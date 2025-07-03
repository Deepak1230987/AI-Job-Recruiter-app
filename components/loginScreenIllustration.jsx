import React from "react";

const LoginScreenIllustration = () => {
  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 mb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 bg-white/30 rounded-full"></div>

      {/* Main illustration elements */}
      <div className="relative z-10 text-center">
        {/* Computer monitor */}
        <div className="bg-gray-800 rounded-lg p-2 mx-auto w-32 h-20 mb-4 relative">
          <div className="bg-blue-500 w-full h-full rounded flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          {/* Monitor stand */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-gray-600"></div>
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gray-600"></div>
        </div>

        {/* Profile cards floating around */}
        <div className="absolute top-2 right-8 bg-blue-600 text-white p-2 rounded-lg text-xs transform rotate-12">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div>
              <div className="w-8 h-1 bg-white/80 rounded mb-1"></div>
              <div className="w-6 h-1 bg-white/60 rounded"></div>
            </div>
          </div>
        </div>

        <div className="absolute top-12 left-2 bg-purple-600 text-white p-2 rounded-lg text-xs transform -rotate-6">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div>
              <div className="w-8 h-1 bg-white/80 rounded mb-1"></div>
              <div className="w-6 h-1 bg-white/60 rounded"></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-lg text-xs transform rotate-6">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div>
              <div className="w-8 h-1 bg-white/80 rounded mb-1"></div>
              <div className="w-6 h-1 bg-white/60 rounded"></div>
            </div>
          </div>
        </div>

        {/* Person figure */}
        <div className="absolute bottom-0 left-8">
          <div className="w-6 h-6 bg-orange-400 rounded-full mb-1"></div>
          <div className="w-4 h-6 bg-blue-600 rounded-sm mx-auto"></div>
          <div className="flex gap-1 mt-1">
            <div className="w-1 h-4 bg-blue-600 rounded"></div>
            <div className="w-1 h-4 bg-blue-600 rounded"></div>
          </div>
        </div>

        {/* Document */}
        <div className="absolute bottom-4 left-2 bg-white p-1 rounded shadow-sm transform -rotate-12">
          <div className="w-8 h-10 border border-gray-200 rounded p-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full mb-1"></div>
            <div className="space-y-1">
              <div className="w-5 h-0.5 bg-gray-300 rounded"></div>
              <div className="w-4 h-0.5 bg-gray-300 rounded"></div>
              <div className="w-5 h-0.5 bg-gray-300 rounded"></div>
            </div>
            <div className="w-4 h-4 border-2 border-blue-500 rounded-full mt-2"></div>
          </div>
        </div>

        {/* Plant decoration */}
        <div className="absolute bottom-0 right-12">
          <div className="w-2 h-4 bg-green-500 rounded-full"></div>
          <div className="w-3 h-1 bg-green-600 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreenIllustration;
