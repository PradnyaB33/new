import React from "react";
import LeaveRejectmodal from "../../components/Modal/LeaveModal/LeaveRejectmodal";
import useLeaveNotificationHook from "../../hooks/QueryHook/notification/leave-notification/hook";

const LeaveNotification = () => {
  const { data } = useLeaveNotificationHook();
  return (
    <div className="">
      {data?.leaveRequests?.map((items, idx) => (
        <LeaveRejectmodal key={idx} items={items} />
      ))}
    </div>
  );
};

export default LeaveNotification;
