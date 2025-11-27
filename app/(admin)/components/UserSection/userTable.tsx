import { User } from '@/types';
import UserTableRow from './userTableRow';

interface UserTableProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export default function UserTable({ users, loading, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">NIPD</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data user
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserTableRow 
                  key={user.id} 
                  user={user} 
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