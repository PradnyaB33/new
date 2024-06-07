import {
  Dashboard,
  EventAvailable,
  EventBusy,
  FilterAltOff,
  Groups,
  LocationOn,
  NearMe,
  SupervisorAccount,
  West,
} from "@mui/icons-material";
import React from "react";
import { useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import useDashGlobal from "../../hooks/Dashboard/useDashGlobal";
import useDashboardFilter from "../../hooks/Dashboard/useDashboardFilter";
import useEmployee from "../../hooks/Dashboard/useEmployee";
import useSubscriptionGet from "../../hooks/QueryHook/Subscription/hook";
import LineGraph from "./Components/Bar/LineGraph";
import AttendenceBar from "./Components/Bar/SuperAdmin/AttendenceBar";
import SuperAdminCard from "./Components/Card/superadmin/SuperAdminCard";
import SkeletonFilterSection from "./Components/Skeletons/SkeletonFilterSection";

const SuperAdmin = () => {
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  // custom hooks
  const { employee, employeeLoading } = useEmployee(organisationId);
  const { data: mainD } = useSubscriptionGet({ organisationId });
  console.log(
    `🚀 ~ file: SuperAdmin.jsx:31 ~ data:`,
    mainD?.organisation?.packageInfo === "Intermediate Plan"
  );
  const {
    Managers,
    managerLoading,
    location: loc,
    oraganizationLoading,
    absentEmployee,
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
          <Link to={"/organizationList"}>
            <West className="mx-4 !text-xl" />
          </Link>
          Organisation Dashboard
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
              isLoading={employeeLoading}
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
            {mainD?.organisation?.packageInfo === "Intermediate Plan" && (
              <SuperAdminCard
                color={"!bg-indigo-500"}
                isLoading={false}
                icon={NearMe}
                data={loc?.locationCount}
                title={"Remote Employees"}
              />
            )}
          </div>

          {oraganizationLoading ? (
            <SkeletonFilterSection />
          ) : (
            <div className="mt-4 w-full  bg-white border rounded-md  ">
              <div className="items-center justify-between flex gap-2 py-2 px-4 ">
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
