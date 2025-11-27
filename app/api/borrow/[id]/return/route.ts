import { NextRequest, NextResponse } from 'next/server';
import { returnPeminjaman } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// Helper function to get token from request
function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  const cookieToken = request.cookies.get('token');
  if (cookieToken?.value) {
    return cookieToken.value;
  }
  
  return null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(request);
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token provided' },
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

    // Await params
    const { id } = await params;
    const peminjamanId = parseInt(id);

    console.log('📦 User returning book, peminjaman ID:', peminjamanId);

    // Return peminjaman
    const result = await returnPeminjaman(peminjamanId, decoded.id);

    console.log('Result:', result);

    return NextResponse.json(
      result, 
      { status: result.success ? 200 : 400 }
    );
  } catch (error) {
    console.error('Error returning peminjaman:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}