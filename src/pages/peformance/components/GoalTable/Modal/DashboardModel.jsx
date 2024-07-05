import { Close } from "@mui/icons-material";
import { Avatar, Box, IconButton, Modal } from "@mui/material";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import React from "react";
import { useQuery } from "react-query";
import EmptyAlertBox from "../../../../../components/EmptyAlertBox";
import usePerformanceApi from "../../../../../hooks/Performance/usePerformanceApi";
import useAuthToken from "../../../../../hooks/Token/useAuth";
import UserProfile from "../../../../../hooks/UserData/useUser";
import PreviewSkeleton from "../Skelton/PreviewSkeleton";

const DashboardModel = ({ open, handleClose, id }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    overflow: "auto",
    maxHeight: "80vh",
    p: 4,
  };

  const user = UserProfile()?.getCurrentUser();
  const authToken = useAuthToken();
  const { getEmployeePerformanceTable } = usePerformanceApi();

  const { data: empData, isFetching: empDashFetching } = useQuery(
    {
      queryKey: ["employeePerformanceTable", id],
      queryFn: () => getEmployeePerformanceTable({ authToken, empId: id }),
    },
    { enabled: id !== null || id !== undefined }
  );

  console.log(empData, id);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[70%] md:!w-[70%] shadow-md outline-none rounded-md"
      >
        {empDashFetching ? (
          <PreviewSkeleton />
        ) : (
          <>
            <div className="flex justify-between py-4 items-center  px-4">
              <div className="flex w-max items-center gap-4">
                <Avatar src={empData?.empId?.user_logo_url} />
                <h1 className="text-2xl space-x-3 truncate">
                  {empData?.empId?.first_name} {empData?.empId?.last_name}
                </h1>
              </div>
              <IconButton onClick={handleClose}>
                <Close className="!text-[16px]" />
              </IconButton>
            </div>
            <div className="space-y-4 pb-4 px-4">
              <div className="flex flex-wrap w-full gap-2 items-center">
                <div className="px-4 p-2 bg-gray-50 border-gray-200 border rounded-md">
                  Rating:{" "}
                  {empData?.managerRating
                    ? empData?.managerRating
                    : "Rating not given"}
                </div>
                <div className="px-4 p-2 bg-gray-50 border-gray-200 border rounded-md">
                  Goals Completed:{" "}
                  {empData?.goals?.reduce((i, acc) => {
                    if (acc?.goalStatus === "Completed") {
                      return i + 1;
                    }
                    return i;
                  }, 0)}{" "}
                  / {empData?.goals?.length}
                </div>
                <div className="px-4 p-2 bg-gray-50 border-gray-200 border rounded-md">
                  Goals Overdue:{" "}
                  {empData?.goals?.reduce((i, acc) => {
                    const { goalStatus, endDate } = acc;
                    const today = new Date();
                    const goalEndDate = new Date(endDate);
                    if (goalEndDate < today && goalStatus !== "Completed") {
                      return i + 1;
                    }
                    return i;
                  }, 0)}
                </div>
              </div>

              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    empData?.managerFeedback
                      ? `Review : ${empData?.managerFeedback}`
                      : "Review : Not yet reviewed by manager"
                  ),
                }}
                className="px-4 p-2 bg-gray-50 border-gray-200 border rounded-md"
              ></div>

              {/* another */}
              {empData?.goals?.length === 0 ? (
                <EmptyAlertBox title={"Goals not found for this employee"} />
              ) : (
                <table className=" overflow-auto table-fixed  border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
                  <thead className="border-b bg-gray-100 font-bold">
                    <tr className="!font-semibold ">
                      <th
                        scope="col"
                        className="!text-left px-2 w-max py-3 text-sm "
                      >
                        Sr. No
                      </th>
                      <th scope="col" className="py-3 text-sm px-2 ">
                        Goal Name
                      </th>
                      {/* <th scope="col" className="py-3 text-sm px-2 ">
                        Goal Measurements
                      </th> */}
                      <th scope="col" className="py-3 text-sm px-2 ">
                        Timeline
                      </th>

                      <th scope="col" className="py-3 text-sm px-2 ">
                        Goal status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {empData?.goals?.map((goal, index) => (
                      <tr
                        className={` hover:bg-gray-50 !font-medium  w-max border-b `}
                      >
                        <td className="!text-left  cursor-pointer py-4 px-2 text-sm w-max  ">
                          {index + 1}
                        </td>
                        <td className="w-max px-2 hover:bg-gray-50 !font-medium   border-b">
                          {goal?.goal}
                        </td>
                        {/* <td
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(goal?.measurments),
                          }}
                          className="w-max px-2 hover:bg-gray-50 !font-medium   border-b"
                        ></td> */}

                        <td className="w-max px-2 hover:bg-gray-50 !font-medium   border-b">
                          {format(new Date(goal?.startDate), "PP")} -{" "}
                          {format(new Date(goal?.endDate), "PP")}
                        </td>
                        <td
                          className={`
                       
                        w-max px-2 hover:bg-gray-50 !font-medium   border-b`}
                        >
                          <div
                            className={`font-bold  rounded-md w-max  ${
                              new Date(goal?.endDate) < new Date()
                                ? " !text-orange-500 "
                                : goal?.goalStatus === "Not started"
                                ? " !text-gray-500 "
                                : goal?.goalStatus === "In Progress"
                                ? " !text-blue-500 "
                                : goal?.goalStatus === "Completed"
                                ? " !text-green-500 "
                                : " !text-gray-500 "
                            }`}
                          >
                            {new Date(goal?.endDate) < new Date()
                              ? "Over Due"
                              : goal?.goalStatus ?? "-"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default DashboardModel;
