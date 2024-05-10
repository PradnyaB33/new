import React from "react";
import useMissedPunchNotificationCount from "../../hooks/QueryHook/notification/MissedPunchNotification/MissedPunchNotification";
import useLeaveNotificationHook from "../../hooks/QueryHook/notification/leave-notification/hook";
import usePunchNotification from "../../hooks/QueryHook/notification/punch-notification/hook";
import useShiftNotification from "../../hooks/QueryHook/notification/shift-notificatoin/hook";
import UserProfile from "../../hooks/UserData/useUser";
import Card from "./components/card";

const ParentNotification = () => {
  const { data, isLoading } = useLeaveNotificationHook();
  const { data: data2, count } = useShiftNotification();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  console.log("shiftnoflkdjlkfjl", data2);
  const { data: data3 } = usePunchNotification();
  const { missPunchData } = useMissedPunchNotificationCount();

  let isAcc = false;
  const profileArr = user.profile;

  profileArr.forEach((element) => {
    if (element === "Accountant") {
      isAcc = true;
    }
  });
  const dummyData = [
    {
      name: "Leave Notification",
      count: data?.leaveRequests?.length ?? 0,
      color: "#FF7373",
      url: "/leave-notification",
    },
    {
      name: "Shift Notification",
      count: isAcc ? count?.length : data2?.length,
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
