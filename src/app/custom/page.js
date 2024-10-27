"use client";
import React, { useState, useRef, useEffect } from "react";
import { LampDemo } from "@/components/ui/lamp";

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

        
        <div key={index} style={{
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
        }}>
          {area.moodLabel.toUpperCase()} {/* Update mood label */}
        </div>
      ))}
    </div>
  );
};

export default Page;
