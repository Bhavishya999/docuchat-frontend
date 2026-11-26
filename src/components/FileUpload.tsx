import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { uploadDocument } from '../services/api';

interface Props {
  onUploaded: () => void;
}

export function FileUpload({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setSuccess(null);
    setIsUploading(true);
    try {
      const { documentName, chunks } = await uploadDocument(file);
      setSuccess(`"${documentName}" uploaded — ${chunks} chunks indexed`);
      onUploaded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
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

  return (
    <div className="p-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`}
      >
        <input ref={inputRef} type="file" accept=".pdf,.txt" className="hidden" onChange={onChange} />
        <p className="text-sm font-medium text-gray-600">
          {isUploading ? 'Uploading...' : 'Drop PDF or text file here'}
        </p>
        <p className="text-xs text-gray-400 mt-1">or click to browse · max 10MB</p>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {success && <p className="mt-2 text-xs text-green-600">{success}</p>}
    </div>
  );
}
