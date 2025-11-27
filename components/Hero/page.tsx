"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Hero() {
  useEffect(() => {
    // Dynamically import AOS
    import('aos').then((AOS) => {
      AOS.init({
        duration: 800,
        once: false,
        offset: 100,
        easing: "ease-out",
      });
    });

    // Import AOS CSS
    import('aos/dist/aos.css');
  }, []);

  return (
    <section className="min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-blue-50/40 to-white relative overflow-hidden py-16 sm:py-20">
      {/* Subtle decorative circles */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-2xl"></div>

      <div className="container mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 gap-8 md:gap-12 max-w-7xl">
        {/* LEFT SIDE - Text Content */}
        <div 
          data-aos="fade-right"
          className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/2 space-y-5"
        >
          {/* Badge */}
          <div 
            data-aos="fade-down"
            data-aos-delay="100"
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            Platform Perpustakaan Digital
          </div>

          {/* Heading */}
          <h1 
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900"
          >
            Selamat Datang di{" "}
            <span className="text-blue-600">PERPUSTB</span>
          </h1>

          {/* Description */}
          <p 
            data-aos="fade-up"
            data-aos-delay="300"
            className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-lg"
          >
            Platform perpustakaan SMK Taruna Bhakti Depok yang membantu kamu
            menemukan dan membaca buku favorit dengan mudah.
          </p>

          {/* CTA Buttons */}
          <div 
            data-aos="fade-up"
            data-aos-delay="400"
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2"
          >
            <Link
              href="/register"
              className="bg-blue-600 text-white py-3 px-7 rounded-lg font-semibold text-base hover:bg-blue-700 transition-all duration-200 text-center shadow-sm hover:shadow-md"
            >
              Ayo Mulai
            </Link>
            <Link
              href="/login"
              className="bg-white border-2 border-gray-200 text-gray-800 py-3 px-7 rounded-lg font-semibold text-base hover:border-blue-400 hover:bg-gray-50 transition-all duration-200 text-center"
            >
              Masuk Akun
            </Link>
          </div>

          {/* Compact Stats */}
          <div 
            data-aos="fade-up"
            data-aos-delay="500"
            className="flex items-center justify-center md:justify-start gap-6 pt-4 text-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700 font-medium">10K+ Buku</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              <span className="text-gray-700 font-medium">5K+ Member</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-gray-700 font-medium">Akses 24/7</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Image */}
        <div
          data-aos="fade-left"
          data-aos-delay="200"
          className="w-full md:w-1/2 flex justify-center items-center"
        >
          <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md">
            {/* Background decoration */}
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl opacity-50 blur-xl"></div>
            
            {/* Main Image */}
            <img
              data-aos="zoom-in"
              data-aos-delay="400"
              className="relative z-10 w-full h-auto object-contain rounded-2xl shadow-xl"
              alt="Library Illustration"
              src="https://i.pinimg.com/1200x/b2/bd/c9/b2bdc9609e1a28b30fc130483d52c7e3.jpg"
            />

            {/* Compact floating info cards */}
            <div 
              data-aos="fade-right"
              data-aos-delay="600"
              className="hidden sm:block absolute -left-3 top-8 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">3,247</p>
                  <p className="text-[10px] text-gray-500">Tersedia</p>
                </div>
              </div>
            </div>

            <div 
              data-aos="fade-left"
              data-aos-delay="700"
              className="hidden sm:block absolute -right-3 bottom-8 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">1,834</p>
                  <p className="text-[10px] text-gray-500">Aktif</p>
                </div>
              </div>
            </div>

            {/* Decorative dots */}
            <div className="absolute -top-2 -right-2 w-16 h-16 grid grid-cols-4 gap-1 opacity-40">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-blue-400 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}