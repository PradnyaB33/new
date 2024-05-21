import React from "react";
import useMissedPunchNotificationCount from "../../hooks/QueryHook/notification/MissedPunchNotification/MissedPunchNotification";
import usePayslipNotificationHook from "../../hooks/QueryHook/notification/PayslipNotification/usePayslipNotificaitonHook";
import useDocNotification from "../../hooks/QueryHook/notification/document-notification/hook";
import useLeaveNotificationHook from "../../hooks/QueryHook/notification/leave-notification/hook";
import useLoanNotification from "../../hooks/QueryHook/notification/loan-notification/useLoanNotificaiton";
import usePunchNotification from "../../hooks/QueryHook/notification/punch-notification/hook";
import useShiftNotification from "../../hooks/QueryHook/notification/shift-notificatoin/hook";
import useTDSNotificationHook from "../../hooks/QueryHook/notification/tds-notification/hook";
import UserProfile from "../../hooks/UserData/useUser";
import Card from "./components/card";
import useForm16NotificationHook from "../../hooks/QueryHook/notification/Form16Notification/useForm16NotificationHook";

const ParentNotification = () => {
  const { data } = useLeaveNotificationHook();
  const { data: data2 } = useShiftNotification();
  const { data: data3 } = usePunchNotification();
  const { data: data4 } = useDocNotification();
  const { missPunchData } = useMissedPunchNotificationCount();
  const { data: tds } = useTDSNotificationHook();
  const { Form16Notification } = useForm16NotificationHook();
  const { getEmployeeRequestLoanApplication } = useLoanNotification();
  const { PayslipNotification } = usePayslipNotificationHook();
  console.log("form16", Form16Notification);
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();

  const tdsRoute =
    role === "Accountant" ||
    role === "Super-Admin" ||
    role === "delegate Super-Admin"
      ? `/notification/income-tax`
      : `/notification/income-tax-details`;

  const dummyData = [
    {
      name: "Leave Notification",
      count: data?.leaveRequests?.length ?? 0,
      color: "#FF7373",
      url: "/leave-notification",
      url2: "/self/leave-notification",
    },
    {
      name: "Shift Notification",
      count: data2?.length ?? 0,
      color: "#3668ff",
      url: "/shift-notification",
      url2: "/self/shift-notification",
    },
    {
      name: "Remote Punching Notification",
      count: data3?.length ?? 0,
      color: "#51FD96",
      url: "/punch-notification",
    },
    {
      name: "TDS Notification",
      count: tds ?? 0,
      color: "#51E8FD",
      url: tdsRoute,
    },
    {
      name: "Document Approval Notification",
      count: data4?.data?.doc.length ?? 0,
      color: "#FF7373",
      url: "/doc-notification",
    },
    {
      name: "Loan Notification",
      count: getEmployeeRequestLoanApplication?.length ?? 0,
      color: "#51E8FD",
      url: "/loan-notification",
      url2: "/loan-notification-to-emp",
    },
    {
      name: "Missed Punch Notification",
      count: missPunchData?.length ?? 0,
      color: "#51E8FD",
      url: "/missedPunch-notification",
      url2: "/missed-punch-notification-to-emp",
    },
    {
      name: "Payslip Notification",
      count: PayslipNotification?.length ?? 0,
      color: "#51E8FD",
      url: "/payslip-notification-to-emp",
    },
    {
      name: "Form 16 Notification",
      count: Form16Notification?.length ?? 0,
      color: "#FF7373",
      url: "/form16-notification-to-emp",
    },
  ];

  return (
    <div className="pt-5">
      <div className="w-full h-full gap-2 flex p-4 md:flex-wrap md:flex-row flex-col justify-center">
        <Card card={dummyData} />
      </div>
    </div>
  );
};

export default ParentNotification;
