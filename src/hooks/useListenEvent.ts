import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

const useListenEvent = <T>(onEvent: (payload: unknown) => void) => {
  useEffect(() => {
    const unlistenRef: { current: UnlistenFn } = { current: () => {} };

    listen("select-hack", (event) => {
      onEvent(event.payload);
    }).then((unlisten) => {
      unlistenRef.current = unlisten;
    });

    return () => unlistenRef.current();
  }, [onEvent]);
};

export default useListenEvent;
