import { Flex, Select as CSelect, Text } from "@chakra-ui/react";
import { useCallback } from "react";

export type SelectProps<Option extends string> = {
  isDisabled?: boolean;
  onChange: (value: Option) => void;
  options: { value: Option; label: string }[];
  placeholder: string;
  value: string;
};

function Select<Option extends string>({
  isDisabled,
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
    <Flex position="relative">
      {placeholder && value.length > 0 && (
        <Flex
          color={"gray.500"}
          left={2}
          position="absolute"
          top={-2}
          zIndex={10}
        >
          <Text fontSize="xs" px={1} zIndex={1}>
            {placeholder}
          </Text>
          <Flex
            borderBottomWidth={2}
            borderColor="white"
            h="50%"
            pos="absolute"
            w="100%"
          />
        </Flex>
      )}

      <CSelect
        bg="white"
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
