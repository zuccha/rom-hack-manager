import { IconButton as ChakraIconButton } from "@chakra-ui/react";
import { ReactNode } from "react";
import Tooltip from "./Tooltip";

export type IconButtonProps = {
  icon: ReactNode;
  isDisabled?: boolean;
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

function IconButton({ icon, isDisabled, label, onClick }: IconButtonProps) {
  return (
    <Tooltip content={label}>
      <ChakraIconButton
        aria-label={label}
        disabled={isDisabled}
        onClick={onClick}
        outlineColor="blue.focusRing"
        size="xs"
        variant="ghost"
      >
        {icon}
      </ChakraIconButton>
    </Tooltip>
  );
}

export default IconButton;
