
import React from 'react';
import Home from './pages/Home';
import { useTheme } from './hooks/useTheme';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

const App: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme(true);

  return (
    <ErrorBoundary>
      <Home isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </ErrorBoundary>
  );
};

export default React.memo(App);
