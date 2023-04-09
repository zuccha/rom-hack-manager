export type ButtonProps = {
  className?: string;
  isDisabled?: boolean;
  onClick: () => void;
  text: string;
};

function Button({ className, isDisabled, onClick, text }: ButtonProps) {
  return (
    <button className={className} disabled={isDisabled} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
