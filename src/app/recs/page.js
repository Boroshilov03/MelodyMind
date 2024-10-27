"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { fetchRecommendations } from "../utils/Recommendations"; // Ensure this path is correct
import { fetchAccessToken } from "../utils/token";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { useOutsideClick } from "@/hooks/use-outside-click";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const token = localStorage.getItem('access_token'); // State for access token

  const emotion = "adoration";

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
        if (emotion && token) { // Check if user input and access token are available
            console.log("Generating recommendations..."); // Log to console
            const tracks = await fetchRecommendations(6, emotion, token); // Pass access token
            setRecommendations(tracks);
            console.log(tracks);
        } else {
            //console.log("User Input ",userInput);
            console.log("Token ", token);
            console.log("User input or access token is missing."); // Log if inputs are missing
        }
    };

  // Prepare card data for the carousel
  const cards = recommendations.map((track, index) => (
    <Card key={track.src} card={track} index={index} />
  ));

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

      {/* <ul className="mt-4">
        {recommendations.length > 0 ? (
          recommendations.map((track, index) => (
            <li
              key={index}
              className="flex items-center gap-4 mb-4 border-b pb-2"
            >
              <a
                href={track.spotifyLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={track.albumImage}
                  alt={track.trackName}
                  width={100}
                  className="rounded"
                />
              </a>
              <div>
                <a
                  href={track.spotifyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h3 className="text-lg font-semibold hover:underline">
                    {track.trackName}
                  </h3>
                </a>
                <p className="text-gray-600">{track.artistName}</p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">
            No recommendations yet. Click "Generate Recommendations" to fetch
            songs.
          </p>
        )}
      </ul> */}

      {/* Render the Carousel */}
      <Carousel items={cards} />
    </section>
  );
}

const DummyContent = () => {
  return (
    <>
      {[...new Array(3).fill(1)].map((_, index) => {
        return (
          <div
            key={"dummy-content" + index}
            className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4"
          >
            <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
              <span className="font-bold text-neutral-700 dark:text-neutral-200">
                The first rule of Apple club is that you boast about Apple club.
              </span>{" "}
              Keep a journal, quickly jot down a grocery list, and take amazing
              class notes. Want to convert those notes to text? No problem.
              Langotiya jeetu ka mara hua yaar is ready to capture every
              thought.
            </p>
            <Image
              src="https://assets.aceternity.com/macbook.png"
              alt="Macbook mockup from Aceternity UI"
              height={500}
              width={500}
              className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
            />
          </div>
        );
      })}
    </>
  );
};

// const data = [
//   {
//     category: "Artificial Intelligence",
//     title: "You can do more with AI.",
//     src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     content: <DummyContent />,
//   },
//   {
//     category: "Productivity",
//     title: "Enhance your productivity.",
//     src: "https://images.unsplash.com/photo-1531554694128-c4c6665f59c2?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     content: <DummyContent />,
//   },
//   {
//     category: "Product",
//     title: "Launching the new Apple Vision Pro.",
//     src: "https://images.unsplash.com/photo-1713869791518-a770879e60dc?q=80&w=2333&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     content: <DummyContent />,
//   },
//   {
//     category: "Product",
//     title: "Maps for your iPhone 15 Pro Max.",
//     src: "https://images.unsplash.com/photo-1599202860130-f600f4948364?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     content: <DummyContent />,
//   },
//   {
//     category: "iOS",
//     title: "Photography just got better.",
//     src: "https://images.unsplash.com/photo-1602081957921-9137a5d6eaee?q=80&w=2793&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     content: <DummyContent />,
//   },
//   {
//     category: "Hiring",
//     title: "Hiring for a Staff Software Engineer",
//     src: "https://images.unsplash.com/photo-1511984804822-e16ba72f5848?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     content: <DummyContent />,
//   },
// ];
