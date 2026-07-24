'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/');
  };

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Leads', href: '/dashboard/leads', icon: '👥' },
    { label: 'Oportunidades', href: '/dashboard/opportunities', icon: '🎯' },
    { label: 'Agenda', href: '/dashboard/agenda', icon: '📅' },
    { label: 'Distribuição', href: '/dashboard/distribution', icon: '🔄' },
    { label: 'Automações', href: '/dashboard/automations', icon: '🤖' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:bg-gray-900">
        <div className="flex items-center justify-center h-16 bg-blue-600">
          <span className="text-white font-bold text-xl">SEGi CRM</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
          >
            🚪 Sair
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between md:hidden">
          <span className="font-bold text-xl">SEGi CRM</span>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            ☰
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-gray-900 px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg"
            >
              Sair
            </button>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}
