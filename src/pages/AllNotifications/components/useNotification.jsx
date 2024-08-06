import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { UseContext } from "../../../State/UseState/UseContext";
import useForm16NotificationHook from "../../../hooks/QueryHook/notification/Form16Notification/useForm16NotificationHook";
import useMissedPunchNotificationCount from "../../../hooks/QueryHook/notification/MissedPunchNotification/MissedPunchNotification";
import usePayslipNotificationHook from "../../../hooks/QueryHook/notification/PayslipNotification/usePayslipNotificaitonHook";
import useAdvanceSalaryData from "../../../hooks/QueryHook/notification/advance-salary-notification/useAdvanceSalary";
import useDocNotification from "../../../hooks/QueryHook/notification/document-notification/hook";
import useJobPositionNotification from "../../../hooks/QueryHook/notification/job-position-notification/useJobPositionNotification";
import useLeaveNotificationHook from "../../../hooks/QueryHook/notification/leave-notification/hook";
import useLoanNotification from "../../../hooks/QueryHook/notification/loan-notification/useLoanNotificaiton";
import usePunchNotification from "../../../hooks/QueryHook/notification/punch-notification/hook";
import useShiftNotification from "../../../hooks/QueryHook/notification/shift-notificatoin/hook";
import useTDSNotificationHook from "../../../hooks/QueryHook/notification/tds-notification/hook";
import UserProfile from "../../../hooks/UserData/useUser";
import useLeaveNotification from "../../SelfLeaveNotification/useLeaveNotification";
import useDepartmentNotification from "../../../hooks/QueryHook/notification/department-notification/hook";
import useGeoFencingNotification from "../../../hooks/QueryHook/notification/geo-fencing-notification/hook";

const useNotification = () => {
  const { data } = useLeaveNotificationHook();
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const { data: selfLeaveNotification } = useLeaveNotification();
  const { data: shiftNotification } = useShiftNotification();
  const [emp, setEmp] = useState();
  const { data: data3 } = usePunchNotification();
  const {data:geoFencing}=useGeoFencingNotification();
  const { data: data4 } = useDocNotification();
  const { data: tds } = useTDSNotificationHook();
  const { missPunchData, getMissedPunchData } =
    useMissedPunchNotificationCount();
  const { Form16Notification } = useForm16NotificationHook();
  const {
    getEmployeeRequestLoanApplication,
    getApprovedRejectLoanDataByApprover,
  } = useLoanNotification();
  const { getJobPositionToMgr, getNotificationToEmp } =
    useJobPositionNotification();
  const { PayslipNotification } = usePayslipNotificationHook();
  const { getAdvanceSalaryData, advanceSalaryNotification } =
    useAdvanceSalaryData();
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const { getDepartmnetData, getDeptNotificationToEmp } =
    useDepartmentNotification();

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
  let loanNotificationCount;
  if (
    role === "HR" ||
    role === "Super-Admin" ||
    role === "Delegate-Super-Admin"
  ) {
    loanNotificationCount = getEmployeeRequestLoanApplication?.length ?? 0;
  } else {
    loanNotificationCount = getApprovedRejectLoanDataByApprover?.length ?? 0;
  }

  // for advance salary notification count
  let advanceSalaryNotifyCount;
  if (
    role === "HR" ||
    role === "Super-Admin" ||
    role === "Delegate-Super-Admin"
  ) {
    advanceSalaryNotifyCount = getAdvanceSalaryData?.length ?? 0;
  } else {
    advanceSalaryNotifyCount = advanceSalaryNotification?.length ?? 0;
  }

  // for missed punch notification count
  let missedPunchNotificationCount;
  if (
    role === "HR" ||
    role === "Super-Admin" ||
    role === "Delegate-Super-Admin" ||
    role === "Manager"
  ) {
    missedPunchNotificationCount = missPunchData?.length ?? 0;
  } else {
    missedPunchNotificationCount = getMissedPunchData?.length ?? 0;
  }

  // for form 16 notification count
  let form16NotificationCount;
  if (role === "Employee") {
    form16NotificationCount = Form16Notification?.length ?? 0;
  } else {
    form16NotificationCount = 0;
  }

  // for payslip notification count
  let payslipNotificationCount;
  if (role === "Employee") {
    payslipNotificationCount = PayslipNotification?.length ?? 0;
  } else {
    payslipNotificationCount = 0;
  }

  // for view job position count
  let jobPositionCount;
  if (role === "Employee") {
    jobPositionCount = getNotificationToEmp?.length ?? 0;
  } else {
    jobPositionCount = getJobPositionToMgr?.length ?? 0;
  }

  // department notification count
  console.log("role", role);
  let departmentNotificationCount;

  if (role === "Employee") {
    departmentNotificationCount = getDeptNotificationToEmp?.length ?? 0;
  } else if (
    role === "HR" ||
    role === "Super-Admin" ||
    role === "Delegate-Super-Admin"
  ) {
    departmentNotificationCount = getDepartmnetData?.length ?? 0;
  } else {
    departmentNotificationCount = 0;
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
      count: shiftNotification?.length ?? 0,
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
      url2: "/self/emp-main-notification",
      visible: emp?.packageInfo === "Intermediate Plan",
    },
    // {
    //   name: "Geo Fencing Notification",
    //   count: geoFencing?.punchNotification?.length ?? 0,
    //   color: "#51FD96",
    //   url: "/geo-notification",
    //   url2: "/self/emp-main-notification",
    //   visible: emp?.packageInfo === "Intermediate Plan",
    // },
    {
      name: "Document Approval Notification",
      count: data4?.data?.doc.length ?? 0,
      color: "#FF7373",
      url: "/doc-notification",
      visible: emp?.packageInfo === "Intermediate Plan",
    },
    {
      name: "Loan Notification",
      count: loanNotificationCount,
      color: "#51E8FD",
      url: "/loan-notification",
      url2: "/loan-notification-to-emp",
      visible: true,
    },
    {
      name: "Advance Salary Notification",
      count: advanceSalaryNotifyCount ?? 0,
      color: "#FF7373",
      url: "/advance-salary-notification",
      url2: "/advance-salary-notification-to-emp",
      visible: true,
    },
    {
      name: "Missed Punch Notification",
      count: missedPunchNotificationCount ?? 0,
      color: "#51E8FD",
      url: "/missedPunch-notification",
      url2: "/missed-punch-notification-to-emp",
      visible: true,
    },
    {
      name: "Payslip Notification",
      count: payslipNotificationCount,
      color: "#51E8FD",
      url2: "/payslip-notification-to-emp",
      visible: true,
    },
    {
      name: "Form-16 Notification",
      count: form16NotificationCount,
      color: "#FF7373",
      url2: "/form16-notification-to-emp",
      visible: true,
    },

    {
      name: "TDS Notification",
      count: Number(tds) ?? 0,
      color: "#51E8FD",
      url: tdsRoute,
      url2: "/notification/income-tax-details",
      visible: true,
    },
    {
      name: "Job Position Notification",
      count: jobPositionCount,
      color: "#51E8FD",
      url: "/job-position-to-mgr",
      url2: "/job-position-to-emp",
      visible: true,
    },
    {
      name: "Add Department Request",
      count: departmentNotificationCount,
      color: "#51E8FD",
      url: "/department-notification-approval",
      url2: "/department-notification-to-emp",
      visible: true,
    },
  ];
  return { dummyData };
};

export default useNotification;
