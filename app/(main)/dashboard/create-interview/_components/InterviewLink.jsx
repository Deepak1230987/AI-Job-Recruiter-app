import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Copy,
  Clock,
  FileText,
  Calendar,
  Mail,
  MessageSquare,
  Plus,
  MessageCircleCode,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const InterviewLink = ({ formData, interviewId, questionCount }) => {
  const [copied, setCopied] = useState(false);

  // Mock interview link - in real app this would come from props or API
  const interviewLink = process.env.NEXT_PUBLIC_HOST_URL + "/" + interviewId;
  const expiryDate = "Nov 20, 2025";
  const duration = formData?.duration? `${formData?.duration} Minutes`: "30 Minutes";
  const questionCountDisplay = questionCount
    ? `${questionCount} Questions`
    : "10 Questions";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(interviewLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleShareVia = (platform) => {
    const subject = "AI Interview Invitation";
    const message = `You're invited to complete an AI-powered interview. Please use this link: ${interviewLink}`;

    switch (platform) {
      case "email":
        window.open(
          `mailto:?subject=${encodeURIComponent(
            subject
          )}&body=${encodeURIComponent(message)}`
        );
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        break;
      case "slack":
        // In real app, this would integrate with Slack API
        toast.info("Slack integration coming soon!");
        break;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Success Icon and Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <svg
            width="60"
            height="60"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10"
          >
            <circle cx="50" cy="50" r="50" fill="#10B981" />
            <path
              d="M30 50L43 63L70 36"
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Your AI Interview is Ready!
          </h1>
          <p className="text-gray-600">
            Share this link with your candidates to start the interview process
          </p>
        </div>
      </div>

      {/* Interview Link Card */}
      <Card className="border border-gray-200">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Interview Link</h3>
            <Badge
              variant="secondary"
              className="bg-blue-50 text-blue-700 border-blue-200"
            >
              Valid for 30 days
            </Badge>
          </div>

          <div className="flex items-center gap-3 pl-3 bg-gray-50 rounded-lg border">
            <div className="flex-1 font-mono text-sm text-gray-700 truncate">
              {interviewLink}
            </div>
            <Button
              onClick={handleCopyLink}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>

          {/* Interview Details */}
          <div className="flex items-center gap-8 text-sm text-gray-600 pt-2">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{questionCountDisplay}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Expires: {expiryDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Share Options */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">Share via</h3>
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="flex flex-row items-center gap-2 h-10 border-gray-200 hover:bg-gray-50"
            onClick={() => handleShareVia("email")}
          >
            <Mail className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-700">Email</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-row items-center gap-2 h-10 border-gray-200 hover:bg-gray-50"
            onClick={() => handleShareVia("slack")}
          >
            <MessageSquare className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-700">Slack</span>
          </Button>

          <Button
            variant="outline"
            className="flex flex-row items-center gap-2 h-10 border-gray-200 hover:bg-gray-50"
            onClick={() => handleShareVia("whatsapp")}
          >
            <MessageCircleCode className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-700">WhatsApp</span>
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-gray-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Link href='/dashboard/create-interview'>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Interview
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InterviewLink;
