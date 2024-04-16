import React from "react";
import Card from "../components/Card";

const PerformanceDashboard = () => {
  return (
    <div>
      <div className="flex items-center justify-between ">
        <div className="w-full p-4  ">
          <h1 className="text-2xl ">Performance Dashboard</h1>
          <p>Manage and organize goals setting</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Card title={"Total Goals"} data={"10 / 13 completed"} />
        <Card title={"In Due"} data={10} />
        <Card title={"Current Stage"} data={"Stage 1"} />
        <Card title={"Timeline"} data={"23"} />
      </div>
    </div>
  );
};

export default PerformanceDashboard;
