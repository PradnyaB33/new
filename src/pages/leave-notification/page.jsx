import React from "react";
import useLeaveNotificationHook from "../../hooks/QueryHook/notification/leave-notification/hook";
import LeaveAcceptModal from "./LeaveAcceptModal";

const LeaveNotification = () => {
  const { data } = useLeaveNotificationHook();
  console.log("leave data", data);
  return (
    <div className="flex flex-col">
      {/* {data?.leaveRequests?.map((items, idx) => (
        <LeaveRejectmodal
          key={idx}
          items={items}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      ))} */}
      <LeaveAcceptModal data={data} />
    </div>
  );
};

export default LeaveNotification;
