import { Flex, Select as CSelect } from "@chakra-ui/react";
import { useCallback } from "react";
import Placeholder from "./Placeholder";

export type SelectProps<Option extends string> = {
  isDisabled?: boolean;
  isFullWidth?: boolean;
  onChange: (value: Option) => void;
  options: { value: Option; label: string }[];
  placeholder: string;
  value: string;
};

function Select<Option extends string>({
  isDisabled,
  isFullWidth,
  onChange,
  options,
  placeholder,
  value,
}: SelectProps<Option>) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value as Option);
    },
    [onChange]
  );

  return (
    <Flex position="relative" flex={isFullWidth ? 1 : undefined}>
      {placeholder && value.length > 0 && (
        <Placeholder placeholder={placeholder} />
      )}

      <CSelect
        bg="white"
        borderColor="gray.500"
        borderRadius={0}
        isDisabled={isDisabled}
        onChange={handleChange}
        size="sm"
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </CSelect>
    </Flex>
  );
}

export default Select;
