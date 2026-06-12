import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/ToastContext";

export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const reload = useCallback(() => {
    setLoading(true);
    fetcher()
      .then(setData)
      .catch((err: unknown) => showToast(getErrorMessage(err)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, reload, setData };
}
