import * as Tauri from "@tauri-apps/api/core";
import { useCallback, useState } from "react";

const useTauriInvoke = (
  cmd: string,
  args?: Tauri.InvokeArgs | undefined
): [() => void, boolean, string | undefined] => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const invoke = useCallback(() => {
    if (isLoading) return;

    setError(undefined);
    setIsLoading(true);

    Tauri.invoke(cmd, args)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [args, cmd, isLoading]);

  return [invoke, isLoading, error];
};

export default useTauriInvoke;
