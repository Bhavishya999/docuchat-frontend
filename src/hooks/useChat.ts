import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { sendQuestion } from '../services/api';
import type { Message } from '../types/index';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const ask = useCallback(async (question: string) => {
    const userMessage: Message = { id: uuidv4(), role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { answer, sources } = await sendQuestion(question);
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: answer,
        sources,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: err instanceof Error ? err.message : 'Something went wrong',
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, isLoading, ask, clearMessages };
}
