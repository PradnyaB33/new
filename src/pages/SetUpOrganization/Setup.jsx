import { SettingsOutlined, West } from "@mui/icons-material";
import React from "react";
import { Link, useParams } from "react-router-dom";
import BackComponent from "../../components/BackComponent/BackComponent";
import useSetupSideNav from "../../hooks/Nav/useSetupSideNav";
const Setup = ({ children }) => {
  const { organisationId } = useParams("");

  const { linkData } = useSetupSideNav(organisationId);

  return (
    <>
      <section className=" bg-gray-50 min-h-screen w-full">
        <header className="md:block hidden text-xl w-full pt-6 bg-white shadow-md p-4">
          <BackComponent />
          <Link to={"/organizationList"}>
            <West className="mx-4 !text-xl" />
          </Link>
          {/* <BackComponent /> */}
          Organization Setup Page
        </header>
        <article className="md:p-4 p-0 w-full h-full flex gap-4">
          <aside className="hidden md:flex md:w-[30%] lg:!w-[20%]  h-max  flex-col items-center shadow-lg justify-center bg-white">
            <div className="px-4 py-3 gap-4 border-b-[.5px] flex w-full items-center border-gray-300">
              <div className="rounded-full h-[30px] w-[30px] flex items-center justify-center">
                <SettingsOutlined className="!text-md text-sky-400 hover:!rotate-180  cursor-pointer" />
              </div>
              <h1 className="!text-lg tracking-wide">Setup Settings</h1>
            </div>

            {linkData?.map((item, id) => (
              <Link
                to={item?.href}
                key={id}
                className={`group  ${item.active && "bg-sky-100 !text-blue-500"}

                  hover:bg-sky-100 transition-all  flex w-full items-center text-gray-700   gap-4 px-4 py-3 cursor-pointer `}
              >
                <item.icon className="!text-2xl  group-hover:!text-blue-500 !font-thin " />
                <h1 className="group-hover:!text-blue-500 ">{item?.label}</h1>
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
