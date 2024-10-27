"use client";
import React, { useState, useEffect } from "react";
import { fetchRecommendations } from "../utils/Recommendations";
import { fetchAccessToken } from "../utils/token";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { FloatingNav } from "@/components/ui/floating-navbar";


export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [token, setAccessToken] = useState(null);
  const [emotion, setEmotion] = useState(null);

  useEffect(() => {
    const storedEmotion = localStorage.getItem('selectedEmotion');
    setEmotion(storedEmotion || "love"); // Default to "love" if no emotion is found

    const query = new URLSearchParams(window.location.search);
    const code = query.get("code");

    if (code) {
      fetchAccessToken(code)
        .then((token) => {
          console.log("Access Token:", token);
          setAccessToken(token);
        })
        .catch((error) => {
          console.error("Failed to fetch access token:", error);
        });
    }
  }, []);

  const getRecommendations = async () => {
    if (!token) {
      console.log("Errors with login or access token.");
    } else {
      if (!emotion) {
        console.log("Emotion not set.");
      } else {
        console.log("Generating recommendations...");
        const tracks = await fetchRecommendations(7, emotion, token);
        setRecommendations(tracks);
        console.log(tracks);
      }
    }
  };

  const cards = recommendations.map((track, index) => {
    const trackLink = track.spotifyLink; 
    return (
      <a href={trackLink} target="_blank" rel="noopener noreferrer" key={track.id || index}>
        <Card card={track} index={index} />
      </a>
    );
  });

  const navItems = [
    { name: "Home", link: "/home" },
    { name: "Chat", link: "/" },
    { name: "Recommendations", link: "/recs" },
  ];

  return (
    <section style={styles.container}>
      <div style={styles.navbarWrapper}>
        <FloatingNav navItems={navItems} />
      </div>
      <h2 style={styles.title}>Recommended Songs</h2>
      <p style={styles.emotionDisplay}>Current Emotion: <strong>{emotion}</strong></p>
  
      <button onClick={getRecommendations} style={styles.button}>
        Generate Recommendations
      </button>
  
      <Carousel items={cards} />
    </section>
  );
}

const styles = {
  navbarWrapper: {
    width: '100%',
    position: 'relative',
    zIndex: 1000, 
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100vh',
    paddingTop: '20px',
    paddingTop: '120px',
    backgroundColor: '#121212',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px', // Increased margin to create space below the title
    background: 'linear-gradient(90deg, #1DB954, #1aa34a)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    animation: 'fadeIn 1s ease-in-out',
    fontFamily: 'Verdana, sans-serif',
    textAlign: 'center',
  },
  emotionDisplay: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1DB954',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    padding: '15px 40px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },
};
