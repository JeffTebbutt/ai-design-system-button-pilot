import "./Button.css";
import type { ButtonProps } from "./Button.types";

import { useEffect } from "react";
import machine from "./Button.states.json";
import { useStateMachine } from "../../state/useStateMachine";

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  isLoading = false,
  type = "button"
}) => {
  const { state, send } = useStateMachine(machine);

  useEffect(() => {
    // Priority: loading > disabled > default
    if (isLoading) {
      if (state !== "loading") send("SET_LOADING");
      return;
    }

    if (disabled) {
      if (state !== "disabled") send("SET_DISABLED");
      return;
    }

    if (state !== "default") {
      send("SET_ENABLED");
    }
  }, [isLoading, disabled, state]);

  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className="btn-primary"
      data-state={state}
      aria-busy={isLoading}
      aria-live="polite"

      // Mouse interactions
      onMouseEnter={() => send("MOUSE_ENTER")}
      onMouseLeave={() => send("MOUSE_LEAVE")}
      onMouseDown={(e) => {
        // Prevent mouse from triggering focus styling
        e.preventDefault();
        send("MOUSE_DOWN");
      }}
      onMouseUp={() => send("MOUSE_UP")}

      // Keyboard interactions
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
        if (e.key === " ") e.preventDefault();
          send("KEY_DOWN");
      }
  }}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          send("KEY_UP");
        }
      }}

      // Focus handling (keyboard-driven)
      onFocus={() => send("FOCUS")}
      onBlur={() => send("BLUR")}
    >
      {isLoading ? (
  <>
    <span className="visually-hidden">Loading</span>
    Loading...
  </>
) : (
  label
)}
    </button>
  );
};