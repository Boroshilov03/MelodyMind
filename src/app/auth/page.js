'use client';

import React, { useEffect } from "react";
import { fetchAccessToken, fetchRefreshToken } from "../utils/token";

const client_id = '9c0464258e4e49549ce8066ea3a06875';
const redirect_uri = 'http://localhost:3000/recs';

export default function Home() {
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
    <div>
      <h1>TITLE</h1>
      <button onClick={handleLogin} style={styles.button}>Login with Spotify</button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#121212',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#1DB954', // From spotify
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    padding: '15px 30px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
};

// HOVER
styles.buttonHover = {
  ...styles.button,
  backgroundColor: '#1aa34a',
};