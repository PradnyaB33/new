//😎
import {
  AccessTime,
  EventAvailable,
  EventBusy,
  Groups,
} from "@mui/icons-material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../../hooks/UserData/useUser";
import SuperAdminCard from "./Components/Card/superadmin/SuperAdminCard";
import ManagerEmployeeChart from "./Components/Custom/ManagerEmployeeChart";
import EmployeeLeaveRequest from "./Components/List/EmployeLeaveReqest";

const DashboardManger = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams("");
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();

  const cardSize = "w-72 h-28 "; // Adjust card size here

  const [selectedyear, setSelectedYear] = useState({
    value: new Date().getFullYear(),
    label: new Date().getFullYear(),
  });

  const getAllEmployeeForManger = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/countofEmployees`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  };

  const { data: EmployeeDataOfManager } = useQuery(
    "employeeData",
    getAllEmployeeForManger
  );

  const getManagerAttendenceChart = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/getManagerEmployeeAttendence/${user._id}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  };

  useQuery(["manager-attendece"], getManagerAttendenceChart);

  const { data: managerShift, isLoading: managerShiftLoading } = useQuery({
    queryKey: ["deptEmployeeOnShift"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/leave/getManagerShifts/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    },
  });

  const { data: managerAttendence, isLoading: managerAttendenceLoading } =
    useQuery({
      queryKey: ["deptEmployeeAbsent"],
      queryFn: async () => {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/route/leave/getTodaysAbsentUnderManager/${organisationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return data;
      },
    });

  return (
    <section className=" bg-gray-50  min-h-screen w-full ">
      <header className="text-xl w-full pt-6 bg-white border-b  p-4 px-8 ">
        Manager Dashboard
      </header>

      <div className=" lg:px-8 sm:px-4 px-2 w-full">
        <div className="flex mt-6">
          <div className="w-full lg:flex-row flex-col flex gap-5">
            <div className="flex flex-col h-max w-full lg:w-[75%] gap-3">
              {/* <div className="flex flex-1  flex-wrap w-full justify-between gap-2 md:gap-5 "> */}
              <div className="grid xl:grid-cols-3 lg:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 mt-6 w-full gap-2 md:gap-5">
                <SuperAdminCard
                  icon={Groups}
                  // className={"!min-w-[150px]"}
                  title={"Total Employees"}
                  data={
                    EmployeeDataOfManager?.data[0]?.reporteeIds?.length ?? 0
                  }
                  color={"!bg-sky-500"}
                  cardSize={cardSize}
                />
                <SuperAdminCard
                  // className={"!min-w-[150px]"}
                  icon={AccessTime}
                  title={"Shift Allowance"}
                  isLoading={managerShiftLoading}
                  data={managerShift ?? 0}
                  color={"!bg-orange-500"}
                  cardSize={cardSize}
                  // 
                />
                <SuperAdminCard
                  icon={EventAvailable}
                  // className={"!min-w-[150px]"}
                  data={
                    EmployeeDataOfManager?.data[0]?.reporteeIds?.length -
                      managerAttendence ?? 0
                  }
                  isLoading={managerAttendenceLoading}
                  title={"Present Today"}
                  color={"!bg-green-500"}
                  cardSize={cardSize}
                />
                <SuperAdminCard
                  icon={EventBusy}
                  // className={"!min-w-[150px]"}
                  data={managerAttendence ?? 0}
                  isLoading={managerAttendenceLoading}
                  title={"Today's Leave"}
                  color={"!bg-red-500"}
                  cardSize={cardSize}
                />
              </div>

              {/* <hr /> */}

              <div className="block  2xl:space-y-0 space-y-3">
                <ManagerEmployeeChart
                  EmployeeDataOfManager={EmployeeDataOfManager}
                  selectedyear={selectedyear}
                  setSelectedYear={setSelectedYear}
                />
              </div>
            </div>

            <div className="w-full lg:w-[30%]  space-y-3">
              <EmployeeLeaveRequest />
            </div> 
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardManger;






// import {
//   AccessTime,
//   EventAvailable,
//   EventBusy,
//   Groups,
// } from "@mui/icons-material";
// import axios from "axios";
// import React, { useContext, useState } from "react";
// import { useQuery } from "react-query";
// import { useParams } from "react-router-dom";
// import { UseContext } from "../../State/UseState/UseContext";
// import UserProfile from "../../hooks/UserData/useUser";
// import SuperAdminCard from "./Components/Card/superadmin/SuperAdminCard";
// import ManagerEmployeeChart from "./Components/Custom/ManagerEmployeeChart";
// import EmployeeLeaveRequest from "./Components/List/EmployeLeaveReqest";

// const DashboardManger = () => {
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { organisationId } = useParams("");
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();

//   const [selectedyear, setSelectedYear] = useState({
//     value: new Date().getFullYear(),
//     label: new Date().getFullYear(),
//   });

//   const getAllEmployeeForManger = async () => {
//     const { data } = await axios.get(
//       `${process.env.REACT_APP_API}/route/employee/countofEmployees`,
//       {
//         headers: {
//           Authorization: authToken,
//         },
//       }
//     );
//     return data;
//   };

//   const { data: EmployeeDataOfManager } = useQuery(
//     "employeeData",
//     getAllEmployeeForManger
//   );

//   const getManagerAttendenceChart = async () => {
//     const { data } = await axios.get(
//       `${process.env.REACT_APP_API}/route/leave/getManagerEmployeeAttendence/${user._id}`,
//       {
//         headers: {
//           Authorization: authToken,
//         },
//       }
//     );
//     return data;
//   };

//   useQuery(["manager-attendece"], getManagerAttendenceChart);

//   const { data: managerShift, isLoading: managerShiftLoading } = useQuery({
//     queryKey: ["deptEmployeeOnShift"],
//     queryFn: async () => {
//       const { data } = await axios.get(
//         `${process.env.REACT_APP_API}/route/leave/getManagerShifts/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return data;
//     },
//   });

//   const { data: managerAttendence, isLoading: managerAttendenceLoading } =
//     useQuery({
//       queryKey: ["deptEmployeeAbsent"],
//       queryFn: async () => {
//         const { data } = await axios.get(
//           `${process.env.REACT_APP_API}/route/leave/getTodaysAbsentUnderManager/${organisationId}`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//         return data;
//       },
//     });

//   return (
//     <section className="bg-gray-50 min-h-screen w-full">
//       <header className="text-xl w-full pt-6 bg-white border-b p-4 px-8">
//         Manager Dashboard
//       </header>

//       <div className="lg:px-8 sm:px-4 px-2 w-full">
//         <div className="flex flex-col gap-6 mt-6">
//           {/* Cards Row */}
//           <div className="flex flex-wrap gap-5">
//             <SuperAdminCard
//               icon={Groups}
//               title={"Total Employees"}
//               data={EmployeeDataOfManager?.data[0]?.reporteeIds?.length ?? 0}
//               color={"!bg-sky-500"}
//             />
//             <SuperAdminCard
//               icon={AccessTime}
//               title={"Shift Allowance"}
//               isLoading={managerShiftLoading}
//               data={managerShift ?? 0}
//               color={"!bg-orange-500"}
//             />
//             <SuperAdminCard
//               icon={EventAvailable}
//               data={
//                 EmployeeDataOfManager?.data[0]?.reporteeIds?.length -
//                 managerAttendence ?? 0
//               }
//               isLoading={managerAttendenceLoading}
//               title={"Present Today"}
//               color={"!bg-green-500"}
//             />
//             <SuperAdminCard
//               icon={EventBusy}
//               data={managerAttendence ?? 0}
//               isLoading={managerAttendenceLoading}
//               title={"Today's Leave"}
//               color={"!bg-red-500"}
//             />
//           </div>

//           {/* Chart and Leave Requests Section */}
//           {/* <div className="flex flex-col lg:flex-row gap-6">
//             <div className="flex-1">
//               <ManagerEmployeeChart
//                 EmployeeDataOfManager={EmployeeDataOfManager}
//                 selectedyear={selectedyear}
//                 setSelectedYear={setSelectedYear}
//               />
//             </div>
//             <div className="flex-1">
//               <EmployeeLeaveRequest />
//             </div>
//           </div> */}
//           <div className="flex flex-row gap-6">
//   <div className="w-9/12">
//     <ManagerEmployeeChart
//       EmployeeDataOfManager={EmployeeDataOfManager}
//       selectedyear={selectedyear}
//       setSelectedYear={setSelectedYear}
//     />
//   </div>
//   <div className="w-3/12">
//     <EmployeeLeaveRequest />
//   </div>
// </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default DashboardManger;
