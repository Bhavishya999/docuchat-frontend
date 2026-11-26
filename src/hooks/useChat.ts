import { useState, useCallback, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { sendQuestion } from '../services/api';
import type { Message } from '../types/index';

const MAX_MESSAGES = 100;

export function useChat() {
  const [chatId] = useState(() => uuidv4());
  const [messages, setMessages] = useState<Message[]>([]);
  const questionCountRef = useRef(0);

  const {
    mutate: _ask,
    isPending,
    isError: lastWasError,
    error: lastError,
    reset: resetMutation,
  } = useMutation({
    mutationFn: (question: string) => sendQuestion(question, chatId),
    onMutate: (question) => {
      questionCountRef.current += 1;
      const userMsg: Message = {
        id: uuidv4(),
        role: 'user',
        content: question,
      };
      setMessages(prev => {
        // Trim oldest messages if we're approaching the limit
        const trimmed = prev.length >= MAX_MESSAGES ? prev.slice(-MAX_MESSAGES + 2) : prev;
        return [...trimmed, userMsg];
      });
    },
    onSuccess: ({ answer, sources }) => {
      const assistantMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: answer,
        sources,
      };
      setMessages(prev => [...prev, assistantMsg]);
    },
    onError: (err, question) => {
      const errorMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
      console.error(`[chat] question failed: "${question}"`, err);
    },
  });

  const ask = useCallback((question: string) => {
    const q = question.trim();
    if (!q || isPending) return;
    if (q.length > 1000) return; // guard — backend also validates
    _ask(q);
  }, [_ask, isPending]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    resetMutation();
    questionCountRef.current = 0;
  }, [resetMutation]);

  return {
    chatId,
    messages,
    isPending,
    lastWasError,
    lastError: lastError instanceof Error ? lastError.message : null,
    questionCount: questionCountRef.current,
    hasMessages: messages.length > 0,
    ask,
    clearMessages,
  };
}
