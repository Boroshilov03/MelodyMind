
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchAccessToken } from './token'; // Import the fetchAccessToken function
import emotionToTrackAttribute from './emotionMap';

// This function fetches recommendations from Spotify based on predefined parameters
export const fetchRecommendations = async (songLimit, emotion, accessToken) => {
  console.log("accessToken: ", accessToken)
  console.log(emotion)
  //console.log(emotionToTrackAttribute.has(emotion))
  console.log(emotionToTrackAttribute.get(emotion))

  try {
    const allAttributes = emotionToTrackAttribute.get(emotion)
    const trackAttr = allAttributes[0]
    const url = `https://api.spotify.com/v1/recommendations?limit=${songLimit}
      &seed_artists=4NHQUGzhtTLFvgF5SZesLK
      &seed_genres=acoustic,pop,r-n-b
      &seed_tracks=0c6xIDDpzE81m2q797ordA
      &min_acousticness=${trackAttr.min_acousticness}
      &max_acousticness=${trackAttr.max_acousticness}
      &target_acousticness=${trackAttr.target_acousticness}
      &min_danceability=${trackAttr.min_danceability}
      &max_danceability=${trackAttr.max_danceability}
      &target_danceability=${trackAttr.target_danceability}
      &min_energy=${trackAttr.min_energy}
      &max_energy=${trackAttr.max_energy}
      &target_energy=${trackAttr.target_energy}
      &min_instrumentalness=${trackAttr.min_instrumentalness}
      &max_instrumentalness=${trackAttr.max_instrumentalness}
      &target_instrumentalness=${trackAttr.target_instrumentalness}`.replace(/\s+/g, '').trim();

    console.log("url: ", url);

    const response = await fetch(
      url,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    // const response = await fetch(
    //   `https://api.spotify.com/v1/recommendations?limit=${songLimit}\
    //   &min_acousticness=${trackAttr.min_acousticness}\
    //   &max_acousticness=${trackAttr.max_acousticness}\
    //   &target_acousticness=${trackAttr.target_acousticness}\
    //   &min_danceability=${trackAttr.min_danceability}\
    //   &max_danceability=${trackAttr.max_danceability}\
    //   &target_danceability=${trackAttr.target_danceability}\
    //   &min_energy=${trackAttr.min_energy}\
    //   &max_energy=${trackAttr.max_energy}\
    //   &target_energy=${trackAttr.target_energy}\
    //   &min_instrumentalness=${trackAttr.min_instrumentalness}\
    //   &max_instrumentalness=${trackAttr.max_instrumentalness}\
    //   &target_instrumentalness=${trackAttr.target_instrumentalness}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   }
    // );

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
