'use client';
import React, { useState, useEffect } from 'react';
import { Search, Home, BookOpen, Heart, User, Settings, LogOut, Menu, X, BookMarked, Clock } from 'lucide-react';

// Import Components
import BerandaPage from './Beranda/berandaPage';
import KatalogBukuPage from './Katalog Buku/katalogPage';
import BookDetailPage from './BookDetail/bookDetailPage';
import PeminjamanPage from './Peminjaman/peminjamanPage'; 
import WishlistPage from './Wishlist/wishlistPage';
import ProfilPage from './Profil/profilePage';
import PengaturanPage from './Pengaturan/pengaturanPage';
import KonfirmasiPeminjamanPage from './konfirmPeminjaman/konfirmasiPeminjamanPage';

interface User {
  id: number;
  nipd: string;
  nama: string;
  email?: string;
  role: string;
  profile_picture: string;
  created_at?: string;
}

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

const LibraryDashboard = () => {
  const [currentPage, setCurrentPage] = useState('beranda');
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<BookType[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [borrowHistory, setBorrowHistory] = useState<BorrowHistory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [bookToConfirm, setBookToConfirm] = useState<BookType | null>(null);

  // Fetch User
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  // Fetch Books
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/admin/books?limit=100');
        if (response.ok) {
          const data = await response.json();
          setBooks(Array.isArray(data) ? data : []);
          setFilteredBooks(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]);
        setFilteredBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Fetch Borrow History
  useEffect(() => {
    const fetchBorrowHistory = async () => {
      try {
        const response = await fetch('/api/borrow', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setBorrowHistory(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching borrow history:', error);
      }
    };

    if (user) {
      fetchBorrowHistory();
    }
  }, [user]);

  // Fetch Wishlist IDs
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch('/api/wishlist/ids', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setWishlist(data.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    if (user) {
      fetchWishlist();
    }
  }, [user]);

  // Search & Filter
  useEffect(() => {
    let filtered = books;

    if (searchQuery) {
      filtered = filtered.filter(book =>
        book.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.pengarang.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.kode_buku.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.kategori === selectedCategory);
    }

    setFilteredBooks(filtered);
  }, [searchQuery, books, selectedCategory]);

  const categories: string[] = ['all', ...Array.from(new Set(books.map(b => b.kategori).filter((cat): cat is string => Boolean(cat))))];

  // Toggle Wishlist with Return
  const toggleWishlist = async (bookId: number) => {
    try {
      const response = await fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buku_id: bookId }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.action === 'added') {
          setWishlist(prev => [...prev, bookId]);
        } else if (data.action === 'removed') {
          setWishlist(prev => prev.filter(id => id !== bookId));
        }
      }
      
      return data;
      
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      return { 
        success: false, 
        message: 'Gagal mengupdate wishlist - Network error' 
      };
    }
  };

  const menuItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'katalog', label: 'Katalog Buku', icon: BookOpen },
    { id: 'peminjaman', label: 'Peminjaman', icon: Clock },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profil', label: 'Profil', icon: User },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const renderPage = () => {
    if (bookToConfirm) {
      return (
        <KonfirmasiPeminjamanPage 
          book={bookToConfirm} 
          user={user}
          onBack={() => setBookToConfirm(null)} 
          onSuccess={() => {
            setBookToConfirm(null);
            setCurrentPage('peminjaman');
          }} 
        />
      );
    }

    if (selectedBook && currentPage === 'katalog') {
      return (
        <BookDetailPage 
          book={selectedBook} 
          allBooks={books} 
          onBack={() => setSelectedBook(null)} 
          wishlist={wishlist} 
          toggleWishlist={toggleWishlist}
          onBorrow={(book) => {
            setSelectedBook(null);
            setBookToConfirm(book);
          }}
          onBookClick={(book) => setSelectedBook(book)}
        />
      );
    }

    switch (currentPage) {
      case 'beranda':
        return (
          <BerandaPage 
            user={user} 
            books={books} 
            borrowHistory={borrowHistory} 
            wishlist={wishlist} 
            setCurrentPage={setCurrentPage} 
          />
        );
      case 'katalog':
        return (
          <KatalogBukuPage 
            books={filteredBooks} 
            loading={loading} 
            wishlist={wishlist} 
            toggleWishlist={toggleWishlist} 
            categories={categories} 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
            onSelectBook={setSelectedBook} 
          />
        );
      case 'peminjaman':
        return (
          <PeminjamanPage 
            isAdmin={user?.role === 'admin'}
          />
        );
      case 'wishlist':
        return (
          <WishlistPage 
            onSelectBook={(book) => {
              setSelectedBook(book);
              setCurrentPage('katalog');
            }}
            setCurrentPage={setCurrentPage} 
          />
        );
      case 'profil':
        return <ProfilPage />;
      case 'pengaturan':
        return <PengaturanPage />;
      default:
        return (
          <BerandaPage 
            user={user} 
            books={books} 
            borrowHistory={borrowHistory} 
            wishlist={wishlist} 
            setCurrentPage={setCurrentPage} 
          />
        );
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });

      if (res.ok) {
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
        alert('Logout gagal, silakan coba lagi');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Terjadi kesalahan saat logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block fixed top-0 left-0 z-40 h-screen bg-white shadow-sm transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          <div className="p-[19px] border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-3 transition-opacity duration-300 ${!isSidebarOpen && 'opacity-0 hidden'}`}>
                <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <BookMarked className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">PERPUSTB</h2>
                  <p className="text-xs text-gray-500">SMK Taruna Bhakti</p>
                </div>
              </div>
              {!isSidebarOpen && (
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-md">
                  <BookMarked className="w-6 h-6 text-white" />
                </div>
              )}
              <button 
                onClick={() => setIsSidebarOpen(false)} 
                className={`p-2 hover:bg-red-50 rounded-lg transition-colors ${!isSidebarOpen && 'hidden'}`}
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>

          <div className={`p-6 border-b border-gray-100 ${!isSidebarOpen && 'px-0 flex justify-center'}`}>
            {user && (
              <div className={`flex items-center gap-3 ${!isSidebarOpen && 'flex-col'}`}>
                {user.profile_picture ? (
                  <img 
                    src={user.profile_picture} 
                    alt={user.nama}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
                  />
                ) : (
                  <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.nama.charAt(0).toUpperCase()}
                  </div>
                )}
                {isSidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{user.nama}</p>
                    <p className="text-xs text-gray-500">{user.nipd}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setSelectedBook(null);
                    setBookToConfirm(null);
                  }}
                  className={`w-full flex items-center gap-3 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  } ${!isSidebarOpen ? 'justify-center py-3.5' : 'px-4 py-3'}`}
                  title={!isSidebarOpen ? item.label : ''}
                >
                  <Icon className={`transition-transform ${!isSidebarOpen ? 'w-5.5 h-5.5' : 'w-5 h-5'} ${!isActive && 'group-hover:scale-110'}`} />
                  {isSidebarOpen && (
                    <>
                      <span className="font-medium text-sm">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={handleLogout} 
              className={`w-full flex items-center gap-3 rounded-lg transition-all group text-gray-600 hover:bg-red-50 hover:text-red-600 ${!isSidebarOpen ? 'justify-center py-3.5' : 'px-4 py-3'}`}
              title={!isSidebarOpen ? 'Logout' : ''}
            >
              <LogOut className={`group-hover:scale-110 transition-transform ${!isSidebarOpen ? 'w-5.5 h-5.5' : 'w-5 h-5'}`} />
              {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed top-0 left-0 right-0 z-50 bg-white rounded-b-2xl shadow-2xl animate-slide-down">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <BookMarked className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">PERPUSTB</h2>
                      <p className="text-[10px] text-gray-500">SMK Taruna Bhakti</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)} 
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>

              <div className="p-4 border-b border-gray-100">
                {user && (
                  <div className="flex items-center gap-2.5">
                    {user.profile_picture ? (
                      <img 
                        src={user.profile_picture} 
                        alt={user.nama}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.nama.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.nama}</p>
                      <p className="text-xs text-gray-500">{user.nipd}</p>
                    </div>
                  </div>
                )}
              </div>

              <nav className="p-3 space-y-0.5 max-h-[60vh] overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentPage(item.id);
                        setSelectedBook(null);
                        setBookToConfirm(null);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span className="font-medium text-sm">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      )}
                    </button>
                  );
                })}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-gray-600 hover:bg-red-50 hover:text-red-600 border-t border-gray-100 mt-1.5 pt-3"
                >
                  <LogOut className="w-4.5 h-4.5" />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-4 flex-1">
                <button 
                  onClick={() => {
                    if (window.innerWidth >= 1024) {
                      setIsSidebarOpen(!isSidebarOpen);
                    } else {
                      setIsMobileMenuOpen(!isMobileMenuOpen);
                    }
                  }}
                  className={`text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all flex-shrink-0 ${
                    isSidebarOpen ? 'lg:hidden' : ''
                  }`}
                >
                  <Menu className="w-6 h-6" />
                </button>

                <div className="flex-1 max-w-2xl">
                  <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <input
                      type="text"
                      placeholder="Cari buku, pengarang, atau kode buku..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400 text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentPage('profil');
                  setSelectedBook(null);
                  setBookToConfirm(null);
                }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shadow-lg ring-2 ring-blue-100 cursor-pointer hover:ring-4 hover:ring-blue-200 transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 flex-shrink-0"
              >
                {user?.profile_picture ? (
                  <img 
                    src={user.profile_picture} 
                    alt={user?.nama || 'User'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    {user?.nama?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LibraryDashboard;