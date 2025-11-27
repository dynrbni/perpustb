import { NextRequest, NextResponse } from 'next/server';
import { getAllPeminjaman } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  console.log('🚀 GET /api/admin/borrow called');
  
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Admin only' },
        { status: 403 }
      );
    }

    const result = await getAllPeminjaman();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('💥 Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
