export type ButtonState =
  | "default"
  | "hover"
  | "pressed"
  | "focus"
  | "disabled"
  | "loading";

export interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  state?: ButtonState;
}