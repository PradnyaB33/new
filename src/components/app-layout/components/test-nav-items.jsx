import {
  Business,
  Category,
  CircleNotifications,
  CurrencyRupee,
  Dashboard,
  Description,
  Fingerprint,
  Groups,
  ListAlt,
  MonetizationOn,
  MonetizationOnOutlined,
  NotificationsActive,
  PanToolAlt,
  Payment,
  PeopleAlt,
  PersonAdd,
  PersonRemove,
  Settings,
  SupervisorAccount,
  TrendingUp,
  Work,
} from "@mui/icons-material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import ArticleIcon from "@mui/icons-material/Article";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import FolderIcon from "@mui/icons-material/Folder";
import HomeRepairServiceOutlinedIcon from "@mui/icons-material/HomeRepairServiceOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import UserProfile from "../../../hooks/UserData/useUser";
import TestAccordian from "./TestAccordian";

const TestNavItems = ({ toggleDrawer }) => {
  const [orgId, setOrgId] = useState(null);
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const location = useLocation();
  const [decodedToken, setDecodedToken] = useState("");

  // Update organization ID when URL changes
  useEffect(() => {
    // const hasEmployeeOnboarding = pathname.includes("employee-onboarding");
    getOrganizationIdFromPathname(location.pathname);
    // eslint-disable-next-line
  }, [location.pathname, orgId]);

  // Function to extract organization ID from pathname
  const getOrganizationIdFromPathname = (pathname) => {
    const parts = pathname.split("/");
    const orgIndex = parts.indexOf("organisation");
    if (orgIndex !== -1 && parts.length > orgIndex + 1) {
      setOrgId(parts[orgIndex + 1]);
    }
  };

  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const [isVisible, setisVisible] = useState(true);

  let navItems = useMemo(
    () => ({
      Home: {
        open: false,
        icon: <Category className=" !text-[1.2em] text-[#67748E]" />,
        isVisible: true,
        routes: [
          {
            key: "dashboard",
            isVisible: true,
            link:
              role === "Manager"
                ? `organisation/${orgId}/dashboard/manager-dashboard`
                : role === "HR"
                ? `/organisation/${orgId}/dashboard/HR-dashboard`
                : role === "Employee"
                ? "/organisation/dashboard/employee-dashboard"
                : "/organizationList",
            icon: <Dashboard className=" !text-[1.2em] text-[#67748E]" />,
            text: "Dashboard",
          },
        ],
      },
      "Self Help": {
        open: true,
        icon: <Category className=" !text-[1.2em] text-[#67748E]" />,
        isVisible: true,
        routes: [
          {
            key: "attendance",
            isVisible: true,
            link: "/leave",
            icon: (
              <AccessTimeOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
            ),
            text: "Attendance",
          },

          {
            key: "accountSettings",
            isVisible: true,
            link: `/employee-profile`,
            icon: <Settings className="text-[#67748E]" />,
            text: "Account Settings",
          },
          {
            key: "billing",
            isVisible: ["Super-Admin"].includes(role) ? true : false,
            link: `/billing`,
            icon: <CurrencyRupee className="text-[#67748E]" />,
            text: "Billing",
          },
          {
            key: "add-delegate-super-admin",
            isVisible: ["Super-Admin"].includes(role) ? true : false,
            link: `/add-delegate`,
            icon: <SupervisorAccount className="text-[#67748E]" />,
            text: "Add Delegate Super Admin",
          },
          {
            key: "shiftManagement",
            isVisible: ["Employee"].includes(role),
            link: "/shift-management",
            icon: (
              <HomeRepairServiceOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
            ),
            text: "Shift Management",
          },
        ],
      },
      Notification: {
        open: false,
        isVisible: true,
        icon: <NotificationsActive className=" !text-[1.2em] text-[#67748E]" />,
        routes: [
          {
            key: "listNotification",
            isVisible: true,
            link: "/notification",
            icon: (
              <CircleNotifications className=" !text-[1.2em] text-[#67748E]" />
            ),
            text: "Notifications",
          },
        ],
      },
      Payroll: {
        open: false,
        isVisible: true,
        icon: <Payment className=" !text-[1.2em] text-[#67748E]" />,
        routes: [
          {
            key: "allowance",
            isVisible: true,
            link: "/allowance",
            icon: <MonetizationOn className=" !text-[1.2em] text-[#67748E]" />,
            text: "Allowance",
          },
          {
            key: "payslip",
            isVisible: true,
            link: `/view-payslip`,
            icon: <ListAlt className=" !text-[1.2em] text-[#67748E]" />,
            text: "Pay Slip",
          },
          {
            key: "IncomeTax",
            isVisible: true,
            link: "/income-tax",
            icon: <TrendingUp className=" !text-[1.2em] text-[#67748E]" />,
            text: "Income Tax",
          },
          {
            key: "form-16",
            isVisible: true,
            link: `/organisation/${orgId}/form-16`,
            icon: <Description className=" !text-[1.2em] text-[#67748E]" />,
            text: "Form-16",
          },
          {
            key: "shiftAllowance",
            isVisible:
              isVisible &&
              ["Super-Admin", "HR", "Manager", "Delegate-Super Admin"].includes(
                role
              ),
            link: "/shift-management",
            icon: <Work className=" !text-[1.2em] text-[#67748E]" />,
            text: "Shift Allowance",
          },
          {
            key: "createsalary",
            isVisible:
              isVisible && ["Super-Admin", "HR", "Accountant"].includes(role),
            link: `/organisation/${orgId}/salary-management`,
            icon: (
              <AccountBalanceWalletOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
            ),
            text: "Salary Management",
          },
          {
            key: "loanmanagement",
            isVisible: true,
            link: `/add-loan`,
            icon: (
              <MonetizationOnOutlined className=" !text-[1.2em] text-[#67748E]" />
            ),
            text: "Loan Management",
          },
        ],
      },
      Employee: {
        open: false,
        icon: <PeopleAlt className=" !text-[1.2em] text-[#67748E]" />,
        isVisible:
          window.location.pathname?.includes("organisation") &&
          [
            "Super-Admin",
            "HR",
            "Manager",
            "Delegate-Super Admin",
            "Department-Head",
            "Department-Admin",
          ]?.includes(role),
        routes: [
          {
            key: "onboarding",
            isVisible: ["Super-Admin", "HR", "Delegate-Super Admin"].includes(
              role
            ),
            link: `organisation/${orgId}/employee-onboarding`,
            icon: <PersonAdd className=" !text-[1.2em] text-[#67748E]" />,
            text: "Onboarding",
          },

          {
            key: "offboarding",
            isVisible: ["Super-Admin", "HR", "Delegate-Super Admin"].includes(
              role
            ),
            link: `organisation/${orgId}/employee-offboarding`,
            icon: <PersonRemove className=" !text-[1.2em] text-[#67748E]" />,
            text: "Offboarding",
          },
          {
            key: "employeeList",
            isVisible: [
              "Super-Admin",
              "HR",
              "Manager",
              "Department-Head",
              "Delegate-Super Admin",
              "Department-Admin",
            ].includes(role),
            link: `organisation/${orgId}/employee-list`,
            icon: <Groups className=" !text-[1.2em] text-[#67748E]" />,
            text: "Employee List",
          },
        ],
      },
      Department: {
        open: false,
        isVisible:
          window.location.pathname.includes("organisation") &&
          [
            "Super-Admin",
            "Delegate-Super Admin",
            "HR",
            "Department-Head",
            "Delegate-Department-Head",
            "Department-Admin",
          ].includes(role),
        // : false
        icon: <Business className=" !text-[1.2em] text-[#67748E]" />,
        routes: [
          {
            key: "addDepartment",
            isVisible: [
              "Super-Admin",
              "HR",
              "Department-Head",
              "Delegate-Department-Head",
              "Department-Admin",
            ].includes(role),
            link: `/organisation/${orgId}/add-department`,
            icon: (
              <AddCircleOutlineOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
            ),
            text: "Add Department",
          },

          {
            key: "deptDeletion",
            isVisible: [
              "Super-Admin",
              "HR",
              "Department-Head",
              "Delegate-Department-Head",
              "Department-Admin",
            ].includes(role),
            link: `/organisation/${orgId}/dept-deletion`,
            icon: (
              <DeleteForeverOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
            ),
            text: "Bulk Deletion",
          },
          {
            key: "departmentList",
            isVisible: [
              "Super-Admin",
              "HR",
              "Department-Head",
              "Delegate-Department-Head",
              "Department-Admin",
            ].includes(role),
            link: `/organisation/${orgId}/department-list`,
            icon: (
              <ListAltOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
            ),
            text: "Manage Departments",
          },
        ],
      },
      Organisation: {
        open: false,
        isVisible: ["Super-Admin"].includes(role),
        icon: <MonetizationOn className=" !text-[1.2em] text-[#67748E]" />,
        routes: [
          {
            key: "addOrganisation",
            isVisible: ["Super-Admin", "Delegate-Super Admin"].includes(role),
            link: "/add-organisation",
            icon: (
              <BusinessOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
            ),
            text: "Add Organisation",
          },

          {
            key: "organisationList",
            isVisible: ["Super-Admin", "Delegate-Super Admin"].includes(role),
            link: "/organizationList",
            icon: (
              <AccountTreeOutlinedIcon className=" !text-[1.2em] text-[#67748E]" />
            ),
            text: "Organisation List",
          },
        ],
      },
      RemotePunch: {
        open: false,
        isVisible: ["Employee", "Manager"].includes(role),
        icon: <MonetizationOn className=" !text-[1.2em] text-[#67748E]" />,
        routes: [
          {
            key: "addPunch",
            isVisible: ["Employee"].includes(role),
            link: "/employee-remote-punching",
            icon: <Fingerprint className=" !text-[1.2em] text-[#67748E]" />,
            text: "Remote Punch-in-out",
          },
          {
            key: "missPunch",
            isVisible: ["Employee"].includes(role),
            link: "/remotePunching",
            icon: <PanToolAlt className=" !text-[1.2em] text-[#67748E]" />,
            text: "Apply Miss For Punch",
          },
        ],
      },
      Records: {
        open: false,
        isVisible: true,
        icon: <MonetizationOn className=" !text-[1.2em] text-[#67748E]" />,
        routes: [
          {
            key: "empDocs",
            isVisible: true,
            link: "/emp/docs",
            icon: <ArticleIcon className=" !text-[1.2em] text-[#67748E]" />,
            text: "My Records",
          },
          {
            key: "orgDocs",
            isVisible: ["Employee"].includes(role),
            link: "/org/docs",
            icon: <FolderIcon className=" !text-[1.2em] text-[#67748E]" />,
            text: "Organization Records",
          },
          {
            key: "orgDocs",
            isVisible: ["HR", "Super-Admin"].includes(role),
            link: "/org/docs/auth",
            icon: <FolderIcon className=" !text-[1.2em] text-[#67748E]" />,
            text: "Organization Records",
          },
        ],
      },
    }),
    // eslint-disable-next-line
    [isVisible, orgId]
  );

  useEffect(() => {
    setisVisible(location.pathname.includes("/organisation"));
  }, [location, navItems]);

  useEffect(() => {
    try {
      if (token) {
        const newToken = jwtDecode(token);

        setDecodedToken(newToken);
        if (decodedToken && decodedToken?.user?.profile) {
        }
      }
    } catch (error) {
      console.error("Failed to decode the token:", error);
    }
    // eslint-disable-next-line
  }, [token]);

  return (
    <>
      {Object.keys(navItems).map((role, i) => {
        const { icon, routes, isVisible } = navItems[role];

        return (
          <TestAccordian
            key={i}
            role={role}
            icon={icon}
            routes={routes}
            toggleDrawer={toggleDrawer}
            isVisible={isVisible}
            valueBoolean={navItems[role].open}
          />
        );
      })}
    </>
  );
};

export default TestNavItems;
