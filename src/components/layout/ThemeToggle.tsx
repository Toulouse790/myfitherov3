
import React from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sun } from 'lucide-react';
import { useTheme } from "next-themes";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={`Passer au mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
};

export default ThemeToggle;
