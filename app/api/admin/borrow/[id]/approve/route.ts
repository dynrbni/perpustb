import { NextRequest, NextResponse } from 'next/server';
import { approvePeminjaman } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Ubah jadi Promise
) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Admin only' },
        { status: 403 }
      );
    }

    // AWAIT params dulu!
    const { id } = await params;
    const peminjamanId = parseInt(id);

    console.log('🟢 Approving peminjaman ID:', peminjamanId);

    const result = await approvePeminjaman(peminjamanId, decoded.id);
    
    console.log('Result:', result);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error approving peminjaman:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}