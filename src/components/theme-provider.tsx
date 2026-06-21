import { ThemeProvider as NextThemesProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Wraps next-themes so the rest of the app can toggle dark mode.
 * `attribute="class"` matches tailwind.config.ts's `darkMode: ["class"]`.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="pitchin-theme"
    >
      {children}
    </NextThemesProvider>
  );
}