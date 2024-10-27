"use client";
import React, { useState, useRef, useEffect } from "react";
import { LampDemo } from "@/components/ui/lamp";
import './button.css'; 

// Function to blend colors based on proximity
const blendColors = (colors) => {
  let r = 0,
    g = 0,
    b = 0;
  let totalWeight = 0;

  colors.forEach(({ color, weight }) => {
    const [rVal, gVal, bVal] = color.match(/\w\w/g).map((c) => parseInt(c, 16));
    r += rVal * weight;
    g += gVal * weight;
    b += bVal * weight;
    totalWeight += weight;
  });

  r = Math.round(r / totalWeight);
  g = Math.round(g / totalWeight);
  b = Math.round(b / totalWeight);

  return `rgb(${r}, ${g}, ${b})`;
};

const Page = () => {
  const [moodPosition, setMoodPosition] = useState({ x: 50, y: 50 }); // Circle position
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // To store offset when dragging
  const containerRef = useRef(null);

  const topEmotions = {
    "joy": "#FFEB3B",
    "contentment": "#8BC34A",
    "excitement": "#FF9800",
    "satisfaction": "#4CAF50"
  };

  // Extract keys and colors
  const moodLabels = Object.keys(topEmotions);
  const colors = Object.values(topEmotions);

  // Define positions for the mood labels
  const positions = [
    { x: 50, y: 0 },   // Top (Joy)
    { x: 100, y: 50 }, // Right (Contentment)
    { x: 50, y: 100 }, // Bottom (Excitement)
    { x: 0, y: 50 }    // Left (Satisfaction)
  ];

  // Create color areas dynamically
  const colorAreas = moodLabels.map((mood, index) => ({
    color: colors[index],
    position: positions[index],
    size: 60,
    moodLabel: mood.charAt(0).toUpperCase() + mood.slice(1), // Capitalize mood label
  }));

  // Calculate the mood color based on moodPosition
  const getMoodColor = () => {
    const { x, y } = moodPosition;
    let colorsInRange = [];

    colorAreas.forEach((area) => {
      const distance = Math.sqrt(
        Math.pow(x - area.position.x, 2) + Math.pow(y - area.position.y, 2)
      );
      if (distance < area.size) {
        const weight = 1 - distance / area.size; // Weight decreases with distance
        colorsInRange.push({ color: area.color, weight });
      }
    });

    if (colorsInRange.length > 0) {
      return blendColors(colorsInRange); // Blend colors based on proximity
    }

    return "#000000"; // Default color if no area is selected
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    const circleX = (moodPosition.x * window.innerWidth) / 100; // Convert to pixels
    const circleY = (moodPosition.y * window.innerHeight) / 100; // Convert to pixels
    setOffset({
      x: event.clientX - circleX,
      y: event.clientY - circleY,
    });
    event.preventDefault(); // Prevent text selection while dragging
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const newX = Math.min(
        Math.max(event.clientX - rect.left - offset.x, 0),
        rect.width - 50
      ); // Adjust for circle size
      const newY = Math.min(
        Math.max(event.clientY - rect.top - offset.y, 0),
        rect.height - 50
      ); // Adjust for circle size

      setMoodPosition({
        x: (newX / rect.width) * 100,
        y: (newY / rect.height) * 100,
      });
    }
  };

  useEffect(() => {
    const handleMouseUpEvent = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleMouseUpEvent);
    return () => window.removeEventListener("mouseup", handleMouseUpEvent);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [isDragging]);
  

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: getMoodColor(),
        overflow: "hidden",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
    >
      {/* Pass the mood color to LampDemo */}
      <LampDemo moodColor={getMoodColor()} />
         {/* Button Section */}
        <div style={{ padding: "10px", textAlign: "center"}}>
          <button className="button absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4">
            <div className="dots_border"></div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="sparkle"
            >
              {/* SVG Paths */}
              <path
                className="path"
                strokeLinejoin="round"
                strokeLinecap="round"
                stroke="black"
                fill="black"
                d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
              />
              <path
                className="path"
                strokeLinejoin="round"
                strokeLinecap="round"
                stroke="black"
                fill="black"
                d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
              />
              <path
                className="path"
                strokeLinejoin="round"
                strokeLinecap="round"
                stroke="black"
                fill="black"
                d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
              />
            </svg>
            <span className="text_button">Generate Site</span>
          </button>
      {/* Circle and mood labels */}
      <div
        className="circle"
        style={{
          position: "absolute",
          left: `${moodPosition.x}%`,
          top: `${moodPosition.y}%`,
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(5px)",
          cursor: "grab",
          transform: "translate(-50%, -50%)",
        }}
      />
  
 
  
        {/* Mood Labels */}
        {colorAreas.map((area, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: area.position.x === 0 ? '18%' : area.position.x === 100 ? 'auto' : '50%',
              right: area.position.x === 100 ? '3%' : 'auto',
              bottom: area.position.y === 100 ? '3%' : 'auto',
              top: area.position.y === 0 ? '3%' : area.position.y === 50 ? '50%' : 'auto',
              transform: area.position.x === 0 ? 'translate(-100%, -50%)' :
                        area.position.x === 100 ? 'translate(0, -50%)' :
                        area.position.y === 0 ? 'translate(-50%, 0)' :
                        'translate(-50%, 0)',
              fontWeight: 'bold',
              fontSize: '2rem', // Smaller font size
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: `linear-gradient(135deg, ${area.color}, rgba(255,255,255,0.7))`, // Gradient color for glassy effect
              WebkitBackgroundClip: 'text',   // Clip the background to text
              WebkitTextFillColor: 'transparent',  // Fill the text with transparent for glass effect
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', // Reduced shadow for a smaller look
            }}
          >
            {area.moodLabel.toUpperCase()} {/* Update mood label */}
          </div>
        ))}
      </div>
    </div>
  );
}
  
export default Page;
