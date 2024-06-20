import {
  AddLocationAltOutlined,
  ManageAccountsOutlined,
  SchoolOutlined,
  SellOutlined,
} from "@mui/icons-material";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import HolidayVillageOutlinedIcon from "@mui/icons-material/HolidayVillageOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PersonPinOutlinedIcon from "@mui/icons-material/PersonPinOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import WeekendOutlinedIcon from "@mui/icons-material/WeekendOutlined";
import WorkOffOutlinedIcon from "@mui/icons-material/WorkOffOutlined";
import { useLocation } from "react-router-dom";

import useSubscriptionGet from "../QueryHook/Subscription/hook";
import UserProfile from "../UserData/useUser";
const useSetupSideNav = (organisationId) => {
  const location = useLocation();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const { data } = useSubscriptionGet({ organisationId });

  const linkData = [
    {
      label: "Manage Roles",
      icon: GroupOutlinedIcon,
      href: `/organisation/${organisationId}/setup/add-roles`,
      active:
        location.pathname === `/organisation/${organisationId}/setup/add-roles`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "Delegate-Super-Admin"].includes(role)
      ),
    },
    {
      label: "Leaves",
      icon: WorkOffOutlinedIcon,
      href: `/organisation/${organisationId}/setup/leave-types`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/leave-types`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "Delegate-Super-Admin"].includes(role)
      ),
    },

    {
      label: "Shifts",
      icon: ScheduleOutlinedIcon,
      href: `/organisation/${organisationId}/setup/set-shifts`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-shifts`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "Delegate-Super-Admin"].includes(role)
      ),
    },
    {
      label: "Location",
      icon: AddLocationAltOutlined,
      href: `/organisation/${organisationId}/setup/add-organization-locations`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/add-organization-locations`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "Delegate-Super-Admin"].includes(role)
      ),
    },
    {
      label: "Public Holidays",
      icon: HolidayVillageOutlinedIcon,
      href: `/organisation/${organisationId}/setup/set-public-holiday`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-public-holiday`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "Delegate-Super-Admin"].includes(role)
      ),
    },

    {
      label: "Additional Employee Data",
      icon: PersonOutlineOutlinedIcon,
      href: `/organisation/${organisationId}/setup/input-field`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/input-field`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "Delegate-Super-Admin"].includes(role)
      ),
    },
    {
      label: "Employment",
      icon: ManageAccountsOutlined,
      href: `/organisation/${organisationId}/setup/set-employement-types`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-employement-types`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "Delegate-Super-Admin"].includes(role)
      ),
    },
    {
      label: "Salary Template",
      icon: MonetizationOnOutlinedIcon,
      href: `/organisation/${organisationId}/setup/set-salary-input-selection`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-salary-input-selection`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "HR", "Delegate-Super-Admin"].includes(role)
      ),
    },
    {
      label: "Designation",
      icon: AssignmentIndOutlinedIcon,
      href: `/organisation/${organisationId}/setup/designation`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/designation`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "HR", "Delegate-Super-Admin"].includes(role)
      ),
    },
    {
      label: "Add Email",
      icon: EmailOutlinedIcon,
      href: `/organisation/${organisationId}/setup/email-communicaiton`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/email-communicaiton`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "Delegate-Super-Admin"].includes(role)
      ),
    },
    {
      label: "Weekly Off",
      icon: WeekendOutlinedIcon,
      href: `/organisation/${organisationId}/setup/weekly-off`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/weekly-off`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "HR", "Delegate-Super-Admin"].includes(role)
      ),
    },
    {
      label: "Salary Computation Day",
      icon: EventNoteOutlinedIcon,
      href: `/organisation/${organisationId}/setup/salary-computation-day`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/salary-computation-day`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "Delegate-Super-Admin"].includes(role)
      ),
    },
    {
      label: "Employee Code",
      icon: PersonPinOutlinedIcon,
      href: `/organisation/${organisationId}/setup/employee-code`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/employee-code`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "Delegate-Super-Admin"].includes(role)
      ),
    },
    {
      label: "Loan Management",
      icon: CreditCardIcon,
      href: `/organisation/${organisationId}/setup/loan-management`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/loan-management`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "Delegate-Super-Admin"].includes(role)
      ),
    },
    {
      label: "Remote Punching",
      icon: SellOutlined,
      href: `/organisation/${organisationId}/setup/remote-punching`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/remote-punching`,
      isVisible: data?.organisation?.packageInfo === "Intermediate Plan",
    },
    {
      label: "Shift Allowance",
      icon: PaidOutlinedIcon,
      href: `/organisation/${organisationId}/setup/shift-allowance`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/shift-allowance`,
      isVisible: true,
    },
    {
      label: "Training",
      icon: SchoolOutlined,
      href: `/organisation/${organisationId}/setup/training`,
      active:
        location.pathname === `/organisation/${organisationId}/setup/training`,
      isVisible: data?.organisation?.packageInfo === "Intermediate Plan",
    },
    {
      label: "Performance Management",
      icon: SellOutlined,
      href: `/organisation/${organisationId}/setup/performance-management`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/performance-management`,
      isVisible:
        true && data?.organisation?.packageInfo === "Intermediate Plan",
      // isVisible: data?.organisation?.packageInfo === "Intermediate Plan",
    },
    {
      label: "Letter Types Setup",
      icon: FolderOutlinedIcon,
      href: `/organisation/${organisationId}/setup/letter-types`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/letter-types`,
      isVisible: user?.profile?.some(
        (role) =>
          ["Super-Admin", "Delegate-Super-Admin"].includes(role) &&
          data?.organisation?.packageInfo === "Intermediate Plan"
      ),
    },
  ];

  return { linkData };
};

export default useSetupSideNav;
