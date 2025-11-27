"use client";

import React from 'react';
import { Book, Users, BookOpen, Home, Settings, LogOut } from 'lucide-react';

export const SidebarAdmin = ({ activeMenu, setActiveMenu, isSidebarOpen }: { 
  activeMenu: string; 
  setActiveMenu: (menu: string) => void; 
  isSidebarOpen: boolean 
}) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Kelola Users' },
    { id: 'books', icon: Book, label: 'Kelola Buku' },
    { id: 'loans', icon: BookOpen, label: 'Peminjaman' },
    { id: 'settings', icon: Settings, label: 'Pengaturan' },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      if (res.ok) {
        // Redirect ke halaman login
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
        alert('Logout gagal, silakan coba lagi');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Terjadi kesalahan saat logout');
    }
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-xl transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} z-40 border-r border-gray-200`}>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className={`font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent transition-all ${isSidebarOpen ? 'text-xl' : 'text-2xl'}`}>
          {isSidebarOpen ? 'ADMIN PERPUSTB' : 'TB'}
        </h1>
      </div>

      {/* Menu Items */}
      <nav className="mt-6 flex flex-col px-3">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 mb-2 rounded-xl transition-all ${
              activeMenu === item.id 
                ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon size={22} />
            {isSidebarOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-500 hover:bg-red-50 transition-all ${!isSidebarOpen && 'justify-center'}`}
        >
          <LogOut size={22} />
          {isSidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};