import { useLayoutEffect, useState } from "react";
import { createObservable } from "../utils/observable";
import {
  type Store,
  type StoreAction,
  type StoreUpdater,
  isStoreAction,
} from "./store";

export function createMemoryStore<T>(defaultValue: T): Store<T> {
  const { notify, subscribe, unsubscribe } = createObservable<T>();

  let store = defaultValue;

  function get(): T {
    return store;
  }

  function set(valueOrAction: T | StoreAction<T>): T {
    store = isStoreAction(valueOrAction) ? valueOrAction(store) : valueOrAction;
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
