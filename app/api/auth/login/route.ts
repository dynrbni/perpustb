import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { nipd, password } = await req.json();

    const [rows]: any = await pool.execute(
      "SELECT * FROM users WHERE nipd = ? LIMIT 1",
      [nipd.trim()]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "NIPD tidak ditemukan" }, { status: 401 });
    }

    const user = rows[0];
    const valid = await verifyPassword(password, user.password);

    if (!valid) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    // TAMBAH await karena signToken sekarang async
    const token = await signToken({
      id: user.id,
      nipd: user.nipd,
      nama: user.nama,
      role: user.role
    });

    const redirectTo = user.role === "admin" ? "/admindashboard" : "/dashboard";

    const res = NextResponse.json({ 
      success: true,
      message: "Login berhasil", 
      redirectTo
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60
    });

    console.log("✅ Login berhasil:", { 
      nipd: user.nipd, 
      role: user.role, 
      redirectTo,
      tokenPreview: token.substring(0, 20) + "..."
    });

    return res;
  } catch (err: any) {
    console.error("❌ LOGIN ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}