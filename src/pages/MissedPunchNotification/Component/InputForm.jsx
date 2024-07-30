import React from "react";
import MissedPunchCard from "./MissedPunchCard";
import useMissedPunchNotificationCount from "../../../hooks/QueryHook/notification/MissedPunchNotification/MissedPunchNotification";

const InputForm = () => {
  // to get the missed punching data of employee
  const { getMissedPunchData } = useMissedPunchNotificationCount();

  return (
    <div className="flex w-full flex-col gap-4">
      {getMissedPunchData && getMissedPunchData.length > 0 ? (
        getMissedPunchData.map((item, index) => (
          <MissedPunchCard key={index} items={item} />
        ))
      ) : (
        <h1>Sorry, no request found</h1>
      )}
    </div>
  );
};

export default InputForm;
