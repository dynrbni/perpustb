"use client";
import { Poppins } from "next/font/google";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function PopularBook() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const books = [
    { 
      title: "Laskar Pelangi", 
      category: "Novel Inspiratif", 
      img: "https://simpus.mkri.id/uploaded_files/sampul_koleksi/original/Monograf//uploadedfiles/perpustakaan/11610-11613.jpg" 
    },
    { 
      title: "Bumi Manusia", 
      category: "Sastra Indonesia", 
      img: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1565658920i/1398034.jpg" 
    },
    { 
      title: "Rich Dad Poor Dad", 
      category: "Finansial", 
      img: "https://cdn.gramedia.com/uploads/items/9786020333175_rich-dad-poor-dad-_edisi-revisi_.jpg" 
    },
    { 
      title: "Atomic Habits", 
      category: "Self Improvement", 
      img: "https://cdn.gramedia.com/uploads/items/9786020633176_.Atomic_Habit.jpg" 
    },
    { 
      title: "Filosofi Teras", 
      category: "Filsafat", 
      img: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1548033656i/42861019.jpg" 
    },
    { 
      title: "Syarah Shahih Muslim", 
      category: "Religi", 
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ11em67_LaD2OJ4hOBdRZNsZfrYiPPNTOS5A&s" 
    },
  ];

  return (
    <section
      ref={ref}
      className={`${poppins.className} bg-gradient-to-br from-blue-50/40 to-white py-12 sm:py-16 md:py-20 relative overflow-hidden`}
    >
      {/* Subtle background decoration */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-2xl"></div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl relative z-10">
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium mb-3 sm:mb-4">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            Pilihan Terbaik
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 px-4">
            Buku Populer
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-4 leading-relaxed">
            Temukan koleksi buku paling populer di{" "}
            <span className="font-semibold text-blue-600">PERPUSTB</span> yang sering dibaca dan dipinjam.
          </p>
        </motion.div>

        {/* GRID BOOKS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
          {books.map((book, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer group"
            >
              {/* Book Cover */}
              <div className="relative w-full overflow-hidden" style={{ paddingTop: '140%' }}>
                <img
                  src={book.img}
                  alt={book.title}
                  className="absolute inset-0 object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Book Info */}
              <div className="p-2.5 sm:p-3 md:p-3.5">
                <p className="text-[10px] sm:text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wide">
                  {book.category}
                </p>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                  {book.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decoration line */}
        <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10 md:mt-12">
          <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-r from-transparent to-blue-400"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <div className="w-8 sm:w-12 h-0.5 bg-gradient-to-l from-transparent to-blue-400"></div>
        </div>
      </div>
    </section>
  );
}