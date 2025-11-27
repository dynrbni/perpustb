import React, { useEffect, useState } from 'react';
import { Heart, BookOpen, Trash2 } from 'lucide-react';
import { BookType } from '@/types';

interface WishlistPageProps {
  onSelectBook: (book: BookType) => void;
  setCurrentPage: (page: string) => void;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ onSelectBook, setCurrentPage }) => {
  const [wishlistBooks, setWishlistBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wishlist', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      
      if (data.success) {
        setWishlistBooks(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (bookId: number) => {
    try {
      const response = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buku_id: bookId }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success) {
        fetchWishlist();
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleClearAll = async () => {
    if (!confirm(`Hapus semua ${wishlistBooks.length} buku dari wishlist?`)) return;

    try {
      const response = await fetch('/api/wishlist/clear', {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success) {
        setWishlistBooks([]);
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Wishlist Buku</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {wishlistBooks.length === 0 ? 'Belum ada buku favorit' : `${wishlistBooks.length} buku dalam wishlist Anda`}
          </p>
        </div>
        {wishlistBooks.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Hapus Semua</span>
          </button>
        )}
      </div>

      {wishlistBooks.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Wishlist Anda masih kosong</h3>
          <p className="text-xs text-gray-400 mb-6">Tambahkan buku favorit dari katalog untuk dibaca nanti</p>
          <button
            onClick={() => setCurrentPage('katalog')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
          >
            <BookOpen className="w-4 h-4" />
            <span>Jelajahi Katalog</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {wishlistBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
            >
              <div className="relative aspect-[2/3] overflow-hidden bg-gray-50">
                <img
                  src={book.cover_image || 'https://via.placeholder.com/300x450/3B82F6/FFFFFF?text=No+Cover'}
                  alt={book.judul}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromWishlist(book.id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 z-10"
                >
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" strokeWidth={2} />
                </button>

                <div className="absolute bottom-2 left-2 right-2">
                  <div className={`px-2.5 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm shadow-lg text-center ${
                    book.jumlah_tersedia > 0
                      ? 'bg-green-500/90 text-white'
                      : 'bg-red-500/90 text-white'
                  }`}>
                    {book.jumlah_tersedia > 0 ? `${book.jumlah_tersedia} Tersedia` : 'Habis'}
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-3 flex flex-col flex-1">
                <h3 className="font-bold text-sm text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1 leading-snug">{book.judul}</h3>
                <p className="text-xs text-gray-400 line-clamp-1 font-medium">{book.pengarang}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;