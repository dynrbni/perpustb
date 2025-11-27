import { NextRequest, NextResponse } from 'next/server';
import { createPeminjamanRequest, getPeminjamanByUser } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// Ambil token dari header / cookies
function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  const cookieToken = request.cookies.get('token')?.value;
  return cookieToken ?? null;
}

// Reusable authenticate function
async function authenticate(request: NextRequest) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return { error: 'Unauthorized - No token provided', status: 401 };
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    return { error: 'Invalid token', status: 401 };
  }

  return { userId: Number(decoded.id) };
}

// POST - User request peminjaman buku
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticate(request);
    if ('error' in auth) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    const { bookId, tanggalPengembalian } = await request.json();

    if (!bookId) {
      return NextResponse.json(
        { success: false, message: 'Book ID is required' },
        { status: 400 }
      );
    }

    if (!tanggalPengembalian) {
      return NextResponse.json(
        { success: false, message: 'Tanggal pengembalian is required' },
        { status: 400 }
      );
    }

    const result = await createPeminjamanRequest(
      auth.userId,
      Number(bookId),
      tanggalPengembalian
    );

    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    });

  } catch (error) {
    console.error('Error creating peminjaman:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Get user's peminjaman history
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticate(request);
    if ('error' in auth) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status }
      );
    }

    const history = await getPeminjamanByUser(auth.userId);

    return NextResponse.json({
      success: true,
      data: history,
    });

  } catch (error) {
    console.error('Error getting peminjaman:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
