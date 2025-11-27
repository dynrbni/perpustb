import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

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

    const body = await request.json();
    const { nama, email, password, profile_picture } = body;

    // Validasi
    if (!nama || nama.trim() === '') {
      return NextResponse.json(
        { message: "Nama wajib diisi" },
        { status: 400 }
      );
    }

    // Update profile user yang sedang login (dari token)
    const userId = payload.id;

    // Build dynamic query
    let updateFields: string[] = [];
    let updateValues: any[] = [];

    // Nama (required)
    updateFields.push('nama = ?');
    updateValues.push(nama.trim());

    // Email (optional)
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email && email.trim() !== '' ? email.trim() : null);
    }

    // Password (only if provided and not empty)
    if (password && typeof password === 'string' && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }

    // Profile picture (only if provided and not empty)
    if (profile_picture && typeof profile_picture === 'string' && profile_picture.trim() !== '') {
      updateFields.push('profile_picture = ?');
      updateValues.push(profile_picture);
    }

    // Tambahkan ID untuk WHERE clause
    updateValues.push(userId);

    // Execute update query
    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    
    console.log('Update Query:', updateQuery);
    
    await pool.query(updateQuery, updateValues);

    return NextResponse.json(
      { message: "Profil berhasil diupdate" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { 
        message: "Server error", 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}