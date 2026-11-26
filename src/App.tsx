import { useEffect, useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { DocumentList } from './components/DocumentList';
import { ChatInterface } from './components/ChatInterface';
import { fetchDocuments } from './services/api';
import { useChat } from './hooks/useChat';
import type { Document } from './types/index';

export default function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { messages, isLoading, ask, clearMessages } = useChat();

  const refreshDocuments = useCallback(async () => {
    try {
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch {
      // non-critical — UI still works
    }
  }, []);

  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-4 py-5 border-b border-gray-100">
          <h1 className="text-lg font-bold text-indigo-600">DocuChat</h1>
          <p className="text-xs text-gray-400 mt-0.5">Ask questions about your documents</p>
        </div>

        <div className="border-b border-gray-100">
          <FileUpload onUploaded={refreshDocuments} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Documents ({documents.length})
          </p>
          <DocumentList documents={documents} onDeleted={refreshDocuments} />
        </div>
      </aside>

      {/* Chat */}
      <main className="flex-1 flex flex-col min-w-0">
        <ChatInterface
          messages={messages}
          isLoading={isLoading}
          onAsk={ask}
          onClear={clearMessages}
          hasDocuments={documents.length > 0}
        />
      </main>
    </div>
  );
}
