'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, BookOpen, Clock, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast, Toaster } from 'sonner';

interface UserType {
  id: number;
  nipd: string;
  nama: string;
  email?: string;
  profile_picture: string;
}

interface BookType {
  id: number;
  kode_buku: string;
  isbn?: string;
  judul: string;
  pengarang: string;
  penerbit?: string;
  tahun_terbit?: number;
  kategori?: string;
  cover_image?: string;
}

interface KonfirmasiPeminjamanPageProps {
  book: BookType;
  user: UserType | null;
  onBack: () => void;
  onSuccess: () => void;
}

const KonfirmasiPeminjamanPage: React.FC<KonfirmasiPeminjamanPageProps> = ({
  book,
  user,
  onBack,
  onSuccess
}) => {
  const [tanggalPengembalian, setTanggalPengembalian] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinDate(tomorrow.toISOString().split('T')[0]);

    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    setTanggalPengembalian(defaultDate.toISOString().split('T')[0]);

    const maxDateVal = new Date();
    maxDateVal.setDate(maxDateVal.getDate() + 30);
    setMaxDate(maxDateVal.toISOString().split('T')[0]);
  }, []);

  const calculateDuration = () => {
    if (!tanggalPengembalian) return 0;
    const today = new Date();
    const returnDate = new Date(tanggalPengembalian);
    const diffTime = returnDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const isDateInRange = (date: Date) => {
    const min = new Date(minDate);
    const max = new Date(maxDate);
    return date >= min && date <= max;
  };

  const isDateSelected = (date: Date) => {
    if (!tanggalPengembalian) return false;
    const selected = new Date(tanggalPengembalian);
    return date.toDateString() === selected.toDateString();
  };

  const handleDateSelect = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isDateInRange(selected)) {
      setTanggalPengembalian(selected.toISOString().split('T')[0]);
      setShowCalendar(false);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleSubmit = async () => {
    if (!tanggalPengembalian) {
      toast.error('Harap pilih tanggal pengembalian', {
        description: 'Tanggal pengembalian wajib diisi'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          bookId: book.id,
          tanggalPengembalian: tanggalPengembalian
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Pengajuan Peminjaman Berhasil!', {
          description: 'Menunggu persetujuan admin dalam 1x24 jam'
        });
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        toast.error('Gagal Mengajukan Peminjaman', {
          description: data.message || 'Terjadi kesalahan, silakan coba lagi'
        });
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
      toast.error('Terjadi Kesalahan', {
        description: 'Tidak dapat terhubung ke server'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-5 pb-6">
      <Toaster position="top-center" richColors />
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors group mb-3"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
          Kembali
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Konfirmasi Peminjaman</h1>
        <p className="text-sm text-gray-500 mt-1">Lengkapi informasi peminjaman buku</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left - Main Content */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Borrower Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-sm font-bold text-gray-900">Data Peminjam</h2>
            </div>
            
            {user && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt={user.nama} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-white">{user.nama.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{user.nama}</p>
                  <p className="text-xs text-gray-500">{user.nipd}</p>
                </div>
              </div>
            )}
          </div>

          {/* Book Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-sm font-bold text-gray-900">Detail Buku</h2>
            </div>

            <div className="flex gap-4 bg-gray-50 rounded-xl p-3">
              <img
                src={book.cover_image || 'https://via.placeholder.com/80x110/E5E7EB/9CA3AF?text=No+Cover'}
                alt={book.judul}
                className="w-16 h-24 object-cover rounded-lg border border-gray-200"
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm mb-1">{book.judul}</h3>
                <p className="text-xs text-gray-500 mb-1">{book.pengarang}</p>
                <p className="text-xs text-gray-400">{book.kode_buku}</p>
                {book.kategori && (
                  <span className="inline-block mt-2 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-lg border border-green-200">
                    {book.kategori}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Date Picker Card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
              <h2 className="text-sm font-bold text-gray-900">Tanggal Pengembalian</h2>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 font-medium bg-gray-50 text-sm text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <span>{tanggalPengembalian ? formatDate(tanggalPengembalian) : 'Pilih tanggal'}</span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </button>

              {showCalendar && (
                <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-10 w-80">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={prevMonth}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="font-bold text-gray-900 text-xs">{monthName}</span>
                    <button
                      onClick={nextMonth}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-0.5">
                    {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                      <div key={day} className="text-center text-[10px] font-semibold text-gray-500 py-1.5">
                        {day}
                      </div>
                    ))}
                    
                    {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                      const inRange = isDateInRange(date);
                      const selected = isDateSelected(date);
                      
                      return (
                        <button
                          key={day}
                          onClick={() => handleDateSelect(day)}
                          disabled={!inRange}
                          className={`aspect-square rounded-md text-xs font-medium transition-colors ${
                            selected
                              ? 'bg-purple-500 text-white'
                              : inRange
                              ? 'hover:bg-purple-50 text-gray-900'
                              : 'text-gray-300 cursor-not-allowed'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-500">
                    Min 1 hari, max 30 hari
                  </div>
                </div>
              )}
            </div>

            {tanggalPengembalian && (
              <div className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-600 font-semibold mb-1">Durasi Peminjaman</p>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-bold text-purple-700">{calculateDuration()} hari</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600 font-semibold mb-1">Tanggal Kembali</p>
                    <p className="text-sm font-bold text-purple-700">
                      {new Date(tanggalPengembalian).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-20 space-y-4">
            <h3 className="text-base font-bold text-gray-900">Ringkasan</h3>
            
            <div className="space-y-3 text-sm">
              <div className="pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Peminjam</p>
                <p className="font-bold text-gray-900">{user?.nama || '—'}</p>
                <p className="text-xs text-gray-500 mt-0.5">{user?.nipd || '—'}</p>
              </div>
              
              <div className="pb-3 border-b border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Buku</p>
                <p className="font-bold text-gray-900 line-clamp-2">{book.judul || '—'}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Durasi</span>
                <span className="font-bold text-gray-900">{calculateDuration()} hari</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Kembali</span>
                <span className="font-bold text-gray-900 text-xs">
                  {tanggalPengembalian ? new Date(tanggalPengembalian).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '—'}
                </span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs text-amber-800">
                <span className="font-semibold">Catatan:</span> Menunggu persetujuan admin dalam 1x24 jam
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!tanggalPengembalian || isLoading}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-sm ${
                tanggalPengembalian && !isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Konfirmasi Peminjaman
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KonfirmasiPeminjamanPage;