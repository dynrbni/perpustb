import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { nipd, nama, email, password } = await req.json();

    if (!nipd || !nama || !password) {
      return NextResponse.json({ message: "Semua field wajib diisi" }, { status: 400 });
    }

    const [existing]: any = await pool.execute(
      "SELECT id FROM users WHERE nipd = ? LIMIT 1",
      [nipd.trim()]
    );

    if ((existing as any[]).length > 0) {
      return NextResponse.json({ message: "NIPD sudah terdaftar" }, { status: 400 });
    }

    const hashed = await hashPassword(password);

    await pool.execute(
      "INSERT INTO users (nipd, nama, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [nipd.trim(), nama.trim(), email?.trim() || "", hashed, "user"]
    );

    return NextResponse.json({ message: "Registrasi berhasil" });
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
