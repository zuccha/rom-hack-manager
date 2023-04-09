import { useCallback } from "react";

type TextEditorProps = {
  className?: string;
  isDisabled?: boolean;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function TextEditor({
  className,
  isDisabled,
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
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
}

export default TextEditor;
