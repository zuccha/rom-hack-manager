import {
  Flex,
  Select as ChakraSelect,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import { useMemo } from "react";
import Placeholder from "./Placeholder";

export type SelectProps<Option extends string> = {
  isDisabled?: boolean;
  isFullWidth?: boolean;
  options: { value: Option; label: string }[];
  placeholder: string;
} & (
  | {
      isMultiple?: false;
      value: string;
      onChange: (value: Option) => void;
    }
  | {
      isMultiple: true;
      value: string[];
      onChange: (value: Option[]) => void;
    }
);

function Select<Option extends string>({
  isDisabled,
  isFullWidth,
  isMultiple,
  onChange,
  options,
  placeholder,
  value,
}: SelectProps<Option>) {
  const collection = useMemo(
    () => createListCollection({ items: options }),
    []
  );

  return (
    <Flex position="relative" flex={isFullWidth ? 1 : undefined}>
      {placeholder && value.length > 0 && (
        <Placeholder placeholder={placeholder} />
      )}

      <ChakraSelect.Root
        borderRadius={0}
        collection={collection}
        colorPalette="blue"
        disabled={isDisabled}
        multiple={isMultiple}
        onValueChange={(e) => {
          isMultiple
            ? onChange(e.value as Option[])
            : onChange(e.value[0] as Option);
        }}
        outlineColor="blue.focusRing"
        size="sm"
        value={isMultiple ? value : [value]}
      >
        <ChakraSelect.HiddenSelect aria-labelledby="" />
        <ChakraSelect.Control>
          <ChakraSelect.Trigger borderRadius={0}>
            <ChakraSelect.ValueText placeholder={placeholder} />
          </ChakraSelect.Trigger>
          <ChakraSelect.IndicatorGroup>
            <ChakraSelect.Indicator />
          </ChakraSelect.IndicatorGroup>
        </ChakraSelect.Control>
        <Portal>
          <ChakraSelect.Positioner>
            <ChakraSelect.Content>
              {options.map((option) => (
                <ChakraSelect.Item item={option.value} key={option.value}>
                  {option.label}
                  <ChakraSelect.ItemIndicator />
                </ChakraSelect.Item>
              ))}
            </ChakraSelect.Content>
          </ChakraSelect.Positioner>
        </Portal>
      </ChakraSelect.Root>
    </Flex>
  );
}

export default Select;
