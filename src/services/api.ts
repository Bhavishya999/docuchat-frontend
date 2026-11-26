import axios, { AxiosError } from 'axios';
import type { Document, ChatSource } from '../types/index';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 60_000,
});

function extractError(err: unknown): string {
  if (err instanceof AxiosError) {
    return err.response?.data?.error ?? err.message;
  }
  return 'An unexpected error occurred';
}

export async function uploadDocument(file: File): Promise<{ documentId: string; documentName: string; chunks: number }> {
  try {
    const form = new FormData();
    form.append('file', file);
    const { data } = await client.post('/upload', form);
    return data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

export async function fetchDocuments(): Promise<Document[]> {
  try {
    const { data } = await client.get<{ documents: Document[] }>('/documents');
    return data.documents;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

export async function deleteDocument(id: string): Promise<void> {
  try {
    await client.delete(`/documents/${id}`);
  } catch (err) {
    throw new Error(extractError(err));
  }
}

export async function sendQuestion(question: string): Promise<{ answer: string; sources: ChatSource[] }> {
  try {
    const { data } = await client.post('/chat', { question });
    return data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}
