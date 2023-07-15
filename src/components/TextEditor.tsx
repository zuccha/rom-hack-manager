import { KeyboardEvent, useCallback, useMemo } from "react";

type TextEditorProps = {
  autoFocus?: boolean;
  className?: string;
  error?: string;
  isDisabled?: boolean;
  isFullWidth?: boolean;
  onBlur?: () => void;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder: string;
  value: string;
};

function TextEditor({
  autoFocus,
  className,
  error,
  isDisabled,
  isFullWidth,
  onBlur,
  onChange,
  onSubmit,
  placeholder,
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

  const extendedClassName = useMemo(() => {
    const classNames = ["relative flex"];
    if (className) classNames.push(className);
    if (isFullWidth) classNames.push("flex-1");
    return classNames.join(" ");
  }, [className, isFullWidth]);

  return (
    <div className={extendedClassName}>
      <input
        autoFocus={autoFocus}
        className={error ? "flex-1 error" : "flex-1"}
        disabled={isDisabled}
        value={value}
        onBlur={onBlur}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
      {error && (
        <div className="absolute error-icon tooltip">
          !<div className="tooltip-text">{error}</div>
        </div>
      )}
    </div>
  );
}

export default TextEditor;
