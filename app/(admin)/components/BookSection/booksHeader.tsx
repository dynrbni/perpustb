import { Plus, Book } from 'lucide-react';

interface BooksHeaderProps {
  onAddBook: () => void;
}

export default function BooksHeader({ onAddBook }: BooksHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Book className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Kelola Buku</h2>
            <p className="text-gray-600">Manajemen data buku perpustakaan</p>
          </div>
        </div>
        <button
          onClick={onAddBook}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tambah Buku
        </button>
      </div>
    </div>
  );
}
