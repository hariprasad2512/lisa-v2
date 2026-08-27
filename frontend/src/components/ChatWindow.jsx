import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

const inlineMarkdown = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={index}>{part.slice(2, -2)}</strong>
      : part
  );
};

const parseTableRow = (line) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());

const MarkdownContent = ({ content }) => {
  const lines = String(content || '').replace(/\r\n/g, '\n').split('\n');
  const elements = [];

  for (let index = 0; index < lines.length;) {
    const line = lines[index].trim();

    // Render a Markdown table as a responsive, horizontally scrollable table.
    if (line.includes('|') && index + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1])) {
      const headers = parseTableRow(lines[index]);
      const rows = [];
      index += 2;
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(parseTableRow(lines[index]));
        index += 1;
      }
      elements.push(
        <div key={`table-${index}`} className="my-3 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full min-w-[430px] text-left text-xs sm:text-sm">
            <thead className="bg-gray-100 text-gray-700 dark:bg-gray-700/70 dark:text-gray-100">
              <tr>{headers.map((header) => <th key={header} className="px-3 py-2 font-semibold">{inlineMarkdown(header)}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {rows.map((row, rowIndex) => <tr key={rowIndex} className="bg-white/60 dark:bg-gray-800/40">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-3 py-2 align-top">{inlineMarkdown(cell)}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (!line) {
      index += 1;
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ''));
        index += 1;
      }
      elements.push(<ul key={`list-${index}`} className="my-2 list-disc space-y-1 pl-5">{items.map((item) => <li key={item}>{inlineMarkdown(item)}</li>)}</ul>);
      continue;
    }
    const heading = line.replace(/^#+\s+/, '');
    elements.push(/^#+\s+/.test(line) ? <h3 key={index} className="mt-3 font-semibold">{inlineMarkdown(heading)}</h3> : <p key={index}>{inlineMarkdown(line)}</p>);
    index += 1;
  }
  return <div className="space-y-2">{elements}</div>;
};

// Premium blur reveal while preserving Markdown formatting.
const FadeRevealMessage = ({ content }) => {
  return <div className="inline-block w-full animate-blur-reveal"><MarkdownContent content={content} /></div>;
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
