import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { Menu, X, LogOut, User, Sun, Moon } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden mr-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold text-navy-600 dark:text-navy-400">Portfolio Manager</h1>
          </div>

          {/* Desktop right */}
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-gray-700 dark:text-gray-300">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut size={16} className="mr-1" /> Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <User size={16} /> {user?.email}
            </div>
            <Button variant="outline" size="sm" onClick={signOut} className="w-full justify-center">
              <LogOut size={16} className="mr-1" /> Đăng xuất
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;