import React, { useState, useEffect } from 'react';
import { Users, UserCheck, TrendingUp, Book, BookOpen } from 'lucide-react';
import { StatsCard } from '../components/DashboardSection/statsCard';
import { DataTable } from '../components/DashboardSection/dataTable';

interface User {
  id: number;
  nipd: string;
  nama: string;
  email?: string;
  role: string;
  profile_picture: string;
  created_at?: string;
}

export const Dashboard = ({ currentUser }: { currentUser: User | null }) => {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    userRole: 0,
    totalBooks: 0,
    activeLoans: 0
  });
  const [usersData, setUsersData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats dari backend
        const statsRes = await fetch('/api/admin/stats', {
          credentials: 'include'
        });

        if (statsRes.ok) {
          const stats = await statsRes.json();
          console.log('Stats received:', stats); // Debug log
          
          // Map data dari API ke state
          setStatsData({
            totalUsers: stats.totalUsers || 0,
            userRole: stats.userRole || 0,
            totalBooks: stats.totalBooks || 0,
            activeLoans: stats.booksBorrowed || 0  // Mapping booksBorrowed ke activeLoans
          });
        } else {
          console.error('Failed to fetch stats:', statsRes.status);
        }

        // Fetch users dengan role 'user' saja (bukan admin)
        const usersRes = await fetch('/api/admin/users?role=user&limit=10', {
          credentials: 'include'
        });

        if (usersRes.ok) {
          const users = await usersRes.json();
          console.log('Users data:', users); // Debug log
          
          // Filter hanya user role (bukan admin)
          const filteredUsers = Array.isArray(users) 
            ? users.filter((user: User) => user.role === 'user')
            : [];
          
          setUsersData(filteredUsers);
        } else {
          console.error('Failed to fetch users:', usersRes.status);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-3">Dashboard Admin</h1>
        <p className="text-blue-100 text-lg">
          Selamat datang kembali, <span className="font-semibold">{currentUser ? currentUser.nama : 'Admin'}</span>! Berikut ringkasan perpustakaan hari ini.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Users}
          title="Total Users"
          value={statsData.totalUsers}
          trend="up"
          trendValue="+8%"
          color="from-blue-500 to-blue-600"
          loading={loading}
        />
        <StatsCard
          icon={UserCheck}
          title="User Role"
          value={statsData.userRole}
          trend="up"
          trendValue="+12%"
          color="from-green-500 to-green-600"
          loading={loading}
        />
        <StatsCard
          icon={Book}
          title="Total Buku"
          value={statsData.totalBooks}
          trend="up"
          trendValue="+5%"
          color="from-purple-500 to-purple-600"
          loading={loading}
        />
        <StatsCard
          icon={BookOpen}
          title="Dipinjam"
          value={statsData.activeLoans}
          trend="up"
          trendValue="+15%"
          color="from-orange-500 to-orange-600"
          loading={loading}
        />
      </div>

      {/* Recent Users Table */}
      <DataTable
        title="Daftar Users PERPUSTB"
        columns={['ID', 'NIPD', 'Nama', 'Email', 'Role', 'Created At']}
        data={usersData}
        actions={true}
        loading={loading}
      />
    </div>
  );
};