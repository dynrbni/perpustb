"use client";
import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import PageHeader from './userHeader';
import SearchBar from './userSearchBar';
import UserTable from './userTable';
import UserFormModal from './userFormModal';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const method = editingUser ? 'PUT' : 'POST';
      const payload = editingUser 
        ? { ...formData, id: editingUser.id }
        : formData;

      const res = await fetch('/api/admin/users', {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(editingUser ? 'User berhasil diupdate!' : 'User berhasil ditambahkan!');
        fetchUsers();
        closeModal();
      } else {
        const error = await res.json();
        alert(error.message || 'Gagal menyimpan user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Gagal menyimpan user');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        alert('User berhasil dihapus!');
        fetchUsers();
      } else {
        alert('Gagal menghapus user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Gagal menghapus user');
    }
  };

  const openModal = (user?: User) => {
    setEditingUser(user || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nipd.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader onAddUser={() => openModal()} />
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <UserTable 
        users={filteredUsers} 
        loading={loading} 
        onEdit={openModal} 
        onDelete={handleDelete} 
      />
      <UserFormModal 
        isOpen={isModalOpen} 
        editingUser={editingUser} 
        onClose={closeModal} 
        onSubmit={handleFormSubmit} 
      />
    </div>
  );
}