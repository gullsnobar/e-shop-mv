import React from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardSideBar from "./DashboardSideBar";

const ShopLayout = ({ active, children }) => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <DashboardHeader />
      <div className="flex items-start w-full">
        {/* Sidebar */}
        <div className="w-[80px] 800px:w-[260px] flex-shrink-0 sticky top-[70px] h-[calc(100vh-70px)] overflow-y-auto">
          <DashboardSideBar active={active} />
        </div>
        {/* Main Content */}
        <div className="flex-1 min-w-0 p-4 800px:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ShopLayout;
