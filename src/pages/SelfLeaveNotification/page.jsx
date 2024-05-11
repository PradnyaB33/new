import React from "react";
import InputForm from "./components/input-form";

const SelfLeaveNotification = () => {
  return (
    <div className="flex w-full flex-col">
      <h1 className="w-full px-14 pt-4 text-xl font-bold">
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
