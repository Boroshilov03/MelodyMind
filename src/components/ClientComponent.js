"use client";
import { VoiceProvider } from "@humeai/voice-react";
import Messages from "./Messages";
import Controls from "./Controls";
export default function ClientComponent({
  accessToken,
}) {
  return (
    <VoiceProvider auth={{ type: "accessToken", value: accessToken }}>
      <Messages />
      <Controls />
    </VoiceProvider>
  );
}
