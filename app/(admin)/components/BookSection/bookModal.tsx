"use client";
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Book } from '@/types';
import BookCoverPreview from './bookCover';
import BookFormFields from './bookForm';

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export default function BookModal({ book, onClose, onSaveSuccess }: BookModalProps) {
  const [formData, setFormData] = useState({
    kode_buku: '',
    judul: '',
    pengarang: '',
    penerbit: '',
    tahun_terbit: '',
    isbn: '',
    kategori: '',
    jumlah_total: 0,
    jumlah_tersedia: 0,
    lokasi_rak: '',
    deskripsi: '',
    cover_image: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        kode_buku: book.kode_buku,
        judul: book.judul,
        pengarang: book.pengarang,
        penerbit: book.penerbit || '',
        tahun_terbit: book.tahun_terbit?.toString() || '',
        isbn: book.isbn || '',
        kategori: book.kategori || '',
        jumlah_total: book.jumlah_total,
        jumlah_tersedia: book.jumlah_tersedia,
        lokasi_rak: book.lokasi_rak || '',
        deskripsi: book.deskripsi || '',
        cover_image: book.cover_image || ''
      });
    }
  }, [book]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const method = book ? 'PUT' : 'POST';
      const payload = book ? { ...formData, id: book.id } : formData;

      const res = await fetch('/api/admin/books', {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(book ? 'Buku berhasil diupdate!' : 'Buku berhasil ditambahkan!');
        onSaveSuccess();
      } else {
        alert('Gagal menyimpan buku');
      }
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Gagal menyimpan buku');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'jumlah_total' || name === 'jumlah_tersedia' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">
            {book ? 'Edit Buku' : 'Tambah Buku Baru'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <div className="overflow-y-auto flex-1 p-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <BookCoverPreview 
              coverUrl={formData.cover_image}
              onUrlChange={handleChange}
            />
            <BookFormFields 
              formData={formData}
              isEditing={!!book}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium text-sm"
          >
            {loading ? 'Menyimpan...' : book ? 'Update' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}