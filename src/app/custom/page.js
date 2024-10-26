'use client';
import React, { useState, useRef, useEffect } from "react";
import { LampDemo } from "@/components/ui/lamp";

const Page = () => {
  const [moodPosition, setMoodPosition] = useState({ x: 50, y: 50 }); // Circle position
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // To store offset when dragging
  const containerRef = useRef(null);
  

    // Calculate the mood color based on moodPosition
    const getMoodColor = () => {
        const { x, y } = moodPosition;
    
        for (const area of colorAreas) {
          const distance = Math.sqrt(Math.pow(x - area.position.x, 2) + Math.pow(y - area.position.y, 2));
          if (distance < area.size) {
            return area.color; // Return the color of the mood area if within range
          }
        }
        return '#000'; // Default color if no area is selected
      };
  
  // Mood areas for color change
  const colorAreas = [
    { color: 'red', position: { x: 50, y: 5 }, size: 25 },    // Top (Anger)
    { color: 'yellow', position: { x: 95, y: 50 }, size: 25 }, // Right (Joy)
    { color: 'purple', position: { x: 50, y: 95 }, size: 25 },   // Bottom (Fear)
    { color: 'blue', position: { x: 5, y: 50 }, size: 25 }, // Left (Sad)
  ];

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
  const getBackgroundColor = () => {
    const { x, y } = moodPosition;

    for (const area of colorAreas) {
      const distance = Math.sqrt(Math.pow(x - area.position.x, 2) + Math.pow(y - area.position.y, 2));
      if (distance < area.size) {
        return area.color; // Change to the color of the mood area if within range
      }
    }
    return '#f0f0f0'; // Default color
  };

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
    <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', color: 'red', fontWeight: 'bold' }}>Anger</div>
    <div style={{ position: 'absolute', top: '50%', right: '5%', color: 'yellow', fontWeight: 'bold' }}>Joy</div>
    <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', color: 'purple', fontWeight: 'bold' }}>Fear</div> {/* Color changed to blue */}
    <div style={{ position: 'absolute', top: '50%', left: '5%', color: 'blue', fontWeight: 'bold' }}>Sad</div> {/* Color changed to purple */}
    </div>
  );
};

export default Page;
