import React from "react";
import usePerformanceApi from "../../../../../hooks/Performance/usePerformanceApi";

const GoalsTab = () => {
  const { dashboardData } = usePerformanceApi();
  console.log(`🚀 ~ dashboardData:`, dashboardData);
  return <div>hey there this are goals</div>;
};

export default GoalsTab;
