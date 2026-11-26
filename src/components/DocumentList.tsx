import { useState } from 'react';
import { deleteDocument } from '../services/api';
import type { Document } from '../types/index';

interface Props {
  documents: Document[];
  onDeleted: () => void;
}

export function DocumentList({ documents, onDeleted }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteDocument(id);
      onDeleted();
    } catch {
      // silent — the list will refresh anyway
    } finally {
      setDeletingId(null);
    }
  }

  if (documents.length === 0) {
    return (
      <p className="px-4 py-2 text-xs text-gray-400">
        No documents yet. Upload one above.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {documents.map((doc) => (
        <li key={doc.id} className="flex items-center justify-between px-4 py-2 group">
          <span className="text-sm text-gray-700 truncate max-w-[160px]" title={doc.name}>
            {doc.name}
          </span>
          <button
            onClick={() => handleDelete(doc.id)}
            disabled={deletingId === doc.id}
            className="text-xs text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity disabled:opacity-50"
          >
            {deletingId === doc.id ? '...' : 'Remove'}
          </button>
        </li>
      ))}
    </ul>
  );
}
