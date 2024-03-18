import {
  AccessTime,
  AdminPanelSettings,
  Dashboard,
  ErrorOutline,
  Groups,
} from "@mui/icons-material";
import axios from "axios";
import { default as React } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom/dist";
import useAuthToken from "../../hooks/Token/useAuth";
import UserProfile from "../../hooks/UserData/useUser";
import LineGraph from "./Components/Bar/LineGraph";
import AttendenceBar from "./Components/Bar/SuperAdmin/AttendenceBar";
import SuperAdminCard from "./Components/Card/superadmin/SuperAdminCard";
import SkeletonFilterSection from "./Components/Skeletons/SkeletonFilterSection";

const DashboardDH = () => {
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const authToken = useAuthToken();
  const { organisationId } = useParams("");

  console.log(user.deptname);

  // custom hooks
  // const { oraganizationLoading } = useDashboardFilter(user.organizationId);

  const { data: deptAttendenceData } = useQuery({
    queryKey: ["deptAttendece"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/route/leave/getDepartmentAttendece/${user.deptname}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { data: deptSalaryData, isLoading: salaryLoading } = useQuery({
    queryKey: ["deptSalary"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/route/employeeSalary/departmentSalaryOverview/${user.deptname}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return data;
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { data: employeeCount, isLoading: employeeCountLoading } = useQuery({
    queryKey: ["deptEmployeeCount"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/departmentHead/getAllEmployees`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    },
  });

  const {
    data: employeeDeptLeaveCount,
    isLoading: employeeDeptLeaveCountLoading,
  } = useQuery({
    queryKey: ["deptEmployeeLeaveCount"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getDeptAbsent/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    },
  });

  const { data: employeeDeptOnShift, isLoading: employeeDeptOnShiftLoading } =
    useQuery({
      queryKey: ["deptEmployeeOnShift"],
      queryFn: async () => {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/route/leave/getDeptShift/${organisationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return data;
      },
    });

  const { data: managerCount, isLoading: managerCountLoading } = useQuery({
    queryKey: ["deptManagerEmployeeCount"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/departmentHead/getAllManagers`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    },
  });

  console.log(employeeCount);

  return (
    <section className=" bg-gray-50  min-h-screen w-full ">
      <header className="text-xl font-bold w-full px-8 pt-6 bg-white !text-[#67748E] shadow-md  p-4">
        Department Head Dashboard
      </header>
      <div className="md:px-8 px-2 w-full">
        <div className="flex flex-1 mt-6 flex-wrap w-full justify-between gap-2 md:gap-5 ">
          <SuperAdminCard
            icon={Groups}
            color={"!bg-blue-500"}
            data={employeeCount ?? 0}
            isLoading={employeeCountLoading}
            title={"Overall Employees"}
          />
          <SuperAdminCard
            color={"!bg-green-500"}
            icon={AdminPanelSettings}
            data={managerCount?.deptEmployees?.length ?? 0}
            isLoading={managerCountLoading}
            title={"People's Manager"}
          />
          <SuperAdminCard
            title={"Today's Leave"}
            icon={ErrorOutline}
            color={"!bg-red-500"}
            data={employeeDeptLeaveCount ?? 0}
            isLoading={employeeDeptLeaveCountLoading}
          />
          <SuperAdminCard
            color={"!bg-orange-500"}
            isLoading={employeeDeptOnShiftLoading}
            icon={AccessTime}
            data={employeeDeptOnShift ?? 0}
            title={"Special Shift"}
          />
        </div>
        {false ? (
          <SkeletonFilterSection />
        ) : (
          <div className="mt-4 w-full  bg-white shadow-md rounded-md  ">
            <div className="border-b-[.5px] items-center justify-between flex gap-2 py-2 px-4 border-gray-300">
              <div className="flex items-center gap-2">
                <Dashboard className="!text-[#67748E]" />
                <h1 className="text-md font-bold text-[#67748E]">Dashboard</h1>
              </div>
            </div>
          </div>
        )}

        <div className="w-full md:gap-4 md:space-y-0 space-y-3 mt-4 flex md:flex-row flex-col items-center">
          <div className="w-[100%] md:w-[50%]">
            <LineGraph salarydata={deptSalaryData} isLoading={salaryLoading} />
          </div>
          <div className="w-[100%] md:w-[50%]">
            <AttendenceBar
              // isLoading={oraganizationLoading}
              attendenceData={deptAttendenceData}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardDH;
