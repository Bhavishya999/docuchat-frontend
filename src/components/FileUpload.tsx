import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { uploadDocument } from '../services/api';

interface Props {
  onUploaded: () => void;
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

const ACCEPTED_EXTENSIONS = '.pdf,.txt';
const MAX_MB = 10;

export function FileUpload({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [message, setMessage] = useState('');

  async function handleFile(file: File) {
    if (!file.name.match(/\.(pdf|txt)$/i)) {
      setUploadState('error');
      setMessage('Only .pdf and .txt files are supported');
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setUploadState('error');
      setMessage(`File is too large. Max size is ${MAX_MB}MB`);
      return;
    }

    setUploadState('uploading');
    setMessage('');

    try {
      const { documentName, chunks } = await uploadDocument(file);
      setUploadState('success');
      setMessage(`"${documentName}" ready — ${chunks} chunks indexed`);
      onUploaded();

      // reset to idle after 3s so user can upload another
      setTimeout(() => setUploadState('idle'), 3000);
    } catch (err) {
      setUploadState('error');
      setMessage(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  const isUploading = uploadState === 'uploading';
  const borderColor = isDragging
    ? 'border-indigo-500 bg-indigo-50'
    : uploadState === 'success'
    ? 'border-green-400 bg-green-50'
    : uploadState === 'error'
    ? 'border-red-400 bg-red-50'
    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50';

  return (
    <div className="p-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors select-none
          ${isUploading ? 'cursor-wait opacity-70' : 'cursor-pointer'}
          ${borderColor}`}
        role="button"
        aria-label="Upload document"
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          className="hidden"
          onChange={onChange}
          disabled={isUploading}
        />

        <p className="text-sm font-medium text-gray-600">
          {isUploading
            ? 'Uploading…'
            : isDragging
            ? 'Drop it here!'
            : 'Drop PDF or TXT here'}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {isUploading ? 'Generating embeddings…' : `click to browse · max ${MAX_MB}MB`}
        </p>
      </div>

      {message && (
        <p className={`mt-2 text-xs font-medium ${uploadState === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
