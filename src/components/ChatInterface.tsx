import { useRef, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { MessageBubble } from './MessageBubble';
import type { Message } from '../types/index';
import { useState } from 'react';

interface Props {
  messages: Message[];
  isLoading: boolean;
  onAsk: (question: string) => void;
  onClear: () => void;
  hasDocuments: boolean;
}

export function ChatInterface({ messages, isLoading, onAsk, onClear, hasDocuments }: Props) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function submit() {
    const q = input.trim();
    if (!q || isLoading) return;
    setInput('');
    onAsk(q);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submit();
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Chat</h2>
        {messages.length > 0 && (
          <button onClick={onClear} className="text-xs text-gray-400 hover:text-gray-600">
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-gray-400 text-center">
              {hasDocuments
                ? 'Ask a question about your documents'
                : 'Upload a document to get started'}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-100">
        <form onSubmit={onSubmit} className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isLoading || !hasDocuments}
            placeholder={hasDocuments ? 'Ask anything about your documents...' : 'Upload a document first'}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm
              focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
              disabled:bg-gray-50 disabled:text-gray-400 max-h-32 overflow-y-auto"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !hasDocuments}
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white
              hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
