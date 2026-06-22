import { useTheme } from "../theme/ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() =>
        setTheme(theme === "onenz-light" ? "onenz-dark" : "onenz-light")
      }
      style={{
        marginBottom: 20,
        padding: "8px 16px",
        cursor: "pointer"
      }}
    >
      Toggle Theme ({theme})
    </button>
  );
}