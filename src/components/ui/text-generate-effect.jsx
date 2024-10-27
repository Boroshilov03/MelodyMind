import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  role, // Accept role as a prop
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2),
      }
    );
  }, [scope.current]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="dark:text-white text-black opacity-0"
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
  const titleColor =
    role === "Assistant" ? "#E686FA" : "#A8D8E6"; // Light Purple for assistant, Light Blue for user

  return (
    <div
      className={cn("font-bold", className)}
      style={{ paddingLeft: "100px" }} // Add padding to the left of the text
    >
      <div className="mt-4">
        <div
          className="leading-snug tracking-wide"
          style={{ color: titleColor }}
        >
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
