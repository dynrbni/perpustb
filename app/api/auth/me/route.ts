import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import  db  from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // ← FETCH USER DARI DATABASE BIAR DAPET profile_picture!
    const [rows] = await db.query(
      'SELECT id, nipd, nama, email, role, profile_picture, created_at FROM users WHERE id = ?',
      [payload.id]
    ) as any;

    const user = rows[0] as any;

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      user: {
        id: user.id,
        nipd: user.nipd,
        nama: user.nama,
        email: user.email || '',
        role: user.role,
        profile_picture: user.profile_picture || '', // ← INI YANG PENTING!
        created_at: user.created_at || new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}