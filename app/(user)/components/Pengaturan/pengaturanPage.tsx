// app/(user)/pengaturan/page.tsx
'use client';
import React, { useState } from 'react';
import { Bell, BookOpen, Shield, AlertTriangle, ChevronRight, User, Lock, Clock } from 'lucide-react';

export default function PengaturanPage() {
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [autoRenew, setAutoRenew] = useState(false);

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-sm ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-5">
      {/* Header - Compact */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pengaturan</h1>
          <p className="text-xs text-gray-400 mt-0.5">Kelola preferensi dan keamanan akun Anda</p>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-bold text-gray-900">Notifikasi</h2>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-400 mt-0.5">Terima notifikasi melalui email</p>
            </div>
            <Toggle enabled={notifEmail} onChange={() => setNotifEmail(!notifEmail)} />
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Push Notifications</p>
              <p className="text-xs text-gray-400 mt-0.5">Terima notifikasi push</p>
            </div>
            <Toggle enabled={notifPush} onChange={() => setNotifPush(!notifPush)} />
          </div>
        </div>
      </div>

      {/* Borrowing Section */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-bold text-gray-900">Peminjaman</h2>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">Auto Renewal</p>
            <p className="text-xs text-gray-400 mt-0.5">Perpanjang otomatis peminjaman</p>
          </div>
          <Toggle enabled={autoRenew} onChange={() => setAutoRenew(!autoRenew)} />
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-bold text-gray-900">Keamanan</h2>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <Lock className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <span className="text-sm font-bold text-gray-900">Ubah Password</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <Clock className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <span className="text-sm font-bold text-gray-900">Riwayat Login</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border-2 border-red-200 overflow-hidden">
        <div className="px-4 py-3 bg-red-50/50 border-b border-red-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-bold text-red-600">Zona Bahaya</h2>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">
            Tindakan ini tidak dapat dibatalkan. Harap berhati-hati.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-red-500/30 transition-all duration-200">
            Hapus Akun
          </button>
        </div>
      </div>
    </div>
  );
}