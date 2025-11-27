"use client";

import { Poppins } from "next/font/google";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <footer
      ref={ref}
      className={`${poppins.className} bg-gradient-to-br from-blue-50/40 to-white relative overflow-hidden`}
    >
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"></div>

      {/* MAIN FOOTER */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-14 md:py-16 max-w-6xl relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10">
          {/* Left Section - Brand & Info */}
          <div className="lg:col-span-5 text-center md:text-left">
            {/* Logo */}
            <a className="flex items-center justify-center md:justify-start mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <svg
                  fill="none"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path>
                  <path d="M6.5 2H20V17H6.5A2.5 2.5 0 014 19.5V2"></path>
                </svg>
              </div>
              <span className="ml-3 text-xl sm:text-2xl font-bold text-gray-900">
                PERPUS<span className="text-blue-600">TB</span>
              </span>
            </a>

            {/* School Info */}
            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">SMK Taruna Bhakti Depok</p>
              <p className="leading-relaxed">
                Jl. Pekapuran, RT.02/RW.06, Curug<br />
                Kec. Cimanggis, Kota Depok<br />
                Jawa Barat 16953
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2 pt-1">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(021) 8744810</span>
              </p>
            </div>
          </div>

          {/* Right Section - Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 text-center md:text-left">
            {/* Column 1 */}
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-3 sm:mb-4">
                Pencarian Cepat
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li>
                  <a className="hover:text-blue-600 transition-colors cursor-pointer">
                    Fiksi
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-600 transition-colors cursor-pointer">
                    Non-Fiksi
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-600 transition-colors cursor-pointer">
                    Jurnal & Penelitian
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-3 sm:mb-4">
                Layanan
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li>
                  <a className="hover:text-blue-600 transition-colors cursor-pointer">
                    Peminjaman
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-600 transition-colors cursor-pointer">
                    Kontak Kami
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-600 transition-colors cursor-pointer">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-bold text-gray-900 text-sm mb-3 sm:mb-4">
                Tentang Kami
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li>
                  <a className="hover:text-blue-600 transition-colors cursor-pointer">
                    Visi & Misi
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-600 transition-colors cursor-pointer">
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a className="hover:text-blue-600 transition-colors cursor-pointer">
                    Ketentuan Layanan
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* DIVIDER */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl relative z-10">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

      {/* BOTTOM BAR */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-5 sm:py-6 max-w-6xl relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-gray-900">PERPUSTB</span>. All rights reserved.
          </p>

          {/* Social Media */}
          <div className="flex items-center gap-3">
            <a className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 cursor-pointer group">
              <svg fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </a>
            <a className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-blue-400 hover:border-blue-400 transition-all duration-300 cursor-pointer group">
              <svg fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 9v1a10.66 10.66 0 01-9-4.47s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
            <a className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition-all duration-300 cursor-pointer group">
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                <circle cx="17.5" cy="6.5" r="1.5"></circle>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}