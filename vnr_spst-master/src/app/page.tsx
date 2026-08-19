"use client";

import dynamic from "next/dynamic";
import OverlayUI from "@/components/OverlayUI";

const Experience = dynamic(() => import("@/components/Experience"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#050505] text-white">
      <div className="animate-pulse">Đang nạp không gian 3D...</div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="relative w-screen h-screen bg-[#050505]">
      <OverlayUI />
      <Experience />
    </main>
  );
}
