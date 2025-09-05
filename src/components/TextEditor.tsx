import { Box, Icon, Input, InputGroup, InputProps } from "@chakra-ui/react";
import { CircleAlertIcon, XIcon } from "lucide-react";
import { KeyboardEvent, useCallback } from "react";
import IconButton from "./IconButton";
import Placeholder from "./Placeholder";
import Tooltip from "./Tooltip";

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
    <Box position="relative" w="full">
      <InputGroup
        endElement={
          error ? (
            <Tooltip content={error}>
              <Icon color="fg.error" size="sm">
                <CircleAlertIcon />
              </Icon>
            </Tooltip>
          ) : onClear && value ? (
            <IconButton
              icon={<XIcon />}
              isDisabled={!value}
              label="Clear"
              onClick={onClear}
            />
          ) : undefined
        }
      >
        <Input
          _focusVisible={{
            borderColor: error ? "border.error" : "blue.focusRing",
          }}
          autoFocus={autoFocus}
          borderColor={error ? "border.error" : "border"}
          borderRadius={0}
          colorPalette="blue"
          disabled={isDisabled}
          onBlur={onBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          outlineColor={error ? "border.error" : "blue.focusRing"}
          type={type}
          value={value}
          readOnly={isReadOnly}
          size="sm"
        />
      </InputGroup>

      {placeholder && value.length > 0 && (
        <Placeholder placeholder={placeholder} />
      )}
    </Box>
  );
}

export default TextEditor;
