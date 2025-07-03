"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edit3,  Plus, Loader2, Check, X, ArrowRight } from "lucide-react";
import { colors } from "@/constants/typeInterview";
import { supabase } from "@/services/supabaseClient";
import { useUser } from "@/app/provider";
import { v4 as uuidv4 } from "uuid";

const QuestionList = ({
  questions,
  formData,
  onRegenerateQuestions,
  onCreateLink,
}) => {
  const [questionList, setQuestionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const { user } = useUser();

  const [saveLoading, setSaveLoading] = useState(false);

  console.log("form data in questionlist", formData);
  useEffect(() => {
    const parseQuestions = () => {
      try {
        setLoading(true);
        setError(null);

        let content = questions.content;

        // Extract JSON from markdown code blocks if present
        const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
          content = jsonMatch[1];
        }

        // Try to parse as JSON
        const parsed = JSON.parse(content);

        // Handle different possible response formats
        let finalQuestions = [];
        if (
          parsed.interviewQuestions &&
          Array.isArray(parsed.interviewQuestions)
        ) {
          finalQuestions = parsed.interviewQuestions;
        } else if (Array.isArray(parsed)) {
          finalQuestions = parsed;
        } else {
          throw new Error("Unexpected response format");
        }

        setQuestionList(finalQuestions);
        console.log("Parsed questions:", finalQuestions);
      } catch (err) {
        console.error("Error parsing questions:", err);
        setError("Failed to parse interview questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (questions && questions.content) {
      parseQuestions();
    }
  }, [questions]);

  const getTypeColor = (type) => {
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const handleEditQuestion = (index) => {
    setEditingIndex(index);
    setEditText(questionList[index].question);
  };

  const handleSaveEdit = (index) => {
    const updatedQuestions = [...questionList];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      question: editText.trim(),
    };
    setQuestionList(updatedQuestions);
    setEditingIndex(null);
    setEditText("");

    toast.success("Question updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
  };

  const handleGenerateMoreQuestions = async () => {
    if (!formData || !onRegenerateQuestions) {
      toast.error("Unable to generate more questions. Please try again.");
      return;
    }

    setIsGeneratingMore(true);
    try {
      const response = await onRegenerateQuestions(formData);
      if (response?.content) {
        // Parse the new questions
        let content = response.content;

        const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
          content = jsonMatch[1];
        }

        const parsed = JSON.parse(content);
        let newQuestions = [];

        if (
          parsed.interviewQuestions &&
          Array.isArray(parsed.interviewQuestions)
        ) {
          newQuestions = parsed.interviewQuestions;
        } else if (Array.isArray(parsed)) {
          newQuestions = parsed;
        }

        // Add new questions to existing ones
        setQuestionList((prev) => [...prev, ...newQuestions]);

        toast.success(
          `${newQuestions.length} additional questions have been added.`
        );
      }
    } catch (error) {
      console.error("Error generating more questions:", error);
      toast.error("Failed to generate more questions. Please try again.");
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      // Save to localStorage for now (can be enhanced with Supabase later)
      const draftData = {
        formData,
        questions: questionList,
        timestamp: new Date().toISOString(),
        id: `draft_${Date.now()}`,
      };

      // Get existing drafts
      const existingDrafts = JSON.parse(
        localStorage.getItem("interviewDrafts") || "[]"
      );

      // Add new draft
      existingDrafts.push(draftData);

      // Keep only last 10 drafts
      if (existingDrafts.length > 10) {
        existingDrafts.splice(0, existingDrafts.length - 10);
      }

      localStorage.setItem("interviewDrafts", JSON.stringify(existingDrafts));

      toast.success("Your interview draft has been saved successfully.");
    } catch (error) {
      console.error("Error saving draft:", error);
      toast.error("Failed to save draft. Please try again.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  const finishCreatingInterview = async () => {
    setSaveLoading(true);
    try {
      const interview_id = uuidv4();
      const { data, error } = await supabase
        .from("interviews")
        .insert([
          {
            ...formData,
            questionList: questionList,
            user_email: user?.email,
            interview_id: interview_id,
          },
        ])
        .select();
      console.log("Interview created:", data);
      setSaveLoading(false);
      onCreateLink(interview_id, questionList);
    } catch (error) {
      console.error("Error creating interview:", error);
      setSaveLoading(false);
      toast.error("Failed to create interview. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            Processing interview questions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Generated Interview Questions
          </h3>
          <p className="text-gray-600">
            Review and customize your interview questions
          </p>
        </div>
        <Badge variant="secondary" className="ml-2">
          {questionList.length} Questions
        </Badge>
      </div>

      <div className="space-y-4">
        {questionList.map((question, index) => (
          <Card
            key={index}
            className="border hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-1">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </span>
                  <Badge className={getTypeColor(question.type)}>
                    {question.type}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {editingIndex === index ? (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveEdit(index)}
                        disabled={!editText.trim()}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditQuestion(index)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {editingIndex === index ? (
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="min-h-[100px] resize-none"
                  placeholder="Edit your question..."
                  autoFocus
                />
              ) : (
                <p className="text-gray-900 leading-relaxed ">
                  {question.question}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={handleGenerateMoreQuestions}
          disabled={isGeneratingMore || !formData}
        >
          {isGeneratingMore ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Generate More Questions
            </>
          )}
        </Button>
        <div className="space-x-3">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
          >
            {isSavingDraft ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save as Draft"
            )}
          </Button>

          <Button
            type="submit"
            disabled={saveLoading}
            onClick={finishCreatingInterview}
            className="w-full mb-4"
          >
            {saveLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Interview creating...
              </>
            ) : (
              <>
                Create Interview
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
