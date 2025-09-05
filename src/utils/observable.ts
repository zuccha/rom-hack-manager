export type Observable<T> = {
  notify: (value: T) => void;
  subscribe: (callback: (value: T) => void) => () => void;
  unsubscribe: (callback: (value: T) => void) => void;
};

export function createObservable<T>(): Observable<T> {
  const listeners = new Set<(value: T) => void>();

  function notify(value: T): void {
    listeners.forEach((callback) => callback(value));
  }

  function subscribe(callback: (value: T) => void): () => void {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }

  function unsubscribe(callback: (value: T) => void): void {
    listeners.delete(callback);
  }

  return { notify, subscribe, unsubscribe };
}
