import React from "react";
import useMissedPunchNotificationCount from "../../hooks/QueryHook/notification/MissedPunchNotification/MissedPunchNotification";
import useDocNotification from "../../hooks/QueryHook/notification/document-notification/hook";
import useLeaveNotificationHook from "../../hooks/QueryHook/notification/leave-notification/hook";
import useLoanNotification from "../../hooks/QueryHook/notification/loan-notification/useLoanNotificaiton";
import usePunchNotification from "../../hooks/QueryHook/notification/punch-notification/hook";
import useShiftNotification from "../../hooks/QueryHook/notification/shift-notificatoin/hook";
import useTDSNotificationHook from "../../hooks/QueryHook/notification/tds-notification/hook";
import UserProfile from "../../hooks/UserData/useUser";
import Card from "./components/card";

const ParentNotification = () => {
  const { data, isLoading } = useLeaveNotificationHook();
  const { data: data2 } = useShiftNotification();
  const { data: data3 } = usePunchNotification();
  const { data: tds } = useTDSNotificationHook();
  console.log(`🚀 ~ tds:`, tds);
  const { data: data4 } = useDocNotification();
  const { getEmployeeRequestLoanApplication } = useLoanNotification();
  const { missPunchData } = useMissedPunchNotificationCount();

  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const tdsRoute =
    role === "Accountant"
      ? `/notification/income-tax`
      : `/notification/income-tax-details`;
  const dummyData = [
    {
      name: "Leave Notification",
      count: data?.leaveRequests?.length ?? 0,
      color: "#FF7373",
      url: "/leave-notification",
    },
    {
      name: "Loan Notification",
      count: getEmployeeRequestLoanApplication?.length ?? 0,
      color: "#51E8FD",
      url: "/loan-notification",
    },
    {
      name: "Missed Punch Notification",
      count: missPunchData?.length ?? 0,
      color: "#51E8FD",
      url: "/missedPunch-notification",
    },
    {
      name: "Shift Notification",
      count: data2?.length ?? 0,
      color: "#3668ff",
      url: "/shift-notification",
    },
    {
      name: "Remote Punching Notification",
      count: data3?.punchNotification?.length ?? 0,
      color: "#51FD96",
      url: "/punch-notification",
    },

    {
      name: "Document Approval Notification",
      count: data4?.data?.doc.length ?? 0,
      color: "#FF7373",
      url: "/doc-notification",
    },
    {
      name: "TDS Notification",
      count: tds ?? 0,
      color: "#51E8FD",
      url: tdsRoute,
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
