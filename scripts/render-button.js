import fs from "fs";

  // Load component tokens
  const componentTokenMap = JSON.parse(
    fs.readFileSync("./src/components/Button/Button.tokens.json", "utf-8")
  );

// Load configs
const componentToSemanticMap = JSON.parse(
  fs.readFileSync("./tokens/component-map.json", "utf-8")
);

const tokenDefinitions = JSON.parse(
  fs.readFileSync("./tokens/tokens.json", "utf-8")
);

const renderConfig = JSON.parse(
  fs.readFileSync("./src/components/Button/Button.render.json", "utf-8")
);

const input = JSON.parse(
  fs.readFileSync("./tests/button.test.json", "utf-8")
);

// Token resolver
function resolveToken(token) {
  return componentToSemanticMap[token] || token;
}

function resolveTokenReferences(value) {
  return value.replace(/\{([^}]+)\}/g, (_, tokenPath) => {
    return `var(--${tokenPath.replace(/\./g, "-")})`;
  });
}

// Shadow resolver
function resolveShadow(shadowToken) {
  const token = tokenDefinitions.tokens.find(
    t => t.name === shadowToken
  );

    console.log("LOOKING FOR:", shadowToken);
  console.log("FOUND TOKEN:", token);

  if (!token || !token.value) return "";

  return token.value
    .map(layer => {
      const { x, y, blur, spread, color } = layer;

      const resolvedColor = resolveTokenReferences(color);

      return `${x} ${y} ${blur} ${spread} ${resolvedColor}`;
    })
    .join(", ");
}

// Renderer
function renderButton(config) {
  const { variant, state, props } = config;

  const el = renderConfig.element;

  const attrs = [];
  const styles = [];

  // Resolve background
  const componentBg =
  componentTokenMap.background[state] || componentTokenMap.background.default;

  const semanticBg = resolveToken(componentBg);
  styles.push(`--button-background: var(--${semanticBg})`);

  // Resolve text
  const componentText =
  componentTokenMap.text[state] || componentTokenMap.text.default;

  const semanticText = resolveToken(componentText);
  styles.push(`--button-text: var(--${semanticText})`);

  // Resolve shadow
  const componentShadow = componentTokenMap.shadow?.[state];

  if (componentShadow) {
  const semanticShadow = resolveToken(componentShadow);

  const shadowValue = resolveShadow(semanticShadow);

  styles.push(`--button-shadow: ${shadowValue}`);
  }

  // Attach styles
  attrs.push(`style="${styles.join("; ")};"`);

  // Attributes from render.json
  for (const [attr, template] of Object.entries(renderConfig.attributes)) {
    let value;

    if (typeof template === "string") {
      value = template
        .replace("{variant}", variant)
        .replace("{state}", state);
    }

    if (template === "disabled") value = props.disabled;
    if (template === "isLoading") value = props.isLoading;

    if (typeof value === "boolean") {
      if (value) attrs.push(attr);
    } else if (value !== undefined && value !== null) {
      attrs.push(`${attr}="${value}"`);
    }
  }

  const content = props?.isLoading
    ? "Loading..."
    : props?.label ?? "";

  return `
    <${el} ${attrs.join(" ")}>
      ${content}
    </${el}>
  `;
}

// Registry
const registry = {
  Button: renderButton
};

function render(config) {
  const renderer = registry[config.component];

  if (!renderer) {
    throw new Error(`Unknown component: ${config.component}`);
  }

  return renderer(config);
}

// Multi-state rendering
const states = ["default", "hover", "pressed", "focus", "disabled", "loading"];

const buttons = states.map((state) =>
  render({
    component: input.component,
    variant: input.variant,
    state,
    props: {
      label: state.charAt(0).toUpperCase() + state.slice(1),
      disabled: state === "disabled",
      isLoading: state === "loading"
    }
  })
);

// Output HTML
const html = `
<!doctype html>
<html>
  <head>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/fonts/euclid.css">
    <link rel="stylesheet" href="/styles/tokens.css">
    <link rel="stylesheet" href="/components/Button.css">
    <style>
      html, body {
        font-family: "Euclid Circular A", system-ui, sans-serif;
        font-weight: 400;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
    </style>
  </head>
  <body>
    <div style="padding:24px; display:flex; gap:16px; flex-wrap:wrap;">
      ${buttons.join("")}
    </div>
  </body>
</html>
`;

fs.writeFileSync("./public/button-generated.html", html);

console.log("✅ Generated button HTML");