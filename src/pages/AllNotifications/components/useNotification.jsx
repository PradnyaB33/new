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
import useTDSNotificationHook from "../../../hooks/QueryHook/notification/tds-notification/hook";
import UserProfile from "../../../hooks/UserData/useUser";
import useLeaveNotification from "../../SelfLeaveNotification/useLeaveNotification";
import useDepartmentNotification from "../../../hooks/QueryHook/notification/department-notification/hook";
import { useQuery } from "react-query";
import useAuthToken from "../../../hooks/Token/useAuth";
import useOrgGeo from "../../Geo-Fence/useOrgGeo";
import useShiftNotification from "../../../hooks/QueryHook/notification/shift-notificatoin/hook";
import UseEmployeeShiftNotification from "../../SelfShiftNotification/UseEmployeeShiftNotification";

const useNotification = () => {
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();
  const { data } = useLeaveNotificationHook();//super admin and manager side notification
  const { data: shiftNotification, accData } = useShiftNotification();//super admin and manager side notification
  console.log("shiftNotification", accData);


  const { data: employeeShiftNotification } = UseEmployeeShiftNotification();//employee side notification
  const { data: selfLeaveNotification } = useLeaveNotification();
  const [emp, setEmp] = useState();
  const { data: data3 } = usePunchNotification();
  const authToken = useAuthToken();
  console.log("selfLeaveNotification", selfLeaveNotification);

  //states
  const [shiftCount, setShiftCount] = useState(0);
  const [employeeShiftCount, setEmployeeShiftCount] = useState(0);
  const [leaveCount, setLeaveCount] = useState(0);
  const [employeeLeaveCount, setEmployeeLeaveCount] = useState(0);
  const [shiftAccCount, setShiftAccCount] = useState(0);
  console.log("employeeLeaveCount", employeeLeaveCount);

  //super admin and manager side leave notification count
  useEffect(() => {
    if (data && data?.leaveRequests && data?.leaveRequests?.length > 0) {
      let total = 0;
      data?.leaveRequests.forEach(item => {
        total += item.notificationCount;
      });
      setLeaveCount(total);
    } else {
      setLeaveCount(0);
    }
  }, [data]);

  //employee side leave notification count
  useEffect(() => {
    if (selfLeaveNotification && selfLeaveNotification?.leaveRequests
      && selfLeaveNotification?.leaveRequests?.length > 0) {
      let total = 0;
      selfLeaveNotification?.leaveRequests?.forEach(item => {
        total += item.approveRejectNotificationCount;
      });
      setEmployeeLeaveCount(total);
    } else {
      setEmployeeLeaveCount(0);
    }
  }, [selfLeaveNotification]);

  const Leavecount = role === "Super-Admin" || role === "Manager"
    ? leaveCount
    : employeeLeaveCount;

  //super admin and manager side shift notification count
  useEffect(() => {
    if (shiftNotification && shiftNotification.length > 0) {
      let total = 0;
      shiftNotification.forEach(item => {
        total += item.notificationCount;
      });
      setShiftCount(total);
    } else {
      setShiftCount(0);
    }
  }, [shiftNotification]);

  //Account side shift notification count
  useEffect(() => {
    if (accData && accData.length > 0) {
      let total = 0;
      accData.forEach(item => {
        total += item.notificationAccCount;
      });
      setShiftAccCount(total);
    } else {
      setShiftAccCount(0);
    }
  }, [accData]);
  //employee side shift notification count
  useEffect(() => {
    if (employeeShiftNotification && employeeShiftNotification?.requests && employeeShiftNotification?.requests?.length > 0) {
      let total = 0;
      employeeShiftNotification?.requests.forEach(item => {
        total += item?.approveRejectNotificationCount || 0;
      });
      setEmployeeShiftCount(total);
    } else {
      setEmployeeShiftCount(0);
    }
  }, [employeeShiftNotification]);

  const count = role === "Super-Admin" || role === "Manager"
    ? shiftCount
    : role === "Accountant" ? shiftAccCount : employeeShiftCount;

  //Employee Side remote and geofencing Notification count
  const employeeId = user._id;
  const { data: EmpNotification } = useQuery({
    queryKey: ["EmpDataPunchNotification", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/punch/get-notification/${employeeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: employeeId !== undefined,
  });

  // Calculate total notificationCount for geoFencingArea false
  const punchNotifications = data3?.punchNotification || [];
  const totalFalseNotificationsCount = punchNotifications
    .filter((item) => item.geoFencingArea === false)
    .reduce((total, item) =>
      total + (item.punchData?.reduce((sum, punch) => sum + punch.notificationCount, 0) || 0),
      0);

  const totalTrueNotificationsCount = punchNotifications
    .filter((item) => item.geoFencingArea === true)
    .reduce((total, item) =>
      total + (item.punchData?.reduce((sum, punch) => sum + punch.notificationCount, 0) || 0),
      0);

  // remote punch notification count
  let remotePunchingCount;
  if (role === "Employee") {
    // Check if geoFencingArea is true and then assign the approveRejectNotificationCount
    const punchData = EmpNotification?.punchData?.[0];
    console.log("punchData", punchData);

    if (punchData?.geoFencingArea === false) {
      remotePunchingCount = punchData.approveRejectNotificationCount;
    } else {
      remotePunchingCount = 0; // Set to 0 if geoFencingArea is not true
    }
  } else {
    remotePunchingCount = totalFalseNotificationsCount;
  }

  let geoFencingCount;
  if (role === "Employee") {
    // Check if geoFencingArea is true and then assign the approveRejectNotificationCount
    const punchData = EmpNotification?.punchData?.[0];
    console.log("punchData", punchData);

    if (punchData?.geoFencingArea === true) {
      geoFencingCount = punchData.approveRejectNotificationCount;
    } else {
      geoFencingCount = 0; // Set to 0 if geoFencingArea is not true
    }
  } else {
    geoFencingCount = totalTrueNotificationsCount;
  }

  //selected employee list for geofencing
  const { data: geofencingData } = useOrgGeo(user?.organizationId);

  //match currect user and selcted employee in list
  const isUserMatchInEmployeeList = geofencingData?.area?.some(area =>
    area.employee.includes(employeeId)
  );

  //
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
      count: Leavecount,
      color: "#FF7373",
      url: "/leave-notification",
      url2: "/self/leave-notification",
      visible: true,
    },

    {
      name: "Shift Notification",
      count: count,
      color: "#3668ff",
      url: "/shift-notification",
      url2: "/self/shift-notification",
      visible: true,
    },

    ...(role === "Super-Admin" || role === "Manager"
      ? [
        {
          name: "Remote Punching Notification",
          count: remotePunchingCount,
          color: "#51FD96",
          url: "/punch-notification",
          url2: "/remote-punching-notification",
          visible: emp?.packageInfo === "Intermediate Plan",
        },
        {
          name: "Geo Fencing Notification",
          count: geoFencingCount,
          color: "#51FD96",
          url: "/geo-fencing-notification",
          url2: "/geofencing-notification",
          visible: emp?.packageInfo === "Intermediate Plan",
        },
      ]
      : // For Employees, conditionally show either Remote Punching or Geo Fencing based on `isUserMatchInEmployeeList`
      [
        isUserMatchInEmployeeList
          ? {
            name: "Geo Fencing Notification",
            count: geoFencingCount,
            color: "#51FD96",
            url: "/geo-fencing-notification",
            url2: "/geofencing-notification",
            visible: emp?.packageInfo === "Intermediate Plan",
          }
          : {
            name: "Remote Punching Notification",
            count: remotePunchingCount,
            color: "#51FD96",
            url: "/punch-notification",
            url2: "/remote-punching-notification",
            visible: emp?.packageInfo === "Intermediate Plan",
          },
      ]),
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
      // count: Number(tds) ?? 0,
      count: typeof tds === "number" ? tds : 0,
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
