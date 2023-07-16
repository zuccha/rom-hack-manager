import {
  Flex,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { KeyboardEvent, useCallback } from "react";

export type TextEditorProps = {
  autoFocus?: boolean;
  error?: string;
  isDisabled?: boolean;
  onBlur?: () => void;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder: string;
  type?: InputProps["type"];
  value: string;
};

function TextEditor({
  autoFocus,
  error,
  isDisabled,
  onBlur,
  onChange,
  onSubmit,
  placeholder,
  type,
  value,
}: TextEditorProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.currentTarget.value);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSubmit?.();
      }
    },
    [onSubmit]
  );

  return (
    <InputGroup bg="white" size="sm">
      {placeholder && value.length > 0 && (
        <Flex
          color={error ? "red.500" : "gray.500"}
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

      <Input
        autoFocus={autoFocus}
        borderRadius={0}
        isDisabled={isDisabled}
        isInvalid={!!error}
        onBlur={onBlur}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        type={type}
        value={value}
      />

      {error && (
        <InputRightElement>
          <Tooltip label={error}>
            <WarningIcon color="red.600" />
          </Tooltip>
        </InputRightElement>
      )}
    </InputGroup>
  );
}

export default TextEditor;
