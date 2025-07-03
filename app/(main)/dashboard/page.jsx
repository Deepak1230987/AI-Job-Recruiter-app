import React from "react";
import WelcomeContainer from "./_components/WelcomeContainer";
import CreateOptions from "./_components/CreateOptions";
import RecentInterviews from "./_components/RecentInterviews";
const Dashboard = () => {
  return (
    <div>
    
      <h2 className="my-3 font-bold text-2xl">
        Dashboard
      </h2>
      <CreateOptions />
      <RecentInterviews />
    </div>
  );
};

export default Dashboard;
