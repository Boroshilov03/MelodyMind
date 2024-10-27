"use client";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils"; // Ensure this utility is defined
import Link from "next/link";
import { fetchAccessToken, fetchRefreshToken } from "../../app/utils/token";

const client_id = "e2ba0c87e0844990a438ef6e39177931";
const redirect_uri = "http://localhost:3000/recs";

export const FloatingNav = ({ navItems, className }) => {
  const handleLogin = () => {
    const scope = "user-read-private user-read-email user-top-read";
    window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(
      scope
    )}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get("code");

    if (code) {
      fetchAccessToken(code)
        .then((token) => {
          console.log("Access Token:", token);
          localStorage.setItem("spotifyToken", token);
          fetchRefreshToken();
        })

        .catch((error) => {
          console.error("Failed to fetch access token:", error);
        });
    }
  }, []);

  return (
    <div
      className={cn(
        "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-md z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
        className
      )}
    >
      {navItems.map((navItem, idx) => (
        <Link
          key={`link=${idx}`}
          href={navItem.link}
          className={cn(
            "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
          )}
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="hidden sm:block text-sm">{navItem.name}</span>
        </Link>
      ))}
      <button
        onClick={handleLogin}
        aria-label="Login To Spotify"
        className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full 
  transition-colors duration-300 ease-in-out hover:bg-[#1DB954] hover:text-white"
      >
        <span>Login</span>
        <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-[#1DB954] to-transparent h-px" />
      </button>
    </div>
  );
};
