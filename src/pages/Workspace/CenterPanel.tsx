import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, Paperclip, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';
import { DSAEngineOrchestrator } from '../../components/Visualizers/Common/DSAEngineOrchestrator';
import type { DSAVisualizerData } from '../../components/Visualizers/types/visualizer.types';
import { apiUrl, API_BASE_URL } from '../../config/api';

// DB stores 'user' | 'assistant', UI uses 'user' | 'ai'
type MessageRole = 'user' | 'ai';

type Message = {
  id: string;
  role: MessageRole;
  content: string;
  isTyping?: boolean;
};

interface CenterPanelProps {
  currentChatId: string | null;
  setCurrentChatId: (id: string | null) => void;
  fetchChats: () => Promise<void>;
}

const TypingIndicator = () => (
  <div className="flex justify-start max-w-[100%]">
    <div className="max-w-[85%] rounded-2xl p-5 text-sm bg-white/10 border border-white/10 text-gray-200 rounded-tl-none">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

const PRESET_QUERIES = [
  'Teach me Binary Trees',
  'Explain React Hooks',
  'Write Fibonacci in Python',
  'Explain DBMS normalization',
];

export const CenterPanel = ({ currentChatId, setCurrentChatId, fetchChats }: CenterPanelProps) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Normalize DB role ('assistant' → 'ai')
  const normalizeRole = (role: string): MessageRole =>
    role === 'assistant' || role === 'ai' ? 'ai' : 'user';

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Load messages when chat changes
  useEffect(() => {
    if (!currentChatId) {
      setMessages([]);
      return;
    }
    loadMessages(currentChatId);
  }, [currentChatId]);

  const loadMessages = async (id: string) => {
    try {
      setLoadingMessages(true);
      const targetUrl = apiUrl(`/api/chat/${id}/messages`);
      console.log('Fetching messages from:', targetUrl);
      const res = await fetch(targetUrl);
      console.log('Messages response status:', res.status);
      if (res.ok) {
        const data: { id: string; role: string; content: string }[] = await res.json();
        setMessages(data.map(m => ({
          id: m.id,
          role: normalizeRole(m.role),
          content: m.content,
        })));
      } else {
        const errText = await res.text();
        console.error('Failed to fetch messages. Status:', res.status, 'Body:', errText);
      }
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
  };

  const handlePresetQuery = (query: string) => {
    setInput(query);
    setTimeout(() => submitQuery(query), 50);
  };

  const submitQuery = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || isStreaming) return;

    const userMsgId = `user-${Date.now()}`;
    const aiMsgId = `ai-${Date.now() + 1}`;

    // Optimistic UI: add user message + typing indicator
    setMessages(prev => [
      ...prev,
      { id: userMsgId, role: 'user', content: trimmed },
      { id: aiMsgId, role: 'ai', content: '', isTyping: true },
    ]);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsStreaming(true);

    try {
      console.log('API URL:', API_BASE_URL);
      const streamEndpoint = apiUrl('/api/chat/stream');
      console.log('Calling chat stream endpoint:', streamEndpoint);

      const response = await fetch(streamEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: currentChatId || 'new', message: trimmed }),
      });

      console.log('Chat response status:', response.status);

      if (!response.ok || !response.body) {
        let errorDetail = `Server returned status ${response.status}`;
        try {
          const errData = await response.json();
          if (errData?.error) {
            errorDetail = errData.error;
          }
        } catch {
          try {
            const errText = await response.text();
            if (errText) errorDetail = errText;
          } catch (_) {}
        }
        console.error('Chat error from server:', errorDetail);
        throw new Error(errorDetail);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let streamedResponse = '';
      let resolvedChatId = currentChatId;
      void resolvedChatId;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE events (separated by \n\n)
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          const line = part.trim();
          if (!line.startsWith('data: ')) continue;

          const dataStr = line.slice(6).trim();
          if (dataStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(dataStr);

            // Handle meta event — new chatId from server
            if (parsed.type === 'meta' && parsed.chatId) {
              resolvedChatId = parsed.chatId;
              if (!currentChatId) {
                setCurrentChatId(parsed.chatId);
                // Refresh sidebar to show new chat
                fetchChats();
              }
            }

            // Handle token — append to streaming message
            if (parsed.token) {
              streamedResponse += parsed.token;
              setMessages(prev => prev.map(msg =>
                msg.id === aiMsgId
                  ? { id: aiMsgId, role: 'ai', content: streamedResponse, isTyping: false }
                  : msg
              ));
            }

            // Handle error from server
            if (parsed.error) {
              console.error('Server SSE error payload:', parsed.error);
              setMessages(prev => prev.map(msg =>
                msg.id === aiMsgId
                  ? { id: aiMsgId, role: 'ai', content: `⚠️ ${parsed.error}`, isTyping: false }
                  : msg
              ));
            }
          } catch (_) {
            // Ignore malformed chunks
          }
        }
      }

    } catch (error) {
      console.error('Streaming error:', error);
      const errMsg = (error instanceof Error && error.message)
        ? error.message
        : 'Could not connect to the AI. Please check that the backend server is running.';
      setMessages(prev => prev.map(msg =>
        msg.id === aiMsgId
          ? {
            id: aiMsgId,
            role: 'ai',
            content: `⚠️ ${errMsg}`,
            isTyping: false
          }
          : msg
      ));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSend = () => submitQuery(input);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">

      {/* Header */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-4 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-600/20 border border-primary-500/50 flex items-center justify-center relative shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <span className="text-xl">🤖</span>
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#12121a] ${isStreaming ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">StudyVerse AI Tutor</h2>
            <p className={`text-xs font-medium tracking-wide ${isStreaming ? 'text-yellow-400' : 'text-green-400'}`}>
              {isStreaming ? '● Thinking...' : '● Online'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden flex flex-col min-h-0">

        <div ref={scrollRef} className="flex-1 overflow-y-auto hidden-scrollbar flex flex-col gap-5 pb-2">

          {/* Loading skeleton for message history */}
          {loadingMessages && (
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="flex justify-end"><div className="h-10 w-48 bg-white/10 rounded-2xl rounded-tr-none" /></div>
              <div className="flex justify-start"><div className="h-16 w-64 bg-white/10 rounded-2xl rounded-tl-none" /></div>
              <div className="flex justify-end"><div className="h-10 w-36 bg-white/10 rounded-2xl rounded-tr-none" /></div>
              <div className="flex justify-start"><div className="h-24 w-72 bg-white/10 rounded-2xl rounded-tl-none" /></div>
            </div>
          )}

          {/* Welcome screen for empty chat */}
          {!loadingMessages && messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500/30 to-violet-500/30 border border-primary-500/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(79,70,229,0.15)]">
                <span className="text-4xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">What would you like to learn?</h3>
              <p className="text-sm text-gray-400 max-w-sm mb-8 leading-relaxed">
                I'm your AI Tutor — I can explain topics, write code, solve problems, and build projects with you.
              </p>
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {PRESET_QUERIES.map(q => (
                  <button
                    key={q}
                    onClick={() => handlePresetQuery(q)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm hover:bg-primary-600/20 hover:border-primary-500/40 hover:text-white transition-all duration-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {!loadingMessages && messages.map((msg) => {
            let parsedVisualizerData: DSAVisualizerData | null = null;
            let displayContent = msg.content;
            
            if (msg.role === 'ai') {
               const jsonRegex = /```json\s*(\{[\s\S]*?"dsa_visualizer"[\s\S]*?\})\s*```/;
               const match = msg.content.match(jsonRegex);
               if (match && match[1]) {
                 try {
                   const data = JSON.parse(match[1]);
                   if (data.dsa_visualizer) {
                      parsedVisualizerData = data.dsa_visualizer as DSAVisualizerData;
                      displayContent = msg.content.replace(jsonRegex, '').trim();
                   }
                 } catch(e) {
                   console.error("Failed to parse visualizer JSON:", e);
                 }
               }
            }

            return (
            <div key={msg.id} className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                {msg.isTyping ? (
                  <TypingIndicator />
                ) : (
                  <div className={`
                    max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-lg
                    ${msg.role === 'user'
                      ? 'bg-primary-600/20 border border-primary-500/30 text-white rounded-tr-none'
                      : 'bg-white/10 border border-white/10 text-gray-200 rounded-tl-none prose prose-invert prose-sm max-w-none'
                    }
                  `}>
                    {msg.role === 'ai' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          a: ({ node, ...props }) => <a className="text-primary-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                          li: ({ node, ...props }) => <li className="text-gray-300" {...props} />,
                          strong: ({ node, ...props }) => <strong className="text-white font-semibold" {...props} />,
                          h1: ({ node, ...props }) => <h1 className="text-lg font-bold text-white mb-2 mt-3" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-base font-bold text-white mb-2 mt-3" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-white mb-1 mt-2" {...props} />,
                          code: ({ node, inline, className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline ? (
                              <div className="my-3 rounded-xl overflow-hidden border border-white/10 not-prose">
                                <div className="bg-white/5 px-4 py-1.5 text-xs text-gray-400 font-mono border-b border-white/5 flex items-center justify-between">
                                  <span>{match?.[1] || 'code'}</span>
                                </div>
                                <pre className="!bg-black/50 !m-0 !p-4 overflow-x-auto text-sm">
                                  <code className={className} {...props}>{children}</code>
                                </pre>
                              </div>
                            ) : (
                              <code className="bg-white/10 text-pink-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                                {children}
                              </code>
                            );
                          },
                          blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-primary-500/50 pl-4 italic text-gray-400 my-2" {...props} />
                          ),
                        }}
                      >
                        {displayContent}
                      </ReactMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{displayContent}</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Conditional Visualizer Rendering */}
              {parsedVisualizerData && (
                <div className="w-full mt-4 mb-8 max-w-5xl self-center">
                  <DSAEngineOrchestrator data={parsedVisualizerData} />
                </div>
              )}
            </div>
          )})}

        </div>

        {/* Input Area */}
        <div className="mt-4 relative group shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-violet-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
          <div className="relative bg-black/50 border border-white/10 backdrop-blur-2xl rounded-2xl p-2 flex items-end gap-2 shadow-2xl">
            <button className="p-3 text-gray-500 hover:text-gray-300 transition-colors rounded-xl hover:bg-white/5 shrink-0">
              <Paperclip size={18} />
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything… (Shift+Enter for new line)"
              disabled={isStreaming}
              className="flex-1 bg-transparent border-none text-white text-sm py-3 focus:outline-none resize-none max-h-32 min-h-[44px] hidden-scrollbar placeholder-gray-500 disabled:opacity-50"
              rows={1}
            />
            <button className="p-3 text-gray-500 hover:text-gray-300 transition-colors rounded-xl hover:bg-white/5 shrink-0">
              <Mic size={18} />
            </button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className={`p-3 rounded-xl transition-all shadow-lg shrink-0 ${
                input.trim() && !isStreaming
                  ? 'bg-primary-600 text-white hover:bg-primary-500 shadow-primary-500/25'
                  : 'bg-white/5 text-gray-600 cursor-not-allowed'
              }`}
            >
              {isStreaming ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} className={input.trim() ? 'translate-x-0.5' : ''} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
