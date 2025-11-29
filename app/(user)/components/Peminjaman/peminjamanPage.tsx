'use client';

import React, { useEffect, useState } from 'react';
import { Clock, Book, AlertTriangle, Hourglass, CheckCircle, XCircle, RefreshCw, Package } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast, Toaster } from 'sonner';

interface BookType {
  id: number;
  kode_buku: string;
  judul: string;
  pengarang: string;
  penerbit?: string;
  tahun_terbit?: number;
  isbn?: string;
  kategori?: string;
  jumlah_total: number;
  jumlah_tersedia: number;
  lokasi_rak?: string;
  deskripsi?: string;
  cover_image?: string;
}

interface BorrowHistory {
  id: number;
  kode_peminjaman?: string;
  book: BookType;
  tanggal_pinjam?: string | null;
  tanggal_kembali?: string | null;
  tanggal_harus_kembali?: string | null;
  tanggal_dikembalikan?: string | null;
  status: 'menunggu' | 'dipinjam' | 'dikembalikan' | 'terlambat' | 'ditolak';
  denda?: number | null;
  catatan?: string;
  alasan_tolak?: string | null;
  disetujui_oleh?: number | null;
  tanggal_persetujuan?: string | null;
  created_at?: string;
  updated_at?: string;
  hari_terlambat?: number;
}

interface PeminjamanPageProps {
  isAdmin?: boolean;
}

const PeminjamanPage: React.FC<PeminjamanPageProps> = ({ isAdmin = false }) => {
  const [history, setHistory] = useState<BorrowHistory[]>([]);
  const [tab, setTab] = useState<'menunggu' | 'aktif' | 'selesai' | 'terlambat' | 'ditolak'>('menunggu');
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState<{ [key: number]: string }>({});
  const [showRejectModal, setShowRejectModal] = useState<number | null>(null);

  const fetchPeminjaman = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? '/api/admin/borrow' : '/api/borrow';
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setHistory(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching peminjaman:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeminjaman();
  }, [isAdmin]);

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

  // ✅ CALCULATE DENDA REAL-TIME
  const calculateDenda = (borrow: BorrowHistory) => {
    const hariTerlambat = borrow.hari_terlambat || 0;
    const dendaDB = borrow.denda || 0;
    const dendaCalculated = hariTerlambat * 1000;
    return dendaDB > 0 ? dendaDB : dendaCalculated;
  };

  const pendingBorrows = history.filter((h) => h.status === 'menunggu');
  const activeBorrows = history.filter((h) => h.status === 'dipinjam');
  const completedBorrows = history.filter((h) => h.status === 'dikembalikan');
  const lateBorrows = history.filter((h) => h.status === 'terlambat');
  const rejectedBorrows = history.filter((h) => h.status === 'ditolak');
  
  const displayHistory = 
    tab === 'menunggu' ? pendingBorrows :
    tab === 'aktif' ? activeBorrows :
    tab === 'selesai' ? completedBorrows :
    tab === 'terlambat' ? lateBorrows :
    rejectedBorrows;

  const tabConfig = {
    menunggu: { icon: Hourglass, color: 'yellow', label: 'Menunggu' },
    aktif: { icon: Clock, color: 'blue', label: 'Aktif' },
    selesai: { icon: CheckCircle, color: 'green', label: 'Selesai' },
    terlambat: { icon: AlertTriangle, color: 'red', label: 'Terlambat' },
    ditolak: { icon: XCircle, color: 'gray', label: 'Ditolak' }
  };

  const getTabStyles = (tabName: typeof tab) => { 
    const isActive = tab === tabName;
    const config = tabConfig[tabName];
    const colorMap: any = {
      yellow: isActive 
        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md border-yellow-400' 
        : 'bg-white text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 border-gray-200',
      blue: isActive 
        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md border-blue-400' 
        : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-700 border-gray-200',
      green: isActive 
        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md border-green-400' 
        : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-700 border-gray-200',
      red: isActive 
        ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md border-red-400' 
        : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-700 border-gray-200',
      gray: isActive 
        ? 'bg-gradient-to-r from-gray-600 to-slate-700 text-white shadow-md border-gray-500' 
        : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-gray-200'
    };
    return colorMap[config.color];
  };

  const emptyMessages = {
    menunggu: { title: 'Tidak ada permintaan', desc: 'Semua permintaan telah diproses' },
    aktif: { title: 'Tidak ada peminjaman aktif', desc: 'Belum ada buku yang dipinjam' },
    selesai: { title: 'Belum ada riwayat', desc: 'Belum ada buku yang dikembalikan' },
    terlambat: { title: 'Tidak ada keterlambatan', desc: 'Semua buku dikembalikan tepat waktu' },
    ditolak: { title: 'Tidak ada penolakan', desc: 'Semua permintaan disetujui' }
  };

  const handleApprove = async (borrowId: number) => {
    const result = await Swal.fire({
      title: 'Setujui Peminjaman?',
      text: 'Buku akan disetujui untuk dipinjam',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Setujui!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/admin/borrow/${borrowId}/approve`, {
        method: 'PUT',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Peminjaman Disetujui!', {
          description: 'Buku berhasil disetujui untuk dipinjam'
        });
        fetchPeminjaman();
      } else {
        toast.error('Gagal Menyetujui', {
          description: data.message
        });
      }
    } catch (error) {
      toast.error('Terjadi Kesalahan', {
        description: 'Tidak dapat terhubung ke server'
      });
    }
  };

  const handleRejectSubmit = async (borrowId: number) => {
    const reason = rejectReason[borrowId];
    if (!reason?.trim()) {
      toast.error('Alasan Wajib Diisi', {
        description: 'Harap masukkan alasan penolakan'
      });
      return;
    }
    try {
      const response = await fetch(`/api/admin/borrow/${borrowId}/reject`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alasan_tolak: reason }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Peminjaman Ditolak', {
          description: 'Peminjaman berhasil ditolak'
        });
        setShowRejectModal(null);
        setRejectReason({ ...rejectReason, [borrowId]: '' });
        fetchPeminjaman();
      } else {
        toast.error('Gagal Menolak', {
          description: data.message
        });
      }
    } catch (error) {
      toast.error('Terjadi Kesalahan', {
        description: 'Tidak dapat terhubung ke server'
      });
    }
  };

  const handleExtend = async (borrowId: number) => {
    const result = await Swal.fire({
      title: 'Perpanjang Peminjaman?',
      text: 'Waktu peminjaman akan diperpanjang 7 hari',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Perpanjang!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/borrow/${borrowId}/extend`, {
        method: 'PUT',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Peminjaman Diperpanjang!', {
          description: 'Buku berhasil diperpanjang 7 hari'
        });
        fetchPeminjaman();
      } else {
        toast.error('Gagal Memperpanjang', {
          description: data.message
        });
      }
    } catch (error) {
      toast.error('Terjadi Kesalahan', {
        description: 'Tidak dapat terhubung ke server'
      });
    }
  };

  const handleReturn = async (borrowId: number) => {
    const borrow = history.find(b => b.id === borrowId);
    const dendaFinal = borrow ? calculateDenda(borrow) : 0;

    const result = await Swal.fire({
      title: 'Kembalikan Buku?',
      html: dendaFinal > 0 
        ? `Buku akan dicatat sebagai sudah dikembalikan<br><br><strong class="text-red-600">Denda: Rp ${dendaFinal.toLocaleString('id-ID')}</strong>`
        : 'Buku akan dicatat sebagai sudah dikembalikan',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: dendaFinal > 0 ? 'Ya, Kembalikan & Bayar Denda!' : 'Ya, Kembalikan!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    const returnPromise = fetch(`/api/borrow/${borrowId}/return`, {
      method: 'PUT',
      credentials: 'include',
    }).then(async (response) => {
      const data = await response.json();
      if (data.success) {
        fetchPeminjaman();
        return data;
      } else {
        throw new Error(data.message || 'Gagal mengembalikan buku');
      }
    });

    toast.promise(returnPromise, {
      loading: 'Memproses pengembalian...',
      success: (data) => dendaFinal > 0 
        ? `Buku dikembalikan! Denda Rp ${dendaFinal.toLocaleString('id-ID')} telah dicatat`
        : 'Buku berhasil dikembalikan!',
      error: (err) => err.message || 'Gagal mengembalikan buku'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-100"></div>
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Peminjaman Buku</h1>
        <p className="text-xs text-gray-400 mt-0.5">Kelola aktivitas peminjaman Anda</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
        {(['menunggu', 'aktif', 'terlambat', 'selesai', 'ditolak'] as const).map((tabName) => {
          const config = tabConfig[tabName];
          const Icon = config.icon;
          const count = 
            tabName === 'menunggu' ? pendingBorrows.length :
            tabName === 'aktif' ? activeBorrows.length :
            tabName === 'selesai' ? completedBorrows.length :
            tabName === 'terlambat' ? lateBorrows.length :
            rejectedBorrows.length;
          
          const isActive = tab === tabName;
          
          return (
            <button
              key={tabName}
              onClick={() => setTab(tabName)}
              className={`group relative flex-shrink-0 py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 text-sm border ${getTabStyles(tabName)}`}
            >
              <Icon className="w-4 h-4" strokeWidth={2.5} />
              <span className="tracking-tight">{config.label}</span>
              <span className={`min-w-[24px] h-6 flex items-center justify-center px-2 rounded-lg text-xs font-bold transition-all duration-200 ${
                isActive 
                  ? 'bg-white/30 backdrop-blur-sm text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {displayHistory.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Book className="w-7 h-7 text-gray-300" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">{emptyMessages[tab].title}</h3>
          <p className="text-xs text-gray-400">{emptyMessages[tab].desc}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {displayHistory.map((borrow) => {
            const dendaFinal = calculateDenda(borrow); // ✅ CALCULATE DENDA
            const hariTerlambat = borrow.hari_terlambat || 0;

            return (
              <div key={borrow.id} className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all">
                <div className="flex gap-5">
                  {/* Book Cover */}
                  <div className="w-35 shrink-0">
                    <div className="aspect-[2/3] overflow-hidden rounded-xl border-2 border-gray-100 bg-gray-50 shadow-md">
                      <img
                        src={borrow.book.cover_image || 'https://via.placeholder.com/200x300/3B82F6/FFFFFF?text=No+Cover'}
                        alt={borrow.book.judul}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="flex-1 min-w-0 space-y-4">
                    {/* Header */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{borrow.book.judul}</h3>
                      <p className="text-sm text-gray-500 mb-2">{borrow.book.pengarang}</p>
                      {borrow.kode_peminjaman && (
                        <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-lg font-semibold border border-purple-200">
                          {borrow.kode_peminjaman}
                        </span>
                      )}
                    </div>

                    {/* Status Menunggu */}
                    {tab === 'menunggu' && (
                      <div className="space-y-3">
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl flex items-start gap-3">
                          <Hourglass className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" strokeWidth={2} />
                          <div>
                            <p className="font-bold text-yellow-800 text-sm">Menunggu Persetujuan</p>
                            <p className="text-xs text-yellow-700 mt-0.5">Akan diproses dalam 1x24 jam</p>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-2 text-xs text-gray-500">
                          <span className="font-semibold">Diajukan:</span>
                          <span>{formatDate(borrow.created_at)}</span>
                        </div>

                        {isAdmin && (
                          <div className="flex gap-2 pt-1">
                            <button 
                              onClick={() => handleApprove(borrow.id)}
                              className="flex-1 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" strokeWidth={2} />
                              Setujui
                            </button>
                            <button 
                              onClick={() => setShowRejectModal(borrow.id)}
                              className="flex-1 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center justify-center gap-2"
                            >
                              <XCircle className="w-4 h-4" strokeWidth={2} />
                              Tolak
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Status Aktif */}
                    {tab === 'aktif' && (
                      <div className="space-y-2.5">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-600" strokeWidth={2} />
                            <span className="text-xs font-bold text-blue-800">Sedang Dipinjam</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <div>
                              <span className="text-gray-500 font-medium">Deadline: </span>
                              <span className="font-bold text-gray-900">{formatDate(borrow.tanggal_harus_kembali)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {!isAdmin && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleExtend(borrow.id)}
                              className="flex-1 py-2 rounded-lg font-semibold text-xs hover:shadow-md transition-all bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center gap-1.5"
                            >
                              <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />
                              Perpanjang
                            </button>
                            <button 
                              onClick={() => handleReturn(borrow.id)}
                              className="flex-1 py-2 rounded-lg font-semibold text-xs hover:shadow-md transition-all bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center gap-1.5"
                            >
                              <Package className="w-3.5 h-3.5" strokeWidth={2} />
                              Kembalikan
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ✅ FIXED: Status Terlambat */}
                    {tab === 'terlambat' && (
                      <div className="space-y-2.5">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-2.5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-600" strokeWidth={2} />
                              <span className="text-xs font-bold text-red-800">Terlambat!</span>
                            </div>
                            <span className="text-xs text-red-700">Segera kembalikan</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <span className="text-red-600 font-medium">Keterlambatan:</span>
                              <span className="font-bold text-red-700">{hariTerlambat} hari</span>
                            </div>
                            <div className="w-px h-3 bg-red-300"></div>
                            <div className="flex items-center gap-1">
                              <span className="text-red-600 font-medium">Denda:</span>
                              <span className="font-bold text-red-700">
                                Rp {dendaFinal.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {!isAdmin && (
                          <button 
                            onClick={() => handleReturn(borrow.id)}
                            className="w-full py-2 rounded-lg font-semibold text-xs hover:shadow-md transition-all bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center justify-center gap-1.5"
                          >
                            <Package className="w-3.5 h-3.5" strokeWidth={2} />
                            Kembalikan & Bayar Denda (Rp {dendaFinal.toLocaleString('id-ID')})
                          </button>
                        )}
                      </div>
                    )}

                    {/* ✅ FIXED: Status Selesai */}
                    {tab === 'selesai' && (
                      <div className="space-y-3">
                        <div className="bg-green-50 border border-green-200 p-3 rounded-xl flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" strokeWidth={2} />
                          <div>
                            <p className="font-bold text-green-800 text-sm">Telah Dikembalikan</p>
                            <p className="text-xs text-green-700 mt-0.5">
                              {dendaFinal > 0 
                                ? `Denda sebesar Rp ${dendaFinal.toLocaleString('id-ID')} telah dibayar`
                                : 'Terima kasih telah mengembalikan tepat waktu'
                              }
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-xs text-gray-400 font-semibold mb-1">Dipinjam</p>
                            <p className="font-bold text-gray-900 text-sm">{formatDate(borrow.tanggal_pinjam)}</p>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-xs text-gray-400 font-semibold mb-1">Dikembalikan</p>
                            <p className="font-bold text-gray-900 text-sm">{formatDate(borrow.tanggal_dikembalikan)}</p>
                          </div>
                          <div className={`rounded-xl p-3 border ${
                            dendaFinal > 0 
                              ? 'bg-orange-50 border-orange-200' 
                              : 'bg-green-50 border-green-200'
                          }`}>
                            <p className={`text-xs font-semibold mb-1 ${
                              dendaFinal > 0 ? 'text-orange-600' : 'text-green-600'
                            }`}>
                              {dendaFinal > 0 ? 'Denda' : 'Status'}
                            </p>
                            <p className={`font-bold text-sm ${
                              dendaFinal > 0 ? 'text-orange-700' : 'text-green-700'
                            }`}>
                              {dendaFinal > 0 
                                ? `Rp ${dendaFinal.toLocaleString('id-ID')}`
                                : 'Selesai'
                              }
                            </p>
                          </div>
                        </div>

                        {dendaFinal > 0 && (
                          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                            <p className="text-xs text-orange-800">
                              <span className="font-semibold">Terlambat {hariTerlambat} hari</span> × Rp 1.000 = Rp {dendaFinal.toLocaleString('id-ID')}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Status Ditolak */}
                    {tab === 'ditolak' && (
                      <div className="space-y-3">
                        <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" strokeWidth={2} />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 text-sm mb-1">Permintaan Ditolak</p>
                            <p className="text-xs text-gray-600">
                              <span className="font-semibold">Alasan:</span> {borrow.alasan_tolak || 'Tidak ada alasan'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-xs text-gray-400 font-semibold mb-1">Diajukan</p>
                            <p className="font-bold text-gray-900 text-sm">{formatDate(borrow.created_at)}</p>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-xs text-gray-400 font-semibold mb-1">Ditolak</p>
                            <p className="font-bold text-gray-900 text-sm">{formatDate(borrow.tanggal_persetujuan)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Reject */}
      {showRejectModal !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Tolak Peminjaman</h3>
                <p className="text-xs text-gray-400">Berikan alasan penolakan</p>
              </div>
            </div>

            <textarea
              value={rejectReason[showRejectModal] || ''}
              onChange={(e) => setRejectReason({ ...rejectReason, [showRejectModal]: e.target.value })}
              placeholder="Masukkan alasan penolakan..."
              className="w-full p-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm min-h-[100px]"
              rows={4}
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason({ ...rejectReason, [showRejectModal]: '' });
                }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => handleRejectSubmit(showRejectModal)}
                disabled={!rejectReason[showRejectModal]?.trim()}
                className={`flex-1 py-2.5 rounded-xl font-semibold text-sm text-white transition-all ${
                  rejectReason[showRejectModal]?.trim()
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg'
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

export default PeminjamanPage;