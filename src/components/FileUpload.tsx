import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { useUpload } from '../hooks/useUpload';

const ACCEPTED = '.pdf,.txt';
const MAX_MB = 10;

export function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { upload, isPending, isSuccess, isError, errorMessage, result, reset } = useUpload();

  function handleFile(file: File) {
    if (!file.name.match(/\.(pdf|txt)$/i)) {
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) return;
    reset();
    upload(file, {
      onSettled: () => { if (inputRef.current) inputRef.current.value = ''; },
      onSuccess: () => setTimeout(reset, 4000),
    });
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  const borderClass = isDragging
    ? 'border-indigo-500 bg-indigo-50'
    : isSuccess
    ? 'border-green-400 bg-green-50'
    : isError
    ? 'border-red-400 bg-red-50'
    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50';

  return (
    <div className="p-4">
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !isPending && inputRef.current?.click()}
        role="button"
        aria-label="Upload a document"
        className={`border-2 border-dashed rounded-xl p-5 text-center transition-all select-none
          ${isPending ? 'cursor-wait opacity-70' : 'cursor-pointer'} ${borderClass}`}
      >
        <input ref={inputRef} type="file" accept={ACCEPTED} className="hidden" onChange={onChange} disabled={isPending} />

        <p className="text-sm font-medium text-gray-600">
          {isPending ? 'Processing…' : isDragging ? 'Drop it!' : 'Drop PDF or TXT here'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {isPending ? 'Generating embeddings, please wait' : `click to browse · max ${MAX_MB}MB`}
        </p>
      </div>

      {isSuccess && result && (
        <div className="mt-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
          <span className="font-semibold">✓ Indexed:</span> "{result.documentName}" — {result.chunks} chunks
        </div>
      )}
      {isError && errorMessage && (
        <div className="mt-2 text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2">
          <span className="font-semibold">✕ Error:</span> {errorMessage}
        </div>
      )}
    </div>
  );
}
