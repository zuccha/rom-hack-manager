export type StoreAction<T> = (prevValue: T) => T;

export type StoreUpdater<T> = (valueOrAction: T | StoreAction<T>) => T;

export type Store<T> = {
  get: () => T;
  set: StoreUpdater<T>;

  use: () => [T, StoreUpdater<T>];
  useSetValue: () => StoreUpdater<T>;
  useValue: () => T;

  subscribe: (callback: (value: T) => void) => void;
  unsubscribe: (callback: (value: T) => T) => void;
};

export type SetStore<T> = {
  get: (id: string) => T;
  set: (id: string) => StoreUpdater<T>;
  remove: (id: string) => void;

  use: (id: string) => [T, StoreUpdater<T>];
  useSetValue: (id: string) => StoreUpdater<T>;
  useValue: (id: string) => T;

  subscribe: (id: string, callback: (value: T) => void) => void;
  unsubscribe: (id: string, callback: (value: T) => T) => void;
};

export function isStoreAction<T>(
  valueOrAction: T | StoreAction<T>
): valueOrAction is StoreAction<T> {
  return typeof valueOrAction === "function";
}
