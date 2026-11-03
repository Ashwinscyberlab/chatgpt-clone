import MessageMetrics from "./MessageMetrics";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MessageType {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  metrics?: {
    response_time_ms: number;
    response_length: number;
    word_count: number;
    sentiment: string;
  };
  feedback?: "thumbs_up" | "thumbs_down" | null;
  isStreaming?: boolean;
}

interface MessageProps {
  message: MessageType;
  onFeedback: (
    messageId: string,
    feedback: "thumbs_up" | "thumbs_down"
  ) => void;
}

export default function Message({ message, onFeedback }: MessageProps) {
  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 py-2 sm:px-4 sm:py-2 rounded-lg ${
          message.sender === "user"
            ? "bg-purple-900 text-white"
            : "bg-slate-800/60 text-slate-200"
        }`}
      >
        <div className="text-sm sm:text-base">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <div className="my-2 rounded-lg overflow-hidden">
                    <div className="bg-slate-800 px-3 py-1 text-xs text-slate-400 border-b border-slate-700">
                      {match[1]}
                    </div>
                    <pre className="bg-slate-900 p-3 text-sm text-slate-200 overflow-x-auto">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                ) : (
                  <code
                    className="bg-slate-800 px-1 py-0.5 rounded text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              table({ children }) {
                return (
                  <div className="my-2 overflow-x-auto">
                    <table className="min-w-full border border-slate-700 rounded-lg">
                      {children}
                    </table>
                  </div>
                );
              },
              th({ children }) {
                return (
                  <th className="px-3 py-2 text-sm font-semibold text-slate-200 bg-slate-800 border border-slate-700">
                    {children}
                  </th>
                );
              },
              td({ children }) {
                return (
                  <td className="px-3 py-2 text-sm text-slate-300 bg-slate-900 border border-slate-700">
                    {children}
                  </td>
                );
              },
              p({ children }) {
                return <p className="break-words mb-2 last:mb-0">{children}</p>;
              },
              ul({ children }) {
                return (
                  <ul className="list-disc list-inside mb-2 space-y-1">
                    {children}
                  </ul>
                );
              },
              ol({ children }) {
                return (
                  <ol className="list-decimal list-inside mb-2 space-y-1">
                    {children}
                  </ol>
                );
              },
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-4 border-slate-600 pl-4 italic text-slate-300 mb-2">
                    {children}
                  </blockquote>
                );
              },
              h1: ({ children }) => (
                <h1 className="text-xl font-bold mb-2">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-bold mb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-base font-bold mb-2">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-sm font-bold mb-2">{children}</h4>
              ),
              h5: ({ children }) => (
                <h5 className="text-xs font-bold mb-2">{children}</h5>
              ),
              h6: ({ children }) => (
                <h6 className="text-xs font-bold mb-2">{children}</h6>
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>

          {message.isStreaming ? (
            <span className="inline-block w-2 h-4 ml-1 bg-purple-400 animate-pulse rounded" />
          ) : null}
        </div>

        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </p>

        {message.sender === "ai" && message.metrics && !message.isStreaming && (
          <MessageMetrics
            metrics={message.metrics}
            messageId={message.id}
            currentFeedback={message.feedback || null}
            onFeedback={onFeedback}
          />
        )}
      </div>
    </div>
  );
}
