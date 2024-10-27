"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchRecommendations } from "../utils/Recommendations"; // Ensure this path is correct
import { fetchAccessToken } from "../utils/token";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { useOutsideClick } from "@/hooks/use-outside-click";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [token, setAccessToken] = useState(null); // State for access token
  const [emotion, setEmotion] = useState(null);

  // Fetch the access token on component mount
  useEffect(() => {
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

  // Function to fetch recommendations
  const getRecommendations = async () => {
    if (!token) {
      console.log("Errors with login or access token.");
    } else {
      if (!emotion) {
        setEmotion("love");
      } else {
        console.log("Generating recommendations..."); // Log to console
        const tracks = await fetchRecommendations(7, emotion, token); // Pass access token
        setRecommendations(tracks);
        console.log(tracks);
      }
    }
  };

  // Prepare card data for the carousel
  const cards = recommendations.map((track, index) => (
    <Card key={track.src} card={track} index={index} />
  ));

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>Recommended Songs</h2>

      {/* Button to generate recommendations */}
      <button onClick={getRecommendations} style={styles.button}>
        Generate Recommendations
      </button>

      {/* Render the Carousel */}
      <Carousel items={cards} />
    </section>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the top
    height: '100vh',
    paddingTop: '20px', // Add padding to give space from the top
    backgroundColor: '#121212',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
    background: 'linear-gradient(90deg, #1DB954, #1aa34a)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    animation: 'fadeIn 1s ease-in-out',
    fontFamily: 'Verdana, sans-serif', // Using Verdana font
    textAlign: 'center', // Ensure text is centered
  },
  button: {
    backgroundColor: '#1DB954', // From Spotify
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
