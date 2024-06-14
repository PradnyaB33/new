import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { UseContext } from "../../../State/UseState/UseContext";
import useForm16NotificationHook from "../../../hooks/QueryHook/notification/Form16Notification/useForm16NotificationHook";
import useMissedPunchNotificationCount from "../../../hooks/QueryHook/notification/MissedPunchNotification/MissedPunchNotification";
import usePayslipNotificationHook from "../../../hooks/QueryHook/notification/PayslipNotification/usePayslipNotificaitonHook";
import useAdvanceSalaryData from "../../../hooks/QueryHook/notification/advance-salary-notification/useAdvanceSalary";
import useDocNotification from "../../../hooks/QueryHook/notification/document-notification/hook";
import useLeaveNotificationHook from "../../../hooks/QueryHook/notification/leave-notification/hook";
import useLoanNotification from "../../../hooks/QueryHook/notification/loan-notification/useLoanNotificaiton";
import usePunchNotification from "../../../hooks/QueryHook/notification/punch-notification/hook";
import useShiftNotification from "../../../hooks/QueryHook/notification/shift-notificatoin/hook";
import useTDSNotificationHook from "../../../hooks/QueryHook/notification/tds-notification/hook";
import UserProfile from "../../../hooks/UserData/useUser";
import useLeaveNotification from "../../SelfLeaveNotification/useLeaveNotification";

const useNotification = () => {
  const { data } = useLeaveNotificationHook();
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const { data: selfLeaveNotification } = useLeaveNotification();
  const { notificationCount } = useShiftNotification();
  const [emp, setEmp] = useState();
  const { data: data3 } = usePunchNotification();
  const { data: data4 } = useDocNotification();
  const { data: tds } = useTDSNotificationHook();
  const { missPunchData, getMissedPunchData } =
    useMissedPunchNotificationCount();
  const { Form16Notification } = useForm16NotificationHook();
  const {
    getEmployeeRequestLoanApplication,
    getApprovedRejectLoanDataByApprover,
  } = useLoanNotification();
  const { PayslipNotification } = usePayslipNotificationHook();
  const { getAdvanceSalaryData, advanceSalaryNotification } =
    useAdvanceSalaryData();
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const tdsRoute = useMemo(() => {
    if (
      role === "Accountant" ||
      role === "Super-Admin" ||
      role === "Delegate-Super-Admin"
    ) {
      return "/notification/income-tax";
    }
    return "/";
  }, [role]);

  // for loan notification count
  let count;
  if (
    role === "HR" ||
    role === "Super-Admin" ||
    role === "Delegate-Super-Admin"
  ) {
    count = getEmployeeRequestLoanApplication?.length ?? 0;
  } else {
    count = getApprovedRejectLoanDataByApprover?.length ?? 0;
  }

  // for advance salary notification count
  let count1;
  if (
    role === "HR" ||
    role === "Super-Admin" ||
    role === "Delegate-Super-Admin"
  ) {
    count1 = getAdvanceSalaryData?.length ?? 0;
    console.log(`🚀 ~ file: page.jsx:73 ~ count1:`, count1);
  } else {
    count1 = advanceSalaryNotification?.length ?? 0;
    console.log(`🚀 ~ file: page.jsx:76 ~ count1:`, count1);
  }

  // for missed punch notification count
  let count2;
  if (
    role === "HR" ||
    role === "Super-Admin" ||
    role === "Delegate-Super-Admin" ||
    role === "Manager"
  ) {
    count1 = missPunchData?.length ?? 0;
  } else {
    count1 = getMissedPunchData?.length ?? 0;
  }

  useEffect(() => {
    (async () => {
      if (user?._id) {
        const resp = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get/profile/${user?._id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setEmp(resp.data.employee.organizationId);
      }
    })();
    // eslint-disable-next-line
  }, []);
  const dummyData = [
    {
      name: "Leave Notification",
      count:
        data?.leaveRequests?.length ??
        selfLeaveNotification?.leaveRequests?.length ??
        0,
      color: "#FF7373",
      url: "/leave-notification",
      url2: "/self/leave-notification",
      visible: true,
    },

    {
      name: "Shift Notification",
      count: notificationCount,
      color: "#3668ff",
      url: "/shift-notification",
      url2: "/self/shift-notification",
      visible: true,
    },
    {
      name: "Remote Punching Notification",
      count: data3?.punchNotification?.length ?? 0,
      color: "#51FD96",
      url: "/punch-notification",
      visible: emp?.packageInfo === "Intermediate Plan",
    },

    {
      name: "Document Approval Notification",
      count: data4?.data?.doc.length ?? 0,
      color: "#FF7373",
      url: "/doc-notification",
      visible: emp?.packageInfo === "Intermediate Plan",
    },
    {
      name: "Loan Notification",
      count: count,
      color: "#51E8FD",
      url: "/loan-notification",
      url2: "/loan-notification-to-emp",
      visible: true,
    },
    {
      name: "Missed Punch Notification",
      count: count2 ?? 0,
      color: "#51E8FD",
      url: "/missedPunch-notification",
      url2: "/missed-punch-notification-to-emp",
      visible: true,
    },
    {
      name: "Payslip Notification",
      count: PayslipNotification?.length ?? 0,
      color: "#51E8FD",
      url2: "/payslip-notification-to-emp",
      visible: true,
    },
    {
      name: "Form-16 Notification",
      count: Form16Notification?.length ?? 0,
      color: "#FF7373",
      url2: "/form16-notification-to-emp",
      visible: true,
    },
    {
      name: "Advance Salary Notification",
      count: count1 ?? 0,
      color: "#FF7373",
      url: "/advance-salary-notification",
      url2: "/advance-salary-notification-to-emp",
      visible: true,
    },
    {
      name: "TDS Notification",
      count: tds ?? 0,
      color: "#51E8FD",
      url: tdsRoute,
      url2: "/notification/income-tax-details",
      visible: true,
    },
  ];
  console.log(`🚀 ~ file: useNotification.jsx:190 ~ dummyData:`, dummyData);
  return { dummyData };
};

export default useNotification;
