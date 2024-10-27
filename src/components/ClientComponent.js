"use client";
import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
export default function ClientComponent({ accessToken }) {
  return (
    <VoiceProvider auth={{ type: "accessToken", value: accessToken }}>
      <div className="flex flex-col">
        <Messages />
        <Controls />
      </div>
    </VoiceProvider>
  );
}
