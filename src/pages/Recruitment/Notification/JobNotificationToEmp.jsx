import React from "react";
import InputForm from "../components/InputForm";

const JobNotificationToEmp = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      <h1 className="w-full pt-5 text-xl font-bold px-14 py-3 shadow-md bg-white border-b border-gray-300">
        Job Position Notification
        <p className="text-sm font-extralight">
          Here employee's would be able to check the status of their job
          position requests
        </p>
      </h1>
      <div className="w-full flex justify-between px-14">
        <InputForm />
      </div>
    </div>
  );
};

export default JobNotificationToEmp;