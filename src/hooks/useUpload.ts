import { useMutation } from '@tanstack/react-query';
import { uploadDocument } from '../services/api';
import { useInvalidateDocuments } from './useDocuments';

export function useUpload() {
  const invalidate = useInvalidateDocuments();

  const {
    mutate: upload,
    mutateAsync: uploadAsync,
    isPending,
    isSuccess,
    isError,
    error,
    data,
    reset,
    variables,
  } = useMutation({
    mutationFn: (file: File) => uploadDocument(file),
    onSuccess: () => invalidate(),
  });

  return {
    upload,
    uploadAsync,
    isPending,
    isSuccess,
    isError,
    errorMessage: error instanceof Error ? error.message : null,
    uploadedFile: variables,
    result: data,
    reset,
  };
}
