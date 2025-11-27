import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { User } from '@/types';
import FormInput from '../../../../components/ui/formInput';
import FormSelect from '../../../../components/ui/formSelect';

interface UserFormModalProps {
  isOpen: boolean;
  editingUser: User | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function UserFormModal({
  isOpen,
  editingUser,
  onClose,
  onSubmit
}: UserFormModalProps) {
  const [formData, setFormData] = useState({
    nipd: '',
    nama: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    if (editingUser) {
      setFormData({
        nipd: editingUser.nipd,
        nama: editingUser.nama,
        email: editingUser.email || '',
        password: '',
        role: editingUser.role
      });
    } else {
      setFormData({
        nipd: '',
        nama: '',
        email: '',
        password: '',
        role: 'user'
      });
    }
  }, [editingUser]);

  const handleSubmit = () => {
    if (!formData.nipd || !formData.nama || (!formData.password && !editingUser)) {
      alert('NIPD, Nama, dan Password wajib diisi!');
      return;
    }
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">
            {editingUser ? 'Edit User' : 'Tambah User Baru'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 text-gray-700 space-y-4">
          <FormInput
            label="NIPD"
            name="nipd"
            value={formData.nipd}
            onChange={handleChange}
            required
            disabled={!!editingUser}
          />

          <FormInput
            label="Nama"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={!editingUser}
            placeholder={editingUser ? 'Kosongkan jika tidak ingin mengubah' : ''}
          />


          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-5 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              {editingUser ? 'Update' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
