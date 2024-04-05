import React from "react";
import Header from "./components/header";
import MiniForm from "./components/mini-form";

const HrTrainings = () => {
  return (
    <div className="pt-16 flex flex-col w-full px-8 gap-8">
      <Header />
      <div>
        <MiniForm />
      </div>
      <div>div1</div>
    </div>
  );
};

export default HrTrainings;
