import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/db';

// GET - Fetch all books
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const kategori = searchParams.get('kategori');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    let sql = 'SELECT * FROM books';
    let params: any[] = [];
    const conditions: string[] = [];

    // Filter hanya buku aktif kecuali diminta sebaliknya
    if (!includeInactive) {
      conditions.push('status = "active"');
    }

    if (kategori) {
      conditions.push('kategori = ?');
      params.push(kategori);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
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

    // Validasi field wajib
    if (!body.kode_buku || !body.judul || !body.pengarang) {
      return NextResponse.json(
        { error: 'Kode buku, judul, dan pengarang wajib diisi' },
        { status: 400 }
      );
    }

    // Cek apakah kode_buku sudah ada
    const existing = await query(
      'SELECT id FROM books WHERE kode_buku = ?',
      [body.kode_buku]
    );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Kode buku sudah digunakan' },
        { status: 400 }
      );
    }

    const result = await execute(
      `INSERT INTO books (
        kode_buku, judul, pengarang, penerbit, tahun_terbit, 
        isbn, kategori, jumlah_total, jumlah_tersedia, lokasi_rak, 
        deskripsi, cover_image, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.kode_buku,
        body.judul,
        body.pengarang,
        body.penerbit || null,
        body.tahun_terbit || null,
        body.isbn || null,
        body.kategori || null,
        body.jumlah_total || 1,
        body.jumlah_tersedia || 1,
        body.lokasi_rak || null,
        body.deskripsi || null,
        body.cover_image || null,
        'active' // Default status
      ]
    );

    return NextResponse.json({
      message: 'Book created successfully',
      id: result.insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}

// PUT - Update book
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    // Cek apakah buku exist
    const existing = await query('SELECT id FROM books WHERE id = ?', [body.id]);
    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

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
        cover_image = ?,
        status = ?
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
        body.cover_image || null,
        body.status || 'active',
        body.id
      ]
    );

    return NextResponse.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

// DELETE - Soft delete book (nonaktifkan buku)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const permanent = searchParams.get('permanent') === 'true';

    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    // Cek apakah buku exist
    const existing = await query('SELECT id FROM books WHERE id = ?', [id]);
    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    if (permanent) {
      // Permanent delete - cek dulu apakah ada peminjaman
      const peminjaman = await query(
        'SELECT COUNT(*) as count FROM peminjaman WHERE book_id = ?',
        [id]
      );

      if (peminjaman[0].count > 0) {
        return NextResponse.json(
          {
            error: 'Tidak dapat menghapus buku ini karena masih memiliki riwayat peminjaman. Gunakan soft delete (nonaktifkan) sebagai gantinya.'
          },
          { status: 400 }
        );
      }

      // Hapus permanen
      await query('DELETE FROM books WHERE id = ?', [id]);
      return NextResponse.json({ message: 'Book permanently deleted successfully' });
    } else {
      // Soft delete - ubah status jadi inactive
      await query('UPDATE books SET status = ? WHERE id = ?', ['inactive', id]);
      return NextResponse.json({ message: 'Book deactivated successfully' });
    }
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}