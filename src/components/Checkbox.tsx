import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";
import { useCallback } from "react";

export type CheckboxProps = {
  className?: string;
  isDisabled?: boolean;
  label: string;
  onChange: (value: boolean) => void;
  value: boolean;
};

function Checkbox({ isDisabled, label, onChange, value }: CheckboxProps) {
  const handleChange = useCallback(() => {
    onChange(!value);
  }, [onChange, value]);

  return (
    <div>
      <ChakraCheckbox.Root
        borderColor="gray.500"
        checked={value}
        defaultChecked={value}
        disabled={isDisabled}
        onChange={handleChange}
        size="sm"
      >
        <ChakraCheckbox.HiddenInput />
        <ChakraCheckbox.Control />
        <ChakraCheckbox.Label>{label}</ChakraCheckbox.Label>
      </ChakraCheckbox.Root>
    </div>
  );
}

export default Checkbox;
