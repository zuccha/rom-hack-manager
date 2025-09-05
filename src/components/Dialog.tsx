import { Dialog as ChakraDialog, Portal } from "@chakra-ui/react";
import Button from "./Button";
import { useRef } from "react";

export type DialogProps = {
  description: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
};

function Dialog({
  description,
  isOpen,
  onCancel,
  onConfirm,
  title,
}: DialogProps) {
  const ref = useRef(null);

  return (
    <ChakraDialog.Root
      open={isOpen}
      initialFocusEl={() => ref.current}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <ChakraDialog.Backdrop />
      <Portal>
        <ChakraDialog.Positioner>
          <ChakraDialog.Content borderRadius={0} mx={4}>
            <ChakraDialog.Header>
              <ChakraDialog.Title>{title}</ChakraDialog.Title>
            </ChakraDialog.Header>

            <ChakraDialog.Body>{description}</ChakraDialog.Body>

            <ChakraDialog.Footer gap={2}>
              <Button onClick={onCancel} text="Cancel" variant="outline" />
              <Button onClick={onConfirm} text="Confirm" />
            </ChakraDialog.Footer>
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    </ChakraDialog.Root>
  );
}

export default Dialog;
