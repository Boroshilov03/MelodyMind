"use client";
import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
import Spline from '@splinetool/react-spline/next';

export default function ClientComponent({ accessToken }) {
  return (
    <VoiceProvider auth={{ type: "accessToken", value: accessToken }}>
      <div className="relative flex flex-col">
        <Messages />
        <Controls />
        <Spline
          scene="https://prod.spline.design/PWCVNwEBMNL22KeQ/scene.splinecode"
          className="absolute" // Ensure it covers the entire area and is above other elements
        />
      </div>
    </VoiceProvider>
  );
}
