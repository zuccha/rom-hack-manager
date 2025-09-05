export type ObservableSet<T> = {
  notify: (id: string, value: T) => void;
  subscribe: (id: string, callback: (value: T) => void) => () => void;
  unsubscribe: (id: string, callback: (value: T) => void) => void;
};

export function createObservableSet<T>(): ObservableSet<T> {
  const listeners = new Map<string, Set<(value: T) => void>>();

  function notify(id: string, value: T): void {
    listeners.get(id)?.forEach((callback) => callback(value));
  }

  function subscribe(id: string, callback: (value: T) => void): () => void {
    if (!listeners.has(id)) listeners.set(id, new Set());
    listeners.get(id)!.add(callback);

    return () => {
      listeners.get(id)?.delete(callback);
      if (listeners.get(id)?.size === 0) listeners.delete(id);
    };
  }

  function unsubscribe(id: string, callback: (value: T) => void): void {
    listeners.get(id)?.delete(callback);
    if (listeners.get(id)?.size === 0) listeners.delete(id);
  }

  return { notify, subscribe, unsubscribe };
}
