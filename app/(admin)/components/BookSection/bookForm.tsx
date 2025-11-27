import React from 'react';

interface BookFormFieldsProps {
  formData: any;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function BookFormFields({ formData, isEditing, onChange }: BookFormFieldsProps) {
  return (
    <div className="lg:col-span-2 space-y-3">
      {/* Kode Buku & ISBN */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Kode Buku <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="kode_buku"
            value={formData.kode_buku}
            onChange={onChange}
            required
            disabled={isEditing}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 text-gray-700 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            ISBN
          </label>
          <input
            type="text"
            name="isbn"
            value={formData.isbn}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
          />
        </div>
      </div>

      {/* Judul */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Judul Buku <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="judul"
          value={formData.judul}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
        />
      </div>

      {/* Pengarang & Penerbit */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Pengarang <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="pengarang"
            value={formData.pengarang}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Penerbit
          </label>
          <input
            type="text"
            name="penerbit"
            value={formData.penerbit}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
          />
        </div>
      </div>

      {/* Tahun, Kategori, Lokasi */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Tahun Terbit
          </label>
          <input
            type="number"
            name="tahun_terbit"
            value={formData.tahun_terbit}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Kategori
          </label>
          <select
            name="kategori"
            value={formData.kategori}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
          >
            <option value="">Pilih Kategori</option>
            <option value="Fiksi">Fiksi</option>
            <option value="Non-Fiksi">Non-Fiksi</option>
            <option value="Sains">Sains</option>
            <option value="Teknologi">Teknologi</option>
            <option value="Sejarah">Sejarah</option>
            <option value="Biografi">Biografi</option>
            <option value="Pendidikan">Pendidikan</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Lokasi Rak
          </label>
          <input
            type="text"
            name="lokasi_rak"
            value={formData.lokasi_rak}
            onChange={onChange}
            placeholder="Contoh: A1"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
          />
        </div>
      </div>

      {/* Jumlah Total & Tersedia */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Jumlah Total <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="jumlah_total"
            value={formData.jumlah_total}
            onChange={onChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Jumlah Tersedia <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="jumlah_tersedia"
            value={formData.jumlah_tersedia}
            onChange={onChange}
            required
            min="0"
            max={formData.jumlah_total}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
          />
        </div>
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi}
          onChange={onChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm resize-none"
        />
      </div>
    </div>
  );
}