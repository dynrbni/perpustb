// app/login/page.tsx
'use client';
import { Poppins } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, Lock, User, Eye, EyeOff } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function LoginPage() {
  const [nipd, setNipd] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nipd: nipd.trim(), password }),
        credentials: 'include'
      });

      const data = await res.json();
      console.log("📦 Login response:", data);

      if (res.ok && data.success) {
        setMessage('Login berhasil! Mengalihkan...');
        setTimeout(() => {
          console.log("🚀 Redirecting to:", data.redirectTo);
          window.location.href = data.redirectTo;
        }, 1000);
      } else {
        setMessage(data.message || 'Login gagal');
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setMessage('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${poppins.className} min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4`}>
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <BookOpen className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Selamat Datang Kembali</h1>
          <p className="text-sm text-gray-500">Masuk ke akun PERPUSTB Anda</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
          {message && (
            <div className={`p-3 rounded-xl text-sm font-medium mb-6 ${
              message.includes('berhasil') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* NIPD Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">NIPD</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={nipd}
                  onChange={(e) => setNipd(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Masukkan NIPD"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Masukkan password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Memproses...
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-6 text-center">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}