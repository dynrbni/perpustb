"use client";
import { BookOpen, Users, Book, RefreshCw } from "lucide-react";
import { Poppins } from "next/font/google";
import CountUp from "react-countup";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Statistic() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const stats = [
    { 
      icon: BookOpen, 
      value: 1248, 
      label: "Total Buku",
      color: "bg-blue-100",
      textColor: "text-blue-600"
    },
    { 
      icon: Users, 
      value: 839, 
      label: "Total Pengguna",
      color: "bg-green-100",
      textColor: "text-green-600"
    },
    { 
      icon: Book, 
      value: 312, 
      label: "Buku Dipinjam",
      color: "bg-purple-100",
      textColor: "text-purple-600"
    },
    { 
      icon: RefreshCw, 
      value: 289, 
      label: "Buku Dikembalikan",
      color: "bg-orange-100",
      textColor: "text-orange-600"
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
            Data Real-Time
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 px-4">
            Statistik Perpustakaan
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-4">
            Pantau aktivitas dan perkembangan di{" "}
            <span className="font-semibold text-blue-600">PERPUSTB</span>
          </p>
        </motion.div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col items-center text-center hover:shadow-lg hover:border-gray-300 transition-all duration-300 group"
            >
              {/* Icon */}
              <div className={`${stat.color} ${stat.textColor} w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>

              {/* Value */}
              <h3 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold ${stat.textColor} mb-0.5 sm:mb-1`}>
                {inView && (
                  <CountUp start={0} end={stat.value} duration={2.5} separator="." />
                )}
              </h3>

              {/* Label */}
              <p className="text-gray-600 text-[11px] sm:text-xs md:text-sm font-medium leading-tight">
                {stat.label}
              </p>
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