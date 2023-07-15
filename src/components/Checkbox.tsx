import { useMemo } from "react";

export type CheckboxProps = {
  className?: string;
  isDisabled?: boolean;
  label: string;
  onToggle: () => void;
  value: boolean;
};

function Checkbox({
  className,
  isDisabled,
  label,
  onToggle,
  value,
}: CheckboxProps) {
  const extendedClassName = useMemo(() => {
    const classNames = ["row align-center"];
    if (className) classNames.push(className);
    return classNames.join(" ");
  }, [className]);

  return (
    <div className={extendedClassName} onChange={onToggle}>
      <input type="checkbox" checked={value} disabled={isDisabled} />
      <label className="">{label}</label>
    </div>
  );
}

export default Checkbox;
