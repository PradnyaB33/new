import {
  AddLocationAltOutlined,
  BeachAccessOutlined,
  EventAvailableOutlined,
  ManageAccountsOutlined,
  PersonAddAlt1Outlined,
  PriceChangeOutlined,
  SettingsOutlined,
  West,
} from "@mui/icons-material";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import BackComponent from "../../components/BackComponent/BackComponent";
const Setup = ({ children }) => {
  const location = useLocation();
  const { organisationId } = useParams("");

  const [user, setUser] = useState("");

  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];

  useEffect(() => {
    try {
      const decodedToken = jwtDecode(authToken);
      if (decodedToken && decodedToken.user) {
        setUser(decodedToken.user);
      } else {
        setUser();
      }
    } catch (error) {
      console.error("Failed to decode the token:", error);
    }
    // eslint-disable-next-line
  }, []);

  const data = [
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
      href: `/organization/${organisationId}/setup/add-organization-locations`,
      active:
        location.pathname ===
        `/organization/${organisationId}/setup/add-organization-locations`,
      isVisible: user?.profile?.some((role) => ["Super-Admin"].includes(role)),
    },
    {
      label: "Add Input Field For Form",
      icon: AddLocationAltOutlined,
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
  ];

  return (
    <>
      <section className=" bg-gray-50 min-h-screen w-full">
        <header className="text-xl w-full pt-6 bg-white shadow-md   p-4">
        <BackComponent />
          <Link to={"/organizationList"}>
            <West className="mx-4 !text-xl" />
          </Link>
          {/* <BackComponent /> */}
          Organization Setup page
        </header>
        <article className="p-4 w-full h-full flex gap-4">
          <aside className="md:w-[30%] lg:!w-[20%]  h-max flex flex-col items-center shadow-lg justify-center bg-white">
            <div className="px-4 py-3 gap-4 border-b-[.5px] flex w-full items-center border-gray-300">
              <div className="rounded-full h-[30px] w-[30px] flex items-center justify-center">
                <SettingsOutlined className="!text-md text-sky-400 hover:!rotate-180  cursor-pointer" />
              </div>
              <h1 className="!text-lg tracking-wide">Setup Settings</h1>
            </div>

            {data.map((item, id) => (
              <Link
                to={item.href}
                key={id}
                className={`group ${!item.isVisible && "hidden"} ${
                  item.active && "bg-sky-100 !text-blue-500"
                }

                  hover:bg-sky-100 transition-all  flex w-full items-center text-gray-700   gap-4 px-4 py-3 cursor-pointer `}
              >
                <item.icon className="!text-2xl  group-hover:!text-blue-500 !font-thin " />
                <h1 className="group-hover:!text-blue-500 ">{item.label}</h1>
              </Link>
            ))}
          </aside>
          {children}
        </article>
      </section>
    </>
  );
};

export default Setup;
