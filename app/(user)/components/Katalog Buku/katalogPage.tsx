import React from 'react';
import { BookOpen, Heart, Filter } from 'lucide-react';
import { BookType } from '@/types';

interface KatalogPageProps {
  books: BookType[];
  loading: boolean;
  wishlist: number[];
  toggleWishlist: (id: number) => Promise<{ success: boolean; action?: string; message?: string }>;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onSelectBook: (book: BookType) => void;
}

const KatalogPage: React.FC<KatalogPageProps> = ({ 
  books, 
  loading, 
  wishlist, 
  toggleWishlist, 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  onSelectBook 
}) => {
  const [wishlistLoading, setWishlistLoading] = React.useState<number | null>(null);

  const handleToggleWishlist = async (bookId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setWishlistLoading(bookId);
    try {
      const result = await toggleWishlist(bookId);
      
      // ✅ FIX: Tambah null check dan logging
      console.log('Toggle wishlist result:', result);
      
      if (!result) {
        console.error('Result is undefined or null');
        alert('Gagal mengupdate wishlist - No response');
        return;
      }
      
      if (!result.success) {
        console.error('Toggle failed:', result.message);
        alert(result.message || 'Gagal mengupdate wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Gagal mengupdate wishlist - Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setWishlistLoading(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header - Compact */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Katalog Buku</h1>
          <p className="text-xs text-gray-400 mt-0.5">{books.length} buku tersedia untuk dipinjam</p>
        </div>
      </div>

      {/* Category Filter - Modern Minimal */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Filter className="w-4 h-4 text-blue-600" strokeWidth={2} />
          </div>
          <h3 className="font-bold text-gray-900 text-sm">Kategori</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-100 cursor-pointer'
              }`}
            >
              {cat === 'all' ? 'Semua' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 absolute top-0 left-0"></div>
          </div>
        </div>
      ) : books.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Tidak ada buku</h3>
          <p className="text-xs text-gray-400">Coba ubah filter atau kata kunci pencarian</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {books.map((book) => (
            <div
              key={book.id}
              onClick={() => onSelectBook(book)}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
            >
              {/* Book Cover */}
              <div className="relative aspect-[2/3] overflow-hidden bg-gray-50">
                <img
                  src={book.cover_image || 'https://via.placeholder.com/300x450/3B82F6/FFFFFF?text=No+Cover'}
                  alt={book.judul}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Wishlist Button */}
                <button
                  onClick={(e) => handleToggleWishlist(book.id, e)}
                  disabled={wishlistLoading === book.id}
                  className={`absolute top-2 right-2 w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-all duration-200 z-10 ${
                    wishlistLoading === book.id
                      ? 'bg-gray-300 cursor-wait'
                      : 'bg-white/90'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${wishlist.includes(book.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                    strokeWidth={2}
                  />
                </button>

                {/* Availability Badge */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className={`px-2.5 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm shadow-lg text-center ${
                    book.jumlah_tersedia > 0
                      ? 'bg-green-500/90 text-white'
                      : 'bg-red-500/90 text-white'
                  }`}>
                    {book.jumlah_tersedia > 0 ? `${book.jumlah_tersedia} Tersedia` : 'Habis'}
                  </div>
                </div>

                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Book Info */}
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

export default KatalogPage;