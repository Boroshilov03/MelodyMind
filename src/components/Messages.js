import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoice } from "@humeai/voice-react";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { TextGenerateEffect2 } from "./ui/text-generate-effect2";
import { ShootingStars } from "@/components/ui/shooting-stars";

const emotionColors = {
  adoration: "#FFB6C1",
  aestheticAppreciation: "#ADD8E6",
  amusement: "#FFFF00",
  anger: "#FF0000",
  anxiety: "#A9A9A9",
  awe: "#E6E6FA",
  awkwardness: "#FFA500",
  boredom: "#F5F5DC",
  calmness: "#90EE90",
  concentration: "#FFD700",
  confusion: "#C0C0C0",
  contemplation: "#DDA0DD",
  contempt: "#800080",
  contentment: "#FF7F50",
  craving: "#FFE4B5",
  desire: "#FFF0F5",
  determination: "#4682B4",
  disappointment: "#FF6347",
  disgust: "#006400",
  distress: "#B22222",
  doubt: "#D3D3D3",
  ecstasy: "#FFDAB9",
  embarrassment: "#FF1493",
  empathicPain: "#8B0000",
  entrancement: "#7B68EE",
  envy: "#00FF7F",
  excitement: "#FF4500",
  fear: "#00008B",
  guilt: "#B8860B",
  horror: "#8B008B",
  interest: "#4682B4",
  joy: "#FFFFE0",
  love: "#FF69B4",
  nostalgia: "#FFDEAD",
  pain: "#B22222",
  pride: "#8A2BE2",
  realization: "#FFFAF0",
  relief: "#32CD32",
  romance: "#FFBFFF",
  sadness: "#1E90FF",
  satisfaction: "#FFD700",
  shame: "#FF8C00",
  surpriseNegative: "#7FFF00",
  surprisePositive: "#20B2AA",
  sympathy: "#5F9EA0",
  tiredness: "#D2691E",
  triumph: "#ADFF2F",
};

export default function Messages() {
  const { messages } = useVoice();
  const chatContainerRef = useRef(null);
  const [uniqueUserMessages, setUniqueUserMessages] = useState([]);

  // Function to get the top N emotions from the user's message
  const getTopEmotions = (message) => {
    const scores = message.models.prosody.scores;
    const topEmotions = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4)
      .map(([emotion, score]) => ({ emotion, score }));

    return topEmotions;
  };

  // Filter user messages and extract top emotions
  const userMessagesWithTopEmotions = messages
    .filter((msg) => msg.type === "user_message")
    .map((msg) => ({
      content: msg.message.content,
      topEmotions: getTopEmotions(msg),
    }));

  // Function to add new unique messages
  const addUniqueMessages = () => {
    userMessagesWithTopEmotions.forEach((newMessage) => {
      const isDuplicate = uniqueUserMessages.some(
        (msg) =>
          msg.content === newMessage.content &&
          JSON.stringify(msg.topEmotions) ===
            JSON.stringify(newMessage.topEmotions)
      );

      if (!isDuplicate) {
        setUniqueUserMessages((prev) => [...prev, newMessage]);
      }
    });
  };

  // Function to get top emotions from the unique user messages
  const getTopEmotionsFromMessages = (messages) => {
    const emotionScores = {};

    messages.forEach((message) => {
      const topEmotions = message.topEmotions;

      topEmotions.forEach(({ emotion, score }) => {
        if (emotionScores[emotion]) {
          emotionScores[emotion] += score; // Sum scores for duplicate emotions
        } else {
          emotionScores[emotion] = score; // Initialize score for new emotions
        }
      });
    });

    const emotionEntries = Object.entries(emotionScores);
    const top4Emotions = emotionEntries
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, 4)
      .map(([emotion]) => emotion);

    return top4Emotions;
  };

  // Log the unique messages and top emotions when the button is clicked
  const handleLogUniqueMessages = () => {
    console.log(uniqueUserMessages);
    const topEmotions = getTopEmotionsFromMessages(uniqueUserMessages);
    console.log("Top 4 Emotions:", topEmotions);
    // Map top emotions to colors
    const topEmotionsWithColors = topEmotions.reduce((acc, emotion) => {
      if (emotionColors[emotion]) {
        acc[emotion] = emotionColors[emotion];
      }
      return acc;
    }, {});

    console.log("Top 4 Emotions with Colors:", topEmotionsWithColors);
    window.location.href = `/custom?pageData=${encodeURIComponent(
      JSON.stringify(topEmotionsWithColors)
    )}`;
  };

  const mockMessages = [
    {
      type: "user_message",
      message: {
        content: "Example: I love this new feature!",
      },
    },
    {
      type: "assistant_message",
      message: {
        role: "Assistant",
        content:
          "Example: I'm glad you're enjoying it! How can I help you today?",
      },
    },
  ];

  const actualMessages = messages.length > 0 ? messages : mockMessages;

  const messageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
    addUniqueMessages(); // Call to add unique messages whenever messages change
  }, [actualMessages]);

  return (
    <div className="absolute py-32 w-full h-screen bg-gradient-to-b from-[#1a1625] to-[#3A2541] shadow-md overflow-hidden">
      <ShootingStars />

      <div className="absolute top-8 right-8">
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-b from-[#e2c697] to-[#d4b381] shadow-lg"
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-4 h-4 rounded-full bg-[#c4a57d] opacity-40 absolute top-3 left-3" />
          <div className="w-3 h-3 rounded-full bg-[#c4a57d] opacity-30 absolute bottom-4 right-3" />
        </motion.div>
      </div>
      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 w-full max-w-3xl mx-auto p-6 h-full">
        <motion.div
          className="flex items-center space-x-2 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-4 h-4 rounded-full bg-[#e2c697]" />
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
            MelodyMind
          </h1>
          <span className="text-[#b198c7] text-sm">POWERED BY HUME</span>
        </motion.div>

        <div
          ref={chatContainerRef}
          className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto"
        >
          <AnimatePresence>
            {actualMessages.map((msg, index) => {
              const content = msg.message?.content;
              if (!content) return null;

              return (
                <motion.div
                  key={`message-${index}`}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="relative border-l-4 pl-4 border-[#2a2435] rounded-lg">
                    <motion.div
                      className="absolute top-0 w-2 h-2 rounded-full bg-[#e2c697]"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center mb-1">
                        <span className="text-[#e2c697] font-semibold">
                          <TextGenerateEffect2
                            duration={1}
                            filter={false}
                            words={
                              msg.type === "assistant_message"
                                ? "Assistant"
                                : "User"
                            }
                            role={
                              msg.type === "assistant_message"
                                ? "Assistant"
                                : "user"
                            }
                          />
                        </span>
                        {msg.type === "user_message" &&
                          msg.message.models?.prosody?.scores && (
                            <div className="flex gap-2 ml-3">
                              {getTopEmotions(msg.message).map(
                                ({ emotion }) => (
                                  <span
                                    key={emotion}
                                    className="text-sm"
                                    style={{ color: emotionColors[emotion] }}
                                  >
                                    + {emotion}
                                  </span>
                                )
                              )}
                            </div>
                          )}
                      </div>

                      <div className="bg-gradient-to-b from-[#453b60] to-[#3a25416b] overflow-hidden rounded-lg text-white max-w-4xl backdrop-blur-sm bg-opacity-80 py-3 px-4 shadow-md">
                        <TextGenerateEffect
                          duration={2}
                          filter={false}
                          words={content}
                          role={
                            msg.type === "assistant_message"
                              ? "Assistant"
                              : "user"
                          }
                        />
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Button to log unique messages and top emotions */}
        <button
          onClick={handleLogUniqueMessages}
          className="group group-hover:before:duration-500 mt-10 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4 origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-12 w-48 border text-left p-2 text-gray-50 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-10 before:h-10 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-16 after:h-16 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg ml-[100px] mb-[40px]" // Added margin-left and margin-bottom here
        >
          Next
        </button>
      </div>
    </div>
  );
}
