import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function DELETE(request: Request) {
  try {
    const userId = await getUserFromRequest(request); // ✅ UBAH INI
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      }, { status: 401 });
    }
    
    // Hapus HANYA wishlist milik USER INI
    await db.query('DELETE FROM wishlist WHERE user_id = ?', [userId]);
    
    return NextResponse.json({
      success: true,
      message: 'Semua wishlist berhasil dihapus',
      userId: userId
    });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return NextResponse.json({
      success: false,
      message: 'Gagal menghapus wishlist'
    }, { status: 500 });
  }
}
