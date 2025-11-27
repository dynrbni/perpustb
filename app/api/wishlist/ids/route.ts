import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const userId = await getUserFromRequest(request);
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      }, { status: 401 });
    }
    
    // Ambil hanya buku_id milik USER INI
    const [result] = await db.query(
      'SELECT buku_id FROM wishlist WHERE user_id = ?',
      [userId]
    );
    
    const wishlistIds = result.map((row: any) => row.buku_id);
    
    return NextResponse.json({
      success: true,
      data: wishlistIds,
      userId: userId // Untuk debugging
    });
  } catch (error) {
    console.error('Error fetching wishlist IDs:', error);
    return NextResponse.json({
      success: false,
      message: 'Gagal mengambil wishlist'
    }, { status: 500 });
  }
}
