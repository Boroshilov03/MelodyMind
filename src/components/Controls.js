"use client";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import Messages from "./Messages"; // Import Messages to use the top emotion logic

export default function Controls() {
  const { connect, disconnect, readyState } = useVoice();

  const handleDisconnect = () => {
    disconnect();
    const topEmotion = Messages.getTopEmotion(); // Call to get the top emotion from Messages
    alert(`Top Emotion: ${topEmotion}`); // Display top emotion
  };

  if (readyState === VoiceReadyState.OPEN) {
    return (
      <button
        onClick={handleDisconnect}
        className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4 origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-12 w-48 border text-left p-2 text-gray-50 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-10 before:h-10 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-16 after:h-16 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg mt-6 ml-[100px] mb-[40px]" // Added UI styles
      >
        End Session
      </button>
    );
  }

  return (
    <div className="parent-container flex items-center justify-center h-full w-full relative">
      <div style={{ position: "absolute", top: "550px" }}>
        <button
          onClick={() => {
            connect()
              .then(() => {
                /* handle success */
              })
              .catch(() => {
                /* handle error */
              });
          }}
          className="group group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 hover:border-rose-300 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4 origin-left hover:decoration-2 hover:text-rose-300 relative bg-neutral-800 h-12 w-48 border text-left p-2 text-gray-50 text-base font-bold rounded-lg overflow-hidden before:absolute before:w-10 before:h-10 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-violet-500 before:rounded-full before:blur-lg after:absolute after:z-10 after:w-16 after:h-16 after:content[''] after:bg-rose-300 after:right-8 after:top-3 after:rounded-full after:blur-lg mt-6 ml-[100px] mb-[40px]" // Added margin-left and margin-bottom here
        >
          Start Session
        </button>
      </div>
    </div>
  );
}
