// Purpose:  After the user logs in and provides their input (feeling or genre), your code will fetch song recommendations from the Spotify API.

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// This function fetches recommendations from Spotify based on user input
const fetchRecommendations = async (seedGenres) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=5&market=US&seed_genres=${seedGenres}`,
      {
        headers: {
          Authorization: `Bearer YOUR_SPOTIFY_ACCESS_TOKEN`, // Replace with the actual access token
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Parse the data to extract necessary fields
    return data.tracks.map((track) => ({
      artistName: track.artists[0].name,
      trackName: track.name,
      albumImage: track.album.images[0].url,
      spotifyLink: track.external_urls.spotify,
    }));
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

export default function Recommendations({ userInput }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const getRecommendations = async () => {
      if (userInput) {
        const tracks = await fetchRecommendations(userInput);
        setRecommendations(tracks);
      }
    };
    getRecommendations();
  }, [userInput]);

  return (
    <section>
      <h2 className="text-xl font-bold">Recommended Songs</h2>
      <ul className="mt-4">
        {recommendations.map((track, index) => (
          <li key={index} className="flex items-center gap-4 mb-4">
            <a href={track.spotifyLink} target="_blank" rel="noopener noreferrer">
              <img src={track.albumImage} alt={track.trackName} width={100} />
            </a>
            <div>
              <a href={track.spotifyLink} target="_blank" rel="noopener noreferrer">
                <h3 className="text-lg font-semibold hover:underline">{track.trackName}</h3>
              </a>
              <p className="text-gray-600">{track.artistName}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
