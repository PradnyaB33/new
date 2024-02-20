import {
  AccessTimeSharp,
  Dashboard,
  ErrorOutline,
  FilterAltOff,
  Groups,
  LocationOn,
} from "@mui/icons-material";
import { default as React, useEffect } from "react";
import { useQueryClient } from "react-query";
import { useLocation } from "react-router-dom/dist";
import Select from "react-select";
import useDashboardFilter from "../../hooks/Dashboard/useDashboardFilter";
import useEmployee from "../../hooks/Dashboard/useEmployee";
import UserProfile from "../../hooks/UserData/useUser";
import LineGraph from "./Components/Bar/LineGraph";
import AttendenceBar from "./Components/Bar/SuperAdmin/AttendenceBar";
import SuperAdminCard from "./Components/Card/superadmin/SuperAdminCard";
import SkeletonFilterSection from "./Components/Skeletons/SkeletonFilterSection";

const DashBoardHR = () => {
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const { employee, employeeLoading } = useEmployee(user.organizationId);
  const location = useLocation("");

  const queryClient = useQueryClient();

  // custom hooks

  const {
    Managers,
    managerLoading,
    oraganizationLoading,
    locationOptions,
    managerOptions,
    Departmentoptions,
    customStyles,
    data,
    locations,
    setLocations,
    manager,
    setManager,
    department,
    setDepartment,
    salaryData,
    absentEmployee,
    getAttendenceData,
  } = useDashboardFilter(user.organizationId);

  useEffect(() => {
    if (location.pathname?.includes("/DH-dashboard")) {
      getAttendenceData();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <section className=" bg-gray-50  min-h-screen w-full ">
      <header className="text-xl font-bold w-full px-8 pt-6 bg-white !text-[#67748E] shadow-md  p-4">
        {location.pathname?.includes("/DH-dashboard")
          ? "Department Head Dashboard"
          : "HR Dashboard"}
      </header>
      <div className="md:px-8 px-2 w-full">
        <div className="flex flex-1 mt-6 flex-wrap w-full justify-between gap-2 md:gap-5 ">
          <SuperAdminCard
            icon={Groups}
            color={"!bg-blue-500"}
            data={employee?.totalEmployees}
            isLoading={employeeLoading}
            title={"Overall Employees"}
          />
          <SuperAdminCard
            color={"!bg-green-500"}
            icon={AccessTimeSharp}
            data={Managers?.length}
            isLoading={managerLoading}
            title={"People's Manager"}
          />
          <SuperAdminCard
            title={"Today's leave"}
            icon={ErrorOutline}
            color={"!bg-red-500"}
            data={absentEmployee}
            isLoading={false}
          />
          <SuperAdminCard
            color={"!bg-orange-500"}
            isLoading={false}
            icon={LocationOn}
            data={14}
            title={"Special Shift"}
          />
        </div>
        {oraganizationLoading ? (
          <SkeletonFilterSection />
        ) : (
          <div className="mt-4 w-full  bg-white shadow-md rounded-md  ">
            <div className="border-b-[.5px] items-center justify-between flex gap-2 py-2 px-4 border-gray-300">
              <div className="flex items-center gap-2">
                <Dashboard className="!text-[#67748E]" />
                <h1 className="text-md font-bold text-[#67748E]">Dashboard</h1>
              </div>
              {location.pathname?.includes("/HR-dashboard") && (
                <div className="flex w-[80%] gap-6 items-center justify-end">
                  <button
                    onClick={() => {
                      setLocations("");
                      setDepartment("");
                      setManager("");
                      queryClient.invalidateQueries("organization-attenedence");
                    }}
                    className="!w-max flex justify-center h-[25px]  gap-2 items-center rounded-md px-1 text-sm font-semibold text-[#152745]  hover:bg-gray-50 focus-visible:outline-gray-100"
                  >
                    <FilterAltOff className="!text-[1.4em] text-[#152745] " />
                    Remove Filter
                  </button>

                  <Select
                    placeholder={"Departments"}
                    onChange={(dept) => {
                      setDepartment(dept.value);
                      setLocations("");
                      setManager("");
                      queryClient.invalidateQueries("department-attenedence");
                    }}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    styles={customStyles}
                    value={
                      department
                        ? Departmentoptions?.find(
                            (option) => option.value === department
                          )
                        : ""
                    } // Add this line
                    options={Departmentoptions}
                  />

                  <Select
                    placeholder={"Manager"}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    onChange={(Managers) => {
                      setManager(Managers.value);
                      setDepartment("");
                      setLocations("");
                      queryClient.invalidateQueries("manager-attenedence");
                    }}
                    value={
                      manager
                        ? managerOptions.find((item) => item.name === manager)
                        : ""
                    }
                    styles={customStyles}
                    options={managerOptions}
                  />

                  <Select
                    placeholder={"Location"}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    onChange={(loc) => {
                      setLocations(loc.value);
                      setDepartment("");
                      setManager("");
                      queryClient.invalidateQueries("location-attenedence");
                    }}
                    value={
                      locations
                        ? locationOptions.find(
                            (item) => item.name === locations
                          )
                        : ""
                    }
                    styles={customStyles}
                    options={locationOptions}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <div className="w-full md:gap-4 md:space-y-0 space-y-3 mt-4 flex md:flex-row flex-col items-center">
          <div className="w-[100%] md:w-[50%]">
            <LineGraph salarydata={salaryData} />
          </div>
          <div className="w-[100%] md:w-[50%]">
            <AttendenceBar
              isLoading={oraganizationLoading}
              attendenceData={data}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashBoardHR;
