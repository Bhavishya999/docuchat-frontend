import { useState } from 'react';
import type { Message } from '../types/index';

interface Props {
  message: Message;
}

export function MessageBubble({ message }: Props) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const isUser = message.role === 'user';
  const hasSources = (message.sources?.length ?? 0) > 0;

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-5`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
        ${isUser ? 'bg-indigo-600 text-white' : message.isError ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
        {isUser ? 'You' : message.isError ? '!' : 'AI'}
      </div>

      <div className={`flex flex-col gap-1 max-w-[76%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? 'bg-indigo-600 text-white rounded-tr-sm'
            : message.isError
            ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-sm'
            : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-tl-sm'}`}>
          {message.content}
        </div>

        {/* Sources toggle */}
        {hasSources && (
          <div className="w-full">
            <button
              onClick={() => setSourcesOpen(o => !o)}
              className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1 mt-0.5"
            >
              <span>{sourcesOpen ? '▾' : '▸'}</span>
              {message.sources!.length} source{message.sources!.length > 1 ? 's' : ''}
            </button>

            {sourcesOpen && (
              <div className="mt-1.5 space-y-1.5">
                {message.sources!.map((src, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs">
                    <p className="font-semibold text-gray-700 mb-0.5 truncate">{src.documentName}</p>
                    <p className="text-gray-500 italic leading-relaxed">"{src.excerpt}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
