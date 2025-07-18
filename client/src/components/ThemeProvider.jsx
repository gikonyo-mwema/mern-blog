import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div className={theme}>
      <div className="bg-gray-50 text-gray-800 dark:bg-[#051836] dark:text-gray-300 min-h-screen">
        {children}
      </div>
    </div>
  );
}
