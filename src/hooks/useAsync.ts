
import { useState, useEffect, useCallback } from 'react';

// Interface pour l'état des opérations asynchrones
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Hook générique pour les opérations asynchrones
export function useAsync<T>(asyncFunction: () => Promise<T>, dependencies: any[] = []) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, execute };
}
