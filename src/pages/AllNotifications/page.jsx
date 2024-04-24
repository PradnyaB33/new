import React from "react";
import useMissedPunchNotificationCount from "../../hooks/QueryHook/notification/MissedPunchNotification/MissedPunchNotification";
import useDocNotification from "../../hooks/QueryHook/notification/document-notification/hook";
import useLeaveNotificationHook from "../../hooks/QueryHook/notification/leave-notification/hook";
import usePunchNotification from "../../hooks/QueryHook/notification/punch-notification/hook";
import useShiftNotification from "../../hooks/QueryHook/notification/shift-notificatoin/hook";
import Card from "./components/card";

const ParentNotification = () => {
  const { data, isLoading } = useLeaveNotificationHook();
  const { data: data2 } = useShiftNotification();
  const { data: data3 } = usePunchNotification();
  const { data: data4 } = useDocNotification();
  const { missPunchData } = useMissedPunchNotificationCount();
  console.log(missPunchData);
  console.log("mydata", data4);

  const dummyData = [
    {
      name: "Leave Notification",
      count: data?.leaveRequests?.length ?? 0,
      color: "#FF7373",
      url: "/leave-notification",
    },
    {
      name: "Shift Notification",
      count: data2?.length ?? 0,
      color: "#3668ff",
      url: "/shift-notification",
    },
    {
      name: "Remote Punching Notification",
      count: data3?.length ?? 0,
      color: "#51FD96",
      url: "/punch-notification",
    },
    {
      name: "Missed Punch Notification",
      count: missPunchData?.length ?? 0,
      color: "#51E8FD",
      url: "/missedPunch-notification",
    },
    {
      name: "Document Approval Notification",
      count: data4?.data?.doc.length ?? 0,
      color: "#FF7373",
      url: "/doc-notification",
    },
  ];

  return (
    <div className="pt-5">
      <div className="w-full h-full gap-2 flex p-4 md:flex-wrap md:flex-row flex-col justify-center">
        <Card card={dummyData} loading={isLoading} />
      </div>
    </div>
  );
};

export default ParentNotification;
