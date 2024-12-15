import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    // Dynamically add 'dark' class to <html>
    const rootElement = document.documentElement;
    if (theme === 'dark') {
      rootElement.classList.add('dark');
    } else {
      rootElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16, 23, 42)] min-h-screen">
      {children}
    </div>
  );
}
