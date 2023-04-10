import { useCallback } from "react";

type TextEditorProps = {
  className?: string;
  isDisabled?: boolean;
  onBlur?: () => void;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function TextEditor({
  className,
  isDisabled,
  onBlur,
  onChange,
  placeholder,
  value,
}: TextEditorProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.currentTarget.value);
    },
    [onChange]
  );

  return (
    <input
      className={className}
      disabled={isDisabled}
      value={value}
      onBlur={onBlur}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
}

export default TextEditor;
