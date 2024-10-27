'use client'
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoice } from "@humeai/voice-react";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { TextGenerateEffect2 } from "./ui/text-generate-effect2";
import { ShootingStars } from "@/components/ui/shooting-stars";

const emotionColors = {
  admiration: "#FFC107",
  adoration: "#FF5722",
  // ... other emotions
};

export default function Messages() {
  const { messages } = useVoice();
  const chatContainerRef = useRef(null);

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

  const extractTopEmotions = (message) => {
    const scores = message.models?.prosody?.scores || {};
    return Object.entries(scores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, 4)
      .map(([emotion]) => ({
        emotion,
        color: emotionColors[emotion] || "#000000",
      }));
  };

  // Scroll to the bottom whenever actualMessages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [actualMessages]);

  return (
    <div className="absolute py-32 w-full h-screen bg-gradient-to-b from-[#1a1625] to-[#3A2541] overflow-hidden">
      <ShootingStars />

      <div className="absolute top-8 right-8">
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-b from-[#e2c697] to-[#d4b381]"
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-4 h-4 rounded-full bg-[#c4a57d] opacity-40 absolute top-3 left-3" />
          <div className="w-3 h-3 rounded-full bg-[#c4a57d] opacity-30 absolute bottom-4 right-3" />
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto p-6 h-full">
        <motion.div
          className="flex items-center space-x-2 mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-4 h-4 rounded-full bg-[#e2c697]" />
          <h1 className="text-white text-2xl font-bold">EMOTION CHAT</h1>
          <span className="text-[#b198c7] text-sm">POWERED BY HUME</span>
        </motion.div>

        <div
          ref={chatContainerRef} // Attach ref here
          className="space-y-4 max-h-[calc(100vh-200px)] overflow-hidden" // Updated to remove scrolling
        >
          <AnimatePresence>
            {actualMessages.map((msg, index) => {
              const content = msg.message?.content;
              if (!content) return null; // Skip rendering if content is undefined or empty

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
                  <div className="relative border-l-2 border-[#2a2435] ">
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
                      <div className="flex items-center">
                        <span className="text-[#e2c697] font-medium ">
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
                            <div className="flex gap-2">
                              {extractTopEmotions(msg.message).map(
                                ({ emotion, color }) => (
                                  <span
                                    key={emotion}
                                    className="text-[#b198c7] text-sm"
                                    style={{ color }}
                                  >
                                    + {emotion}
                                  </span>
                                )
                              )}
                            </div>
                          )}
                      </div>

                      <div className="bg-[#2a2435] rounded-lg  text-white max-w-4xl backdrop-blur-sm bg-opacity-80 py-2">
                        <TextGenerateEffect
                          duration={2}
                          filter={false}
                          words={content} // Directly use content, which is guaranteed to exist
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
      </div>
    </div>
  );
}
