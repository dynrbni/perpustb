"use client";

import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { User } from '@/types';

export const NavbarAdmin = ({ toggleSidebar, currentUser }: { 
  toggleSidebar: () => void;
  currentUser: User | null;
}) => {
  const getInitials = (nama: string | undefined) => {
    if (!nama) return 'U';
    return nama
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar} 
            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all"
          >
            <Menu size={24} />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari buku, user, peminjaman"
              className="pl-10 pr-4 py-2.5 w-96 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 text-gray-700 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <button className="relative text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all">
            <Bell size={24} />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">3</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-semibold shadow-md">
                {getInitials(currentUser.nama)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{currentUser.nama}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser.role} • {currentUser.nipd}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-11 h-11 bg-gray-300 rounded-xl flex items-center justify-center text-white font-semibold shadow-md animate-pulse">
                <span>...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};