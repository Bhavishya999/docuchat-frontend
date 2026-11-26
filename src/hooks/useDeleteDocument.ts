import { useMutation } from '@tanstack/react-query';
import { deleteDocument } from '../services/api';
import { useInvalidateDocuments } from './useDocuments';

export function useDeleteDocument() {
  const invalidate = useInvalidateDocuments();

  const {
    mutate: remove,
    isPending,
    isSuccess,
    isError,
    error,
    variables: deletingId,
    reset,
  } = useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => invalidate(),
  });

  return {
    remove,
    isPending,
    isSuccess,
    isError,
    errorMessage: error instanceof Error ? error.message : null,
    deletingId,
    reset,
  };
}
