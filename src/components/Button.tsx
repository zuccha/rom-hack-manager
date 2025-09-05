import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";
import { ReactNode } from "react";

export type ButtonProps = {
  isDisabled?: boolean;
  isFullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  onClick: () => void;
  rightIcon?: ReactNode;
  text: string;
  variant?: ChakraButtonProps["variant"];
};

function Button({
  isDisabled,
  isFullWidth,
  isLoading,
  leftIcon,
  onClick,
  rightIcon,
  text,
  variant,
}: ButtonProps) {
  return (
    <ChakraButton
      borderRadius={0}
      flex={isFullWidth ? 1 : undefined}
      disabled={isDisabled}
      loading={isLoading}
      onClick={onClick}
      size="sm"
      variant={variant}
    >
      {leftIcon}
      {text}
      {rightIcon}
    </ChakraButton>
  );
}

export default Button;
