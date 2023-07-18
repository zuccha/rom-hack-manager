import {
  IconButton as CIconButton,
  IconButtonProps as CIconButtonProps,
  Tooltip,
} from "@chakra-ui/react";

export type IconButtonProps = {
  icon: CIconButtonProps["icon"];
  isDisabled?: boolean;
  label: string;
  onClick: () => void;
};

function IconButton({ icon, isDisabled, label, onClick }: IconButtonProps) {
  return (
    <Tooltip label={label}>
      <CIconButton
        aria-label={label}
        color="gray.500"
        icon={icon}
        isDisabled={isDisabled}
        onClick={onClick}
        size="xs"
        variant="ghost"
        _hover={{ color: "black" }}
      />
    </Tooltip>
  );
}

export default IconButton;
