"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchRecommendations } from '../utils/Recommendations'; // Ensure this path is correct
import { fetchAccessToken, fetchRefreshToken} from '../utils/token'; 


export default function Recommendations() { // Remove accessToken prop
    
    const [recommendations, setRecommendations] = useState([]);
    const [token, setAccessToken] = useState(null); // State for access token

    const userInput = {
        limit: 1,
        market: "ES",
        seed_artists: "4NHQUGzhtTLFvgF5SZesLK",
        seed_genres: "classical,country",
        seed_tracks: "0c6xIDDpzE81m2q797ordA",
        min_acousticness: 0.5,
        max_acousticness: 1.0,
        target_acousticness: 0.7,
        min_danceability: 0.0,
        max_danceability: 0.5,
        target_danceability: 0.3,
        // Add other parameters as necessary
      };

    // Fetch the access token on component mount
    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const code = query.get("code");
        fetchAccessToken(code)
        .then((token) => {
          console.log("Access Token:", token);
          setAccessToken(token);
        })

        .catch((error) => {
          console.error("Failed to fetch access token:", error);
        });
    }, []);

    // Function to fetch recommendations
    const getRecommendations = async () => {
        if (userInput && token) { // Check if user input and access token are available
            console.log("Generating recommendations..."); // Log to console
            const tracks = await fetchRecommendations(userInput, token); // Pass access token
            setRecommendations(tracks);
        } else {
            console.log("User Input ",userInput);
            console.log("Token ", token);
            console.log("User input or access token is missing."); // Log if inputs are missing
        }
    };

    return (
        <section className="p-4">
            <h2 className="text-xl font-bold mb-4">Recommended Songs</h2>

            {/* Button to generate recommendations */}
            <button
                onClick={getRecommendations} // Call the fetch function on click
                className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
                Generate Recommendations
            </button>

            <ul className="mt-4">
                {recommendations.length > 0 ? (
                    recommendations.map((track, index) => (
                        <li key={index} className="flex items-center gap-4 mb-4 border-b pb-2">
                            <a href={track.spotifyLink} target="_blank" rel="noopener noreferrer">
                                <img src={track.albumImage} alt={track.trackName} width={100} className="rounded" />
                            </a>
                            <div>
                                <a href={track.spotifyLink} target="_blank" rel="noopener noreferrer">
                                    <h3 className="text-lg font-semibold hover:underline">{track.trackName}</h3>
                                </a>
                                <p className="text-gray-600">{track.artistName}</p>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-500">No recommendations yet. Click "Generate Recommendations" to fetch songs.</p>
                )}
            </ul>
        </section>
    );
}
