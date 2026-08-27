import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

// --- NEW COMPONENT: Premium Blur Reveal ---
const FadeRevealMessage = ({ content }) => {
  return <span className="inline-block animate-blur-reveal">{content}</span>;
};

export default function ChatWindow({ messages, isProcessing }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  return (
    <main className="flex-1 min-h-0 space-y-4 overflow-y-auto bg-gradient-to-b from-gray-100 to-gray-50 px-4 py-3 scroll-smooth md:px-6 md:py-4 dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-3xl mx-auto space-y-5">
        
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[75%] rounded-3xl p-5 shadow-2xl transition-all ${
              msg.role === 'user' 
                ? 'rounded-br-sm border border-teal-500/30 bg-gradient-to-br from-teal-500 to-emerald-600 text-white dark:from-teal-600 dark:to-emerald-700'
                : 'rounded-bl-sm border border-gray-200 bg-white/85 text-gray-800 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/80 dark:text-gray-100'
            }`}>
              <p className="leading-relaxed text-sm md:text-[15px] font-normal tracking-wide">
                {/* Apply the new Reveal effect only to Lisa's messages */}
                {msg.role === 'assistant' 
                  ? <FadeRevealMessage content={msg.content} />
                  : msg.content
                }
              </p>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start animate-fade-in">
            <div className="flex items-center gap-4 rounded-3xl rounded-bl-sm border border-gray-200 bg-white/85 p-5 backdrop-blur-sm dark:border-gray-700/50 dark:bg-gray-800/80">
              <Loader2 className="h-5 w-5 animate-spin text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-medium tracking-wide text-gray-600 dark:text-gray-400">Processing logic...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
        
      </div>
    </main>
  );
}
