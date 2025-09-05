import { useCallback, useLayoutEffect, useState } from "react";
import { createObservableSet } from "./observable-set";
import { SetStore, StoreAction, StoreUpdater, isStoreAction } from "./store";

export function createLocalSetStore<T>(
  storeId: string,
  defaultValue: T,
  parse: (maybeT: unknown) => T
): SetStore<T> {
  const { notify, subscribe, unsubscribe } = createObservableSet<T>();

  const store: Record<string, T> = {};

  function get(id: string): T {
    try {
      const stringOrNull = localStorage.getItem(`${storeId}/${id}`);
      return stringOrNull === null
        ? defaultValue
        : parse(JSON.parse(stringOrNull));
    } catch {
      localStorage.removeItem(`${storeId}/${id}`);
      return defaultValue;
    }
  }

  function set(id: string): StoreUpdater<T> {
    return function (valueOrAction: T | StoreAction<T>): T {
      store[id] = isStoreAction(valueOrAction)
        ? valueOrAction(store[id] ?? defaultValue)
        : valueOrAction;
      localStorage.setItem(storeId, JSON.stringify(store[id]));
      notify(id, store[id]);
      return store[id];
    };
  }

  function remove(id: string): void {
    localStorage.removeItem(`${storeId}/${id}`);
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
