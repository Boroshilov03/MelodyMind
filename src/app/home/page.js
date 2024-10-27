import React from "react";
import Head from "next/head"; // Import Head from next/head
import Spline from "@splinetool/react-spline/next";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { FloatingNav } from "@/components/ui/floating-navbar";

const navItems = [
  { name: "About", link: "/home" },
  { name: "Home", link: "/" },
  { name: "Songs", link: "/recs" },
];

function Page() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen space-y-10 relative overflow-hidden">
        <FloatingNav navItems={navItems} />
        <ShootingStars />
        <div className="flex justify-between items-center z-10 w-full px-10" style={{ paddingBottom: "50px" }}>
          <h1 className="text-8xl font-extrabold font-dynapuff leading-[1.2]">
            Hey! I am
          </h1>
          <h1 className="writing-text text-8xl font-extrabold bg-gradient-to-r from-purple-500 to-yellow-400 bg-clip-text text-transparent font-dynapuff leading-[1.2]">
            MelodyMind
          </h1>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Spline scene="https://prod.spline.design/ZaVCUY8TrM6BCcfW/scene.splinecode" />
        </div>
      </div>
    </>
  );
}

export default Page;
