import { Info, RequestQuote, Search, West } from "@mui/icons-material";
import { Avatar, CircularProgress } from "@mui/material";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import LeaveRejectmodal from "../../components/Modal/LeaveModal/LeaveRejectmodal";
import useLeaveNotificationHook from "../../hooks/QueryHook/notification/leave-notification/hook";
import useAuthToken from "../../hooks/Token/useAuth";
const LeaveAcceptModal = () => {
  const authToken = useAuthToken();
  const { employeeId } = useParams();
  const { data } = useLeaveNotificationHook();

  const { data: EmpNotification, isLoading: empDataLoading } = useQuery({
    queryKey: ["EmpDataLeave", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/leave/get/${employeeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        console.log("this is my data bro", res.data);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    enabled: employeeId !== undefined,
  });

  const navigate = useNavigate();
  return (
    <div>
      <header className="text-xl w-full pt-6 border bg-white shadow-md p-4">
        <span className="cursor-pointer" onClick={() => navigate(-1)}>
          <West className="mx-4 !text-xl" />
        </span>
        Employee Attendance and Leave Request
      </header>
      <section className="min-h-[90vh] flex  ">
        <article className="md:w-[25%] w-[200px] overflow-auto max-h-[90vh] h-full bg-white  border-gray-200">
          <div className="p-6 !py-2  ">
            <div className="space-y-2">
              <div
                className={`
                  flex  rounded-md items-center px-2 outline-none border-gray-200 border-[.5px]  bg-white py-1 md:py-[6px]`}
              >
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type={"test"}
                  placeholder={"Search Employee"}
                  className={`border-none bg-white w-full outline-none md:px-2 px-0  `}
                />
              </div>
            </div>
          </div>
          {data?.arrayOfEmployee?.map(
            (employee, idx) =>
              employee !== null && (
                <Link
                  to={`/leave-notification/${employee?._id}`}
                  className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 ${
                    employee?._id === employeeId &&
                    "bg-blue-500 text-white hover:!bg-blue-300"
                  }`}
                  key={idx}
                >
                  <Avatar />
                  <div>
                    <h1 className="md:text-[1.2rem] text-sm">
                      {employee?.first_name} {employee?.last_name}
                    </h1>
                    <h1
                      className={`md:text-sm text-xs text-gray-500 ${
                        employee?._id === employeeId && "text-white"
                      }`}
                    >
                      {employee?.email}
                    </h1>
                  </div>
                </Link>
              )
          )}
        </article>

        <article className="w-[75%] min-h-[90vh] border-l-[.5px]  bg-gray-50">
          {empDataLoading ? (
            <div className="flex items-center justify-center my-2">
              <CircularProgress />
            </div>
          ) : employeeId ? (
            EmpNotification?.length <= 0 ? (
              <div className="flex px-4 w-full items-center my-4">
                <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                  <Info /> No Leave Request Found
                </h1>
              </div>
            ) : (
              <>
                <div className="p-4 space-y-1 flex items-center gap-3">
                  <Avatar className="text-white !bg-blue-500">
                    <RequestQuote />
                  </Avatar>
                  <div>
                    <h1 className=" md:text-xl text-lg ">
                      Attendance & Leave Requests
                    </h1>
                    <p className="text-sm">
                      Here you will be able to approve or reject the attendance
                      & leave notifications
                    </p>
                  </div>
                </div>

                <div className=" md:px-4 px-0 ">
                  {EmpNotification?.leaveRequests?.map((items, itemIndex) => (
                    <LeaveRejectmodal
                      items={items}
                      idx={itemIndex}
                      length={EmpNotification?.leaveRequests?.length}
                    />
                  ))}
                </div>
              </>
            )
          ) : (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="md:text-lg text-sm w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> Select employee to see their requests
              </h1>
            </div>
          )}
        </article>
      </section>
    </div>
  );
};
export default LeaveAcceptModal;