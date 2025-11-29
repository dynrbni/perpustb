'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Book, Calendar, Search, Filter, AlertTriangle, CalendarDays, User2 } from 'lucide-react';

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
        day: '2-digit',
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
      <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Book className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Peminjaman</h2>
            <p className="text-sm text-gray-600">Kelola persetujuan, peminjaman aktif, dan riwayat peminjaman buku</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-1 border border-gray-100">
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => setActiveTab('approval')}
            className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'approval'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Approval</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'approval' ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-700'
              }`}>
                {pendingCount}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'active'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Book className="w-4 h-4" />
              <span>Aktif</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'active' ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-700'
              }`}>
                {activeCount}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('late')}
            className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'late'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Terlambat</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'late' ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-700'
              }`}>
                {lateCount}
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'history'
                ? 'bg-gray-700 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Riwayat</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'history' ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-700'
              }`}>
                {historyCount}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      {(activeTab === 'approval' || activeTab === 'active' || activeTab === 'late') && (
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari siswa, buku, NIPD..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none cursor-pointer"
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
        <div className="bg-white rounded-2xl shadow-sm p-12 border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {activeTab === 'approval' && 'Tidak ada permintaan menunggu'}
            {activeTab === 'active' && 'Tidak ada peminjaman aktif'}
            {activeTab === 'late' && 'Tidak ada peminjaman terlambat'}
            {activeTab === 'history' && 'Tidak ada riwayat'}
          </h3>
          <p className="text-sm text-gray-500">
            {activeTab === 'approval' && 'Semua permintaan telah diproses'}
            {activeTab === 'active' && 'Tidak ada buku yang sedang dipinjam'}
            {activeTab === 'late' && 'Semua buku dikembalikan tepat waktu'}
            {activeTab === 'history' && 'Belum ada riwayat peminjaman'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBorrows.map((borrow) => (
            <div
              key={borrow.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="p-5 flex gap-5">
                {/* Book Cover */}
                <img
                  src={borrow.book.cover_image || 'https://via.placeholder.com/100x140/3B82F6/FFFFFF?text=No+Cover'}
                  alt={borrow.book.judul}
                  className="w-24 h-32 object-cover rounded-xl shadow-md flex-shrink-0"
                />

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Title & Author */}
                  <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">
                    {borrow.book.judul}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{borrow.book.pengarang}</p>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${
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

                  {/* User Info */}
                  <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
                    {borrow.user.profile_picture ? (
                      <img
                        src={borrow.user.profile_picture}
                        alt={borrow.user.nama}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {borrow.user.nama.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">{borrow.user.nama}</p>
                      <p className="text-xs text-gray-500">NIPD: {borrow.user.nipd}</p>
                    </div>
                  </div>

                  {/* Code Badge */}
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1.5 bg-purple-50 text-purple-700 text-xs rounded-lg font-semibold border border-purple-100">
                      {borrow.kode_peminjaman || 'No Code'}
                    </span>
                  </div>

                  {/* Notes/Reason */}
                  {borrow.catatan && activeTab === 'approval' && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-blue-900 mb-0.5">Permintaan Ditolak</p>
                          <p className="text-xs text-blue-800">
                            <span className="font-semibold">Alasan:</span> {borrow.catatan}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {borrow.alasan_tolak && activeTab === 'history' && borrow.status === 'ditolak' && (
                    <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-red-900 mb-0.5">Permintaan Ditolak</p>
                          <p className="text-xs text-red-800">
                            <span className="font-semibold">Alasan:</span> {borrow.alasan_tolak}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Late Warning */}
                  {activeTab === 'late' && (
                    <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="text-xs text-red-700 font-semibold">
                          Terlambat {borrow.hari_terlambat || 0} hari • Denda: Rp {borrow.denda?.toLocaleString('id-ID') || '0'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Date Info Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {activeTab === 'approval' && (
                      <>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Diajukan</p>
                          <p className="font-bold text-gray-900 text-sm">{formatDate(borrow.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Dikembalikan</p>
                          <p className="font-bold text-gray-900 text-sm">{formatDate(borrow.tanggal_pengembalian_diinginkan)}</p>
                        </div>
                      </>
                    )}

                    {(activeTab === 'active' || activeTab === 'late') && (
                      <>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Diajukan</p>
                          <p className="font-bold text-gray-900 text-sm">{formatDate(borrow.tanggal_pinjam)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Ditolak</p>
                          <p className="font-bold text-gray-900 text-sm">{formatDate(borrow.tanggal_harus_kembali)}</p>
                        </div>
                      </>
                    )}

                    {activeTab === 'history' && (
                      <>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Diajukan</p>
                          <p className="font-bold text-gray-900 text-sm">{formatDate(borrow.tanggal_pinjam)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            {borrow.status === 'dikembalikan' ? 'Ditolak' : 'Ditolak'}
                          </p>
                          <p className="font-bold text-gray-900 text-sm">
                            {formatDate(borrow.status === 'dikembalikan' ? borrow.tanggal_dikembalikan : borrow.updated_at)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions - Bottom */}
              {activeTab === 'approval' && (
                <div className="px-5 pb-5 flex gap-2">
                  <button
                    onClick={() => handleApprove(borrow.id)}
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Setujui
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBorrow(borrow);
                      setShowRejectModal(true);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm hover:shadow flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Tolak
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedBorrow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Tolak Peminjaman</h3>
                <p className="text-sm text-gray-500">{selectedBorrow.user.nama}</p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Buku:</span> {selectedBorrow.book.judul}
              </p>
            </div>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Masukkan alasan penolakan..."
              className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm min-h-[100px] resize-none"
              rows={4}
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedBorrow(null);
                  setRejectReason('');
                }}
                className="flex-1 py-3 rounded-xl border-2 border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim()}
                className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition-colors ${
                  rejectReason.trim()
                    ? 'bg-red-500 hover:bg-red-600 shadow-sm hover:shadow'
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