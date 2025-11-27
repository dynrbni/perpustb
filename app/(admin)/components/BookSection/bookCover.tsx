import React from 'react';

interface BookCoverPreviewProps {
  coverUrl: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BookCoverPreview({ coverUrl, onUrlChange }: BookCoverPreviewProps) {
  return (
    <div className="lg:col-span-1">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Cover Buku
      </label>
      <div className="space-y-2">
        {/* Preview Image */}
        <div className="relative aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt="Cover preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '';
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <p className="text-xs">(Cover akan muncul disini)</p>
            </div>
          )}
        </div>

        {/* URL Input */}
        <input
          type="url"
          name="cover_image"
          value={coverUrl}
          onChange={onUrlChange}
          placeholder="https://example.com/cover.jpg"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
        />
        <p className="text-xs text-gray-500">
          Paste URL gambar cover buku
        </p>
      </div>
    </div>
  );
}