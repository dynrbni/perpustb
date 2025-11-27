'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, User, Book, Calendar, Search, Filter, AlertTriangle } from 'lucide-react';

interface BookType {
  id: number;
  kode_buku: string;
  judul: string;
  pengarang: string;
  penerbit?: string;
  cover_image?: string;
  kategori?: string;
}

interface UserType {
  id: number;
  nipd: string;
  nama: string;
  email?: string;
  profile_picture?: string;
}

interface BorrowData {
  id: number;
  kode_peminjaman?: string;
  book: BookType;
  user: UserType;
  tanggal_pinjam?: string | null;
  tanggal_harus_kembali?: string | null;
  tanggal_pengembalian_diinginkan?: string | null; // ← TAMBAHAN INI
  tanggal_dikembalikan?: string | null;
  status: 'menunggu' | 'dipinjam' | 'dikembalikan' | 'terlambat' | 'ditolak';
  catatan?: string;
  alasan_tolak?: string | null;
  created_at: string;
  updated_at?: string;
  hari_terlambat?: number;
  denda?: number | null;
}

const LoansPage = () => {
  const [activeTab, setActiveTab] = useState<'approval' | 'active' | 'late' | 'history'>('approval');
  const [allBorrows, setAllBorrows] = useState<BorrowData[]>([]);
  const [filteredBorrows, setFilteredBorrows] = useState<BorrowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBorrow, setSelectedBorrow] = useState<BorrowData | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Fetch all borrows
  const fetchBorrows = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/borrow', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success) {
        setAllBorrows(data.data || []);
      } else {
        console.error('Failed to fetch borrows:', data.message);
      }
    } catch (error) {
      console.error('Error fetching borrows:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  // Filter borrows by tab
  useEffect(() => {
    let filtered = allBorrows;

    // Filter by tab
    if (activeTab === 'approval') {
      filtered = filtered.filter(b => b.status === 'menunggu');
    } else if (activeTab === 'active') {
      filtered = filtered.filter(b => b.status === 'dipinjam');
    } else if (activeTab === 'late') {
      filtered = filtered.filter(b => b.status === 'terlambat');
    } else if (activeTab === 'history') {
      filtered = filtered.filter(b => b.status === 'dikembalikan' || b.status === 'ditolak');
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(borrow =>
        borrow.book.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        borrow.user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        borrow.user.nipd.toLowerCase().includes(searchQuery.toLowerCase()) ||
        borrow.book.kode_buku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(borrow => borrow.book.kategori === filterCategory);
    }

    setFilteredBorrows(filtered);
  }, [activeTab, allBorrows, searchQuery, filterCategory]);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(allBorrows.map(b => b.book.kategori).filter(Boolean)))];

  // Format date
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  // Time ago
  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} hari yang lalu`;
    if (hours > 0) return `${hours} jam yang lalu`;
    return 'Baru saja';
  };

  // Handle approve
  const handleApprove = async (borrowId: number) => {
    if (!confirm('Setujui permintaan peminjaman ini?')) return;
    
    try {
      const response = await fetch(`/api/admin/borrow/${borrowId}/approve`, {
        method: 'PUT',
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success) {
        alert(data.message || 'Peminjaman berhasil disetujui');
        fetchBorrows();
      } else {
        alert(data.message || 'Gagal menyetujui peminjaman');
      }
    } catch (error) {
      console.error('Error approving:', error);
      alert('Terjadi kesalahan saat menyetujui peminjaman');
    }
  };

  // Handle reject
  const handleRejectSubmit = async () => {
    if (!selectedBorrow) return;
    if (!rejectReason.trim()) {
      alert('Harap masukkan alasan penolakan');
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/borrow/${selectedBorrow.id}/reject`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alasan_tolak: rejectReason }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(data.message || 'Peminjaman berhasil ditolak');
        setShowRejectModal(false);
        setSelectedBorrow(null);
        setRejectReason('');
        fetchBorrows();
      } else {
        alert(data.message || 'Gagal menolak peminjaman');
      }
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Terjadi kesalahan saat menolak peminjaman');
    }
  };

  // Count by status
  const pendingCount = allBorrows.filter(b => b.status === 'menunggu').length;
  const activeCount = allBorrows.filter(b => b.status === 'dipinjam').length;
  const lateCount = allBorrows.filter(b => b.status === 'terlambat').length;
  const historyCount = allBorrows.filter(b => b.status === 'dikembalikan' || b.status === 'ditolak').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Book className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Peminjaman</h2>
            <p className="text-gray-600">Kelola persetujuan, peminjaman aktif, dan riwayat peminjaman buku</p>
          </div>
        </div>
      </div>

      {/* Tabs - 4 TABS */}
      <div className="bg-white rounded-2xl p-2 shadow-md border border-gray-100 grid grid-cols-4 gap-2">
        <button
          onClick={() => setActiveTab('approval')}
          className={`py-3 px-4 rounded-xl font-bold transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
            activeTab === 'approval'
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
              : 'text-gray-700 hover:bg-yellow-50'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-sm">Approval</span>
          <span className="text-xs opacity-80">({pendingCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`py-3 px-4 rounded-xl font-bold transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
            activeTab === 'active'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
              : 'text-gray-700 hover:bg-blue-50'
          }`}
        >
          <Book className="w-5 h-5" />
          <span className="text-sm">Aktif</span>
          <span className="text-xs opacity-80">({activeCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('late')}
          className={`py-3 px-4 rounded-xl font-bold transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
            activeTab === 'late'
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
              : 'text-gray-700 hover:bg-red-50'
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="text-sm">Terlambat</span>
          <span className="text-xs opacity-80">({lateCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-4 rounded-xl font-bold transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-sm">Riwayat</span>
          <span className="text-xs opacity-80">({historyCount})</span>
        </button>
      </div>

      {/* Search & Filter */}
      {(activeTab === 'approval' || activeTab === 'active' || activeTab === 'late') && (
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari siswa, buku, NIPD, atau kode buku..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="all">Semua Kategori</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {filteredBorrows.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-md border border-gray-100 text-center">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {activeTab === 'approval' && 'Tidak ada permintaan menunggu'}
            {activeTab === 'active' && 'Tidak ada peminjaman aktif'}
            {activeTab === 'late' && 'Tidak ada peminjaman terlambat'}
            {activeTab === 'history' && 'Tidak ada riwayat'}
          </h3>
          <p className="text-gray-500">
            {activeTab === 'approval' && 'Semua permintaan peminjaman telah diproses'}
            {activeTab === 'active' && 'Tidak ada buku yang sedang dipinjam'}
            {activeTab === 'late' && 'Tidak ada buku yang terlambat dikembalikan'}
            {activeTab === 'history' && 'Belum ada riwayat peminjaman'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBorrows.map((borrow) => (
            <div
              key={borrow.id}
              className={`rounded-2xl p-6 shadow-md border-2 hover:shadow-xl transition-all duration-300 ${
                borrow.status === 'menunggu' ? 'bg-gradient-to-br from-yellow-50 to-white border-yellow-200' :
                borrow.status === 'terlambat' ? 'bg-gradient-to-br from-red-50 to-white border-red-200' :
                borrow.status === 'dipinjam' ? 'bg-gradient-to-br from-blue-50 to-white border-blue-200' :
                'bg-gradient-to-br from-gray-50 to-white border-gray-200'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Book Cover */}
                <div className="lg:col-span-2">
                  <img
                    src={borrow.book.cover_image || 'https://via.placeholder.com/150x200/3B82F6/FFFFFF?text=No+Cover'}
                    alt={borrow.book.judul}
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                </div>

                {/* Book & User Info */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Book Info */}
                  <div>
                    <div className="flex items-start gap-2 mb-2">
                      <Book className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{borrow.book.judul}</h3>
                        <p className="text-gray-600">{borrow.book.pengarang}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            {borrow.book.kode_buku}
                          </span>
                          {borrow.book.kategori && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                              {borrow.book.kategori}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 font-semibold">Peminjam</p>
                        <div className="flex items-center gap-3 mt-1">
                          {borrow.user.profile_picture ? (
                            <img
                              src={borrow.user.profile_picture}
                              alt={borrow.user.nama}
                              className="w-10 h-10 rounded-full object-cover shadow-md"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                              {borrow.user.nama.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-800">{borrow.user.nama}</p>
                            <p className="text-sm text-gray-500">NIPD: {borrow.user.nipd}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="grid grid-cols-2 gap-3">
                    {activeTab === 'approval' && (
                      <>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 font-semibold mb-1">DIAJUKAN</p>
                          <p className="text-sm font-bold text-gray-800">{formatDate(borrow.created_at)}</p>
                          <p className="text-xs text-gray-500 mt-1">{timeAgo(borrow.created_at)}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 font-semibold mb-1">DIKEMBALIKAN PADA</p>
                          <p className="text-sm font-bold text-gray-800">
                            {formatDate(borrow.tanggal_pengembalian_diinginkan)}
                          </p>
                        </div>
                      </>
                    )}

                    {(activeTab === 'active' || activeTab === 'late') && (
                      <>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 font-semibold mb-1">DIPINJAM</p>
                          <p className="text-sm font-bold text-gray-800">{formatDate(borrow.tanggal_pinjam)}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 font-semibold mb-1">HARUS KEMBALI</p>
                          <p className="text-sm font-bold text-gray-800">{formatDate(borrow.tanggal_harus_kembali)}</p>
                        </div>
                        {activeTab === 'late' && (
                          <>
                            <div className="bg-white rounded-lg p-3 border border-red-200">
                              <p className="text-xs text-red-600 font-semibold mb-1">HARI TERLAMBAT</p>
                              <p className="text-sm font-bold text-red-600">{borrow.hari_terlambat || 0} hari</p>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-red-200">
                              <p className="text-xs text-red-600 font-semibold mb-1">DENDA</p>
                              <p className="text-sm font-bold text-red-600">Rp {borrow.denda?.toLocaleString('id-ID') || '0'}</p>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {activeTab === 'history' && (
                      <>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 font-semibold mb-1">DIPINJAM</p>
                          <p className="text-sm font-bold text-gray-800">{formatDate(borrow.tanggal_pinjam)}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <p className="text-xs text-gray-500 font-semibold mb-1">
                            {borrow.status === 'dikembalikan' ? 'DIKEMBALIKAN' : 'DITOLAK'}
                          </p>
                          <p className="text-sm font-bold text-gray-800">
                            {formatDate(borrow.status === 'dikembalikan' ? borrow.tanggal_dikembalikan : borrow.updated_at)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Catatan / Alasan Tolak */}
                  {borrow.catatan && activeTab === 'approval' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-600 font-semibold mb-1">CATATAN PEMINJAM</p>
                      <p className="text-sm text-blue-800">{borrow.catatan}</p>
                    </div>
                  )}

                  {borrow.alasan_tolak && activeTab === 'history' && borrow.status === 'ditolak' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs text-red-600 font-semibold mb-1">ALASAN PENOLAKAN</p>
                      <p className="text-sm text-red-800">{borrow.alasan_tolak}</p>
                    </div>
                  )}

                  {activeTab === 'late' && (
                    <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">Buku terlambat dikembalikan. Denda sedang berjalan Rp 1.000/hari.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {activeTab === 'approval' && (
                  <div className="lg:col-span-3 flex flex-col gap-3">
                    <button
                      onClick={() => handleApprove(borrow.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg transition-all duration-200"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Setujui
                    </button>

                    <button
                      onClick={() => {
                        setSelectedBorrow(borrow);
                        setShowRejectModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg transition-all duration-200"
                    >
                      <XCircle className="w-5 h-5" />
                      Tolak
                    </button>

                    <div className="bg-yellow-100 rounded-lg p-3 text-center border border-yellow-300">
                      <p className="text-xs text-yellow-700 font-semibold mb-1">KODE</p>
                      <p className="text-sm font-bold text-yellow-800">{borrow.kode_peminjaman || '-'}</p>
                    </div>
                  </div>
                )}

                {activeTab !== 'approval' && (
                  <div className="lg:col-span-3 flex flex-col gap-3">
                    <div className="bg-gray-100 rounded-lg p-3 text-center border border-gray-300">
                      <p className="text-xs text-gray-700 font-semibold mb-1">KODE</p>
                      <p className="text-sm font-bold text-gray-800">{borrow.kode_peminjaman || '-'}</p>
                    </div>
                    <div className={`rounded-lg p-3 text-center font-bold ${
                      borrow.status === 'dipinjam' ? 'bg-blue-100 text-blue-800' :
                      borrow.status === 'terlambat' ? 'bg-red-100 text-red-800' :
                      borrow.status === 'dikembalikan' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {borrow.status === 'dipinjam' && 'Sedang Dipinjam'}
                      {borrow.status === 'terlambat' && 'Terlambat'}
                      {borrow.status === 'dikembalikan' && 'Dikembalikan'}
                      {borrow.status === 'ditolak' && 'Ditolak'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedBorrow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Tolak Peminjaman</h3>
                <p className="text-sm text-gray-500">{selectedBorrow.user.nama}</p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Buku:</span> {selectedBorrow.book.judul}
              </p>
            </div>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Masukkan alasan penolakan (wajib)..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 text-gray-700 focus:ring-red-500 min-h-[100px]"
              rows={4}
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedBorrow(null);
                  setRejectReason('');
                }}
                className="flex-1 py-3 rounded-lg border-2 border-gray-300 font-bold text-gray-700 hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim()}
                className={`flex-1 py-3 rounded-lg font-bold text-white transition-all ${
                  rejectReason.trim()
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Tolak Peminjaman
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansPage;