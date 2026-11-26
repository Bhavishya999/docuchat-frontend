import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchDocuments } from '../services/api';

export const DOCUMENTS_KEY = (page: number, limit: number) =>
  ['documents', page, limit] as const;

export function useDocuments(page: number, limit: number) {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    isSuccess,
    isPlaceholderData,
    refetch,
    status,
    fetchStatus,
  } = useQuery({
    queryKey: DOCUMENTS_KEY(page, limit),
    queryFn: () => fetchDocuments({ page, limit }),
    placeholderData: (prev) => prev, // keep old data visible while fetching next page
  });

  return {
    documents: data?.documents ?? [],
    pagination: data?.pagination ?? { page, limit, total: 0, totalPages: 1 },
    isLoading,
    isFetching,
    isPlaceholderData,
    isError,
    error: error instanceof Error ? error.message : null,
    isSuccess,
    isEmpty: isSuccess && (data?.documents.length ?? 0) === 0,
    status,
    fetchStatus,
    refetch,
  };
}

export function useInvalidateDocuments() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['documents'] });
}
