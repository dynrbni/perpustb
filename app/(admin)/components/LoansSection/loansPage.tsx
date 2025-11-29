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
  tanggal_pengembalian_diinginkan?: string | null;
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

  useEffect(() => {
    let filtered = allBorrows;

    if (activeTab === 'approval') {
      filtered = filtered.filter(b => b.status === 'menunggu');
    } else if (activeTab === 'active') {
      filtered = filtered.filter(b => b.status === 'dipinjam');
    } else if (activeTab === 'late') {
      filtered = filtered.filter(b => b.status === 'terlambat');
    } else if (activeTab === 'history') {
      filtered = filtered.filter(b => b.status === 'dikembalikan' || b.status === 'ditolak');
    }

    if (searchQuery) {
      filtered = filtered.filter(borrow =>
        borrow.book.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        borrow.user.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        borrow.user.nipd.toLowerCase().includes(searchQuery.toLowerCase()) ||
        borrow.book.kode_buku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(borrow => borrow.book.kategori === filterCategory);
    }

    setFilteredBorrows(filtered);
  }, [activeTab, allBorrows, searchQuery, filterCategory]);

  const categories = ['all', ...Array.from(new Set(allBorrows.map(b => b.book.kategori).filter(Boolean)))];

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  const timeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}h lalu`;
    if (hours > 0) return `${hours}j lalu`;
    return 'Baru saja';
  };

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

  const pendingCount = allBorrows.filter(b => b.status === 'menunggu').length;
  const activeCount = allBorrows.filter(b => b.status === 'dipinjam').length;
  const lateCount = allBorrows.filter(b => b.status === 'terlambat').length;
  const historyCount = allBorrows.filter(b => b.status === 'dikembalikan' || b.status === 'ditolak').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-1.5 border border-gray-100">
        <div className="grid grid-cols-4 gap-1.5">
          <button
            onClick={() => setActiveTab('approval')}
            className={`py-2.5 px-3 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'approval'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Approval</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                activeTab === 'approval' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {pendingCount}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`py-2.5 px-3 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'active'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Book className="w-4 h-4" />
              <span>Aktif</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                activeTab === 'active' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {activeCount}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('late')}
            className={`py-2.5 px-3 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'late'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Terlambat</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                activeTab === 'late' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {lateCount}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-2.5 px-3 rounded-lg font-semibold text-sm transition-all ${
              activeTab === 'history'
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Riwayat</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                activeTab === 'history' ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {historyCount}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      {(activeTab === 'approval' || activeTab === 'active' || activeTab === 'late') && (
        <div className="bg-white rounded-xl shadow-sm p-3 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari siswa, buku, NIPD..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
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
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {activeTab === 'approval' && 'Tidak ada permintaan menunggu'}
            {activeTab === 'active' && 'Tidak ada peminjaman aktif'}
            {activeTab === 'late' && 'Tidak ada peminjaman terlambat'}
            {activeTab === 'history' && 'Tidak ada riwayat'}
          </h3>
          <p className="text-sm text-gray-500">
            {activeTab === 'approval' && 'Semua permintaan telah diproses'}
            {activeTab === 'active' && 'Tidak ada buku yang sedang dipinjam'}
            {activeTab === 'late' && 'Tidak ada buku terlambat'}
            {activeTab === 'history' && 'Belum ada riwayat'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBorrows.map((borrow) => (
            <div
              key={borrow.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-4"
            >
              <div className="flex gap-4">
                {/* Left: Book Cover */}
                <div className="flex-shrink-0">
                  <img
                    src={borrow.book.cover_image || 'https://via.placeholder.com/80x110/3B82F6/FFFFFF?text=No+Cover'}
                    alt={borrow.book.judul}
                    className="w-20 h-28 object-cover rounded-lg shadow-sm"
                  />
                </div>

                {/* Middle: Info */}
                <div className="flex-1 min-w-0 space-y-3">
                  {/* Book Title & Author */}
                  <div>
                    <h3 className="font-bold text-gray-900 text-base mb-0.5 line-clamp-1">{borrow.book.judul}</h3>
                    <p className="text-sm text-gray-600 mb-2">{borrow.book.pengarang}</p>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                        {borrow.book.kode_buku}
                      </span>
                      {borrow.book.kategori && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded font-medium">
                          {borrow.book.kategori}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        borrow.status === 'menunggu' ? 'bg-amber-100 text-amber-700' :
                        borrow.status === 'terlambat' ? 'bg-red-100 text-red-700' :
                        borrow.status === 'dipinjam' ? 'bg-blue-100 text-blue-700' :
                        borrow.status === 'dikembalikan' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {borrow.status === 'menunggu' && 'Menunggu'}
                        {borrow.status === 'dipinjam' && 'Dipinjam'}
                        {borrow.status === 'terlambat' && 'Terlambat'}
                        {borrow.status === 'dikembalikan' && 'Dikembalikan'}
                        {borrow.status === 'ditolak' && 'Ditolak'}
                      </span>
                    </div>
                  </div>

                  {/* User Info with Profile Picture */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    {borrow.user.profile_picture ? (
                      <img
                        src={borrow.user.profile_picture}
                        alt={borrow.user.nama}
                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {borrow.user.nama.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{borrow.user.nama}</p>
                      <p className="text-xs text-gray-600">NIPD: {borrow.user.nipd}</p>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      <span className="font-semibold">Kode:</span> {borrow.kode_peminjaman || '-'}
                    </div>
                  </div>

                  {/* Date Info Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    {activeTab === 'approval' && (
                      <>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 mb-0.5">Diajukan</p>
                          <p className="text-xs font-semibold text-gray-800">{formatDate(borrow.created_at)}</p>
                          <p className="text-xs text-gray-500">{timeAgo(borrow.created_at)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 mb-0.5">Target Kembali</p>
                          <p className="text-xs font-semibold text-gray-800">
                            {formatDate(borrow.tanggal_pengembalian_diinginkan)}
                          </p>
                        </div>
                      </>
                    )}

                    {(activeTab === 'active' || activeTab === 'late') && (
                      <>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 mb-0.5">Dipinjam</p>
                          <p className="text-xs font-semibold text-gray-800">{formatDate(borrow.tanggal_pinjam)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 mb-0.5">Batas Kembali</p>
                          <p className="text-xs font-semibold text-gray-800">{formatDate(borrow.tanggal_harus_kembali)}</p>
                        </div>
                        {activeTab === 'late' && (
                          <>
                            <div className="bg-red-50 rounded-lg p-2">
                              <p className="text-xs text-red-600 mb-0.5">Terlambat</p>
                              <p className="text-xs font-semibold text-red-700">{borrow.hari_terlambat || 0} hari</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-2">
                              <p className="text-xs text-red-600 mb-0.5">Denda</p>
                              <p className="text-xs font-semibold text-red-700">Rp {borrow.denda?.toLocaleString('id-ID') || '0'}</p>
                            </div>
                          </>
                        )}
                      </>
                    )}

                    {activeTab === 'history' && (
                      <>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 mb-0.5">Dipinjam</p>
                          <p className="text-xs font-semibold text-gray-800">{formatDate(borrow.tanggal_pinjam)}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500 mb-0.5">
                            {borrow.status === 'dikembalikan' ? 'Dikembalikan' : 'Ditolak'}
                          </p>
                          <p className="text-xs font-semibold text-gray-800">
                            {formatDate(borrow.status === 'dikembalikan' ? borrow.tanggal_dikembalikan : borrow.updated_at)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Notes */}
                  {borrow.catatan && activeTab === 'approval' && (
                    <div className="bg-blue-50 border-l-2 border-blue-500 rounded p-2">
                      <p className="text-xs text-blue-800"><span className="font-semibold">Catatan:</span> {borrow.catatan}</p>
                    </div>
                  )}

                  {borrow.alasan_tolak && activeTab === 'history' && borrow.status === 'ditolak' && (
                    <div className="bg-red-50 border-l-2 border-red-500 rounded p-2">
                      <p className="text-xs text-red-800"><span className="font-semibold">Alasan:</span> {borrow.alasan_tolak}</p>
                    </div>
                  )}

                  {activeTab === 'late' && (
                    <div className="bg-red-50 border-l-2 border-red-500 rounded p-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        <p className="text-xs text-red-800">Denda berjalan Rp 1.000/hari</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Actions */}
                {activeTab === 'approval' && (
                  <div className="flex-shrink-0 flex flex-col gap-2 w-24">
                    <button
                      onClick={() => handleApprove(borrow.id)}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Setujui
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBorrow(borrow);
                        setShowRejectModal(true);
                      }}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Tolak
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedBorrow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Tolak Peminjaman</h3>
                <p className="text-sm text-gray-500">{selectedBorrow.user.nama}</p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Buku:</span> {selectedBorrow.book.judul}
              </p>
            </div>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Masukkan alasan penolakan..."
              className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-700 min-h-[80px]"
              rows={3}
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedBorrow(null);
                  setRejectReason('');
                }}
                className="flex-1 py-2 rounded-lg border border-gray-300 font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim()}
                className={`flex-1 py-2 rounded-lg font-semibold text-sm text-white transition-colors ${
                  rejectReason.trim()
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoansPage;