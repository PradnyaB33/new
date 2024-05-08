import React from "react";
import LeaveRejectmodal from "../../components/Modal/LeaveModal/LeaveRejectmodal";
import useLeaveNotificationHook from "../../hooks/QueryHook/notification/leave-notification/hook";

const LeaveNotification = () => {
  const { data, isLoading, isFetching } = useLeaveNotificationHook();
  return (
    <div className="pt-12 flex flex-col">
      {data?.leaveRequests?.map((items, idx) => (
        <LeaveRejectmodal
          key={idx}
          items={items}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};

export default LeaveNotification;
