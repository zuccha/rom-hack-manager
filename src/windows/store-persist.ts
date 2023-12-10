import { AtomEffect } from "recoil";

const STORAGE_KEY = "recoil-persist";

export const storePersist = (): {
  persistAtom: AtomEffect<any>;
  persistAtomWithDefaults: (defaults: any) => AtomEffect<any>;
} => {
  if (typeof window === "undefined") {
    return {
      persistAtom: () => {},
      persistAtomWithDefaults: () => () => {},
    };
  }

  const getState = (): any => {
    const maybeState = localStorage.getItem(STORAGE_KEY);
    if (typeof maybeState !== "string") return {};

    try {
      return JSON.parse(maybeState);
    } catch (e) {
      console.error(e);
      return {};
    }
  };

  const setState = (state: any, key: string, value: any, isReset: boolean) => {
    if (isReset) delete state[key];
    else state[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const persistAtom: AtomEffect<any> = ({ onSet, node, trigger, setSelf }) => {
    if (trigger === "get") {
      const state = getState();
      if (state.hasOwnProperty(node.key)) setSelf(state[node.key]);
    }

    onSet(async (newValue, _, isReset) => {
      const state = getState();
      setState(state, node.key, newValue, isReset);
    });
  };

  const persistAtomWithDefaults: (defaults: any) => AtomEffect<any> =
    (defaults: any) =>
    ({ onSet, node, trigger, setSelf }) => {
      if (trigger === "get") {
        const state = getState();
        if (state.hasOwnProperty(node.key))
          setSelf({ ...defaults, ...state[node.key] });
      }

      onSet(async (newValue, _, isReset) => {
        const state = getState();
        setState(state, node.key, newValue, isReset);
      });
    };

  return { persistAtom, persistAtomWithDefaults };
};
