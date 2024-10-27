'use client';
import React, { useState, useRef, useEffect } from "react";
import { LampDemo } from "@/components/ui/lamp";

// Function to blend colors based on proximity
const blendColors = (colors) => {
  let r = 0, g = 0, b = 0;
  let totalWeight = 0;

  colors.forEach(({ color, weight }) => {
    const [rVal, gVal, bVal] = color.match(/\w\w/g).map(c => parseInt(c, 16));
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

  // Mood areas for color blending
  const colorAreas = [
    { color: '#ff0000', position: { x: 50, y: 0 }, size: 60 },     // Top (Anger)
    { color: '#ffff00', position: { x: 100, y: 50 }, size: 60 },   // Right (Joy)
    { color: '#800080', position: { x: 50, y: 100 }, size: 60 },   // Bottom (Fear)
    { color: '#0000ff', position: { x: 0, y: 50 }, size: 60 },     // Left (Sad)
  ];

  // Calculate the mood color based on moodPosition
  const getMoodColor = () => {
    const { x, y } = moodPosition;
    let colorsInRange = [];

    colorAreas.forEach((area) => {
      const distance = Math.sqrt(Math.pow(x - area.position.x, 2) + Math.pow(y - area.position.y, 2));
      if (distance < area.size) {
        const weight = 1 - distance / area.size; // Weight decreases with distance
        colorsInRange.push({ color: area.color, weight });
      }
    });

    if (colorsInRange.length > 0) {
      return blendColors(colorsInRange); // Blend colors based on proximity
    }

    return '#000000'; // Default color if no area is selected
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);

    // Calculate the offset of the cursor from the circle's center
    const circleX = moodPosition.x * window.innerWidth / 100; // Convert to pixels
    const circleY = moodPosition.y * window.innerHeight / 100; // Convert to pixels
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

      // Calculate new position based on mouse position plus offset
      const newX = Math.min(Math.max(event.clientX - rect.left - offset.x, 0), rect.width - 50); // Adjust for circle size
      const newY = Math.min(Math.max(event.clientY - rect.top - offset.y, 0), rect.height - 50); // Adjust for circle size

      setMoodPosition({ x: (newX / rect.width) * 100, y: (newY / rect.height) * 100 });
    }
  };

  // Change background color based on proximity to mood areas
  const getBackgroundColor = () => getMoodColor();

  useEffect(() => {
    const handleMouseUpEvent = () => {
      setIsDragging(false);
    };

    window.addEventListener('mouseup', handleMouseUpEvent);
    return () => window.removeEventListener('mouseup', handleMouseUpEvent);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: getBackgroundColor(),
        overflow: 'hidden',
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
          position: 'absolute',
          left: `${moodPosition.x}%`,
          top: `${moodPosition.y}%`,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(5px)',
          cursor: 'grab',
          transform: 'translate(-50%, -50%)',
        }}
      />


{/* Mood Labels */}
<div style={{
  position: 'absolute',
  top: '3%', // Adjusted position for closer to the top
  left: '50%',
  transform: 'translateX(-50%)',
  fontWeight: 'bold',
  fontSize: '2rem', // Smaller font size
  background: 'linear-gradient(135deg, rgba(255,0,0,0.7), rgba(255,255,255,0.7))', // Gradient color for glassy effect
  WebkitBackgroundClip: 'text',   // Clip the background to text
  WebkitTextFillColor: 'transparent',  // Fill the text with transparent for glass effect
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', // Reduced shadow for a smaller look
}}>Anger</div>

<div style={{
  position: 'absolute',
  top: '50%',
  right: '3%', // Adjusted position for closer to the right
  fontWeight: 'bold',
  fontSize: '2rem', // Smaller font size
  display: 'flex', // Use flexbox for vertical alignment
  flexDirection: 'column', // Arrange items vertically
  alignItems: 'center', // Center items
  background: 'linear-gradient(135deg, rgba(255,255,0,0.7), rgba(255,255,255,0.7))', // Gradient color for glassy effect
  WebkitBackgroundClip: 'text',   // Clip the background to text
  WebkitTextFillColor: 'transparent',  // Fill the text with transparent for glass effect
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', // Reduced shadow for a smaller look
}}>
  J<br/>
  O<br/>
  Y
</div>

<div style={{
  position: 'absolute',
  bottom: '3%', // Adjusted position for closer to the bottom
  left: '50%',
  transform: 'translateX(-50%)',
  fontWeight: 'bold',
  fontSize: '2rem', // Smaller font size
  background: 'linear-gradient(135deg, rgba(128,0,128,0.7), rgba(255,255,255,0.7))', // Gradient color for glassy effect
  WebkitBackgroundClip: 'text',   // Clip the background to text
  WebkitTextFillColor: 'transparent',  // Fill the text with transparent for glass effect
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', // Reduced shadow for a smaller look
}}>Fear</div>

<div style={{
  position: 'absolute',
  top: '50%',
  left: '3%', // Adjusted position for closer to the left
  fontWeight: 'bold',
  fontSize: '2rem', // Smaller font size
  display: 'flex', // Use flexbox for vertical alignment
  flexDirection: 'column', // Arrange items vertically
  alignItems: 'center', // Center items
  background: 'linear-gradient(135deg, rgba(0,0,255,0.7), rgba(255,255,255,0.7))', // Gradient color for glassy effect
  WebkitBackgroundClip: 'text',   // Clip the background to text
  WebkitTextFillColor: 'transparent',  // Fill the text with transparent for glass effect
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)', // Reduced shadow for a smaller look
}}>
  S<br/>
  A<br/>
  D
</div>


    </div>
  );
};

export default Page;
