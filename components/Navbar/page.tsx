"use client";
import { useState } from "react";
import Link from "next/link";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={`${poppins.className} bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm`}>
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 max-w-7xl">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center text-gray-900 font-bold text-lg sm:text-xl hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-5 h-5 sm:w-6 sm:h-6"
              viewBox="0 0 24 24"
            >
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path>
              <path d="M6.5 2H20V17H6.5A2.5 2.5 0 014 19.5V2"></path>
            </svg>
          </div>
          <span className="ml-2 sm:ml-3">
            PERPUS<span className="text-blue-600">TB</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            href="#"
            className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            Beranda
          </Link>
          <Link
            href="#"
            className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            Statistik
          </Link>
          <Link
            href="#"
            className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            Buku Populer
          </Link>
          <Link
            href="#"
            className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            Kontak
          </Link>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Auth Buttons */}
          <Link
            href="/login"
            className="px-4 lg:px-5 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-4 lg:px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
          >
            Daftar
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-slideDown">
          <nav className="container mx-auto px-4 py-4 space-y-1 max-w-7xl">
            <Link
              href="#"
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              onClick={() => setIsOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="#"
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              onClick={() => setIsOpen(false)}
            >
              Statistik
            </Link>
            <Link
              href="#"
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              onClick={() => setIsOpen(false)}
            >
              Buku Populer
            </Link>
            <Link
              href="#"
              className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              onClick={() => setIsOpen(false)}
            >
              Kontak
            </Link>

            {/* Mobile Auth Buttons */}
            <div className="pt-3 space-y-2">
              <Link
                href="/login"
                className="block w-full text-center px-4 py-2.5 text-sm font-semibold border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                onClick={() => setIsOpen(false)}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="block w-full text-center px-4 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                onClick={() => setIsOpen(false)}
              >
                Daftar Sekarang
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}