import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export type ViewType = 'list' | 'grid';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_VIEW: ViewType = 'list';
const VALID_LIMITS = [5, 10, 20, 50] as const;
const VALID_VIEWS: ViewType[] = ['list', 'grid'];

function clampPage(val: number): number {
  return isNaN(val) || val < 1 ? DEFAULT_PAGE : Math.floor(val);
}

function clampLimit(val: number): typeof VALID_LIMITS[number] {
  const closest = VALID_LIMITS.reduce((a, b) =>
    Math.abs(b - val) < Math.abs(a - val) ? b : a
  );
  return closest;
}

function parseView(val: string | null): ViewType {
  return VALID_VIEWS.includes(val as ViewType) ? (val as ViewType) : DEFAULT_VIEW;
}

export function useDocumentParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = clampPage(Number(searchParams.get('page') ?? DEFAULT_PAGE));
  const limit = clampLimit(Number(searchParams.get('limit') ?? DEFAULT_LIMIT));
  const viewType = parseView(searchParams.get('view_type'));

  const setPage = useCallback((p: number) => {
    setSearchParams(prev => { prev.set('page', String(p)); return prev; }, { replace: true });
  }, [setSearchParams]);

  const setLimit = useCallback((l: number) => {
    setSearchParams(prev => {
      prev.set('limit', String(l));
      prev.set('page', '1'); // reset page when limit changes
      return prev;
    }, { replace: true });
  }, [setSearchParams]);

  const setViewType = useCallback((v: ViewType) => {
    setSearchParams(prev => { prev.set('view_type', v); return prev; }, { replace: true });
  }, [setSearchParams]);

  return { page, limit, viewType, setPage, setLimit, setViewType, VALID_LIMITS };
}
