import {
  AccessTime,
  AddAlert,
  Business,
  Category,
  CircleNotifications,
  Description,
  Event,
  Groups,
  ListAlt,
  MonetizationOn,
  NotificationsActive,
  Payment,
  PeopleAlt,
  PersonAdd,
  PersonRemove,
  Settings,
  SwipeLeftAlt,
  TrendingUp,
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import UserProfile from "../../../hooks/UserData/useUser";
import NavAccordian from "./accordian";

const TestNavItems = ({ toggleDrawer }) => {
  const [orgId, setOrgId] = useState(null);
  const { cookies } = useContext(UseContext);
  const token = cookies["aeigs"];
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

  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const [isVisible, setisVisible] = useState(true);

  let navItems = useMemo(
    () => ({
      "Self Help": {
        open: true,
        icon: <Category className="text-black" />,
        isVisible: true,
        routes: [
          {
            key: "orglist",
            link: "/organizationList",
            icon: <SwipeLeftAlt className="text-black" />,
            text: "Go to Organisation",
          },
          {
            key: "attendance",
            link: "/leave",
            icon: <AccessTime className="text-black" />,
            text: "Attendance",
          },
          {
            key: "accountSettings",
            link: `/userprofile`,
            icon: <Settings className="text-black" />,
            text: "Account Settings",
          },
        ],
      },
      Notification: {
        open: false,
        isVisible: true,
        icon: <NotificationsActive className="text-black" />,
        routes: [
          {
            key: "createNotification",
            link: "/create-notification",
            icon: <AddAlert className="text-black" />,
            text: "Create Notification",
          },
          {
            key: "listNotification",
            link: "/notification",
            icon: <CircleNotifications className="text-black" />,
            text: "List Notification",
          },
        ],
      },
      "Pay-roll": {
        open: false,
        isVisible: true,
        icon: <Payment className="text-black" />,
        routes: [
          {
            key: "allowance",
            link: "/allowance",
            icon: <MonetizationOn className="text-black" />,
            text: "Allowance",
          },
          {
            key: "payslip",
            link: `organisation/view-payslip`,
            icon: <ListAlt className="text-black" />,
            text: "Pay Slip",
          },
          {
            key: "icomeTax",
            link: "/income-tax",
            icon: <TrendingUp className="text-black" />,
            text: "Income Tax",
          },
          {
            key: "form-16",
            link: "/form-16",
            icon: <Description className="text-black" />,
            text: "Form-16",
          },
          {
            key: "shiftManagement",
            link: "/shift-management",
            icon: <Event className="text-black" />,
            text: "Shift Management",
          },
          {
            key: "createsalary",
            link: `/organisation/${orgId}/salary-management`,
            icon: <Event className="text-black" />,
            text: "Create Salary",
          },
        ],
      },
      Employee: {
        open: false,
        icon: <PeopleAlt className="text-black" />,
        isVisible:
          window.location.pathname.includes("dashboard") &&
          user.profile.includes("Super-Admin", "Hr", "Manager"),
        routes: [
          {
            key: "onboarding",
            link: `organisation/${orgId}/employee-onboarding`,
            icon: <PersonAdd className="text-black" />,
            text: "Onboarding",
          },

          {
            key: "offboarding",
            link: `organisation/${orgId}/employee-offboarding`,
            icon: <PersonRemove className="text-black" />,
            text: "Offboarding",
          },
          {
            key: "employeeList",
            link: `organisation/${orgId}/employee-list`,
            icon: <Groups className="text-black" />,
            text: "Employee List",
          },
        ],
      },
      Department: {
        open: false,
        isVisible:
          window.location.pathname.includes("organisation") &&
          user.profile.includes("Super-Admin", "Hr", "Manager"),
        // : false
        icon: <Business className="text-black" />,
        routes: [
          {
            key: "addDepartment",
            link: `/organisation/${orgId}/create-department`,
            icon: <AddAlert className="text-black" />,
            text: "Add Department",
          },
          // {
          //   key: "updateDepartment",
          //   link: "/department-update",
          //   icon: <ListAlt className="text-black" />,
          //   text: "Update Department",
          // },
          // {
          //   key: "deleteDepartment",
          //   link: "/department-delete",
          //   icon: <ListAlt className="text-black" />,
          //   text: "Delete Department",
          // },
          {
            key: "deptDeletion",
            link: `/organisation/${orgId}/dept-deletion`,
            icon: <ListAlt className="text-black" />,
            text: "Bulk Deletion",
          },
          {
            key: "departmentList",
            link: `/organisation/${orgId}/department-list`,
            icon: <ListAlt className="text-black" />,
            text: "Manage Departments",
          },
        ],
      },
      Organisation: {
        open: false,
        isVisible:
          window.location.pathname.includes("dashboard") &&
          user.profile.includes("Super-Admin", "Hr"),
        icon: <MonetizationOn className="text-black" />,
        routes: [
          {
            key: "addOrganisation",
            link: "/add-organisation",
            icon: <AddAlert className="text-black" />,
            text: "Add Organisation",
          },
          {
            key: "updateOrganisation",
            link: "/organisation-update",
            icon: <ListAlt className="text-black" />,
            text: "Update Organisation",
          },
          {
            key: "deleteOrganisation",
            link: "/organisation-delete",
            icon: <ListAlt className="text-black" />,
            text: "Delete Organisation",
          },
          {
            key: "organisationList",
            link: "/department-list",
            icon: <ListAlt className="text-black" />,
            text: "Organisation List",
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
        if (decodedToken && decodedToken.user.profile) {
        }
      }
    } catch (error) {
      console.error("Failed to decode the token:", error);
    }
    // eslint-disable-next-line
  }, [token]);

  return (
    <>
      {Object.keys(navItems).map((role) => {
        const { icon, routes, isVisible } = navItems[role];

        return (
          <NavAccordian
            key={role}
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
