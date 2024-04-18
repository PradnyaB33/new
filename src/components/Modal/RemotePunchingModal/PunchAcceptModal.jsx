import { Info, RequestQuote, Search, West } from "@mui/icons-material";
import { Avatar, CircularProgress } from "@mui/material";
import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import usePunchNotification from "../../../hooks/QueryHook/notification/punch-notification/hook";
import useAuthToken from "../../../hooks/Token/useAuth";
import PunchMapModal from "./components/mapped-form";

const PunchAcceptModal = () => {
  const authToken = useAuthToken();
  const { employeeId } = useParams();
  const { data } = usePunchNotification();
  console.log("my data", data?.arrayOfEmployee);

  const { data: EmpNotification, isLoading: empDataLoading } = useQuery({
    queryKey: ["EmpDataPunch", employeeId],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/route/punch-notification/notification-user/${employeeId}`,
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

  return (
    <div>
      <header className="text-xl w-full pt-6 border bg-white shadow-md   p-4">
        <Link to={"/income-tax"}>
          <West className="mx-4 !text-xl" />
        </Link>
        Employee Punch Request
      </header>
      <section className="min-h-[90vh] flex  ">
        <article className="w-[25%] overflow-auto max-h-[90vh] h-full bg-white  border-gray-200">
          <div className="p-6 !py-2  ">
            <div className="space-y-2">
              <div
                // onFocus={() => {
                //   handleFocus(name);
                // }}
                // onBlur={() => setFocusedInput(null)}
                className={
                  //  ${
                  //   focusedInput === name
                  //     ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                  //     : "outline-none border-gray-200 border-[.5px]"
                  //                   }
                  `
                  flex  rounded-md items-center px-2 outline-none border-gray-200 border-[.5px]  bg-white py-1 md:py-[6px]`
                }
              >
                <Search className="text-gray-700 md:text-lg !text-[1em]" />

                <input
                  type={"test"}
                  placeholder={"Search Employee"}
                  className={`border-none bg-white w-full outline-none px-2  `}
                />
              </div>
            </div>
          </div>
          {data?.arrayOfEmployee?.map(
            (employee, idx) =>
              employee !== null && (
                <Link
                  to={`/punch-notification/${employee?._id}`}
                  className={`px-6 my-1 mx-3 py-2 flex gap-2 rounded-md items-center hover:bg-gray-50 ${
                    employee?._id === employeeId &&
                    "bg-blue-500 text-white hover:!bg-blue-300"
                  }`}
                  key={idx}
                >
                  <Avatar />
                  <div>
                    <h1 className="text-[1.2rem]">
                      {employee?.first_name} {employee?.last_name}
                    </h1>
                    <h1
                      className={`text-sm text-gray-500 ${
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
                  <Info /> No Punch Request Found
                </h1>
              </div>
            ) : (
              <>
                <div className="p-4 space-y-1 flex items-center gap-3">
                  <Avatar className="text-white !bg-blue-500">
                    <RequestQuote />
                  </Avatar>
                  <div>
                    <h1 className=" text-xl">Punch Requests</h1>
                    <p className="text-sm">
                      Here manager would be able to approve or reject the punch
                      notifications
                    </p>
                  </div>
                </div>

                <div className=" px-4 ">
                  {EmpNotification?.punchNotification?.map(
                    (items, itemIndex) => (
                      <PunchMapModal items={items} />
                    )
                  )}
                </div>
              </>
            )
          ) : (
            <div className="flex px-4 w-full items-center my-4">
              <h1 className="text-lg w-full  text-gray-700 border bg-blue-200 p-4 rounded-md">
                <Info /> Select employee to see their requests
              </h1>
            </div>
          )}
        </article>
      </section>
    </div>
  );
};
export default PunchAcceptModal;
