'use client';

import React from 'react';
import { ArrowLeft, Heart, BookOpen, MapPin, Hash, Calendar, Building2 } from 'lucide-react';

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
  created_at?: string;
  updated_at?: string;
}

interface BookDetailPageProps {
  book: BookType;
  onBack: () => void;
  wishlist: number[];
  toggleWishlist: (id: number) => Promise<{ success: boolean; action?: string; message?: string }>;
  onBorrow: (book: BookType) => void;
  allBooks?: BookType[];
  onBookClick?: (book: BookType) => void;
}

const BookDetailPage: React.FC<BookDetailPageProps> = ({ 
  book, 
  onBack, 
  wishlist, 
  toggleWishlist,
  onBorrow,
  allBooks = [],
  onBookClick
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = React.useState(false);

  // Auto scroll to top when book changes
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [book.id]);

  // Get random books excluding current book - NO CATEGORY FILTER
  const displayBooks = React.useMemo(() => {
    if (!allBooks || allBooks.length === 0) return [];
    
    // Exclude current book and shuffle
    const otherBooks = allBooks.filter(b => b.id !== book.id);
    
    // Shuffle and take first 10 books
    const shuffled = [...otherBooks].sort(() => Math.random() - 0.5);
    
    return shuffled.slice(0, 10);
  }, [allBooks, book.id]);

  const handleBorrow = () => {
    if (book.jumlah_tersedia === 0) {
      alert('Buku tidak tersedia');
      return;
    }
    onBorrow(book);
  };

  const handleToggleWishlist = async () => {
    setIsWishlistLoading(true);
    try {
      const result = await toggleWishlist(book.id);
      
      if (!result.success) {
        alert(result.message || 'Gagal mengupdate wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Gagal mengupdate wishlist');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Back Button - Compact */}
      <button 
        onClick={onBack} 
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2} />
        Kembali
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Book Cover - Compact */}
        <div className="lg:col-span-1">
          <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border-2 border-gray-100 bg-gray-50 sticky top-20 shadow-lg">
            <img
              src={book.cover_image || 'https://via.placeholder.com/300x450/3B82F6/FFFFFF?text=No+Cover'}
              alt={book.judul}
              className="w-full h-full object-cover"
            />
            {/* Wishlist Button on Cover */}
            <button
              onClick={handleToggleWishlist}
              disabled={isWishlistLoading}
              className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all backdrop-blur-sm ${
                isWishlistLoading 
                  ? 'bg-gray-300 cursor-wait'
                  : wishlist.includes(book.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart
                className={`w-5 h-5 ${wishlist.includes(book.id) ? 'fill-current' : ''}`}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>

        {/* Book Info - Compact */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title & Author */}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-2">
              {book.judul}
            </h1>
            <p className="text-base text-gray-500 font-medium">{book.pengarang}</p>
          </div>

          {/* Category & Year - Compact Badges */}
          <div className="flex flex-wrap gap-2">
            {book.kategori && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg font-semibold border border-blue-200">
                <BookOpen className="w-3.5 h-3.5" strokeWidth={2} />
                {book.kategori}
              </span>
            )}
            {book.tahun_terbit && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 text-xs rounded-lg font-semibold border border-gray-200">
                <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                {book.tahun_terbit}
              </span>
            )}
          </div>

          {/* Availability Card - Compact */}
          <div
            className={`p-4 rounded-xl text-center font-bold text-sm border-2 ${
              book.jumlah_tersedia > 0
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {book.jumlah_tersedia > 0
              ? `${book.jumlah_tersedia} dari ${book.jumlah_total} Tersedia`
              : 'Tidak Tersedia'}
          </div>

          {/* Action Buttons - Compact */}
          <div className="flex gap-3">
            <button
              onClick={handleBorrow}
              disabled={book.jumlah_tersedia === 0 || isLoading}
              className={`flex-1 py-3 px-5 rounded-xl font-bold transition-all duration-200 text-sm ${
                book.jumlah_tersedia > 0 && !isLoading
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              }`}
            >
              {isLoading
                ? 'Memproses...'
                : book.jumlah_tersedia > 0
                ? 'Pinjam Sekarang'
                : 'Tidak Tersedia'}
            </button>
          </div>

          {/* Book Details Grid - Compact & Modern */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Detail Buku</h3>
            <div className="grid grid-cols-2 gap-4">
              {book.kode_buku && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <Hash className="w-4 h-4 text-gray-400" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-semibold mb-0.5">Kode Buku</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{book.kode_buku}</p>
                  </div>
                </div>
              )}
              {book.penerbit && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-gray-400" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-semibold mb-0.5">Penerbit</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{book.penerbit}</p>
                  </div>
                </div>
              )}
              {book.isbn && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-gray-400" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-semibold mb-0.5">ISBN</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{book.isbn}</p>
                  </div>
                </div>
              )}
              {book.lokasi_rak && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-gray-400" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-semibold mb-0.5">Lokasi Rak</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{book.lokasi_rak}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis - Compact */}
      {book.deskripsi && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" strokeWidth={2} />
            </div>
            Sinopsis
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {book.deskripsi}
          </p>
        </div>
      )}

      {/* Books Catalog Section - Random Books */}
      {displayBooks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-50 rounded-lg flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-purple-600" strokeWidth={2} />
            </div>
            Buku Lainnya
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayBooks.map((otherBook) => (
              <div
                key={otherBook.id}
                onClick={() => onBookClick?.(otherBook)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl border-2 border-gray-100 bg-gray-50 mb-2 group-hover:border-blue-300 group-hover:shadow-lg transition-all">
                  <img
                    src={otherBook.cover_image || 'https://via.placeholder.com/200x300/3B82F6/FFFFFF?text=No+Cover'}
                    alt={otherBook.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Wishlist Heart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(otherBook.id);
                    }}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all backdrop-blur-sm ${
                      wishlist.includes(otherBook.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${wishlist.includes(otherBook.id) ? 'fill-current' : ''}`}
                      strokeWidth={2}
                    />
                  </button>
                  
                  {otherBook.jumlah_tersedia === 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-xs font-bold px-2 py-1 bg-red-500 rounded-lg">
                        Tidak Tersedia
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
                  {otherBook.judul}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">{otherBook.pengarang}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailPage;