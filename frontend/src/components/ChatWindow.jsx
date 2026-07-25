import { Loader2 } from 'lucide-react';

export default function ChatWindow({ messages, isProcessing }) {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-5 shadow-sm transition-all ${
              msg.role === 'user' 
                ? 'bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-br-sm' 
                : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-sm'
            }`}>
              <p className="leading-relaxed text-sm md:text-base font-light tracking-wide">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 rounded-bl-sm shadow-sm flex items-center gap-4">
              <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
              <span className="text-gray-400 text-sm font-light tracking-wide">Processing your request...</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}