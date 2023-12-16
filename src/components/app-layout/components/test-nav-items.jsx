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
  TrendingUp,
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useMatch } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import NavAccordian from "./accordian";

const TestNavItems = ({ toggleDrawer }) => {
  const [orgId, setOrgId] = useState(null);
  const { cookies } = useContext(UseContext);
  const token = cookies["aeigs"];
  const params = useMatch("/organisation/:id");
  const location = useLocation();
  const pathname = location.pathname;

  // Update organization ID when URL changes
  useEffect(() => {
    const hasEmployeeOnboarding = pathname.includes("employee-onboarding");
    if (!hasEmployeeOnboarding) {
      getOrganizationIdFromPathname(location.pathname);
    }
  }, [location.pathname]);

  // Function to extract organization ID from pathname
  const getOrganizationIdFromPathname = (pathname) => {
    const parts = pathname.split("/");
    const orgIndex = parts.indexOf("organisation");
    if (orgIndex !== -1 && parts.length > orgIndex + 1) {
      setOrgId(parts[orgIndex + 1]);
    }
  };

  const [isVisible, setisVisible] = useState(true);

  let navItems = {
    "Self Help": {
      open: true,
      icon: <Category className="text-white" />,
      isVisible: true,
      routes: [
        {
          key: "attendance",
          link: "/leave",
          icon: <AccessTime className="text-white" />,
          text: "Attendance",
        },
        {
          key: "accountSettings",
          link: "/account",
          icon: <Settings className="text-white" />,
          text: "Account Settings",
        },
      ],
    },
    Notification: {
      open: false,
      isVisible: true,
      icon: <NotificationsActive className="text-white" />,
      routes: [
        {
          key: "createNotification",
          link: "/create-notification",
          icon: <AddAlert className="text-white" />,
          text: "Create Notification",
        },
        {
          key: "listNotification",
          link: "/list-notification",
          icon: <CircleNotifications className="text-white" />,
          text: "List Notification",
        },
      ],
    },
    "Pay-roll": {
      open: false,
      isVisible: true,
      icon: <Payment className="text-white" />,
      routes: [
        {
          key: "allowance",
          link: "/allowance",
          icon: <MonetizationOn className="text-white" />,
          text: "Allowance",
        },
        {
          key: "payslip",
          link: "/payslip",
          icon: <ListAlt className="text-white" />,
          text: "Pay Slip",
        },
        {
          key: "icomeTax",
          link: "/income-tax",
          icon: <TrendingUp className="text-white" />,
          text: "Income Tax",
        },
        {
          key: "form-16",
          link: "/form-16",
          icon: <Description className="text-white" />,
          text: "Form-16",
        },
        {
          key: "shiftManagement",
          link: "/shift-manage",
          icon: <Event className="text-white" />,
          text: "Shift Management",
        },
      ],
    },
    Employee: {
      open: false,
      icon: <PeopleAlt className="text-white" />,
      isVisible: isVisible,
      routes: [
        {
          key: "onboarding",
          link: `organisation/${orgId}/employee-onboarding`,
          icon: <PersonAdd className="text-white" />,
          text: "Onboarding",
        },

        {
          key: "offboarding",
          link: `organisation/${orgId}/employee-offboarding`,
          icon: <PersonRemove className="text-white" />,
          text: "Offboarding",
        },
        {
          key: "employeeList",
          link: `organisation/${orgId}/employee-list`,
          icon: <Groups className="text-white" />,
          text: "Employee List",
        },
      ],
    },
    Department: {
      open: false,
      isVisible: isVisible,
      icon: <Business className="text-white" />,
      routes: [
        {
          key: "addDepartment",
          link: `/organisation/${orgId}/create-department`,
          icon: <AddAlert className="text-white" />,
          text: "Add Department",
        },
        {
          key: "updateDepartment",
          link: "/department-update",
          icon: <ListAlt className="text-white" />,
          text: "Update Department",
        },
        {
          key: "deleteDepartment",
          link: "/department-delete",
          icon: <ListAlt className="text-white" />,
          text: "Delete Department",
        },
        {
          key: "departmentList",
          link: "/department-list",
          icon: <ListAlt className="text-white" />,
          text: "Department List",
        },
      ],
    },
    Organisation: {
      open: false,
      isVisible: isVisible,
      icon: <MonetizationOn className="text-white" />,
      routes: [
        {
          key: "addOrganisation",
          link: "/organisation-add",
          icon: <AddAlert className="text-white" />,
          text: "Add Organisation",
        },
        {
          key: "updateOrganisation",
          link: "/organisation-update",
          icon: <ListAlt className="text-white" />,
          text: "Update Organisation",
        },
        {
          key: "deleteOrganisation",
          link: "/organisation-delete",
          icon: <ListAlt className="text-white" />,
          text: "Delete Organisation",
        },
        {
          key: "organisationList",
          link: "/department-list",
          icon: <ListAlt className="text-white" />,
          text: "Organisation List",
        },
      ],
    },
  };

  useEffect(() => {
    setisVisible(location.pathname.includes("/organisation"));
  }, [location, navItems]);

  useEffect(() => {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken.user.profile) {
      }
    } catch (error) {
      console.error("Failed to decode the token:", error);
    }
  }, [token]);

  return (
    <>
      {Object.keys(navItems).map((role) => {
        const { icon, routes, isVisible } = navItems[role];

        // Check if on root or organisation page
        // const isOrganisationAndIdNotDefined =
        //   role === "Organisation" && (!params || params.params?.id === null);

        // // Check if on a specific department page
        // const isDepartmentAndDepartmentIdNotDefined =
        //   role === "Department" &&
        //   (!params2 ||
        //     params2.params?.id === null ||
        //     params2.params?.departmentId === null);

        // Show Organisation navbar when on organisation page, not on root
        // if (role === "Organisation") {
        //   if (params && params.params && params.params.id !== undefined) {
        //     return (
        //       <NavAccordian
        //         key={role}
        //         role={role}
        //         icon={icon}
        //         routes={routes}
        //         toggleDrawer={toggleDrawer}
        //         valueBoolean={navItems[role].open}
        //       />
        //     );
        //   } else {
        //     // If on root, do not show Organisation navbar
        //     return null;
        //   }
        // }

        // // Show Department navbar when on a specific department page
        // if (role === "Department") {
        //   if (
        //     params2 &&
        //     params2.params &&
        //     params2.params.id !== undefined &&
        //     params2.params.departmentId !== undefined
        //   ) {
        //     return (
        //       <NavAccordian
        //         key={role}
        //         role={role}
        //         icon={icon}
        //         routes={routes}
        //         toggleDrawer={toggleDrawer}
        //         valueBoolean={navItems[role].open}
        //       />
        //     );
        //   } else {
        //     // If not on a specific department page, do not show Department navbar
        //     return null;
        //   }
        // }

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
