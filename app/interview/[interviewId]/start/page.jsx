"use client";
import { InterviewDataContext } from "@/app/contexts/InterviewDataContext";
import React, { useContext, useState, useEffect, useRef } from "react";
import { Mic, MicOff, PhoneOff, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import Vapi from "@vapi-ai/web";
import AlertConfirm from "./_components/AlertConfirm";
import { toast } from "sonner";

// Timer component

const Timer = React.memo(() => {
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
  const vapiRef = useRef(null);
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [isMuted, setIsMuted] = useState(false);
  const [activeUser, setActiveUser] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const { interviewId } = useParams();
  const router = useRouter();

  // Setup Vapi event listeners
  const setupVapiEventListeners = () => {
    const vapi = vapiRef.current;
    if (!vapi) return;

    vapi.on("call-start", () => {
      console.log("Call started");
      setIsCallActive(true);
      setIsCallStarted(true);
      toast.success("Call connected successfully!");
    });

    vapi.on("speech-start", () => {
      console.log("Assistant Speech started");
      setActiveUser(false);
      setIsAssistantSpeaking(true);
    });

    vapi.on("speech-end", () => {
      console.log("Assistant Speech ended");
      setActiveUser(true);
      setIsAssistantSpeaking(false);
    });

    vapi.on("call-end", () => {
      console.log("Call ended");
      setIsCallActive(false);
      setIsAssistantSpeaking(false);
      setActiveUser(false);
      toast.info("Call ended");
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      toast.error("Connection error occurred");
      setIsCallActive(false);
    });
  };

  // Initialize Vapi only once
  useEffect(() => {
    if (!vapiRef.current) {
      vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
      setupVapiEventListeners();
    }

    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  // Check if interview data exists and auto-start call
  useEffect(() => {
    if (!interviewInfo) {
      console.log("No interview data found, redirecting...");
      router.push(`/interview/${interviewId}`);
      return;
    }

    console.log("Interview data loaded, starting call automatically");
    // Auto-start the call after a short delay
    const timer = setTimeout(() => {
      if (!isCallActive && !isCallStarted) {
        startCall();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [interviewInfo, interviewId, router]);

  // Show loading if no interview data or connecting
  if (!interviewInfo || (!isCallStarted && !isCallActive)) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>
            {!interviewInfo
              ? "Loading interview session..."
              : "Connecting to AI interviewer..."}
          </p>
          {interviewInfo && (
            <div className="mt-4 text-gray-300">
              <p className="text-sm">Welcome, {interviewInfo?.userName}!</p>
              <p className="text-xs text-gray-400">
                Position: {interviewInfo?.data?.jobPosition}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const startCall = async () => {
    if (!interviewInfo || isCallActive) return;

    try {
      const vapi = vapiRef.current;
      if (!vapi) {
        toast.error("Voice service not available");
        return;
      }

      // Build question list
      let questionList = "";
      interviewInfo?.data?.questionList?.forEach((item) => {
        questionList += item?.question + ", ";
      });

      console.log("Starting call with questions:", questionList);

      const assistantOptions = {
        name: "AI Recruiter",
        firstMessage: `Hi ${interviewInfo?.userName}, welcome to your ${interviewInfo?.data?.jobPosition} interview! Are you ready to get started?`,
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
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                `You are an AI voice assistant conducting a professional interview for the position of ${interviewInfo?.data?.jobPosition}.

Your responsibilities:
- Conduct a friendly yet professional interview
- Ask questions one at a time and wait for responses
- Provide brief, encouraging feedback after each answer
- Keep the conversation natural and engaging
- Ask the candidate to introduce themselves first

Interview Questions to ask (one by one):
${questionList}

Guidelines:
✅ Be professional, friendly, and encouraging
✅ Keep responses concise and natural
✅ Wait for complete answers before moving to next question
✅ Provide brief positive feedback after each response
✅ End the interview positively after all questions

After completing all questions, thank the candidate and let them know the interview is complete.`.trim(),
            },
          ],
        },
      };

      await vapi.start(assistantOptions);
      toast.loading("Connecting to AI interviewer...");
    } catch (error) {
      console.error("Error starting call:", error);
      toast.error("Failed to start interview. Please try again.");
    }
  };

  const toggleMute = () => {
    const vapi = vapiRef.current;
    if (!vapi || !isCallActive) return;

    try {
      if (isMuted) {
        vapi.setMuted(false);
        setIsMuted(false);
        toast.success("Microphone unmuted");
      } else {
        vapi.setMuted(true);
        setIsMuted(true);
        toast.success("Microphone muted");
      }
    } catch (error) {
      console.error("Error toggling mute:", error);
      toast.error("Failed to toggle microphone");
    }
  };

  const endInterview = () => {
    const vapi = vapiRef.current;
    if (!vapi) return;

    try {
      vapi.stop();
      setIsCallActive(false);
      setIsCallStarted(false);
      setIsAssistantSpeaking(false);
      setActiveUser(false);
      setIsMuted(false);

      console.log("Interview ended by user");
      toast.success("Interview ended successfully!");

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      console.error("Error ending interview:", error);
      toast.error("Error ending interview");
    }
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
            <div
              className={`w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center transition-all duration-300 ${
                isAssistantSpeaking
                  ? "ring-4 ring-blue-400 ring-opacity-75"
                  : ""
              }`}
            >
              <div className="text-center text-white">
                <div
                  className={`w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-300 ${
                    isAssistantSpeaking ? "scale-110 animate-pulse" : ""
                  }`}
                >
                  <span className="text-3xl">🤖</span>
                </div>
                <p className="text-lg font-medium">AI Interviewer</p>
                {isAssistantSpeaking && (
                  <div className="flex justify-center mt-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-4 left-4">
              <span
                className={`bg-black/50 text-white px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                  isAssistantSpeaking ? "bg-blue-500 animate-pulse" : ""
                }`}
              >
                AI Interviewer {isAssistantSpeaking && "🎤"}
              </span>
            </div>
          </div>
        </div>

        {/* User Video */}
        <div className="flex-1 relative">
          <div className="bg-gray-800 rounded-lg overflow-hidden h-full min-h-[400px] relative">
            <div
              className={`w-full h-full bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center transition-all duration-300 ${
                activeUser ? "ring-4 ring-green-400 ring-opacity-75" : ""
              }`}
            >
              <div className="text-center text-white">
                <div
                  className={`w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-300 ${
                    activeUser ? "scale-110 animate-pulse" : ""
                  }`}
                >
                  <span className="text-3xl">
                    {interviewInfo?.userName?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <p className="text-lg font-medium">
                  {interviewInfo?.userName || "You"}
                </p>
                {activeUser && (
                  <div className="flex justify-center mt-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-white rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-4 left-4">
              <span
                className={`bg-black/50 text-white px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                  activeUser ? "bg-green-500/75" : ""
                }`}
              >
                You {activeUser && "🎤"}
              </span>
            </div>
            {isMuted && (
              <div className="absolute top-4 right-4 animate-pulse">
                <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
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
          <div className="text-gray-300 text-center">
            <p className="text-sm">
              {isAssistantSpeaking
                ? "🤖 AI Interviewer is speaking..."
                : activeUser
                ? "🎤 You are speaking..."
                : "Interview in progress..."}
            </p>
            {isMuted && (
              <p className="text-red-400 text-xs mt-1">
                🔇 Microphone is muted
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={toggleMute}
              className={`w-12 h-12 rounded-full transition-all duration-300 ${
                isMuted
                  ? "bg-red-500 hover:bg-red-600 animate-pulse"
                  : "bg-gray-600 hover:bg-gray-700"
              } text-white shadow-lg`}
              title={isMuted ? "Unmute microphone" : "Mute microphone"}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>

            <AlertConfirm stopInterview={endInterview}>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                title="End interview"
              >
                <PhoneOff className="w-5 h-5" />
              </div>
            </AlertConfirm>
          </div>

          <div className="text-gray-400 text-xs text-center">
            <p>
              Click the microphone to {isMuted ? "unmute" : "mute"} • Click the
              phone to end interview
            </p>
            <p className="mt-1">
              {activeUser
                ? "🟢 You can speak now"
                : isAssistantSpeaking
                ? "🔵 AI is speaking"
                : "🟡 Waiting..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
