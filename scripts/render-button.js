import fs from "fs";

// Load render contract
const renderConfig = JSON.parse(
  fs.readFileSync("./src/components/Button/Button.render.json", "utf-8")
);

// Load input JSON
const input = JSON.parse(
  fs.readFileSync("./tests/button.test.json", "utf-8")
);

function renderButton(config) {
  const { variant, state, props } = config;

  const el = renderConfig.element;

  const attrs = [];

  // ✅ MUST BE INSIDE THIS FUNCTION
  for (const [attr, template] of Object.entries(renderConfig.attributes)) {
    let value;

    if (typeof template === "string") {
      value = template
        .replace("{variant}", variant)
        .replace("{state}", state);
    }

    if (template === "disabled") {
      value = props.disabled;
    }

    if (template === "isLoading") {
      value = props.isLoading;
    }

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

const states = ["default", "hover", "pressed", "focus", "disabled", "loading"];

const buttons = states.map((state) =>
  render({
    component: input.component,
    variant: input.variant,
    state,
    props: {
      label: input.props.label,
      disabled: state === "disabled",
      isLoading: state === "loading"
    }
  })
);

const html = `
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="/src/styles/tokens.css">
    <link rel="stylesheet" href="/src/components/Button/Button.css">
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