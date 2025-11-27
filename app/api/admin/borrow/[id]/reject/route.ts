import { NextRequest, NextResponse } from 'next/server';
import { rejectPeminjaman } from '@/lib/db';
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

    const body = await request.json();
    const { alasan_tolak } = body;

    if (!alasan_tolak || !alasan_tolak.trim()) {
      return NextResponse.json(
        { success: false, message: 'Alasan tolak is required' },
        { status: 400 }
      );
    }

    // AWAIT params dulu!
    const { id } = await params;
    const peminjamanId = parseInt(id);

    console.log('🔴 Rejecting peminjaman ID:', peminjamanId);

    const result = await rejectPeminjaman(peminjamanId, Number(decoded.id), alasan_tolak);
    
    console.log('Result:', result);

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Error rejecting peminjaman:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}