type Theme = "light" | "dark";

type ThemeSwitchProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export default function ThemeSwitch({ theme, setTheme }: ThemeSwitchProps) {
  return (
    <button
      style={{ marginLeft: 16 }}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      Switch to {theme === "light" ? "Dark" : "Light"} Theme
    </button>
  );
}