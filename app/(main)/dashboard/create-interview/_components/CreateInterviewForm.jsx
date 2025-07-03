"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Loader2 } from "lucide-react";

// Form validation schema
const formSchema = z.object({
  jobPosition: z.string().min(2, {
    message: "Job position must be at least 2 characters.",
  }),
  jobDescription: z.string().min(10, {
    message: "Job description must be at least 10 characters.",
  }),
  duration: z.string().min(1, {
    message: "Please select interview duration.",
  }),
  interviewTypes: z.array(z.string()).min(1, {
    message: "Please select at least one interview type.",
  }),
});

const CreateInterviewForm = ({ onNext }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobPosition: "",
      jobDescription: "",
      duration: "",
      interviewTypes: ["Technical"],
    },
  });

  const interviewTypes = [
    { id: "Technical", label: "Technical", icon: "💻" },
    { id: "Behavioral", label: "Behavioral", icon: "👥" },
    { id: "Experience", label: "Experience", icon: "💼" },
    { id: "Problem Solving", label: "Problem Solving", icon: "🧩" },
    { id: "Leadership", label: "Leadership", icon: "👑" },
  ];

  // Get current selected types from form state
  const selectedTypes = form.watch("interviewTypes") || [];

  const toggleInterviewType = (type) => {
    const currentTypes = form.getValues("interviewTypes") || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];

    form.setValue("interviewTypes", newTypes, { shouldValidate: true });
  };

  const onSubmit = async (values) => {
    setIsGenerating(true);
    console.log(values);

    try {
      // Generate questions using the AI API
      const questions = await GenerateQuestionList(values);

      // Move to next step after successful generation and pass both form data and questions
      if (onNext) {
        onNext({
          formData: values,
          questions: questions,
        });
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      // Show error notification to user
      alert(
        "Failed to generate interview questions. Please check your input and try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const GenerateQuestionList = async (formData) => {
    try {
      const result = await axios.post("/api/ai-model", {
        ...formData,
      });

      console.log("API response:", result.data);

      // Handle different response formats
      if (result.data.error) {
        throw new Error(result.data.error);
      }

      return result.data; // Return the full response for QuestionList to parse
    } catch (error) {
      console.error("Error calling AI API:", error);

      if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.error || "Server error occurred";
        throw new Error(`API Error: ${errorMessage}`);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error("Network error: Unable to reach the server");
      } else {
        // Something else happened
        throw new Error(error.message || "Unknown error occurred");
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg w-full mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Job Position */}
          <FormField
            control={form.control}
            name="jobPosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Job Position
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Senior Frontend Developer"
                    {...field}
                    className="h-12 text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Job Description */}
          <FormField
            control={form.control}
            name="jobDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Job Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter detailed job description..."
                    className="min-h-[120px] text-base resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Interview Duration */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Interview Duration
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="select duration" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="10">10 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Interview Types */}
          <FormField
            control={form.control}
            name="interviewTypes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Interview Types
                </FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-3">
                    {interviewTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => toggleInterviewType(type.id)}
                        className={`flex items-center px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          selectedTypes.includes(type.id)
                            ? "text-primary border-primary"
                            : "text-gray-600 border-gray-200 "
                        }`}
                      >
                        <span className="mr-2">{type.icon}</span>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Generating Status */}
          {isGenerating && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500 mr-3" />
                <div>
                  <p className="text-blue-700 font-medium">
                    Generating Interview Questions
                  </p>
                  <p className="text-blue-600 text-sm">
                    Our AI is crafting personalized questions based on your
                    requirements...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="ghost"
              className="text-gray-600 hover:text-gray-800 bg-gray-200 px-6 py-3 h-10"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isGenerating}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 h-10"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Questions
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateInterviewForm;
