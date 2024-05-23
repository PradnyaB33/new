import {
  AccessTimeSharp,
  Business,
  Dashboard,
  FilterAltOff,
  Groups,
  LocationOn,
  West,
} from "@mui/icons-material";
import React from "react";
import { useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import useDashGlobal from "../../hooks/Dashboard/useDashGlobal";
import useDashboardFilter from "../../hooks/Dashboard/useDashboardFilter";
import useEmployee from "../../hooks/Dashboard/useEmployee";
import LineGraph from "./Components/Bar/LineGraph";
import AttendenceBar from "./Components/Bar/SuperAdmin/AttendenceBar";
import SuperAdminCard from "./Components/Card/superadmin/SuperAdminCard";
import SkeletonFilterSection from "./Components/Skeletons/SkeletonFilterSection";

const SuperAdmin = () => {
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  // custom hooks
  const { employee, employeeLoading } = useEmployee(organisationId);
  const {
    Department,
    departmentLoading,
    Managers,
    managerLoading,
    location,
    oraganizationLoading,
    locationLoading,
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
  } = useDashboardFilter(organisationId);

  const { setSelectedSalaryYear, selectedSalaryYear } = useDashGlobal();

  //? Salary Graph Data

  return (
    <>
      <section className=" bg-gray-50  min-h-screen w-full ">
        <header className="text-xl w-full pt-6 bg-white shadow-md   p-4">
          {/* <BackComponent /> */}
          <Link to={"/organizationList"}>
            <West className="mx-4 !text-xl" />
          </Link>
          Organisation Dashboard
        </header>
        {/* <Link to={"/organizationList"} className="my-4 px-8 flex gap-1">
        <KeyboardBackspace />
        <h1>Go back</h1>
      </Link> */}
        {/* <div className="bg-white pt-10 pb-4 border-b-[.5px] border-gray-300">
        <div className="flex  px-8    items-center !text-[#152745] gap-1"></div>
      </div> */}

        <div className="md:px-8 px-2 w-full">
          <div className="flex flex-1 mt-6 flex-wrap w-full justify-between gap-2 md:gap-5 ">
            <SuperAdminCard
              icon={Business}
              color={"!bg-red-500"}
              data={Department?.departmentCount}
              isLoading={departmentLoading}
              title={"Departments"}
            />
            <SuperAdminCard
              icon={Groups}
              data={employee?.totalEmployees}
              color={"!bg-blue-500"}
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
              color={"!bg-orange-500"}
              isLoading={locationLoading}
              icon={LocationOn}
              data={location?.locationCount}
              title={"Locations"}
            />
          </div>

          {oraganizationLoading ? (
            <SkeletonFilterSection />
          ) : (
            <div className="mt-4 w-full  bg-white shadow-md rounded-md  ">
              <div className="border-b-[.5px] items-center justify-between flex gap-2 py-2 px-4 border-gray-300">
                <div className="flex items-center gap-2">
                  <Dashboard className="!text-[#67748E]" />
                </div>
                <div className="flex w-[80%] gap-6 items-center justify-end">
                  <button
                    onClick={() => {
                      setLocations("");
                      setDepartment("");
                      setManager("");
                      queryClient.invalidateQueries("organization-attenedence");
                      queryClient.invalidateQueries("Org-Salary-overview");
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
              </div>
            </div>
          )}

          <div className="w-full md:gap-4 md:space-y-0 space-y-3 mt-4 flex md:flex-row flex-col items-center">
            <div className="w-[100%] md:w-[50%]">
              <LineGraph
                salarydata={salaryData}
                selectedyear={selectedSalaryYear}
                setSelectedYear={setSelectedSalaryYear}
              />
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
    </>
  );
};

export default SuperAdmin;
