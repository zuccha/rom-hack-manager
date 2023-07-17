import { UnlistenFn, listen } from "@tauri-apps/api/event";
import { useEffect } from "react";

const useListenEvent = <T>(onEvent: (payload: unknown) => void) => {
  useEffect(() => {
    let unlisten: UnlistenFn = () => {};

    listen("select-hack", (event) => {
      onEvent(event.payload);
    }).then((newUnlisten) => {
      unlisten = newUnlisten;
    });

    return unlisten;
  }, [onEvent]);
};

export default useListenEvent;
