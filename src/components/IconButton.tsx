import { IconButton as ChakraIconButton } from "@chakra-ui/react";
import { ReactNode } from "react";
import Tooltip from "./Tooltip";

export type IconButtonProps = {
  icon: ReactNode;
  isDisabled?: boolean;
  label: string;
  onClick: () => void;
};

function IconButton({ icon, isDisabled, label, onClick }: IconButtonProps) {
  return (
    <Tooltip content={label}>
      <ChakraIconButton
        aria-label={label}
        color="gray.500"
        disabled={isDisabled}
        onClick={onClick}
        size="xs"
        variant="ghost"
        _hover={{ color: "black" }}
      >
        {icon}
      </ChakraIconButton>
    </Tooltip>
  );
}

export default IconButton;
