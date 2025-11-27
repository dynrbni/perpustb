import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET() {
  try {
    // 1. Verify Authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // ==================== USER STATISTICS ====================
    
    // Get total users
    const [totalUsersResult]: any = await pool.query(
      'SELECT COUNT(*) as count FROM users'
    );
    const totalUsers = totalUsersResult[0]?.count || 0;

    // Get users with role 'user'
    const [userRoleResult]: any = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'user'"
    );
    const userRole = userRoleResult[0]?.count || 0;

    // Get users with role 'admin'
    const [adminRoleResult]: any = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
    );
    const adminRole = adminRoleResult[0]?.count || 0;

    // Get new users this month
    const [newUsersResult]: any = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())'
    );
    const newUsers = newUsersResult[0]?.count || 0;

    // ==================== BOOK STATISTICS ====================
    
    // Get total books (jumlah judul buku)
    const [totalBooksResult]: any = await pool.query(
      'SELECT COUNT(*) as count FROM books'
    );
    const totalBooks = totalBooksResult[0]?.count || 0;

    // Get books borrowed - CEK apakah table peminjaman ada
    let booksBorrowed = 0;
    try {
      const [booksBorrowedResult]: any = await pool.query(
        "SELECT COUNT(DISTINCT book_id) as count FROM peminjaman WHERE status = 'dipinjam'"
      );
      booksBorrowed = booksBorrowedResult[0]?.count || 0;
    } catch (error: any) {
      // Jika table peminjaman belum ada, set booksBorrowed = 0
      if (error.code === 'ER_NO_SUCH_TABLE') {
        console.log('⚠️ Table peminjaman belum ada, booksBorrowed = 0');
        booksBorrowed = 0;
      } else {
        throw error;
      }
    }

    // Get books available (jumlah buku yang masih tersedia)
    const [booksAvailableResult]: any = await pool.query(
      'SELECT COUNT(*) as count FROM books WHERE jumlah_tersedia > 0'
    );
    const booksAvailable = booksAvailableResult[0]?.count || 0;

    // ==================== RESPONSE ====================
    
    const stats = {
      totalUsers,
      userRole,
      adminRole,
      newUsers,
      totalBooks,
      booksBorrowed,
      booksAvailable
    };

    console.log('📊 Stats API Response:', stats);

    return NextResponse.json(stats);
    
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    return NextResponse.json(
      { 
        message: "Server error",
        error: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}