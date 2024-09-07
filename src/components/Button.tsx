import {
  Button as CButton,
  ButtonProps as CButtonProps,
} from "@chakra-ui/react";

export type ButtonProps = {
  isDisabled?: boolean;
  isFullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: CButtonProps["leftIcon"];
  onClick: () => void;
  rightIcon?: CButtonProps["rightIcon"];
  text: string;
  variant?: CButtonProps["variant"];
  colorScheme?: CButtonProps["colorScheme"];
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
  colorScheme = "blue",
}: ButtonProps) {
  return (
    <CButton
      borderRadius={0}
      colorScheme={colorScheme}
      flex={isFullWidth ? 1 : undefined}
      leftIcon={leftIcon}
      isDisabled={isDisabled}
      isLoading={isLoading}
      rightIcon={rightIcon}
      onClick={onClick}
      size="sm"
      variant={variant}
    >
      {text}
    </CButton>
  );
}

export default Button;
