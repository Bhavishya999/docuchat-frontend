import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import type { Document, ChatSource } from '../types/index';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DocumentsResponse {
  documents: Document[];
  pagination: PaginationMeta;
}

export interface UploadResult {
  documentId: string;
  documentName: string;
  chunks: number;
}

export interface ChatResult {
  answer: string;
  sources: ChatSource[];
  chatId: string;
}

export interface FetchDocumentsParams {
  page?: number;
  limit?: number;
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 90_000,
  headers: { 'Content-Type': 'application/json' },
});

function extractError(err: unknown): string {
  if (err instanceof AxiosError) {
    const serverMsg = err.response?.data?.error;
    if (serverMsg) return serverMsg;
    if (err.code === 'ECONNABORTED') return 'Request timed out — the server took too long to respond';
    if (err.code === 'ERR_NETWORK') return 'Network error — make sure the backend server is running';
    return err.message;
  }
  return 'An unexpected error occurred';
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const { data } = await client.request<T>(config);
    return data;
  } catch (err) {
    throw new Error(extractError(err));
  }
}

export async function uploadDocument(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append('file', file);
  return request<UploadResult>({
    method: 'POST',
    url: '/upload',
    data: form,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function fetchDocuments(params: FetchDocumentsParams = {}): Promise<DocumentsResponse> {
  return request<DocumentsResponse>({
    method: 'GET',
    url: '/documents',
    params: { page: params.page ?? 1, limit: params.limit ?? 10 },
  });
}

export async function deleteDocument(id: string): Promise<void> {
  return request({ method: 'DELETE', url: `/documents/${id}` });
}

export async function sendQuestion(question: string, chatId: string): Promise<ChatResult> {
  const result = await request<{ answer: string; sources: ChatSource[] }>({
    method: 'POST',
    url: '/chat',
    data: { question, chatId },
  });
  return { ...result, chatId };
}
