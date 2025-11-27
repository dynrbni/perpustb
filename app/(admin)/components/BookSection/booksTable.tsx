import { Book } from '@/types';
import BooksTableRow from './bookTableRow';

interface BooksTableProps {
  books: Book[];
  loading: boolean;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
}

export default function BooksTable({ books, loading, onEdit, onDelete }: BooksTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Cover</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Kode</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Judul</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Pengarang</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Kategori</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Stok</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tersedia</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data buku
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <BooksTableRow 
                  key={book.id} 
                  book={book} 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}