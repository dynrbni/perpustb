"use client";
import React, { useState, useEffect } from 'react';
import { BookType } from '@/types';
import BooksHeader from './booksHeader';
import BooksSearchBar from './bookSearchBar';
import BooksTable from './booksTable';
import BookModal from './bookModal';

export default function BooksPage() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<BookType | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/admin/books', {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setBooks(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus buku ini?')) return;

    try {
      const res = await fetch(`/api/admin/books?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        fetchBooks();
        alert('Buku berhasil dihapus!');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Gagal menghapus buku');
    }
  };

  const openModal = (book?: BookType) => {
    setEditingBook(book || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleSaveSuccess = () => {
    fetchBooks();
    closeModal();
  };

  const filteredBooks = books.filter(book =>
    book.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.pengarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.kode_buku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <BooksHeader onAddBook={() => openModal()} />
      <BooksSearchBar value={searchTerm} onChange={setSearchTerm} />
      <BooksTable 
        books={filteredBooks}
        loading={loading}
        onEdit={openModal}
        onDelete={handleDelete}
      />
      {isModalOpen && (
        <BookModal
          book={editingBook}
          onClose={closeModal}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}