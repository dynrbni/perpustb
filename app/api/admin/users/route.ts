import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

// =================================================================
// GET - Fetch users
// =================================================================
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const limit = searchParams.get('limit') || '100';

    // Build query
    let sql = 'SELECT id, nipd, nama, email, role, profile_picture, created_at FROM users';
    const params: any[] = [];

    if (role) {
      sql += ' WHERE role = ?';
      params.push(role);
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const [users] = await pool.query(sql, params);

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// =================================================================
// POST - Create new user
// =================================================================
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { nipd, nama, email, password, role } = await request.json();

    // Validation
    if (!nipd || !nama || !password) {
      return NextResponse.json(
        { message: "NIPD, Nama, dan Password wajib diisi" },
        { status: 400 }
      );
    }

    // Check if NIPD already exists
    const [existing]: any = await pool.query(
      'SELECT id FROM users WHERE nipd = ?',
      [nipd]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { message: "NIPD sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result]: any = await pool.query(
      'INSERT INTO users (nipd, nama, email, password, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [nipd, nama, email || null, hashedPassword, role || 'user']
    );

    return NextResponse.json(
      { 
        message: "User berhasil ditambahkan",
        id: result.insertId 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// =================================================================
// PUT - Update existing user (dengan profile_picture support)
// =================================================================
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id, nipd, nama, email, password, profile_picture } = await request.json();

    // Validation
    if (!id || !nama) {
      return NextResponse.json(
        { message: "ID dan Nama wajib diisi" },
        { status: 400 }
      );
    }

    // Check if user exists
    const [userCheck]: any = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (userCheck.length === 0) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Build dynamic query based on what fields are being updated
    let updateFields = ['nama = ?'];
    let updateValues: any[] = [nama];

    // Tambahkan nipd jika dikirim
    if (nipd !== undefined && nipd !== null) {
      updateFields.push('nipd = ?');
      updateValues.push(nipd);
    }

    // Tambahkan email
    updateFields.push('email = ?');
    updateValues.push(email || null);

    // Jika password dikirim dan tidak kosong, tambahkan ke query
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }

    // Jika profile_picture dikirim, tambahkan ke query
    if (profile_picture && profile_picture.trim() !== '') {
      updateFields.push('profile_picture = ?');
      updateValues.push(profile_picture);
    }

    // Tambahkan ID di akhir untuk WHERE clause
    updateValues.push(id);

    // Execute update query
    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    await pool.query(updateQuery, updateValues);

    return NextResponse.json(
      { message: "User berhasil diupdate" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// =================================================================
// DELETE - Delete user
// =================================================================
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Get ID from query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: "ID user wajib diisi" },
        { status: 400 }
      );
    }

    // Prevent deleting yourself
    if (parseInt(id) === payload.id) {
      return NextResponse.json(
        { message: "Tidak bisa menghapus akun sendiri" },
        { status: 400 }
      );
    }

    // Check if user exists
    const [userCheck]: any = await pool.query(
      'SELECT id FROM users WHERE id = ?',
      [id]
    );

    if (userCheck.length === 0) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Delete user
    await pool.query('DELETE FROM users WHERE id = ?', [id]);

    return NextResponse.json(
      { message: "User berhasil dihapus" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}