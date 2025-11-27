"use client";
import { Poppins } from "next/font/google";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Quotes() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const container = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.12 } 
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section
      ref={ref}
      className={`${poppins.className} bg-gradient-to-br from-blue-50/40 to-white py-12 sm:py-16 md:py-20 relative overflow-hidden`}
    >
      {/* Subtle background decoration */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-2xl"></div>

      <motion.div
        variants={container}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl relative z-10"
      >
        {/* Badge */}
        <motion.div 
          variants={item}
          className="flex justify-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            Inspirasi Hari Ini
          </div>
        </motion.div>

        {/* Quote Container */}
        <div className="bg-white border border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm hover:shadow-lg transition-shadow duration-300">
          {/* Icon Quote */}
          <motion.div variants={item} className="flex justify-center mb-4 sm:mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600/30"
              viewBox="0 0 975.036 975.036"
            >
              <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
            </svg>
          </motion.div>

          {/* Quote Text */}
          <motion.p 
            variants={item} 
            className="text-center leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 italic mb-6 sm:mb-8"
          >
            Ilmu pengetahuan bukanlah milik golongan atau bangsa tertentu. Ia adalah milik umat manusia. Barang siapa yang menguasai ilmu, dialah yang menguasai dunia. Karena dengan berpikir dan membaca, manusia menaklukkan kebodohan.
          </motion.p>

          {/* Divider */}
          <motion.div 
            variants={item}
            className="flex justify-center mb-4 sm:mb-5"
          >
            <div className="h-1 w-12 sm:w-16 rounded bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          </motion.div>

          {/* Author Info */}
          <motion.div variants={item} className="text-center">
            <h3 className="text-gray-900 font-bold text-base sm:text-lg mb-1">
              Tan Malaka
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm">
              dalam Buku Madilog, 1943
            </p>
          </motion.div>
        </div>

        {/* Bottom decoration line */}
        <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10 md:mt-12">
          <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-400"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-l from-transparent to-blue-400"></div>
        </div>
      </motion.div>
    </section>
  );
}