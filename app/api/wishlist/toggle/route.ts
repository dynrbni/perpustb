import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // ===== DEBUG: Lihat cookie header
    console.log('📨 Incoming request:');
    console.log('  Headers:', Object.fromEntries(request.headers));
    const cookieHeader = request.headers.get('cookie');
    console.log('  Cookie header raw:', cookieHeader);

    // ===== Try to get userId
    const userId = await getUserFromRequest(request);
    console.log('  userId dari auth:', userId);

    // ===== Check if authenticated
    if (!userId) {
      console.log('❌ REJECTED: No userId');
      return NextResponse.json({
        success: false,
        message: 'Unauthorized - Silakan login terlebih dahulu',
        debug: {
          cookieHeader: cookieHeader ? 'exists' : 'missing',
          userId: null
        }
      }, { status: 401 });
    }

    const { buku_id } = await request.json();
    
    if (!buku_id) {
      return NextResponse.json({
        success: false,
        message: 'buku_id diperlukan'
      }, { status: 400 });
    }

    // Cek apakah sudah ada di wishlist
    const checkQuery = `
      SELECT id FROM wishlist 
      WHERE user_id = ? AND buku_id = ?
    `;
    const [existing] = await db.query(checkQuery, [userId, buku_id]);

    if (existing.length > 0) {
      // Hapus dari wishlist
      await db.query(
        'DELETE FROM wishlist WHERE user_id = ? AND buku_id = ?', 
        [userId, buku_id]
      );
      console.log('✅ Removed from wishlist:', { userId, buku_id });
      
      return NextResponse.json({
        success: true,
        message: 'Dihapus dari wishlist',
        action: 'removed',
        userId: userId
      });
    } else {
      // Tambah ke wishlist
      await db.query(
        'INSERT INTO wishlist (user_id, buku_id) VALUES (?, ?)', 
        [userId, buku_id]
      );
      console.log('✅ Added to wishlist:', { userId, buku_id });
      
      return NextResponse.json({
        success: true,
        message: 'Ditambahkan ke wishlist',
        action: 'added',
        userId: userId
      });
    }
  } catch (error) {
    console.error('❌ ERROR toggling wishlist:', error);
    return NextResponse.json({
      success: false,
      message: 'Gagal mengupdate wishlist'
    }, { status: 500 });
  }
}