import { Notifications } from "@mui/icons-material";
import { Badge } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
import useGetUser from "../../../hooks/Token/useUser";
import UserProfile from "../../../hooks/UserData/useUser";
import useLeaveNotification from "../../../pages/SelfLeaveNotification/useLeaveNotification";

const NotificationIcon = () => {
  const [orgId, setOrgId] = useState(null);
  const { decodedToken: decoded } = useGetUser();
  const location = useLocation();
  const { data } = useLeaveNotificationHook();
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const { data: selfLeaveNotification } = useLeaveNotification();
  const { data: data2 } = useShiftNotification();
  const [emp, setEmp] = useState();
  const { data: data3 } = usePunchNotification();
  const { data: data4 } = useDocNotification();
  const { data: tds } = useTDSNotificationHook();
  const { missPunchData } = useMissedPunchNotificationCount();
  const { Form16Notification } = useForm16NotificationHook();
  const {
    getEmployeeRequestLoanApplication,
    getApprovedRejectLoanDataByApprover,
  } = useLoanNotification();
  const { PayslipNotification } = usePayslipNotificationHook();
  const { getAdvanceSalaryData, advanceSalaryNotification } =
    useAdvanceSalaryData();
  const { useGetCurrentRole, getCurrentUser } = UserProfile();
  const user = getCurrentUser();
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
  useEffect(() => {
    if ((role === "Super-Admin", "Delegate-Super-Admin")) {
      getOrganizationIdFromPathname(location.pathname);
    } else {
      setOrgId(user?.organizationId);
    }
    // eslint-disable-next-line
  }, [location.pathname, orgId]);
  const getOrganizationIdFromPathname = (pathname) => {
    const parts = pathname.split("/");
    const orgIndex = parts.indexOf("organisation");
    let orgId;

    if (orgIndex !== -1 && parts.length > orgIndex + 1) {
      if (parts[orgIndex + 1] === null || undefined) {
        orgId = decoded?.user?.organizationId;
      } else {
        orgId = parts[orgIndex + 1];
      }
    } else {
      orgId = decoded?.user?.organizationId;
    }
    setOrgId(orgId);
  };

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
      count: data2?.length ?? 0,
      color: "#3668ff",
      url: "/shift-notification",
      url2: "/self/shift-notification",
      visible: true,
    },
    {
      name: "Remote Punching Notification",
      count: data3?.length ?? 0,
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
      count:
        getEmployeeRequestLoanApplication?.length ??
        getApprovedRejectLoanDataByApprover?.length ??
        0,
      color: "#51E8FD",
      url: "/loan-notification",
      url2: "/loan-notification-to-emp",
      visible: true,
    },
    {
      name: "Missed Punch Notification",
      count: missPunchData?.length ?? 0,
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
      name: "Form 16 Notification",
      count: Form16Notification?.length ?? 0,
      color: "#FF7373",
      url2: "/form16-notification-to-emp",
      visible: true,
    },
    {
      name: "Advance Salary Notification",
      count:
        getAdvanceSalaryData?.length ?? advanceSalaryNotification?.length ?? 0,
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
  const totalCount = dummyData.reduce((acc, item) => acc + item.count, 0);
  return (
    <Link to={`/organisation/${orgId}/notification`}>
      <Badge
        variant={"standard"}
        color={"error"}
        badgeContent={totalCount ?? 0}
      >
        <Notifications className="text-white" />
      </Badge>
    </Link>
  );
};

export default NotificationIcon;
