import { useCallback } from "react";

type TextEditorProps = {
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function TextEditor({ onChange, placeholder, value }: TextEditorProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.currentTarget.value);
    },
    [onChange]
  );

  return (
    <input value={value} onChange={handleChange} placeholder={placeholder} />
  );
}

export default TextEditor;
