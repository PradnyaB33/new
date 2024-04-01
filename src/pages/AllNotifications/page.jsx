import React from "react";
import useLeaveNotificationHook from "../../hooks/QueryHook/notification/leave-notification/hook";
import usePunchNotification from "../../hooks/QueryHook/notification/punch-notification/hook";
import useShiftNotification from "../../hooks/QueryHook/notification/shift-notificatoin/hook";
import Card from "./components/card";

const ParentNotification = () => {
  const { data, isLoading } = useLeaveNotificationHook();
  const { data: data2 } = useShiftNotification();
  const { data: data3 } = usePunchNotification();
  console.log(`🚀 ~ file: page.jsx:11 ~ data:`, data);

  const dummyData = [
    {
      name: "Leave Notification",
      count: data?.length,
      color: "#FF7373",
      url: "/leave-notification",
    },
    {
      name: "Shift Notification",
      count: data2?.length,
      color: "#3668ff",
      url: "/shift-notification",
    },
    {
      name: "Remote Punching Notification",
      count: data3?.length,
      color: "#51FD96",
      url: "/punch-notification",
    },
    {
      name: "Department Notification",
      count: 2,
      color: "#51E8FD",
      url: "/department-notification",
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
