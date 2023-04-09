import { useCallback, useMemo } from "react";
import TextEditor from "./TextEditor";
import Button from "./Button";

type PathBrowserProps = {
  className?: string;
  isDisabled?: boolean;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

function PathBrowser({
  className,
  isDisabled,
  onChange,
  placeholder,
  value,
}: PathBrowserProps) {
  const handleBrowse = useCallback(() => {}, []);

  const extendedClassName = useMemo(() => {
    const baseClassName = "row";
    return className ? baseClassName + " " + className : baseClassName;
  }, [className]);

  return (
    <div className={extendedClassName}>
      <TextEditor
        className="flex-1"
        isDisabled={isDisabled}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
      <Button onClick={handleBrowse} text="..." isDisabled={isDisabled} />
    </div>
  );
}

export default PathBrowser;
