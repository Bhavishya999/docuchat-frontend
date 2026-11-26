import { useRef, useEffect, useState, type FormEvent, type KeyboardEvent } from 'react';
import { MessageBubble } from './MessageBubble';
import type { Message } from '../types/index';

interface Props {
  chatId: string;
  messages: Message[];
  isPending: boolean;
  lastWasError: boolean;
  questionCount: number;
  hasDocuments: boolean;
  onAsk: (q: string) => void;
  onClear: () => void;
}

const MAX_CHARS = 1000;

export function ChatInterface({
  chatId, messages, isPending, lastWasError, questionCount, hasDocuments, onAsk, onClear,
}: Props) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const charsLeft = MAX_CHARS - input.length;
  const canSend = input.trim().length >= 3 && !isPending && hasDocuments && charsLeft >= 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  function submit() {
    if (!canSend) return;
    onAsk(input.trim());
    setInput('');
    textareaRef.current?.focus();
  }

  function onSubmit(e: FormEvent) { e.preventDefault(); submit(); }
  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
        <div>
          <h2 className="font-semibold text-gray-900 text-sm">Conversation</h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {chatId.slice(0, 8)}…</p>
        </div>
        <div className="flex items-center gap-3">
          {questionCount > 0 && (
            <span className="text-xs text-gray-400">{questionCount} question{questionCount !== 1 ? 's' : ''}</span>
          )}
          {messages.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-gray-400 hover:text-red-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-red-300 transition-colors"
            >
              Clear chat
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Empty state */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl">
              💬
            </div>
            <div>
              <p className="font-semibold text-gray-700">
                {hasDocuments ? 'Ask anything about your documents' : 'No documents yet'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {hasDocuments
                  ? 'Type a question below — sources are shown with each answer'
                  : 'Upload a PDF or text file from the sidebar to get started'}
              </p>
            </div>
          </div>
        )}

        {messages.map(msg => <MessageBubble key={msg.id} message={msg} />)}

        {/* Thinking indicator */}
        {isPending && (
          <div className="flex gap-3 mb-5">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600 font-bold flex-shrink-0">
              AI
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {/* Retry hint */}
        {lastWasError && !isPending && (
          <p className="text-xs text-center text-gray-400 mb-4">
            Last question failed — you can try again or rephrase.
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <form onSubmit={onSubmit} className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={isPending || !hasDocuments}
              placeholder={
                !hasDocuments
                  ? 'Upload a document first…'
                  : isPending
                  ? 'Waiting for answer…'
                  : 'Ask a question (Enter to send, Shift+Enter for newline)'
              }
              rows={1}
              maxLength={MAX_CHARS}
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm
                focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
                disabled:bg-gray-50 disabled:text-gray-400 max-h-40 overflow-y-auto leading-relaxed"
            />
            {input.length > MAX_CHARS * 0.8 && (
              <span className={`absolute right-3 bottom-3 text-xs ${charsLeft < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                {charsLeft}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={!canSend}
            className="flex-shrink-0 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white
              hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isPending ? '…' : 'Send'}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Answers are grounded in your uploaded documents only
        </p>
      </div>
    </div>
  );
}
