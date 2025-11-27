import mysql from 'mysql2/promise';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'perpustb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Fungsi query untuk SELECT
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  try {
    const [results] = await pool.execute<RowDataPacket[]>(sql, params);
    return results as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Fungsi khusus untuk INSERT, UPDATE, DELETE
export async function execute(sql: string, params?: any[]): Promise<ResultSetHeader> {
  try {
    const [result] = await pool.execute<ResultSetHeader>(sql, params);
    return result;
  } catch (error) {
    console.error('Database execute error:', error);
    throw error;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

// Helper function untuk generate random alphanumeric string
function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Gunakan crypto untuk random yang lebih aman
  const randomValues = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
  } else {
    // Fallback ke Math.random untuk Node.js environment
    const nodeCrypto = require('crypto');
    const bytes = nodeCrypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      result += chars[bytes[i] % chars.length];
    }
  }
  
  return result;
}

// ============================================
// PEMINJAMAN FUNCTIONS
// ============================================

// Generate kode peminjaman unik dengan kombinasi timestamp + random string
export async function generateKodePeminjaman(): Promise<string> {
  const maxAttempts = 10;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Format: PJM-YYYYMMDD-HHMMSS-XXXXX
    // Contoh: PJM-20251122-143022-A8K3P
    const now = new Date();
    const date = now.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    const time = now.toTimeString().split(' ')[0].replace(/:/g, ''); // HHMMSS
    
    // Generate random alphanumeric string (5 karakter)
    const randomPart = generateRandomString(5);
    
    const kodePeminjaman = `PJM-${date}-${time}-${randomPart}`;
    
    // Cek apakah kode sudah ada di database
    const existing = await query<{ kode_peminjaman: string }>(
      `SELECT kode_peminjaman FROM peminjaman WHERE kode_peminjaman = ?`,
      [kodePeminjaman]
    );
    
    // Jika tidak ada duplikat, return kode ini
    if (existing.length === 0) {
      return kodePeminjaman;
    }
    
    // Jika ada duplikat (sangat jarang), tunggu sebentar dan coba lagi
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  // Fallback jika semua attempt gagal (hampir tidak mungkin terjadi)
  // Gunakan timestamp presisi tinggi + UUID-like random
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = generateRandomString(8);
  return `PJM-${timestamp}-${random}`;
}

// User request peminjaman (status: menunggu)
export async function createPeminjamanRequest(
  userId: number,
  bookId: number,
  tanggalPengembalian: string
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    // Cek apakah user sudah punya 3 peminjaman aktif/menunggu
    const activeLoans = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM peminjaman 
       WHERE user_id = ? AND status IN ('dipinjam', 'menunggu')`,
      [userId]
    );

    if (activeLoans[0].count >= 3) {
      return {
        success: false,
        message: 'Anda sudah mencapai batas maksimal 3 peminjaman aktif',
      };
    }

    // Cek stok buku
    const book = await query<{ jumlah_tersedia: number }>(
      `SELECT jumlah_tersedia FROM books WHERE id = ?`,
      [bookId]
    );

    if (!book.length || book[0].jumlah_tersedia <= 0) {
      return {
        success: false,
        message: 'Buku tidak tersedia untuk dipinjam',
      };
    }

    // Generate kode peminjaman
    const kodePeminjaman = await generateKodePeminjaman();

    // Insert peminjaman dengan status menunggu dan tanggal pengembalian yang dipilih
    const result = await execute(
      `INSERT INTO peminjaman (kode_peminjaman, user_id, book_id, tanggal_pengembalian_diinginkan, status, created_at)
       VALUES (?, ?, ?, ?, 'menunggu', NOW())`,
      [kodePeminjaman, userId, bookId, tanggalPengembalian]
    );

    return {
      success: true,
      message: 'Permintaan peminjaman berhasil diajukan. Menunggu persetujuan admin.',
      data: { id: result.insertId, kodePeminjaman },
    };
  } catch (error) {
    console.error('Error creating peminjaman request:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat mengajukan peminjaman',
    };
  }
}

// Admin approve peminjaman
export async function approvePeminjaman(
  peminjamanId: number,
  adminId: number
): Promise<{ success: boolean; message: string }> {
  try {
    // Get peminjaman data
    const peminjaman = await query<{ 
      book_id: number; 
      status: string;
      tanggal_pengembalian_diinginkan: string | null;
    }>(
      `SELECT book_id, status, tanggal_pengembalian_diinginkan FROM peminjaman WHERE id = ?`,
      [peminjamanId]
    );

    if (!peminjaman.length) {
      return { success: false, message: 'Peminjaman tidak ditemukan' };
    }

    if (peminjaman[0].status !== 'menunggu') {
      return { success: false, message: 'Peminjaman sudah diproses' };
    }

    // Cek stok buku
    const book = await query<{ jumlah_tersedia: number }>(
      `SELECT jumlah_tersedia FROM books WHERE id = ?`,
      [peminjaman[0].book_id]
    );

    if (!book.length || book[0].jumlah_tersedia <= 0) {
      return { success: false, message: 'Stok buku tidak tersedia' };
    }

    // Gunakan tanggal yang dipilih user, atau default +7 hari jika tidak ada
    let updateQuery: string;
    let updateParams: any[];

    if (peminjaman[0].tanggal_pengembalian_diinginkan) {
      // Gunakan tanggal yang dipilih user
      updateQuery = `UPDATE peminjaman 
       SET status = 'dipinjam',
           tanggal_pinjam = CURDATE(),
           tanggal_kembali = ?,
           disetujui_oleh = ?,
           tanggal_persetujuan = NOW()
       WHERE id = ?`;
      updateParams = [peminjaman[0].tanggal_pengembalian_diinginkan, adminId, peminjamanId];
    } else {
      // Default +7 hari dari tanggal peminjaman
      updateQuery = `UPDATE peminjaman 
       SET status = 'dipinjam',
           tanggal_pinjam = CURDATE(),
           tanggal_kembali = DATE_ADD(CURDATE(), INTERVAL 7 DAY),
           disetujui_oleh = ?,
           tanggal_persetujuan = NOW()
       WHERE id = ?`;
      updateParams = [adminId, peminjamanId];
    }

    // Update peminjaman status ke dipinjam
    await execute(updateQuery, updateParams);

    // Kurangi stok buku
    await execute(
      `UPDATE books 
       SET jumlah_tersedia = jumlah_tersedia - 1 
       WHERE id = ?`,
      [peminjaman[0].book_id]
    );

    return {
      success: true,
      message: 'Peminjaman berhasil disetujui',
    };
  } catch (error) {
    console.error('Error approving peminjaman:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat menyetujui peminjaman',
    };
  }
}

// Admin reject peminjaman
export async function rejectPeminjaman(
  peminjamanId: number,
  adminId: number,
  alasanTolak: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Get peminjaman data
    const peminjaman = await query<{ status: string }>(
      `SELECT status FROM peminjaman WHERE id = ?`,
      [peminjamanId]
    );

    if (!peminjaman.length) {
      return { success: false, message: 'Peminjaman tidak ditemukan' };
    }

    if (peminjaman[0].status !== 'menunggu') {
      return { success: false, message: 'Peminjaman sudah diproses' };
    }

    // Update peminjaman status ke ditolak
    await execute(
      `UPDATE peminjaman 
       SET status = 'ditolak',
           alasan_tolak = ?,
           disetujui_oleh = ?,
           tanggal_persetujuan = NOW()
       WHERE id = ?`,
      [alasanTolak, adminId, peminjamanId]
    );

    return {
      success: true,
      message: 'Peminjaman berhasil ditolak',
    };
  } catch (error) {
    console.error('Error rejecting peminjaman:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat menolak peminjaman',
    };
  }
}

// User kembalikan buku
export async function returnPeminjaman(
  peminjamanId: number,
  userId: number
): Promise<{ success: boolean; message: string }> {
  try {
    // Get peminjaman data
    const peminjaman = await query<{ 
      status: string; 
      user_id: number; 
      book_id: number;
      tanggal_kembali: string;
    }>(
      `SELECT status, user_id, book_id, tanggal_kembali 
       FROM peminjaman 
       WHERE id = ?`,
      [peminjamanId]
    );

    if (!peminjaman.length) {
      return { success: false, message: 'Peminjaman tidak ditemukan' };
    }

    // Pastikan ini peminjaman milik user yang bersangkutan
    if (peminjaman[0].user_id !== userId) {
      return { success: false, message: 'Anda tidak memiliki akses' };
    }

    // Hanya bisa mengembalikan jika status dipinjam atau terlambat
    if (peminjaman[0].status !== 'dipinjam' && peminjaman[0].status !== 'terlambat') {
      return { success: false, message: 'Buku ini tidak dalam status peminjaman aktif' };
    }

    // Hitung denda jika terlambat
    const today = new Date();
    const dueDate = new Date(peminjaman[0].tanggal_kembali);
    const isLate = today > dueDate;
    
    let denda = 0;
    let hariTerlambat = 0;
    
    if (isLate) {
      hariTerlambat = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
      denda = hariTerlambat * 1000; // Rp 1000 per hari
    }

    // Update peminjaman status ke dikembalikan
    await execute(
      `UPDATE peminjaman 
       SET status = 'dikembalikan',
           tanggal_dikembalikan = CURDATE(),
           hari_terlambat = ?,
           denda = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [hariTerlambat, denda, peminjamanId]
    );

    // Tambah stok buku kembali
    await execute(
      `UPDATE books 
       SET jumlah_tersedia = jumlah_tersedia + 1 
       WHERE id = ?`,
      [peminjaman[0].book_id]
    );

    return {
      success: true,
      message: isLate 
        ? `Buku berhasil dikembalikan. Denda keterlambatan: Rp ${denda.toLocaleString('id-ID')}` 
        : 'Buku berhasil dikembalikan. Terima kasih!',
    };
  } catch (error) {
    console.error('Error returning peminjaman:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat mengembalikan buku',
    };
  }
}

// Get all peminjaman by user (untuk halaman user)
export async function getPeminjamanByUser(userId: number) {
  try {
    const results = await query<any>(
      `SELECT 
        p.id,
        p.kode_peminjaman,
        p.tanggal_pinjam,
        p.tanggal_kembali,
        p.tanggal_dikembalikan,
        p.status,
        p.denda,
        p.catatan,
        p.alasan_tolak,
        p.disetujui_oleh,
        p.tanggal_persetujuan,
        p.created_at,
        p.updated_at,
        DATEDIFF(CURDATE(), p.tanggal_kembali) AS hari_terlambat,
        b.id AS book_id,
        b.kode_buku,
        b.judul,
        b.pengarang,
        b.penerbit,
        b.tahun_terbit,
        b.isbn,
        b.kategori,
        b.jumlah_total,
        b.jumlah_tersedia,
        b.lokasi_rak,
        b.deskripsi,
        b.cover_image
      FROM peminjaman p
      JOIN books b ON p.book_id = b.id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC`,
      [userId]
    );

    // Transform data ke format BorrowHistory
    return results.map((row) => ({
      id: row.id,
      kode_peminjaman: row.kode_peminjaman,
      tanggal_pinjam: row.tanggal_pinjam,
      tanggal_harus_kembali: row.tanggal_kembali,
      tanggal_dikembalikan: row.tanggal_dikembalikan,
      status: row.status,
      denda: row.denda,
      catatan: row.catatan,
      alasan_tolak: row.alasan_tolak,
      disetujui_oleh: row.disetujui_oleh,
      tanggal_persetujuan: row.tanggal_persetujuan,
      created_at: row.created_at,
      updated_at: row.updated_at,
      hari_terlambat: row.hari_terlambat > 0 ? row.hari_terlambat : 0,
      book: {
        id: row.book_id,
        kode_buku: row.kode_buku,
        judul: row.judul,
        pengarang: row.pengarang,
        penerbit: row.penerbit,
        tahun_terbit: row.tahun_terbit,
        isbn: row.isbn,
        kategori: row.kategori,
        jumlah_total: row.jumlah_total,
        jumlah_tersedia: row.jumlah_tersedia,
        lokasi_rak: row.lokasi_rak,
        deskripsi: row.deskripsi,
        cover_image: row.cover_image,
      },
    }));
  } catch (error) {
    console.error('Error getting peminjaman by user:', error);
    throw error;
  }
}

// Get all peminjaman menunggu (untuk admin)
export async function getPeminjamanMenunggu() {
  try {
    const results = await query<any>(
      `SELECT 
        p.id,
        p.kode_peminjaman,
        p.tanggal_pengembalian_diinginkan,
        p.created_at,
        p.updated_at,
        DATEDIFF(NOW(), p.created_at) AS hari_menunggu,
        u.id AS user_id,
        u.nipd,
        u.nama AS nama_peminjam,
        u.email,
        b.id AS book_id,
        b.kode_buku,
        b.judul,
        b.pengarang,
        b.penerbit,
        b.tahun_terbit,
        b.isbn,
        b.kategori,
        b.jumlah_total,
        b.jumlah_tersedia,
        b.lokasi_rak,
        b.deskripsi,
        b.cover_image
      FROM peminjaman p
      JOIN books b ON p.book_id = b.id
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 'menunggu'
      ORDER BY p.created_at ASC`
    );

    // Transform ke format BorrowHistory untuk konsistensi
    return results.map((row) => ({
      id: row.id,
      kode_peminjaman: row.kode_peminjaman,
      tanggal_pengembalian_diinginkan: row.tanggal_pengembalian_diinginkan,
      status: 'menunggu' as const,
      created_at: row.created_at,
      updated_at: row.updated_at,
      hari_menunggu: row.hari_menunggu,
      user: {
        id: row.user_id,
        nipd: row.nipd,
        nama: row.nama_peminjam,
        email: row.email,
      },
      book: {
        id: row.book_id,
        kode_buku: row.kode_buku,
        judul: row.judul,
        pengarang: row.pengarang,
        penerbit: row.penerbit,
        tahun_terbit: row.tahun_terbit,
        isbn: row.isbn,
        kategori: row.kategori,
        jumlah_total: row.jumlah_total,
        jumlah_tersedia: row.jumlah_tersedia,
        lokasi_rak: row.lokasi_rak,
        deskripsi: row.deskripsi,
        cover_image: row.cover_image,
      },
    }));
  } catch (error) {
    console.error('Error getting peminjaman menunggu:', error);
    throw error;
  }
}

export async function getAllPeminjaman() {
  try {
    const results = await query<any>(
      `SELECT 
        p.id,
        p.kode_peminjaman,
        p.tanggal_pinjam,
        p.tanggal_kembali,
        p.tanggal_dikembalikan,
        p.tanggal_pengembalian_diinginkan,
        p.status,
        p.denda,
        p.catatan,
        p.alasan_tolak,
        p.disetujui_oleh,
        p.tanggal_persetujuan,
        p.created_at,
        p.updated_at,
        CASE 
          WHEN p.status IN ('dipinjam', 'terlambat') AND p.tanggal_kembali < CURDATE() 
          THEN DATEDIFF(CURDATE(), p.tanggal_kembali)
          ELSE 0 
        END AS hari_terlambat,
        u.id AS user_id,
        u.nipd,
        u.nama,
        u.email,
        u.profile_picture,
        b.id AS book_id,
        b.kode_buku,
        b.judul,
        b.pengarang,
        b.penerbit,
        b.tahun_terbit,
        b.isbn,
        b.kategori,
        b.jumlah_total,
        b.jumlah_tersedia,
        b.lokasi_rak,
        b.deskripsi,
        b.cover_image
      FROM peminjaman p
      JOIN books b ON p.book_id = b.id
      JOIN users u ON p.user_id = u.id
      ORDER BY 
        CASE 
          WHEN p.status = 'menunggu' THEN 1
          WHEN p.status = 'terlambat' THEN 2
          WHEN p.status = 'dipinjam' THEN 3
          WHEN p.status = 'dikembalikan' THEN 4
          WHEN p.status = 'ditolak' THEN 5
          ELSE 6
        END,
        p.created_at DESC`
    );

    // Format data sesuai interface BorrowData di frontend
    const formattedData = results.map((row) => ({
      id: row.id,
      kode_peminjaman: row.kode_peminjaman,
      tanggal_pinjam: row.tanggal_pinjam,
      tanggal_harus_kembali: row.tanggal_kembali,
      tanggal_dikembalikan: row.tanggal_dikembalikan,
      tanggal_pengembalian_diinginkan: row.tanggal_pengembalian_diinginkan,
      status: row.status,
      denda: row.denda,
      catatan: row.catatan,
      alasan_tolak: row.alasan_tolak,
      disetujui_oleh: row.disetujui_oleh,
      tanggal_persetujuan: row.tanggal_persetujuan,
      created_at: row.created_at,
      updated_at: row.updated_at,
      hari_terlambat: row.hari_terlambat,
      user: {
        id: row.user_id,
        nipd: row.nipd,
        nama: row.nama,
        email: row.email,
        profile_picture: row.profile_picture,
      },
      book: {
        id: row.book_id,
        kode_buku: row.kode_buku,
        judul: row.judul,
        pengarang: row.pengarang,
        penerbit: row.penerbit,
        tahun_terbit: row.tahun_terbit,
        isbn: row.isbn,
        kategori: row.kategori,
        jumlah_total: row.jumlah_total,
        jumlah_tersedia: row.jumlah_tersedia,
        lokasi_rak: row.lokasi_rak,
        deskripsi: row.deskripsi,
        cover_image: row.cover_image,
      },
    }));

    return {
      success: true,
      data: formattedData,
    };
  } catch (error) {
    console.error('Error getting all peminjaman:', error);
    return {
      success: false,
      message: 'Failed to fetch peminjaman',
      data: [],
    };
  }
}

// Perpanjang peminjaman (untuk user)
export async function extendPeminjaman(
  peminjamanId: number,
  userId: number
): Promise<{ success: boolean; message: string }> {
  try {
    // Cek peminjaman
    const peminjaman = await query<{ status: string; user_id: number }>(
      `SELECT status, user_id FROM peminjaman WHERE id = ?`,
      [peminjamanId]
    );

    if (!peminjaman.length) {
      return { success: false, message: 'Peminjaman tidak ditemukan' };
    }

    if (peminjaman[0].user_id !== userId) {
      return { success: false, message: 'Anda tidak memiliki akses' };
    }

    if (peminjaman[0].status !== 'dipinjam') {
      return { success: false, message: 'Hanya peminjaman aktif yang bisa diperpanjang' };
    }

    // Perpanjang 7 hari
    await execute(
      `UPDATE peminjaman 
       SET tanggal_kembali = DATE_ADD(tanggal_kembali, INTERVAL 7 DAY),
           catatan = CONCAT(IFNULL(catatan, ''), '\nDiperpanjang pada ', CURDATE())
       WHERE id = ?`,
      [peminjamanId]
    );

    return {
      success: true,
      message: 'Peminjaman berhasil diperpanjang 7 hari',
    };
  } catch (error) {
    console.error('Error extending peminjaman:', error);
    return {
      success: false,
      message: 'Terjadi kesalahan saat memperpanjang peminjaman',
    };
  }
}

// Update status terlambat & hitung denda (cronjob/admin)
export async function updateStatusTerlambat() {
  try {
    await execute(
      `UPDATE peminjaman 
       SET status = 'terlambat',
           denda = DATEDIFF(CURDATE(), tanggal_kembali) * 1000
       WHERE status = 'dipinjam' 
         AND tanggal_kembali < CURDATE()`
    );
    return { success: true };
  } catch (error) {
    console.error('Error updating status terlambat:', error);
    return { success: false };
  }
}

export default pool;