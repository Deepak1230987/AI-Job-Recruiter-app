"use client";
import { InterviewDataContext } from "@/app/contexts/InterviewDataContext";
import React, { useContext, useState, useEffect, useRef } from "react";
import { Mic, MicOff, PhoneOff, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import Vapi from "@vapi-ai/web";
import AlertConfirm from "./_components/AlertConfirm";

// Separate Timer component that only re-renders when time changes
const Timer = React.memo(() => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time to HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2 text-white">
      <Clock className="w-5 h-5" />
      <span className="text-lg font-mono">{formatTime(timeElapsed)}</span>
    </div>
  );
});

Timer.displayName = "Timer";

const page = () => {
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);

  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [isMuted, setIsMuted] = useState(false);
  const { interviewId } = useParams();
  const router = useRouter();

  console.log("Interview Info:", interviewInfo); // Removed to reduce console spam

  // Check if interview data exists, if not redirect back to interview page
  useEffect(() => {
    if (!interviewInfo) {
      console.log("No interview data found, redirecting...");
      router.push(`/interview/${interviewId}`);
    }

    interviewInfo && startCall();
  }, [interviewInfo, interviewId, router]);

  // Show loading if no interview data yet
  if (!interviewInfo) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading interview session...</p>
        </div>
      </div>
    );
  }

  const startCall = async () => {
    let questionList;
    interviewInfo?.data?.questionList.forEach(
      (item, index) => (questionList = item?.question + ", " + questionList)
    );
    console.log("Starting call with questions:", questionList);

    const assistantOptions = {
      name: "AI Recruiter",
      firstMessage:
        "Hi " +
        interviewInfo?.userName +
        ", how are you? Ready for your interview on " +
        interviewInfo?.data.jobPosition +
        " ?",
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ` +
              interviewInfo?.data.jobPosition +
              ` interview. Let’s get started with a few questions!"

Ask one question at a time and wait for the candidate’s response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
Questions: ` +
              questionList +
              `

If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"

Provide brief, encouraging feedback after each answer. Example:
"Nice! That’s a solid answer."

"Hmm, not quite! Want to try again?"

Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!"

After 5–7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions nicely. Keep sharpening your skills!"

End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"

Key Guidelines:
✅ Be friendly, engaging, and witty 🧠
✅ Keep responses short and natural, like a real conversation
✅ Adapt based on the candidate’s confidence level
✅ Ensure the interview remains focused on React
`.trim(),
          },
        ],
      },
    };

    vapi.start(assistantOptions);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const endInterview = () => {
    // Add end interview logic here
    vapi.stop();
    console.log("Ending interview...");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-gray-800">
        <h1 className="text-white text-xl font-semibold">
          AI Interview Session
        </h1>
        <Timer />
      </div>

      {/* Main Video Area */}
      <div className="flex-1 p-6 flex gap-6">
        {/* AI Interviewer Video */}
        <div className="flex-1 relative">
          <div className="bg-gray-800 rounded-lg overflow-hidden h-full min-h-[400px] relative">
            {/* Placeholder for AI Interviewer Video */}
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">🤖</span>
                </div>
                <p className="text-lg font-medium">AI Interviewer</p>
              </div>
            </div>
            {/* AI Interviewer Label */}
            <div className="absolute bottom-4 left-4">
              <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                AI Interviewer
              </span>
            </div>
          </div>
        </div>

        {/* User Video */}
        <div className="flex-1 relative">
          <div className="bg-gray-800 rounded-lg overflow-hidden h-full min-h-[400px] relative">
            {/* Placeholder for User Video */}
            <div className="w-full h-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">
                    {interviewInfo?.userName?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <p className="text-lg font-medium">
                  {interviewInfo?.userName || "You"}
                </p>
              </div>
            </div>
            {/* User Label */}
            <div className="absolute bottom-4 left-4">
              <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                You
              </span>
            </div>
            {/* Mute indicator */}
            {isMuted && (
              <div className="absolute top-4 right-4">
                <div className="bg-red-500 text-white p-2 rounded-full">
                  <MicOff className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-gray-800 p-6">
        <div className="flex flex-col items-center gap-4">
          {/* Status Message */}
          <div className="text-gray-300 text-center">
            <p className="text-sm">Interview in progress...</p>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-4">
            {/* Mute/Unmute Button */}
            <Button
              onClick={toggleMute}
              className={`w-12 h-12 rounded-full ${
                isMuted
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-600 hover:bg-gray-700"
              } text-white`}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>

            {/* End Interview Button */}
            <AlertConfirm stopInterview={endInterview}>
              <Button className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white">
                <PhoneOff className="w-5 h-5" />
              </Button>
            </AlertConfirm>
          </div>

          {/* Additional Info */}
          <div className="text-gray-400 text-xs text-center">
            <p>
              Click the microphone to mute/unmute • Click the phone to end
              interview
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
