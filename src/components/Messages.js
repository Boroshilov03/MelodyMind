"use client";
import { useVoice } from "@humeai/voice-react";
import { TextGenerateEffect } from "./ui/text-generate-effect";

const emotionColors = {
  admiration: "#FFC107",
  adoration: "#FF5722",
  aestheticAppreciation: "#673AB7",
  amusement: "#FF9800",
  anger: "#F44336",
  anxiety: "#3F51B5",
  awe: "#4CAF50",
  awkwardness: "#8E24AA",
  boredom: "#9E9E9E",
  calmness: "#2196F3",
  concentration: "#3F51B5",
  confusion: "#757575",
  contemplation: "#795548",
  contempt: "#D32F2F",
  contentment: "#8BC34A",
  craving: "#E91E63",
  desire: "#E91E63",
  determination: "#673AB7",
  disappointment: "#9C27B0",
  disgust: "#8B4513",
  distress: "#F44336",
  doubt: "#616161",
  ecstasy: "#FFEB3B",
  embarrassment: "#FFCDD2",
  empathicPain: "#D32F2F",
  entrancement: "#FFC107",
  envy: "#8D6E63",
  excitement: "#FF9800",
  fear: "#303F9F",
  guilt: "#9E9E9E",
  horror: "#000000",
  interest: "#64B5F6",
  joy: "#FFEB3B",
  love: "#E91E63",
  nostalgia: "#6D4C41",
  pain: "#B71C1C",
  pride: "#FFA000",
  realization: "#009688",
  relief: "#81C784",
  romance: "#FF4081",
  sadness: "#37474F",
  satisfaction: "#4CAF50",
  shame: "#757575",
  surpriseNegative: "#9E9E9E",
  surprisePositive: "#00BCD4",
  sympathy: "#FFAB91",
  tiredness: "#607D8B",
  triumph: "#FF6F00",
};

export default function Messages() {
  const { messages } = useVoice();

  // Filter for only "user_message" types and extract top 4 emotions
  const userMessagesTopEmotions = messages
    .filter((message) => message.type === "user_message")
    .map((message) => {
      // Get the emotion scores
      const scores = message.models?.prosody?.scores;

      // Sort emotions by score and take the top 4
      const topEmotions = Object.entries(scores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        .slice(0, 4)
        .reduce((acc, [emotion, score]) => {
          acc[emotion] = emotionColors[emotion] || "#000000"; // Default to black if no color is found
          return acc;
        }, {});

      return {
        content: message.message.content,
        topEmotions,
      };
    });

  console.log(userMessagesTopEmotions);

  return (
    <div>
      {userMessagesTopEmotions.map((msg, index) => (
        <div key={`user_message_${index}`}>
          <div>{msg.content}</div>
          <div>
            {Object.entries(msg.topEmotions).map(([emotion, color]) => (
              <span
                key={emotion}
                style={{
                  color: color,
                  marginRight: "8px",
                  fontWeight: "bold",
                }}
              >
                {emotion}: {color}
              </span>
            ))}
          </div>
        </div>
      ))}
      {messages.map((msg, index) => {
        if (msg.type === "user_message" || msg.type === "assistant_message") {
          return (
            <div key={msg.type + index}>
              <div>{msg.message.role}</div>
              <TextGenerateEffect
                duration={2}
                filter={false}
                words={msg.message.content}
              />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
