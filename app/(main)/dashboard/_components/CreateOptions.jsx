import { Phone, Video } from "lucide-react";
import React from "react";

const CreateOptions = () => {
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="bg-white border-gray-200 rounded-lg p-5">
        <Video className="p-3 text-primary bg-blue-50 rounded-lg size-14" />
        <h2 className="font-bold ">Create New Interview</h2>
        <p className="text-gray-500">
          Create AI interviews and schedule them with candidates.
        </p>
      </div>
      <div className="bg-white border-gray-200 rounded-lg p-5">
        <Phone className="p-3 text-primary bg-blue-50 rounded-lg size-14" />
        <h2 className="font-bold ">Create Phone Screening Call</h2>
        <p className="text-gray-500">
         Schedule a phone screening call with potential candidates.
        </p>
      </div>
    </div>
  );
};

export default CreateOptions;
