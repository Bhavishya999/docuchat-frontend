import type { Document } from '../types/index';
import type { PaginationMeta } from '../services/api';
import type { ViewType } from '../hooks/useDocumentParams';

interface Props {
  documents: Document[];
  pagination: PaginationMeta;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: string | null;
  isEmpty: boolean;
  viewType: ViewType;
  deletingId: string | undefined;
  validLimits: readonly number[];
  onDelete: (id: string) => void;
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
  onViewChange: (v: ViewType) => void;
}

export function DocumentList({
  documents, pagination, isLoading, isFetching, isError, error, isEmpty,
  viewType, deletingId, validLimits,
  onDelete, onPageChange, onLimitChange, onViewChange,
}: Props) {
  if (isLoading) {
    return (
      <div className="px-4 py-6 space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 py-4 text-xs text-red-600 bg-red-50 mx-3 rounded-lg">
        <p className="font-semibold">Failed to load documents</p>
        <p className="mt-0.5 text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="flex items-center gap-1">
          {/* View type toggle */}
          {(['list', 'grid'] as ViewType[]).map(v => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              title={`${v} view`}
              className={`p-1.5 rounded-md text-xs transition-colors
                ${viewType === v ? 'bg-indigo-100 text-indigo-700' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {v === 'list' ? '☰' : '⊞'}
            </button>
          ))}
        </div>

        {/* Per-page selector */}
        <select
          value={pagination.limit}
          onChange={e => onLimitChange(Number(e.target.value))}
          className="text-xs border border-gray-200 rounded-md px-1.5 py-1 text-gray-600 focus:outline-none"
        >
          {validLimits.map(l => <option key={l} value={l}>{l} / page</option>)}
        </select>
      </div>

      {/* Count + fetching indicator */}
      <div className="flex items-center justify-between px-4 py-1.5">
        <span className="text-xs text-gray-400">{pagination.total} document{pagination.total !== 1 ? 's' : ''}</span>
        {isFetching && <span className="text-xs text-indigo-500 animate-pulse">Refreshing…</span>}
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="px-4 py-6 text-center">
          <p className="text-xs text-gray-400">No documents uploaded yet.</p>
          <p className="text-xs text-gray-400">Upload a PDF or text file above.</p>
        </div>
      )}

      {/* Document items */}
      {!isEmpty && (
        <div className={`flex-1 overflow-y-auto px-3 pb-2 ${viewType === 'grid' ? 'grid grid-cols-2 gap-2 pt-2' : 'flex flex-col divide-y divide-gray-100'}`}>
          {documents.map(doc => (
            <div
              key={doc.id}
              className={`group flex items-center justify-between gap-2
                ${viewType === 'grid'
                  ? 'flex-col items-start bg-gray-50 rounded-xl p-3 border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors'
                  : 'py-2 px-1 hover:bg-gray-50 rounded-lg transition-colors'}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base flex-shrink-0">{doc.name.endsWith('.pdf') ? '📄' : '📝'}</span>
                <span className="text-xs text-gray-700 truncate font-medium" title={doc.name}>
                  {doc.name}
                </span>
              </div>
              <button
                onClick={() => onDelete(doc.id)}
                disabled={deletingId === doc.id}
                className={`text-xs text-gray-300 hover:text-red-500 transition-colors flex-shrink-0
                  ${viewType === 'list' ? 'opacity-0 group-hover:opacity-100' : ''}
                  disabled:opacity-50`}
                title="Remove document"
              >
                {deletingId === doc.id ? '…' : '✕'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 px-4 py-3 border-t border-gray-100">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="text-xs px-2 py-1 rounded-md border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
          >
            ‹
          </button>
          <span className="text-xs text-gray-500">
            {pagination.page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="text-xs px-2 py-1 rounded-md border border-gray-200 disabled:opacity-30 hover:bg-gray-50"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
