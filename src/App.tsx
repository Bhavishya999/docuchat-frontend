import { FileUpload } from './components/FileUpload';
import { DocumentList } from './components/DocumentList';
import { ChatInterface } from './components/ChatInterface';
import { useDocuments } from './hooks/useDocuments';
import { useDeleteDocument } from './hooks/useDeleteDocument';
import { useChat } from './hooks/useChat';
import { useDocumentParams } from './hooks/useDocumentParams';

export default function App() {
  const { page, limit, viewType, setPage, setLimit, setViewType, VALID_LIMITS } = useDocumentParams();

  const {
    documents,
    pagination,
    isLoading,
    isFetching,
    isError,
    error,
    isEmpty,
  } = useDocuments(page, limit);

  const { remove, deletingId } = useDeleteDocument();

  const {
    chatId,
    messages,
    isPending,
    lastWasError,
    questionCount,
    hasMessages,
    ask,
    clearMessages,
  } = useChat();

  return (
    <div className="flex h-screen bg-gray-100 font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">D</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">DocuChat</h1>
              <p className="text-xs text-gray-400">RAG-powered document Q&amp;A</p>
            </div>
          </div>
        </div>

        {/* Upload */}
        <div className="border-b border-gray-100">
          <FileUpload />
        </div>

        {/* Document list */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Library
          </p>
          <div className="flex-1 overflow-hidden">
            <DocumentList
              documents={documents}
              pagination={pagination}
              isLoading={isLoading}
              isFetching={isFetching}
              isError={isError}
              error={error}
              isEmpty={isEmpty}
              viewType={viewType}
              deletingId={deletingId}
              validLimits={VALID_LIMITS}
              onDelete={remove}
              onPageChange={setPage}
              onLimitChange={setLimit}
              onViewChange={setViewType}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-xs text-gray-300 text-center">
            Powered by Gemini 1.5 Flash
          </p>
        </div>
      </aside>

      {/* Main chat */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ChatInterface
          chatId={chatId}
          messages={messages}
          isPending={isPending}
          lastWasError={lastWasError}
          questionCount={questionCount}
          hasDocuments={!isEmpty && documents.length > 0}
          onAsk={ask}
          onClear={clearMessages}
        />
      </main>
    </div>
  );
}
