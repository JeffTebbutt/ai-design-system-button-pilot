import "./Button.css";
import type { ButtonProps } from "./Button.types";

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  isLoading = false,
  type = "button"
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className="btn-primary"
    >
      {isLoading ? "Loading..." : label}
    </button>
  );
};