// UserTableRow.tsx
import { Edit, Trash2 } from 'lucide-react';
import { User } from '@/types';  // ✅ Import dari tempat yang sama!

interface UserTableRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export default function UserTableRow({ user, onEdit, onDelete }: UserTableRowProps) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
      <td className="px-6 py-4 text-sm text-gray-900">{user.nipd}</td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{user.nama}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">{user.email || '-'}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(user.id)}
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