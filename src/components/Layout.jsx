import { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useTheme } from '../hooks/useTheme';

export default function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary text-text-primary transition-colors duration-200">
      <div className="flex flex-1">
        <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} theme={theme} onThemeToggle={toggleTheme} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
