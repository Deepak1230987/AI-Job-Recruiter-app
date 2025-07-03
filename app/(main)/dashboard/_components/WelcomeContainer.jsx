"use client";

import { useUser } from "@/app/provider";
import Image from "next/image";
import React from "react";

const WelcomeContainer = () => {
  const { user } = useUser();

  return (
    <div className="bg-white p-4 rounded-lg flex justify-between items-center">
      <div className="">
        <h2 className="text-lg font-bold">Welcome, {user?.name}</h2>
        <h2 className="text-gray-500">
          AI-driven Interviews, Hassle-free hiring
        </h2>
      </div>

     <div className="flex items-center bg-[#5DE2E7] p-1 rounded-full">
         {user?.picture ? (
        <Image
          src={user.picture}
          alt={user?.name || "User"}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="size-11 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </span>
        </div>
      )}
     </div>
    </div>
  );
};

export default WelcomeContainer;
