import { useLayoutEffect, useState } from "react";
import { createObservable } from "./observable";
import { isStoreAction, Store, StoreAction, StoreUpdater } from "./store";

export function createLocalStore<T>(
  storeId: string,
  defaultValue: T,
  parse: (maybeT: unknown) => T
): Store<T> {
  const { notify, subscribe, unsubscribe } = createObservable<T>();

  let store = defaultValue;

  function get(): T {
    try {
      const stringOrNull = localStorage.getItem(storeId);
      return stringOrNull === null
        ? defaultValue
        : parse(JSON.parse(stringOrNull));
    } catch {
      localStorage.removeItem(storeId);
      return defaultValue;
    }
  }

  function set(valueOrAction: T | StoreAction<T>): T {
    store = isStoreAction(valueOrAction) ? valueOrAction(store) : valueOrAction;
    localStorage.setItem(storeId, JSON.stringify(store));
    notify(store);
    return store;
  }

  function use(): [T, StoreUpdater<T>] {
    const [value, setValue] = useState(get);
    useLayoutEffect(() => subscribe(setValue), []);
    return [value, set];
  }

  function useValue(): T {
    const [value, setValue] = useState(get);
    useLayoutEffect(() => subscribe(setValue), []);
    return value;
  }

  function useSetValue(): StoreUpdater<T> {
    return set;
  }

  return {
    get,
    set,

    use,
    useSetValue,
    useValue,

    subscribe,
    unsubscribe,
  };
}
