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
      style={{
        backgroundColor: "var(--color-surface-primary)",
        color: "var(--color-on-surface-primary)",
        height: "var(--size-7xl)",
        minWidth: "var(--size-11xl)",
        paddingLeft: "var(--space-large)",
        paddingRight: "var(--space-large)",
        paddingTop: "var(--space-none)",
        paddingBottom: "var(--space-none)",
        borderRadius: "var(--radius-full)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-none)",
        fontFamily: "var(--font-family-label)",
        fontSize: "var(--font-size-label)",
        fontWeight: "var(--font-weight-label)",
        lineHeight: "var(--line-height-label)",
        border: "none",
        cursor: isDisabled ? "not-allowed" : "pointer"
      }}
    >
      {isLoading ? "Loading..." : label}
    </button>
  );
};