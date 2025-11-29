import React from 'react';
import { BookOpen, Heart, Book, ChevronRight, Calendar, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { User, BookType, BorrowHistory } from '@/types';

interface BerandaPageProps {
  user: User | null;
  books: BookType[];
  borrowHistory: BorrowHistory[];
  wishlist: number[];
  setCurrentPage: (page: string) => void;
}

const BerandaPage: React.FC<BerandaPageProps> = ({ user, books, borrowHistory, wishlist, setCurrentPage }) => {
  const activeBorrows = borrowHistory.filter((h) => h.status === 'dipinjam');
  const lateBorrows = borrowHistory.filter((h) => h.status === 'terlambat');
  const recentBooks = books.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Welcome Banner - Compact */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full -mr-28 -mt-28 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full mb-3">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-white">Online</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Selamat Datang, {user?.nama}! 👋</h1>
          <p className="text-blue-100 text-sm">Jelajahi koleksi buku dan kelola peminjaman Anda dengan mudah</p>
        </div>
      </div>

      {/* Stats Cards - Compact */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="group relative bg-white rounded-2xl p-4 border border-gray-100 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-100/50 hover:-translate-y-2 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-500/20">
              <BookOpen className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">{activeBorrows.length}</p>
            <p className="text-xs text-gray-500 font-semibold mb-2">Sedang Dipinjam</p>
            <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
              <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
              <span>Aktif</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="group relative bg-white rounded-2xl p-4 border border-gray-100 hover:border-red-300 hover:shadow-2xl hover:shadow-red-100/50 hover:-translate-y-2 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-red-50/50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-red-500/20">
              <AlertCircle className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">{lateBorrows.length}</p>
            <p className="text-xs text-gray-500 font-semibold mb-2">Buku Terlambat</p>
            <div className="flex items-center gap-1 text-xs text-red-600 font-semibold">
              <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
              <span>Denda: Rp {(lateBorrows.length * 1000).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="group relative bg-white rounded-2xl p-4 border border-gray-100 hover:border-pink-300 hover:shadow-2xl hover:shadow-pink-100/50 hover:-translate-y-2 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-pink-50/50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-pink-500/20">
              <Heart className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">{wishlist.length}</p>
            <p className="text-xs text-gray-500 font-semibold mb-2">Wishlist Saya</p>
            <div className="flex items-center gap-1 text-xs text-pink-600 font-semibold">
              <Heart className="w-3 h-3 fill-current" strokeWidth={2.5} />
              <span>Favorit</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="group relative bg-white rounded-2xl p-4 border border-gray-100 hover:border-green-300 hover:shadow-2xl hover:shadow-green-100/50 hover:-translate-y-2 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-green-50/50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-green-500/20">
              <Book className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5 tracking-tight">{books.length}</p>
            <p className="text-xs text-gray-500 font-semibold mb-2">Total Koleksi</p>
            <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
              <Book className="w-3 h-3" strokeWidth={2.5} />
              <span>Tersedia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Borrows - Compact */}
      {activeBorrows.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-5 border-b border-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Buku yang Sedang Dipinjam</h2>
                <p className="text-xs text-gray-400 mt-0.5">Jangan lupa untuk mengembalikan tepat waktu</p>
              </div>
              <button 
                onClick={() => setCurrentPage('peminjaman')} 
                className="group px-4 py-2 text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-xl transition-all flex items-center gap-1.5"
              >
                Lihat Semua
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="p-5 space-y-2.5">
            {activeBorrows.slice(0, 3).map((borrow) => (
              <div key={borrow.id} className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all group cursor-pointer border border-transparent hover:border-gray-100">
                <div className="relative">
                  <img
                    src={borrow.book.cover_image || 'https://via.placeholder.com/80x120/3B82F6/FFFFFF?text=No+Cover'}
                    alt={borrow.book.judul}
                    className="w-11 h-16 object-cover rounded-lg border-2 border-gray-100 group-hover:border-blue-200 group-hover:shadow-lg transition-all"
                  />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-1 mb-0.5 group-hover:text-blue-600 transition-colors">{borrow.book.judul}</h3>
                  <p className="text-xs text-gray-500 mb-1.5 truncate">{borrow.book.pengarang}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span className="font-medium">Kembali: {new Date(borrow.tanggal_harus_kembali || '').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-blue-700">Dipinjam</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Late Borrows Alert - Compact */}
      {lateBorrows.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-2xl p-5 shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/50 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative flex items-start gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-red-500/20">
              <AlertCircle className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1 text-base tracking-tight">Perhatian!</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                Anda memiliki <span className="font-bold text-red-600 text-sm">{lateBorrows.length} buku</span> yang terlambat dikembalikan. 
                Segera kembalikan untuk menghindari denda.
              </p>
              <button 
                onClick={() => setCurrentPage('peminjaman')} 
                className="mt-3 group px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-lg shadow-red-500/30"
              >
                Lihat Detail
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Books - Compact */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Buku Terbaru</h2>
              <p className="text-xs text-gray-400 mt-0.5">Koleksi terbaru di perpustakaan</p>
            </div>
            <button 
              onClick={() => setCurrentPage('katalog')} 
              className="group px-4 py-2 text-xs font-semibold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-xl transition-all flex items-center gap-1.5"
            >
              Lihat Semua
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentBooks.map((book) => (
              <div key={book.id} className="group cursor-pointer" onClick={() => setCurrentPage('katalog')}>
                <div className="relative aspect-[2/3] mb-2.5 overflow-hidden rounded-xl border-2 border-gray-100 group-hover:border-blue-300 group-hover:shadow-2xl group-hover:shadow-blue-100/50 transition-all duration-300">
                  <img
                    src={book.cover_image || 'https://via.placeholder.com/200x300/3B82F6/FFFFFF?text=No+Cover'}
                    alt={book.judul}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-bold text-xs text-gray-900 line-clamp-2 mb-0.5 group-hover:text-blue-600 transition-colors">{book.judul}</h3>
                <p className="text-xs text-gray-400 line-clamp-1 font-medium">{book.pengarang}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BerandaPage;