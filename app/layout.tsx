import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from 'next/font/google';
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400','500','600','700'] });

export const metadata: Metadata = {
  title: "PERPUSTB",
  description: "Perpustakaan SMK Taruna Bhakti Depok",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.className} antialiased`}>
        {children} {/* RootLayout murni statis, jangan pakai motion di sini */}
      </body>
    </html>
  );
}
