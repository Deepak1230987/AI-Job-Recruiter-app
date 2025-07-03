"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import CreateInterviewForm from "./_components/CreateInterviewForm";
import QuestionList from "./_components/QuestionList";
import InterviewLink from "./_components/InterviewLink";

const CreateInterview = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [finalQuestions, setFinalQuestions] = useState([]);

  const handleNext = (data) => {
    setInterviewData(data);
    setStep(2);
  };

  const onCreateLink = (interview_id, questions) => {
    setInterviewId(interview_id);
    setFinalQuestions(questions || []);
    setStep(3);
  };
  const handleRegenerateQuestions = async (formData) => {
    try {
      const response = await axios.post("/api/ai-model", formData);
      return response.data;
    } catch (error) {
      console.error("Error regenerating questions:", error);
      throw error;
    }
  };

  return (
    <div className="mt-10 px-10 md:px-24 lg:px-44 xl:px-56">
      <div className="flex gap-5 items-center">
        <ArrowLeft onClick={() => router.back()} />
        <h2 className="font-bold text-xl">Create New Interview</h2>
      </div>
      <Progress value={step * 33.33} className="my-5" />
      {step == 1 ? (
        <CreateInterviewForm onNext={handleNext} />
      ) : step == 2 ? (
        <QuestionList
          questions={interviewData?.questions}
          formData={interviewData?.formData}
          onRegenerateQuestions={handleRegenerateQuestions}
          onCreateLink={(interview_id, questions) =>
            onCreateLink(interview_id, questions)
          }
        />
      ) : step == 3 ? (
        <InterviewLink
          formData={interviewData?.formData}
          interviewId={interviewId}
          questionCount={finalQuestions.length}
        />
      ) : null}
    </div>
  );
};

export default CreateInterview;
