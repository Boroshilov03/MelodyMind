
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchAccessToken } from './token'; // Import the fetchAccessToken function

// This function fetches recommendations from Spotify based on predefined parameters
export const fetchRecommendations = async (userInput, accessToken) => {
  console.log("callig fetching")
  console.log("userInput: ", userInput)
  console.log("accessToken: ", accessToken)

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=${userInput.limit}&market=${userInput.market}&seed_artists=${userInput.seed_artists}&seed_genres=${userInput.seed_genres}&seed_tracks=${userInput.seed_tracks}&target_danceability=${userInput.target_danceability}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("response: ", response)
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

// Main Recommendations component
export default function Recommendations({ accessToken }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const getRecommendations = async () => {
      if (accessToken) { // Check if access token is available
        const tracks = await fetchRecommendations(accessToken); // Pass access token
        setRecommendations(tracks);
      }
    };
    getRecommendations();
  }, [accessToken]); // Re-fetch recommendations when access token changes

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
