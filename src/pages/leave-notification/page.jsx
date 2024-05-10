import React from "react";
import useLeaveNotificationHook from "../../hooks/QueryHook/notification/leave-notification/hook";
import LeaveAcceptModal from "./LeaveAcceptModal";

const LeaveNotification = () => {
  const { data } = useLeaveNotificationHook();
  console.log("leave data", data);
  return (
    <div className="flex flex-col">
      <LeaveAcceptModal data={data} />
    </div>
  );
};

export default LeaveNotification;
