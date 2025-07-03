"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const RecentInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const router = useRouter();

  return (
    <div className="my-5">
      <h2 className="font-bold text-xl mb-5 ">Recent Interviews</h2>

      {interviews?.length == 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
          {/* Empty State Illustration */}
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="size-10 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>

            {/* Decorative elements */}
            <div className="flex justify-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>

          {/* Empty State Content */}
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No interviews yet
            </h3>
            <p className="text-gray-600 mb-3 leading-relaxed">
              Start your AI-powered recruitment journey! Create your first
              interview to discover top talent with intelligent screening.
            </p>
          </div>
          <Button onClick={()=>router.push('/dashboard/create-interview')}>
            <Plus className="mr-2 w-full" />
            Create New Interview
          </Button>
        </div>
      ) : (
        <div>
          {/* Future: Interview list will go here */}
          <p className="text-gray-500">
            Interview list will be displayed here...
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentInterviews;
