import {
  AccessTimeSharp,
  Business,
  Dashboard,
  FilterAltOff,
  Group,
  LocationOn,
  West,
} from "@mui/icons-material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { UseContext } from "../../../State/UseState/UseContext";
import LineGraph from "../Components/Bar/LineGraph";
import AttendenceBar from "../Components/Bar/SuperAdmin/AttendenceBar";
import SuperAdminCard from "../Components/Card/superadmin/SuperAdminCard";
import SkeletonFilterSection from "../Components/Skeletons/SkeletonFilterSection";

const SuperAdmin = () => {
  const { organisationId } = useParams("");
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const [department, setDepartment] = useState("");
  const [manager, setManager] = useState("");
  const [locations, setLocations] = useState("");
  const queryClient = useQueryClient();
  const [data, setData] = useState([]);

  const getDepartment = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/get/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: Department, isLoading: departmentLoading } = useQuery(
    ["departments-data", organisationId],
    getDepartment
  );

  const getEmployees = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: employee, isLoading: employeeLoading } = useQuery(
    ["employee-data", organisationId],
    getEmployees
  );

  const getLocationData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: location, isLoading: locationLoading } = useQuery(
    ["organization-locations", organisationId],
    getLocationData
  );

  const customStyles = {
    control: (base) => ({
      ...base,
      border: 0,
      background: "#f9fafb",
      boxShadow: "none",
      hover: {
        cursor: "pointer !important",
      },
    }),
    menu: (base) => ({
      ...base,
      width: "max-content",
      minWidth: "100%",
      right: 0,
    }),
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#000",
      };
    },
  };

  const getManagerData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get-manager/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return response?.data?.manager;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: Managers, isLoading: managerLoading } = useQuery(
    ["all-manager", organisationId],
    getManagerData
  );

  const Departmentoptions = Department?.department?.map((item) => {
    return {
      value: item?._id,
      label: item?.departmentName,
    };
  });

  const managerOptions = Managers?.map((item) => {
    return {
      value: item?.managerId?._id,
      label: `${item?.managerId?.first_name} ${item?.managerId?.last_name}`,
    };
  });

  const locationOptions = location?.locationsData?.map((item, id) => {
    return {
      value: item._id,
      label: item.shortName,
    };
  });

  //TODO Attendence Fillter and data
  async function getAttendenceData(endPoint) {
    try {
      const { data } = await axios.get(`${endPoint}`, {
        headers: {
          Authorization: authToken,
        },
      });
      const currentYear = new Date().getFullYear();
      const filterData = data.filter((item) => item.year === currentYear);

      return filterData;
    } catch (error) {
      console.log(error);
    }
  }

  const { isLoading: oraganizationLoading } = useQuery(
    ["organization-attenedence", organisationId],
    () =>
      getAttendenceData(
        `${process.env.REACT_APP_API}/route/leave/getOrganizationAttendece/${organisationId}`
      ),
    {
      onSuccess: (organizationAttendenceData) =>
        setData(organizationAttendenceData),
      enabled: !department && !locations,
      staleTime: Infinity,
    }
  );

  useQuery(
    ["department-attenedence", department],
    () =>
      getAttendenceData(
        `${process.env.REACT_APP_API}/route/leave/getDepartmentAttendece/${department}`
      ),
    {
      onSuccess: (attendenceData) => setData(attendenceData),
      enabled: !!department,
    }
  );

  useQuery(
    ["manager-attenedence", manager],
    () =>
      getAttendenceData(
        `${process.env.REACT_APP_API}/route/leave/getManagerEmployeeAttendence/${manager}`
      ),
    {
      onSuccess: (attendenceData) => setData(attendenceData),
      enabled: !!manager,
    }
  );

  useQuery(
    ["location-attenedence", locations],
    () =>
      getAttendenceData(
        `${process.env.REACT_APP_API}/route/leave/getLocationAttendece/${locations}`
      ),
    {
      onSuccess: (attendenceData) => setData(attendenceData),
      enabled: !!locations,
    }
  );

  return (
    <section className=" bg-gray-50  min-h-screen w-full ">
      {/* <BackComponent /> */}
      {/* <header className="px-8 !text-[#152745] text-xl w-full flex items-center gap-2 pt-6 bg-white shadow-md   p-4">
        <Dashboard />
        <h1 className="text-2xl  font-semibold">Organization Overview</h1>
      </header> */}

      <header className="text-xl w-full pt-6 bg-white shadow-md   p-4">
        {/* <BackComponent /> */}
        <Link to={"/organizationList"}>
          <West className="mx-4 !text-xl" />
        </Link>
        Organization Overview
      </header>
      {/* <Link to={"/organizationList"} className="my-4 px-8 flex gap-1">
        <KeyboardBackspace />
        <h1>Go back</h1>
      </Link> */}
      {/* <div className="bg-white pt-10 pb-4 border-b-[.5px] border-gray-300">
        <div className="flex  px-8    items-center !text-[#152745] gap-1"></div>
      </div> */}

      <div className=" px-8 w-full">
        <div className="flex mt-6 w-full justify-between gap-5">
          <SuperAdminCard
            icon={Business}
            color={"!bg-red-500"}
            data={Department?.departmentCount}
            isLoading={departmentLoading}
            title={"Departments"}
          />
          <SuperAdminCard
            icon={Group}
            color={"!bg-green-500"}
            data={employee?.totalEmployees}
            isLoading={employeeLoading}
            title={"Overall Employees"}
          />
          <SuperAdminCard
            color={"!bg-blue-500"}
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
                <h1 className="text-md font-bold text-[#67748E]">Dashboard</h1>
              </div>
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
                      ? locationOptions.find((item) => item.name === locations)
                      : ""
                  }
                  styles={customStyles}
                  options={locationOptions}
                />
              </div>
            </div>
          </div>
        )}

        <div className="w-full gap-4 mt-4 flex items-center">
          <div className="w-[50%]">
            <LineGraph />
          </div>
          <div className="w-[50%]">
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

export default SuperAdmin;
