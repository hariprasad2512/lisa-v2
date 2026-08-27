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
    <main className="flex-1 min-h-0 overflow-y-auto px-4 py-3 md:px-6 md:py-4 space-y-4 scroll-smooth bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="max-w-3xl mx-auto space-y-5">
        
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[75%] rounded-3xl p-5 shadow-2xl transition-all ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-teal-600 to-emerald-700 text-white rounded-br-sm border border-teal-500/30' 
                : 'bg-gray-800/80 backdrop-blur-sm text-gray-100 border border-gray-700/50 rounded-bl-sm'
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
            <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-5 rounded-bl-sm flex items-center gap-4">
              <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
              <span className="text-gray-400 text-sm font-medium tracking-wide">Processing logic...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
        
      </div>
    </main>
  );
}
