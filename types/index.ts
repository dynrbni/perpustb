// types/index.ts atau @/types.ts
export interface User {
  id: number;
  nipd: string;
  nama: string;
  email?: string;
  role: string;
  profile_picture: string;
  created_at?: string;
}

export interface BookType {
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

export interface BorrowHistory {
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
  // Helper properties untuk display
  hari_terlambat?: number;
}

export interface Stats {
  totalUsers: number;
  userRole: number;
  totalBooks: number;           // Total semua buku
  booksBorrowed: number;        // Buku yang sedang dipinjam
  booksAvailable: number;       // Buku yang tersedia
  pendingRequests?: number;
  totalWishlist?: number;        
  userWishlistCount?: number;      
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface Wishlist {
  id: number;
  user_id: number;
  buku_id: number;
  tanggal_ditambahkan: string;
  catatan?: string;
  created_at?: string;
  updated_at?: string;
  
  // Relations (untuk joined queries)
  book?: BookType;
}