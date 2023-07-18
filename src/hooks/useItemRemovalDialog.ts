import { useCallback, useState } from "react";

const useItemRemovalDialog = <T>(
  removeItem: (item: T) => void,
  skipConfirmation?: boolean
): {
  close: () => void;
  closeAndRemove: () => void;
  isOpen: boolean;
  openOrRemove: (item: T) => void;
} => {
  const [itemToRemove, setItemToRemove] = useState<T | undefined>(undefined);

  const close = useCallback(() => {
    setItemToRemove(undefined);
  }, []);

  const closeAndRemove = useCallback(() => {
    setItemToRemove(undefined);
    if (itemToRemove) removeItem(itemToRemove);
  }, [itemToRemove, removeItem]);

  const openOrRemove = useCallback(
    (item: T) => {
      if (skipConfirmation) setItemToRemove(item);
      else removeItem(item);
    },
    [skipConfirmation, removeItem]
  );

  return { close, isOpen: !!itemToRemove, closeAndRemove, openOrRemove };
};

export default useItemRemovalDialog;
