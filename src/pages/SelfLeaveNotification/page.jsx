import React from "react";
import InputForm from "./components/input-form";

const SelfLeaveNotification = () => {
  return (
    <div className="flex w-full flex-col px-14 gap-6">
      <h1 className="w-full pt-5 text-xl font-bold">
        Attendance and Leave Notifications
      </h1>
      <div className="w-full flex justify-between">
        <InputForm />
      </div>
      <div className="flex flex-col">
        <div></div>
      </div>
    </div>
  );
};

export default SelfLeaveNotification;
