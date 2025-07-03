"use client";
import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building,
  Clock,
  Info,
  Settings,
  VideoIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { InterviewDataContext } from "@/app/contexts/InterviewDataContext";

const page = () => {
  const { interviewId } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [joinLoading, setJoinLoading] = useState(false);
  const router = useRouter();
  console.log("Interview ID:", interviewId);

  const GetInterviewDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      let { data: interviews, error } = await supabase
        .from("interviews")
        .select("jobPosition, jobDescription, duration, interviewTypes")
        .eq("interview_id", interviewId);

      if (error) {
        throw error;
      }

      if (!interviews || interviews.length === 0) {
        throw new Error("Interview not found");
      }

      console.log("Interview Details:", interviews);
      setInterviewData(interviews[0]);
      toast.success("Interview details loaded successfully!");
    } catch (error) {
      console.error("Error fetching interview details:", error);
      setError(error.message || "Failed to load interview details");
      toast.error(error.message || "Failed to load interview details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      GetInterviewDetails();
    }
  }, [interviewId]);

  const handleJoinInterview = async () => {
    if (!userName.trim()) {
      toast.error("Please enter your full name before joining the interview");
      return;
    }
    setJoinLoading(true);

    // Add your join interview logic here

    try {
      let { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("interview_id", interviewId)
        .single();
      console.log("Joining interview with data:", data.questionList);
      setInterviewInfo({
        data: data,
        userName: userName,
      });
      router.push(`/interview/${interviewId}/start`);
      toast.success("Joined interview...");
      setJoinLoading(false);
    } catch (error) {
      console.error("Error joining interview:", error);
      setError(error.message || "Failed to join interview");
      toast.error(error.message || "Failed to join interview");
      setJoinLoading(false);
    }
  };

  const handleTestAudioVideo = () => {
    toast.info("Opening audio & video test...");
    // Add your test audio/video logic here
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl w-full">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <h3 className="text-lg font-medium text-gray-700">
              Loading interview details...
            </h3>
            <p className="text-sm text-gray-500">
              Please wait while we fetch your interview information
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl w-full">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h3 className="text-lg font-medium text-gray-900">
              Something went wrong
            </h3>
            <p className="text-sm text-gray-600">{error}</p>
            <Button
              onClick={GetInterviewDetails}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl w-full">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <h2 className="text-2xl font-bold text-center text-[#16A6E9] mb-1">
            AIcruiter
          </h2>
          <p className="text-gray-500 text-sm">AI-Powered Interview Platform</p>
        </div>
        {/* Interview Illustration */}
        <div className="flex justify-center mb-6">
          <Image
            src="/landing.jpg"
            alt="interview illustration"
            width={400}
            height={300}
            className="rounded-lg"
          />
        </div>
        {/* Interview Details */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {interviewData ? interviewData.jobPosition : "Loading..."}
          </h3>
          <div className="flex items-center justify-center gap-5 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <span>
                <Building className="size-5" />
              </span>
              <span>Google Inc.</span>
            </div>
            <div className="flex items-center gap-1">
              <span>
                <Clock className="size-5" />
              </span>
              <span>
                {interviewData
                  ? `${interviewData.duration} Minutes`
                  : "Loading..."}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter your full name
          </label>
          <Input
            type="text"
            placeholder="e.g., John Smith"
            className="w-full"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        {/* Instructions Card */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Info className="size-4 text-blue-500" />

              <div>
                <h4 className="font-medium text-blue-800 mb-2">
                  Before you begin
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Ensure you have a stable internet connection</li>
                  <li>• Test your camera and microphone</li>
                  <li>• Find a quiet place for the interview</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Action Buttons */}
        <div className="space-y-4 flex flex-col items-center justify-center">
          <Button
            onClick={handleJoinInterview}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
            disabled={!userName.trim()}
          >
            {joinLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <VideoIcon className="h-4 w-4 mr-2" />
                Join Interview
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handleTestAudioVideo}
            className="w-full items-center justify-center flex flex-row text-gray-700 py-2 border-gray-300"
          >
            <Settings className="size-5" />
            <span className="ml-2">Test Audio & Video</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
