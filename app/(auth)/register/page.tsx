// app/register/page.tsx
'use client';

import { Poppins } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, User, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RegisterPage() {
  const [nipd, setNipd] = useState('');
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Password tidak sama');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nipd, nama, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Registrasi berhasil! Mengalihkan ke login...');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setMessage(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      setMessage('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    if (strength <= 1) return { strength: 25, label: 'Lemah', color: 'bg-red-500' };
    if (strength === 2) return { strength: 50, label: 'Sedang', color: 'bg-yellow-500' };
    if (strength === 3) return { strength: 75, label: 'Kuat', color: 'bg-blue-500' };
    return { strength: 100, label: 'Sangat Kuat', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength();
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <div className={`${poppins.className} min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-8`}>
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <BookOpen className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Buat Akun Baru</h1>
          <p className="text-sm text-gray-500">Bergabung dengan PERPUSTB sekarang</p>
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

          <form onSubmit={handleRegister} className="space-y-4">
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

            {/* Nama Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="contoh@email.com"
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
                  placeholder="Minimal 8 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Kekuatan password:</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.label === 'Lemah' ? 'text-red-600' :
                      passwordStrength.label === 'Sedang' ? 'text-yellow-600' :
                      passwordStrength.label === 'Kuat' ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Konfirmasi Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none text-gray-700 focus:ring-2 focus:border-transparent transition-all ${
                    confirmPassword && (passwordsMatch ? 'border-green-300 focus:ring-green-500' : 'border-red-300 focus:ring-red-500')
                  } ${!confirmPassword && 'border-gray-200 focus:ring-blue-500'}`}
                  placeholder="Ulangi password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className={`flex items-center gap-1.5 mt-2 text-xs font-medium ${
                  passwordsMatch ? 'text-green-600' : 'text-red-600'
                }`}>
                  {passwordsMatch ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Password cocok</span>
                    </>
                  ) : (
                    <span>Password tidak cocok</span>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Mendaftar...
                </span>
              ) : (
                'Daftar'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-6 text-center">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
            Masuk sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}