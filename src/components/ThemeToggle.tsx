import React from 'react';
import { IconSun, IconMoon } from '@tabler/icons-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-4 right-4 p-2 rounded-full transition-colors ${
        isDark ? 'bg-neutral-800 hover:bg-neutral-700' : 'bg-neutral-200 hover:bg-neutral-300'
      }`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <IconSun size={20} className="text-neutral-200" />
      ) : (
        <IconMoon size={20} className="text-neutral-800" />
      )}
    </button>
  );
}

export default ThemeToggle;