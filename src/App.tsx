import { Button } from "./components/Button/Button";
import "./styles/tokens.css";

export default function App() {
  return (
    <div style={{ padding: 40, display: "flex", gap: 16 }}>
      <Button label="Action" />
      <Button label="Disabled" disabled />
    </div>
  );
}