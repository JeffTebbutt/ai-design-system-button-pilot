import { Button } from "./components/Button/Button";
import ThemeToggle from "./components/ThemeToggle";
import "./styles/tokens.css";

export default function App() {
  return (
    <div style={{ padding: 40 }}>
      <ThemeToggle />

      <div style={{ display: "flex", gap: 16, marginTop: 20 }}>
        <Button label="Action" />
        <Button label="Disabled" disabled />
      </div>

<div style={{ padding: 24, display: "flex", gap: 16 }}>
  <button className="btn-primary" data-state="default">Default</button>
  <button className="btn-primary" data-state="hover">Hover</button>
  <button className="btn-primary" data-state="pressed">Pressed</button>
  <button className="btn-primary" data-state="focus">Focus</button>
  <button className="btn-primary" data-state="disabled" disabled>Disabled</button>
  <button className="btn-primary" data-state="loading">Loading…</button>
</div>
    </div>
  );
}