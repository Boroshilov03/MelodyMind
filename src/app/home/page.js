import React from "react";
import Head from "next/head";
import Spline from "@splinetool/react-spline/next";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { Spotlight } from "@/components/ui/Spotlight";
import {
  TypewriterEffectSmooth,
} from "@/components/ui/typewriter-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const navItems = [
  { name: "Home", link: "/home" },
  { name: "Chat", link: "/" },
  { name: "Recommendations", link: "/recs" },
];

const leftwords = [
  {
    text: "Hello! I am",
    className: "text-7xl font-extrabold font-dynapuff leading-[1.2]",
  },
];

const rightwords = [
  {
    text: "MelodyMind.",
    className:
      "text-7xl font-extrabold bg-gradient-to-r from-purple-500 to-yellow-400 bg-clip-text text-transparent font-dynapuff leading-[1.2]",
  },
];

function Page() {
  return (
    <>
      <Head>
        <title>MelodyMind</title>
        <meta
          name="description"
          content="Welcome to MelodyMind, your go-to chat application!"
        />
      </Head>
      <div className="flex flex-col justify-center items-center h-screen space-y-10 relative overflow-hidden">
        <FloatingNav navItems={navItems} />
        <ShootingStars />

        <div className="flex flex-row z-10 w-full px-10 mx-auto">
          {/* Increased margin-left for the left text */}
          <div className="ml-40">
            <TypewriterEffectSmooth words={leftwords} />
          </div>
          <div className="flex flex-row justify-center items-center z-10 w-full px-10 mx-auto">
            {/* Increased margin-left significantly to move the right text further to the right */}
            <div className="ml-80">  {/* Increased margin to ml-80 */}
              <TypewriterEffectSmooth words={rightwords} delay={2000} />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <Spline scene="https://prod.spline.design/ZaVCUY8TrM6BCcfW/scene.splinecode" />
        </div>
      </div>
      <HoverBorderGradient
        containerClassName="absolute text-lg font-bold"
        duration={2}
        clockwise={true}
        as="button"
        style={{
          top: "90%",
          left: "51%",
          transform: "translate(-50%, 0%)",
          zIndex: 10,
        }}
      >
        Get started!
      </HoverBorderGradient>
      <div className="absolute inset-0 flex items-center justify-center">
        <Spotlight className="ml-10" />
        <Spline scene="https://prod.spline.design/CrgCVVm0KarNURAL/scene.splinecode" />
      </div>
    </>
  );
}

export default Page;
