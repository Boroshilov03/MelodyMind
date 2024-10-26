'use client';
import React, { useState, useRef, useEffect } from "react";

const Page = () => {
  const [moodPosition, setMoodPosition] = useState({ x: 50, y: 50 }); // Circle position
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  
  // Mood areas for color change
  const colorAreas = [
    { color: 'red', position: { x: 50, y: 5 }, size: 25 },    // Top (Anger)
    { color: 'yellow', position: { x: 95, y: 50 }, size: 25 }, // Right (Joy)
    { color: 'blue', position: { x: 50, y: 95 }, size: 25 },   // Bottom (Fear)
    { color: 'purple', position: { x: 5, y: 50 }, size: 25 }, // Left (Sad)
  ];

  const handleMouseDown = (event) => {
    setIsDragging(true);
    event.preventDefault(); // Prevent text selection while dragging
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      // Calculate new position based on mouse position
      const newX = Math.min(Math.max(event.clientX - rect.left, 0), rect.width) - 25; // Adjust for circle size
      const newY = Math.min(Math.max(event.clientY - rect.top, 0), rect.height) - 25; // Adjust for circle size

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
      <h1 style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', color: 'black' }}>
        Mood Selector
      </h1>
      
      <div
        className="circle"
        style={{
          position: 'absolute',
          left: `${moodPosition.x}%`,
          top: `${moodPosition.y}%`,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          cursor: 'grab',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <div style={{ position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)', color: 'red', fontWeight: 'bold' }}>Anger</div>
      <div style={{ position: 'absolute', top: '50%', right: '5%', color: 'yellow', fontWeight: 'bold' }}>Joy</div>
      <div style={{ position: 'absolute', bottom: '5%', left: '50%', transform: 'translateX(-50%)', color: 'blue', fontWeight: 'bold' }}>Fear</div>
      <div style={{ position: 'absolute', top: '50%', left: '5%', color: 'purple', fontWeight: 'bold' }}>Sad</div>
    </div>
  );
};

export default Page;
