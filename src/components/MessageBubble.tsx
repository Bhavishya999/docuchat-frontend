import type { Message } from '../types/index';

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed
            ${isUser
              ? 'bg-indigo-600 text-white rounded-br-sm'
              : message.isError
              ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-sm'
              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
            }`}
        >
          {message.content}
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.sources.map((src, i) => (
              <details key={i} className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-1 border border-gray-100">
                <summary className="cursor-pointer font-medium">{src.documentName}</summary>
                <p className="mt-1 text-gray-500 italic">{src.excerpt}</p>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
