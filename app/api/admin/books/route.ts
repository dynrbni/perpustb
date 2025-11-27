import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/db';

// GET - Fetch all books
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const kategori = searchParams.get('kategori');

    let sql = 'SELECT * FROM books';
    let params: any[] = [];

    if (kategori) {
      sql += ' WHERE kategori = ?';
      params.push(kategori);
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const books = await query(sql, params);
    return NextResponse.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}

// POST - Create new book
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await execute(
      `INSERT INTO books (
        kode_buku, judul, pengarang, penerbit, tahun_terbit, 
        isbn, kategori, jumlah_total, jumlah_tersedia, lokasi_rak, 
        deskripsi, cover_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.kode_buku,
        body.judul,
        body.pengarang,
        body.penerbit || null,
        body.tahun_terbit || null,
        body.isbn || null,
        body.kategori || null,
        body.jumlah_total,
        body.jumlah_tersedia,
        body.lokasi_rak || null,
        body.deskripsi || null,
        body.cover_image || null  // TAMBAHKAN INI untuk menyimpan cover_image
      ]
    );
    return NextResponse.json({ message: 'Book created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}

// PUT - Update book
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await query(
      `UPDATE books SET 
        judul = ?, 
        pengarang = ?, 
        penerbit = ?, 
        tahun_terbit = ?, 
        isbn = ?, 
        kategori = ?, 
        jumlah_total = ?, 
        jumlah_tersedia = ?, 
        lokasi_rak = ?, 
        deskripsi = ?,
        cover_image = ?
      WHERE id = ?`,
      [
        body.judul,
        body.pengarang,
        body.penerbit,
        body.tahun_terbit,
        body.isbn,
        body.kategori,
        body.jumlah_total,
        body.jumlah_tersedia,
        body.lokasi_rak,
        body.deskripsi,
        body.cover_image || null,  // TAMBAHKAN INI untuk update cover_image
        body.id
      ]
    );
    return NextResponse.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

// DELETE - Delete book
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    await query('DELETE FROM books WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}