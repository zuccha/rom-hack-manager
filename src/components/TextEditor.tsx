import {
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  Tooltip,
} from "@chakra-ui/react";
import { CloseIcon, WarningIcon } from "@chakra-ui/icons";
import { KeyboardEvent, useCallback } from "react";
import IconButton from "./IconButton";
import Placeholder from "./Placeholder";

export type TextEditorProps = {
  autoFocus?: boolean;
  error?: string;
  isDisabled?: boolean;
  onBlur?: () => void;
  onChange: (value: string) => void;
  onClear?: () => void;
  onSubmit?: () => void;
  placeholder: string;
  type?: InputProps["type"];
  value: string;
  isReadOnly?: boolean;
};

function TextEditor({
  autoFocus,
  error,
  isDisabled,
  onBlur,
  onChange,
  onClear,
  onSubmit,
  placeholder,
  type,
  value,
  isReadOnly = false,
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
    <InputGroup bg="white" borderColor="gray.500" size="sm">
      {placeholder && value.length > 0 && (
        <Placeholder placeholder={placeholder} />
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
        isReadOnly={isReadOnly}
      />

      {error && (
        <InputRightElement>
          <Tooltip label={error}>
            <WarningIcon color="red.600" />
          </Tooltip>
        </InputRightElement>
      )}

      {!error && onClear && (
        <InputRightElement>
          <IconButton
            icon={<CloseIcon />}
            isDisabled={!value}
            label="Clear"
            onClick={onClear}
          />
        </InputRightElement>
      )}
    </InputGroup>
  );
}

export default TextEditor;
