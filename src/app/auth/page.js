'use client';

import React, { useEffect, useState } from "react";

const client_id = '9c0464258e4e49549ce8066ea3a06875'; 
const client_secret = '1750fae5a6764fe4942cb7727109cc72';
const redirect_uri = 'http://localhost:3000/callback'; 

export default function Home() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = () => {
    const scope = "user-read-private user-read-email";
    window.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(
      scope
    )}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
  };

  const fetchAccessToken = async (code) => {
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("redirect_uri", redirect_uri);
    params.append("grant_type", "authorization_code");

    const authHeader =
      "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64");

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
    const query = new URLSearchParams(window.location.search);
    const code = query.get("code");
    
    // Assuming this page is the default page, you can remove the path check
    if (code) {
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
