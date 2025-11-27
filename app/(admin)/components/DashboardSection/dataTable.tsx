
import React from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { User } from '@/types';

export const DataTable = ({ title, columns, data, actions, loading }: {
  title: string;
  columns: string[];
  data: User[];
  actions?: boolean;
  loading?: boolean;
}) => {
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-linear-to-r from-gray-50 to-white">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-linear-to-r from-blue-50 to-blue-100/50">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  {col}
                </th>
              ))}
              {actions && <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex justify-center items-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600 font-medium">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700">{row.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">{row.nipd}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{row.nama}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.email || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      row.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {row.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(row.created_at)}</td>
                  {actions && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-all">
                          <Eye size={18} />
                        </button>
                        <button className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-all">
                          <Edit size={18} />
                        </button>
                        <button className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};