import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const userId = await getUserFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - Silakan login terlebih dahulu'
      }, { status: 401 });
    }
    
    const query = `
      SELECT 
        w.id,
        w.user_id,
        w.buku_id,
        w.tanggal_ditambahkan,
        b.id,
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
        b.cover_image,
        b.created_at,
        b.updated_at
      FROM wishlist w
      JOIN books b ON w.buku_id = b.id
      WHERE w.user_id = ?
      ORDER BY w.tanggal_ditambahkan DESC
    `;
    
    const [wishlists] = await db.query(query, [userId]);
    
    return NextResponse.json({
      success: true,
      data: wishlists,
      message: `Wishlist user ID ${userId}`
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json({
      success: false,
      message: 'Gagal mengambil wishlist'
    }, { status: 500 });
  }
}
