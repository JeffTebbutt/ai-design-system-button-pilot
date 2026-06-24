import "./Button.css";
import type { ButtonProps } from "./Button.types";

import { useEffect, useMemo } from "react";
import machine from "./Button.states.json";
import { useStateMachine } from "../../state/useStateMachine";

import tokenDefinitionsRaw from "../../../tokens/tokens.json";
import componentMap from "../../../tokens/component-map.json";
import componentTokens from "./Button.tokens.json";

type ButtonState =
  | "default"
  | "hover"
  | "pressed"
  | "focus"
  | "disabled"
  | "loading";

type ComponentTokens = {
  background: Partial<Record<ButtonState, string>> & { default: string };
  text: Partial<Record<ButtonState, string>> & { default: string };
  shadow?: Partial<Record<ButtonState, string>>;
};

type TokenDefinition = {
  name: string;
  value: any;
};

function getToken<K extends string>(
  map: Partial<Record<K, string>> | undefined,
  key: K,
  fallback?: string
): string | undefined {
  return map?.[key] ?? fallback;
}

const tokenDefinitions = (tokenDefinitionsRaw as { tokens: TokenDefinition[] }).tokens;
const componentMapTyped = componentMap as Record<string, string>;
const tokens = componentTokens as ComponentTokens;

// Precompute lookup (faster)
const tokenMap: Record<string, TokenDefinition> = Object.fromEntries(
  tokenDefinitions.map((t) => [t.name, t])
);

function resolveToken(token: string) {
  return componentMapTyped[token] || token;
}

function resolveTokenReferences(value: string) {
  if (typeof value !== "string") return value;

  return value.replace(/\{([^}]+)\}/g, (_, tokenPath) => {
    return `var(--${tokenPath.replace(/\./g, "-")})`;
  });
}

function resolveShadow(shadowToken: string) {
  const token = tokenMap[shadowToken];

  if (!token || !token.value) return "";

  return token.value
    .map((layer: any) => {
      const { x, y, blur, spread, color } = layer;
      const resolvedColor = resolveTokenReferences(color);
      return `${x} ${y} ${blur} ${spread} ${resolvedColor}`;
    })
    .join(", ");
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  isLoading = false,
  type = "button",
  state: externalState
  }) => {
  
const { state: internalState, send } = useStateMachine(machine) as {
  state: ButtonState;
  send: (event: string) => void;
};

const state = externalState ?? internalState;

  useEffect(() => {
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

  const styles = useMemo(() => {
    const s: React.CSSProperties = {};

// Background
const bgToken =
  getToken(tokens.background, state, tokens.background.default) ??
  tokens.background.default;

const semanticBg = resolveToken(bgToken);
(s as any)["--button-background"] = `var(--${semanticBg})`;

// Text
const textToken =
  getToken(tokens.text, state, tokens.text.default) ??
  tokens.text.default;

const semanticText = resolveToken(textToken);
(s as any)["--button-text"] = `var(--${semanticText})`;

// Shadow
const shadowToken = getToken(tokens.shadow, state) ?? undefined;

if (shadowToken) {
  const semanticShadow = resolveToken(shadowToken);
  const shadowValue = resolveShadow(semanticShadow);

  if (shadowValue) {
    (s as any)["--button-shadow"] = shadowValue;
  }
} else {
  (s as any)["--button-shadow"] = "none";
}

    return s;
  }, [state]);

  return (
    <button
      type={type}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className="btn-primary"
      data-state={state}
      aria-busy={isLoading}
      aria-live="polite"
      style={styles}
      onMouseEnter={() => send("MOUSE_ENTER")}
      onMouseLeave={() => send("MOUSE_LEAVE")}
      onMouseDown={(e) => {
        e.preventDefault();
        send("MOUSE_DOWN");
      }}
      onMouseUp={() => send("MOUSE_UP")}
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