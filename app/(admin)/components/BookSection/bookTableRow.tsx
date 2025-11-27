import { Edit, Trash2 } from 'lucide-react';
import { Book } from '@/types';

interface BooksTableRowProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
}

export default function BooksTableRow({ book, onEdit, onDelete }: BooksTableRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Cover Image */}
      <td className="px-6 py-4">
        <div className="w-12 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
          {book.cover_image ? (
            <img 
              src={book.cover_image} 
              alt={book.judul}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextSibling) {
                  (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div 
            className="w-full h-full flex items-center justify-center text-gray-400 text-xs"
            style={{ display: book.cover_image ? 'none' : 'flex' }}
          >
            📚
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-gray-900">{book.kode_buku}</td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{book.judul}</div>
        <div className="text-sm text-gray-500">{book.penerbit || '-'}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{book.pengarang}</td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {book.kategori || '-'}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{book.jumlah_total}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          book.jumlah_tersedia > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {book.jumlah_tersedia}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(book)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}