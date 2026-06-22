import fs from "fs";

const input = JSON.parse(
  fs.readFileSync("./tests/button.states.json", "utf-8")
);

const { states, props, variant } = input;

const buttons = states.map((state) => {
  const isDisabled = state === "disabled";
  const isLoading = state === "loading";

  return `
    <button
      class="btn-${variant}"
      data-state="${state}"
      ${isDisabled ? "disabled" : ""}
      aria-busy="${isLoading}"
    >
      ${isLoading ? "Loading..." : props.label}
    </button>
  `;
});

const html = `
<div style="padding:24px; display:flex; gap:16px; flex-wrap:wrap;">
  ${buttons.join("\n")}
</div>
`;

fs.writeFileSync("./tests/button-harness.html", html);

console.log("✅ Button harness generated");