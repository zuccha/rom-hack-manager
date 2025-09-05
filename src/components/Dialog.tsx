import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
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
    <AlertDialog isOpen={isOpen} leastDestructiveRef={ref} onClose={onCancel}>
      <AlertDialogOverlay>
        <AlertDialogContent borderRadius={0} mx={4}>
          <AlertDialogHeader>{title}</AlertDialogHeader>

          <AlertDialogBody>{description}</AlertDialogBody>

          <AlertDialogFooter gap={2}>
            <Button onClick={onCancel} text="Cancel" variant="outline" />
            <Button onClick={onConfirm} text="Confirm" />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default Dialog;
