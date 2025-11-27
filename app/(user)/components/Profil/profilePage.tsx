'use client';
import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Camera, Save, X, BookOpen, AlertCircle, CheckCircle, TrendingUp, ArrowLeft } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface UserData {
  id: number;
  nipd: string;
  nama: string;
  email?: string;
  role: string;
  profile_picture: string;
  created_at?: string;
}

interface BorrowHistory {
  id: number;
  status: 'menunggu' | 'dipinjam' | 'dikembalikan' | 'terlambat' | 'ditolak';
}

export default function ProfilPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [borrowHistory, setBorrowHistory] = useState<BorrowHistory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
  });
  const [profileImage, setProfileImage] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setFormData({ nama: data.user.nama || '', email: data.user.email || '', password: '' });
          setPreviewImage(data.user.profile_picture || '');
          setProfileImage(data.user.profile_picture || '');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchBorrowHistory = async () => {
      try {
        const response = await fetch('/api/borrow', { credentials: 'include' });
        if (response.ok) {
          const result = await response.json();
          const data = result?.data || result || [];
          setBorrowHistory(Array.isArray(data) ? data : []);
        } else {
          setBorrowHistory([]);
        }
      } catch (error) {
        console.error('Error fetching borrow history:', error);
        setBorrowHistory([]);
      }
    };
    fetchBorrowHistory();
  }, []);

  const stats = {
    active: borrowHistory.filter(h => h.status === 'dipinjam').length,
    completed: borrowHistory.filter(h => h.status === 'dikembalikan').length,
    late: borrowHistory.filter(h => h.status === 'terlambat').length,
  };
  const total = stats.active + stats.completed + stats.late;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File Terlalu Besar', {
          description: 'Ukuran maksimal file adalah 2MB'
        });
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Format File Salah', {
          description: 'File harus berupa gambar (jpg, png, dll)'
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setProfileImage(result);
        toast.success('Foto Profil Dipilih', {
          description: 'Jangan lupa simpan perubahan'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!formData.nama || formData.nama.trim() === '') {
      toast.error('Nama Wajib Diisi', {
        description: 'Nama tidak boleh kosong'
      });
      return;
    }

    setIsLoading(true);
    try {
      const updateData: any = { nama: formData.nama.trim() };
      if (formData.email?.trim()) updateData.email = formData.email.trim();
      if (formData.password?.trim()) updateData.password = formData.password;
      if (profileImage && profileImage !== user?.profile_picture) updateData.profile_picture = profileImage;

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }
      
      toast.success('Profil Berhasil Diperbarui!', {
        description: 'Perubahan akan diterapkan dalam beberapa saat'
      });
      setIsEditing(false);
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      toast.error('Gagal Memperbarui Profil', {
        description: error.message || 'Terjadi kesalahan, silakan coba lagi'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ nama: user?.nama || '', email: user?.email || '', password: '' });
    setPreviewImage(user?.profile_picture || '');
    setProfileImage(user?.profile_picture || '');
    toast.info('Perubahan Dibatalkan', {
      description: 'Semua perubahan telah dikembalikan'
    });
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-slate-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      <Toaster position="top-center" richColors />
      
      {!isEditing ? (
        <>
          {/* Header */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Profil Pengguna</h1>
            <p className="text-xs text-gray-400 mt-0.5">Kelola preferensi akun perpustakaan anda</p>
          </div>

          {/* Profile Card & Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-white shadow-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-3 sm:mb-4">
                  {previewImage ? (
                    <img src={previewImage} alt={user.nama} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl sm:text-4xl font-bold text-white">{user.nama.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{user.nama}</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">{user.nipd}</p>
                <span className="inline-block mt-2 sm:mt-3 px-3 sm:px-4 py-1 sm:py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  {user.role}
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full mt-4 sm:mt-6 py-2 sm:py-2.5 bg-blue-600 text-white text-sm rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  Edit Profil
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Informasi Akun</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-50">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">Email</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate ml-2">{user.email || 'Belum diatur'}</span>
                </div>
                <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-50">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">ID Siswa</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">{user.nipd}</span>
                </div>
                <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-50">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">Role</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">{user.role}</span>
                </div>
                <div className="flex items-center justify-between py-2 sm:py-3">
                  <span className="text-xs sm:text-sm text-gray-600 font-medium">Anggota Sejak</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 rounded-xl sm:rounded-2xl transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-2 sm:mb-2.5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-500/20">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2} />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">{stats.active}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 font-semibold mb-1.5 sm:mb-2">Sedang Dipinjam</p>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-green-600 font-semibold">
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2.5} />
                  <span>Aktif</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 hover:border-red-300 hover:shadow-2xl hover:shadow-red-100/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-red-50/50 to-transparent opacity-0 group-hover:opacity-100 rounded-xl sm:rounded-2xl transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center mb-2 sm:mb-2.5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-red-500/20">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2} />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">{stats.late}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 font-semibold mb-1.5 sm:mb-2">Buku Terlambat</p>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-red-600 font-semibold">
                  <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2.5} />
                  <span>Denda: Rp 0</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 hover:border-green-300 hover:shadow-2xl hover:shadow-green-100/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-50/50 to-transparent opacity-0 group-hover:opacity-100 rounded-xl sm:rounded-2xl transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-2 sm:mb-2.5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-green-500/20">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2} />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">{stats.completed}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 font-semibold mb-1.5 sm:mb-2">Pengembalian Selesai</p>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-green-600 font-semibold">
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2.5} />
                  <span>Selesai</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-100/50 hover:-translate-y-2 transition-all duration-300 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 rounded-xl sm:rounded-2xl transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mb-2 sm:mb-2.5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-purple-500/20">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2} />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">{total}</p>
                <p className="text-[10px] sm:text-xs text-gray-500 font-semibold mb-1.5 sm:mb-2">Total Peminjaman</p>
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-purple-600 font-semibold">
                  <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2.5} />
                  <span>Riwayat</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Edit Form - Clean & Compact Design */}
          <div className="max-w-2xl mx-auto">
            {/* Back Button */}
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base font-medium">Kembali</span>
            </button>

            {/* Header */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Profil</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Perbarui informasi pribadi Anda</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              {/* Profile Picture */}
              <div className="flex justify-center mb-6 sm:mb-8">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-blue-50 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                    {previewImage ? (
                      <img src={previewImage} alt={user.nama} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl sm:text-4xl font-bold text-white">{user.nama.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleFormChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">NIPD</label>
                  <input
                    type="text"
                    value={user.nipd}
                    disabled
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">ID tidak dapat diubah</p>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="email@contoh.com"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Password Baru</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Kosongkan jika tidak ingin mengubah"
                    autoComplete="new-password"
                  />
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-8">
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="flex-1 py-2.5 sm:py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 py-2.5 sm:py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  <span>Batal</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}