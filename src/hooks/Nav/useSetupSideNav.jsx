import {
  AddLocationAltOutlined,
  ManageAccountsOutlined,
  SellOutlined,
} from "@mui/icons-material";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import WeekendOutlinedIcon from "@mui/icons-material/WeekendOutlined";
import { useLocation } from "react-router-dom";
import UserProfile from "../UserData/useUser";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import WorkOffOutlinedIcon from "@mui/icons-material/WorkOffOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import HolidayVillageOutlinedIcon from "@mui/icons-material/HolidayVillageOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import PersonPinOutlinedIcon from "@mui/icons-material/PersonPinOutlined";
const useSetupSideNav = (organisationId) => {
  const location = useLocation();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();

  const linkData = [
    {
      label: "Manage Roles",
      icon: GroupOutlinedIcon,
      href: `/organisation/${organisationId}/setup/add-roles`,
      active:
        location.pathname === `/organisation/${organisationId}/setup/add-roles`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },
    {
      label: "Leaves",
      icon: WorkOffOutlinedIcon,
      href: `/organisation/${organisationId}/setup/leave-types`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/leave-types`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },

    {
      label: "Shifts",
      icon: ScheduleOutlinedIcon,
      href: `/organisation/${organisationId}/setup/set-shifts`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-shifts`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },
    {
      label: "Location",
      icon: AddLocationAltOutlined,
      href: `/organisation/${organisationId}/setup/add-organization-locations`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/add-organization-locations`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },
    {
      label: "Public Holidays",
      icon: HolidayVillageOutlinedIcon,
      href: `/organisation/${organisationId}/setup/set-public-holiday`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-public-holiday`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },

    {
      label: "Additional Employee Data",
      icon: PersonOutlineOutlinedIcon,
      href: `/organisation/${organisationId}/setup/input-field`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/input-field`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },
    {
      label: "Employment",
      icon: ManageAccountsOutlined,
      href: `/organisation/${organisationId}/setup/set-employement-types`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-employement-types`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },
    {
      label: "Salary Template",
      icon: MonetizationOnOutlinedIcon,
      href: `/organisation/${organisationId}/setup/set-salary-input-selection`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-salary-input-selection`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "HR"].includes(role)
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
        ["Super-Admin", "HR"].includes(role)
      ),
    },
    {
      label: "Email Setting",
      icon: EmailOutlinedIcon,
      href: `/organisation/${organisationId}/setup/email`,
      active:
        location.pathname === `/organisation/${organisationId}/setup/email`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "HR"].includes(role)
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
        ["Super-Admin", "HR"].includes(role)
      ),
    },
    {
      label: "Salary Computation Day",
      icon: EventNoteOutlinedIcon,
      href: `/organisation/${organisationId}/setup/salary-computation-day`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/salary-computation-day`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },
    {
      label: "Employee Code",
      icon: PersonPinOutlinedIcon,
      href: `/organisation/${organisationId}/setup/employee-code`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/employee-code`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },
    {
      label: "Subscription",
      icon: SellOutlined,
      href: `/organisation/${organisationId}/setup/subscription`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/subscription`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },
  ];

  return { linkData };
};

export default useSetupSideNav;
