export interface Document {
  id: string;
  name: string;
}

export interface ChatSource {
  documentName: string;
  excerpt: string;
}

export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  sources?: ChatSource[];
  isError?: boolean;
}
