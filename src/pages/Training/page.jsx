import React from "react";
import Header from "./components/header";
import MiniForm from "./components/mini-form";
import TrainingTable from "./training-table/page";

const HrTrainings = () => {
  return (
    <div className="pt-16 flex flex-col w-full px-8 gap-4">
      <Header />
      <MiniForm />
      <TrainingTable />
    </div>
  );
};

export default HrTrainings;
