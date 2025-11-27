"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar/page";
import Hero from "@/components/Hero/page";
import Statistic from "@/components/Statistic/page";
import PopularBook from "@/components/Popular Book/page";
import Quotes from "@/components/Quotes/page";
import Footer from "@/components/Footer/page";
import { ST } from "next/dist/shared/lib/utils";

export default function Home() {
  return (
    <>
    <Navbar />
    <Hero />
    <Statistic />
    <PopularBook />
    <Quotes />
    <Footer />
    </>
  );
}
