"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect2 = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  role, // Accept role as a prop
  userIconSize = "50%", // Default size for user icon
  userIconHeight = "23px", // Default height for user icon
  userIconWidth = "35px", // Default width for user icon
  botIconSize = "50%", // Default size for bot icon
  botIconHeight = "40px", // Default height for bot icon
  botIconWidth = "35px", // Default width for bot icon
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate("span", {
      opacity: 1,
      filter: filter ? "blur(0px)" : "none",
    }, {
      duration: duration ? duration : 1,
      delay: stagger(0.2),
    });
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className=""
            style={{
              filter: filter ? "blur(10px)" : "none",
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  // Determine color based on role
  const titleColor = role === "Assistant" ? "#E686FA" : "#A8D8E6"; // Light Purple for assistant, Light Blue for user
  const icon = role === "Assistant" ? "bot_icon.png" : "user_icon.svg"; // Different icon based on role
  const iconSize = role === "Assistant" ? botIconSize : userIconSize; // Choose the correct icon size
  const iconHeight = role === "Assistant" ? botIconHeight : userIconHeight; // Choose the correct icon height
  const iconWidth = role === "Assistant" ? botIconWidth : userIconWidth; // Choose the correct icon width

  return (
    <div
      className={cn("font-bold", className)}
      style={{ paddingLeft: "100px" }} // Add padding around the entire text block
    >
      <div className="mt-4 flex items-center"> {/* Flexbox for alignment */}
        <div
          style={{
            width: "40px", // Circle width
            height: "40px", // Circle height
            borderRadius: "50%", // Makes the div circular
            backgroundColor: "#2C1E3A", // Circle background color
            position: "relative", // Relative positioning for icon
            marginRight: "12px", // Space between the circle and text
            marginLeft: "-50px", // Moves the circle further left
          }}
        >
          <img
            src={icon}
            alt="user icon"
            style={{
              width: iconWidth, // Use the width passed via props
              height: iconHeight, // Use the height passed via props
              position: "absolute", // Absolute positioning to center the icon
              top: "50%", // Center vertically
              left: "50%", // Center horizontally
              transform: "translate(-50%, -50%)", // Translate to truly center the icon
              filter: "brightness(0) invert(1)", // Apply complete white effect
            }}
          />
        </div>
        <div
          className="leading-snug tracking-wide"
          style={{ color: titleColor }} // Apply dynamic color based on role
        >
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
