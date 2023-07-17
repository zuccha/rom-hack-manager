import { Checkbox as CCheckbox, Text } from "@chakra-ui/react";

export type CheckboxProps = {
  className?: string;
  isDisabled?: boolean;
  label: string;
  onToggle: () => void;
  value: boolean;
};

function Checkbox({ isDisabled, label, onToggle, value }: CheckboxProps) {
  return (
    <div>
      <CCheckbox
        type="checkbox"
        checked={value}
        defaultChecked={value}
        disabled={isDisabled}
        onChange={onToggle}
      >
        <Text fontSize="sm">{label}</Text>
      </CCheckbox>
    </div>
  );
}

export default Checkbox;
