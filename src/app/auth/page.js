'use client'

import React, { useEffect, useState } from "react";

const SPOTIFY_CLIENT_ID = "9c0464258e4e49549ce8066ea3a06875"; 
const SPOTIFY_CLIENT_SECRET = "1750fae5a6764fe4942cb7727109cc72"; 
const SPOTIFY_REDIRECT_URI = 'http://localhost:3000/callback'; 

export default function Home() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = () => {
    const scope = "user-read-private user-read-email";
    window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(
      scope
    )}&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}`;
  };

  const fetchAccessToken = async (code) => {
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("redirect_uri", SPOTIFY_REDIRECT_URI);
    params.append("grant_type", "authorization_code");

    const authHeader =
      "Basic " + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: authHeader,
        },
        body: params.toString(),
      });

      if (!response.ok) throw new Error("Failed to fetch access token");

      const data = await response.json();
      setToken(data.access_token); 
    } catch (error) {
      console.error("Error fetching access token:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const path = window.location.pathname;
    const query = new URLSearchParams(window.location.search);
    const code = query.get("code");
    
    if (path === "/callback" && code) {
      fetchAccessToken(code);
    }  
  }, []);

  return (
    <div>
      <h1>Login with Spotify</h1>
      {token ? (
        <p>Access Token: {token}</p>
      ) : (
        <button onClick={handleLogin}>Login with Spotify</button>
      )}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}