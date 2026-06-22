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
    </div>
  );
}