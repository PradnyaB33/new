import {
  Dashboard,
  EventAvailable,
  EventBusy,
  FilterAlt,
  FilterAltOff,
  Groups,
  LocationOn,
  NearMe,
  SupervisorAccount,
} from "@mui/icons-material";
import { IconButton, Popover } from "@mui/material";
import { default as React, useEffect } from "react";
import { useQueryClient } from "react-query";
import { useLocation } from "react-router-dom/dist";
import Select from "react-select";
import useDashGlobal from "../../hooks/Dashboard/useDashGlobal";
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
  const { setSelectedSalaryYear, selectedSalaryYear } = useDashGlobal();
  const location = useLocation("");

  const queryClient = useQueryClient();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // custom hooks

  const {
    Managers,
    managerLoading,
    oraganizationLoading,
    salaryGraphLoading,
    locationOptions,
    managerOptions,
    Departmentoptions,
    customStyles,
    data,
    locations,
    location: loc,
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
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1  mt-6  w-full   gap-2 md:gap-5 ">
          <SuperAdminCard
            icon={Groups}
            color={"!bg-blue-500"}
            data={employee?.totalEmployees}
            isLoading={employeeLoading}
            title={"Overall Employees"}
          />

          <SuperAdminCard
            color={"!bg-green-500"}
            isLoading={employeeLoading}
            icon={EventAvailable}
            data={
              !isNaN(employee?.totalEmployees)
                ? employee?.totalEmployees - absentEmployee
                : 0
            }
            title={"Present Today"}
          />
          <SuperAdminCard
            title={"Today's Leave"}
            icon={EventBusy}
            color={"!bg-red-500"}
            data={absentEmployee}
            isLoading={false}
          />

          <SuperAdminCard
            color={"!bg-amber-500"}
            icon={SupervisorAccount}
            data={Managers?.length}
            isLoading={managerLoading}
            title={"People's Manager"}
          />
          <SuperAdminCard
            color={"!bg-orange-500"}
            isLoading={false}
            icon={LocationOn}
            data={loc?.locationCount}
            title={"Locations"}
          />

          <SuperAdminCard
            color={"!bg-indigo-500"}
            isLoading={false}
            icon={NearMe}
            data={loc?.locationCount}
            title={"Remote Employees"}
          />
        </div>
        {oraganizationLoading ? (
          <SkeletonFilterSection />
        ) : (
          <div className="mt-4  w-full  bg-white shadow-md rounded-md  ">
            <div className="border-b-[.5px] items-center justify-between flex gap-2 py-2 px-4 border-gray-300">
              <div className="flex items-center gap-2">
                <Dashboard className="!text-[#67748E]" />
                <h1 className="text-md font-bold text-[#67748E]">Dashboard</h1>
              </div>
              <div className=" w-[80%]  md:hidden flex gap-6 items-center justify-end">
                <IconButton onClick={handleClick}>
                  <FilterAlt />
                </IconButton>
              </div>

              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                sx={{
                  height: "150px",
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <div className="w-full  items-center    p-2 flex gap-2 ">
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
              </Popover>

              {location.pathname?.includes("/HR-dashboard") && (
                <div className=" w-[80%] hidden md:flex gap-6 items-center justify-end">
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
            <LineGraph
              salarydata={salaryData}
              isLoading={salaryGraphLoading}
              selectedyear={selectedSalaryYear}
              setSelectedYear={setSelectedSalaryYear}
            />
          </div>
          <div className="w-[100%] md:w-[50%]">
            <AttendenceBar
              orgId={user.organizationId}
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
