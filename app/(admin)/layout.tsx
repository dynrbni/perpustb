"use client";
import React, { useState, useEffect } from "react";
import { SidebarAdmin } from "./components/DashboardSection/sidebarAdmin";
import { NavbarAdmin } from "./components/DashboardSection/NavbarAdmin";
import { Dashboard } from "./components/dashboard";
import UsersPage from "./components/UserSection/userPage";
import BooksPage from "./components/BookSection/bookspage";
import LoansPage from "./components/LoansSection/loansPage";
import { User } from '@/types';

// Placeholder Settings
const SettingsPage = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold text-gray-800">Pengaturan</h2>
    <p className="text-gray-600 mt-2">Halaman pengaturan (placeholder)</p>
  </div>
);

export default function AdminLayout() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch current user dari backend
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include'
        });

        if (res.ok) {
          const data = await res.json();
          console.log('User data:', data); // Debug log
          
          // API lu return { user: {...} }, jadi ambil data.user
          if (data.user) {
            setCurrentUser(data.user);
          }
        } else {
          console.error('Failed to fetch user, redirecting to login');
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        window.location.href = '/login';
      }
    };

    fetchCurrentUser();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <Dashboard currentUser={currentUser} />;
      case "users":
        return <UsersPage />;
      case "books":
        return <BooksPage />;
      case "loans":
        return <LoansPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Dashboard currentUser={currentUser} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <SidebarAdmin 
        isSidebarOpen={isSidebarOpen} 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu} 
      />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Navbar */}
        <NavbarAdmin 
          toggleSidebar={toggleSidebar}
          currentUser={currentUser}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}