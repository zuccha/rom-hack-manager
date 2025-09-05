import { useCallback, useLayoutEffect, useState } from "react";
import { createObservableSet } from "./observable-set";
import { SetStore, StoreAction, StoreUpdater, isStoreAction } from "./store";

export function createMemorySetStore<T>(defaultValue: T): SetStore<T> {
  const { notify, subscribe, unsubscribe } = createObservableSet<T>();

  const store: Record<string, T> = {};

  function get(id: string): T {
    return store[id] ?? defaultValue;
  }

  function set(id: string): StoreUpdater<T> {
    return function (valueOrAction: T | StoreAction<T>): T {
      store[id] = isStoreAction(valueOrAction)
        ? valueOrAction(store[id] ?? defaultValue)
        : valueOrAction;
      notify(id, store[id]);
      return store[id];
    };
  }

  function remove(id: string): void {
    delete store[id];
  }

  function use(id: string): [T, StoreUpdater<T>] {
    const [value, setValue] = useState(() => get(id));
    useLayoutEffect(() => subscribe(id, setValue), [id]);
    return [value, useCallback(set(id), [id])];
  }

  function useValue(id: string): T {
    const [value, setValue] = useState(() => get(id));
    useLayoutEffect(() => subscribe(id, setValue), [id]);
    return value;
  }

  function useSetValue(id: string): StoreUpdater<T> {
    return useCallback(set(id), [id]);
  }

  return {
    get,
    set,
    remove,

    use,
    useSetValue,
    useValue,

    subscribe,
    unsubscribe,
  };
}
