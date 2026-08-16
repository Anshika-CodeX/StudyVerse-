import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';

interface CodeViewerProps {
  code: string;
  language: string;
  activeLine?: number;
}

export const CodeViewer = ({ code, language, activeLine }: CodeViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLine !== undefined && containerRef.current) {
      const activeElement = containerRef.current.querySelector(`[data-line="${activeLine}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLine]);

  // We manually render the lines to support active line highlighting
  const lines = code.split('\n');

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#12121a]">
      <div className="bg-white/5 px-4 py-2 text-xs font-mono text-gray-400 border-b border-white/5 flex items-center justify-between">
        <span>{language}</span>
      </div>
      
      <div 
        ref={containerRef}
        className="p-4 overflow-x-auto overflow-y-auto max-h-[300px] text-sm font-mono leading-loose hidden-scrollbar"
      >
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = activeLine === lineNumber;
          
          return (
            <div 
              key={lineNumber} 
              data-line={lineNumber}
              className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                isActive ? 'bg-primary-500/20 border-l-2 border-primary-500 -ml-[2px]' : 'border-l-2 border-transparent'
              }`}
            >
              <span className="w-8 shrink-0 text-gray-600 text-right pr-4 select-none">
                {lineNumber}
              </span>
              <span className="flex-1 whitespace-pre">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    p: ({ node, ...props }) => <span {...props} />,
                    pre: ({ node, ...props }) => <span {...props} />,
                    code: ({ node, inline, className, children, ...props }: any) => {
                      return (
                        <code className={`language-${language}`} {...props}>
                          {line || ' '}
                        </code>
                      );
                    }
                  }}
                >
                  {`\`\`\`${language}\n${line || ' '}\n\`\`\``}
                </ReactMarkdown>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
