import { Request, Response } from 'express';
import { aiService, ChatMessage } from '../services/ai/ai.service';

// Temporary in-memory chat storage for testing on Vercel
const chats: Map<string, any> = new Map();

export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const history = Array.from(chats.values()).map((chat) => ({
      id: chat.id,
      title: chat.title,
      isPinned: false,
      updatedAt: chat.updatedAt
    }));

    history.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime()
    );

    res.json(history);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const chat = chats.get(id);

    if (!chat) {
      return res.json([]);
    }

    res.json(chat.messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
};

export const createNewChat = async (req: Request, res: Response) => {
  try {
    const id = `chat-${Date.now()}`;

    const chat = {
      id,
      title: 'New Conversation',
      messages: [],
      updatedAt: new Date().toISOString()
    };

    chats.set(id, chat);

    res.json({
      id: chat.id,
      title: chat.title
    });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
};

export const streamChat = async (req: Request, res: Response) => {
  try {
    let { chatId, message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        error: 'Message is required'
      });
    }

    message = message.trim();

    // Create chat if it doesn't exist
    if (!chatId || chatId === 'new') {
      chatId = `chat-${Date.now()}`;

      chats.set(chatId, {
        id: chatId,
        title:
          message.length > 40
            ? message.substring(0, 40) + '...'
            : message,
        messages: [],
        updatedAt: new Date().toISOString()
      });
    }

    // Ensure chatId is always a string
    chatId = String(chatId);

    let chat = chats.get(chatId);

    if (!chat) {
      chat = {
        id: chatId,
        title: 'New Conversation',
        messages: [],
        updatedAt: new Date().toISOString()
      };

      chats.set(chatId, chat);
    }

    // Build chat history for AI
    const chatHistory: ChatMessage[] = chat.messages.map(
      (msg: any) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      })
    );

    // Save user message
    chat.messages.push({
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString()
    });

    chat.updatedAt = new Date().toISOString();

    const allMessages: ChatMessage[] = [
      ...chatHistory,
      {
        role: 'user',
        content: message
      }
    ];

    // SSE Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    res.flushHeaders();

    // Send chat ID to frontend
    res.write(
      `data: ${JSON.stringify({
        type: 'meta',
        chatId
      })}\n\n`
    );

    // Stream AI response
    await aiService.streamChat(
      allMessages,

      (token) => {
        res.write(
          `data: ${JSON.stringify({ token })}\n\n`
        );
      },

      async (fullResponse) => {
        chat.messages.push({
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          content: fullResponse,
          createdAt: new Date().toISOString()
        });

        chat.updatedAt = new Date().toISOString();

        res.write(`data: [DONE]\n\n`);
        res.end();
      },

      (error) => {
        console.error('AI stream error:', error);

        res.write(
          `data: ${JSON.stringify({
            error:
              'AI generation failed. Please check your API key.'
          })}\n\n`
        );

        res.write(`data: [DONE]\n\n`);
        res.end();
      }
    );
  } catch (error) {
    console.error('Chat Streaming Error:', error);

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Internal Server Error'
      });
    }
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    chats.delete(id);

    res.json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
};

export const renameChat = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { title } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        error: 'Title is required'
      });
    }

    const chat = chats.get(id);

    if (!chat) {
      return res.status(404).json({
        error: 'Chat not found'
      });
    }

    chat.title = title.trim();
    chat.updatedAt = new Date().toISOString();

    res.json({
      id: chat.id,
      title: chat.title
    });
  } catch (error) {
    console.error('Error renaming chat:', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });
  }
};