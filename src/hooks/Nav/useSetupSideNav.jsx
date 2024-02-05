import {
  AddLocationAltOutlined,
  BeachAccessOutlined,
  EventAvailableOutlined,
  ManageAccountsOutlined,
  PersonAddAlt1Outlined,
  PriceChangeOutlined,
  SellOutlined,
} from "@mui/icons-material";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import WeekendOutlinedIcon from "@mui/icons-material/WeekendOutlined";
import { useLocation } from "react-router-dom";
import UserProfile from "../UserData/useUser";

const useSetupSideNav = (organisationId) => {
  const location = useLocation();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();

  const linkData = [
    {
      label: "Add Roles",
      icon: PersonAddAlt1Outlined,
      href: `/organisation/${organisationId}/setup/add-roles`,
      active:
        location.pathname === `/organisation/${organisationId}/setup/add-roles`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },
    {
      label: "Leave Types",
      icon: BeachAccessOutlined,
      href: `/organisation/${organisationId}/setup/leave-types`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/leave-types`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },

    {
      label: "Shift Types",
      icon: EventAvailableOutlined,
      href: `/organisation/${organisationId}/setup/set-shifts`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-shifts`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },
    {
      label: "Public Holidays",
      icon: BeachAccessOutlined,
      href: `/organisation/${organisationId}/setup/set-public-holiday`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-public-holiday`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },

    {
      label: "Add Location",
      icon: AddLocationAltOutlined,
      href: `/organisation/${organisationId}/setup/add-organization-locations`,
      active:
        location.pathname ===
        `/organization/${organisationId}/setup/add-organization-locations`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },
    {
      label: "Additional Employee Data",
      icon: PersonAddAlt1OutlinedIcon,
      href: `/organisation/${organisationId}/setup/input-field`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/input-field`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },
    {
      label: "Employement type",
      icon: ManageAccountsOutlined,
      href: `/organisation/${organisationId}/setup/set-employement-types`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-employement-types`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },
    {
      label: "Salary Input Field selection",
      icon: PriceChangeOutlined,
      href: `/organisation/${organisationId}/setup/set-salary-input-selection`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-salary-input-selection`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "HR"].includes(role)
      ),
    },
    {
      label: "Add Designation",
      icon: BadgeOutlinedIcon,
      href: `/organisation/${organisationId}/setup/set-designation`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-designation`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "HR"].includes(role)
      ),
    },
    {
      label: "Email Setting",
      icon: EmailOutlinedIcon,
      href: `/organisation/${organisationId}/setup/set-email`,
      active:
        location.pathname === `/organisation/${organisationId}/setup/set-email`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "HR"].includes(role)
      ),
    },
    {
      label: "Weekly off",
      icon: WeekendOutlinedIcon,
      href: `/organisation/${organisationId}/setup/set-weekend-holiday`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-weekend-holiday`,
      isVisible: user?.profile?.some((role) =>
        ["Super-Admin", "HR"].includes(role)
      ),
    },
    {
      label: "Salary Computation Day",
      icon: DateRangeOutlinedIcon,
      href: `/organisation/${organisationId}/setup/set-employee-salary-calculate-day`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-employee-salary-calculate-day`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },
    {
      label: "Employee Code Generator",
      icon: AssignmentIndOutlinedIcon,
      href: `/organisation/${organisationId}/setup/set-employee-code-generator`,
      active:
        location.pathname ===
        `/organisation/${organisationId}/setup/set-employee-code-generator`,
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
