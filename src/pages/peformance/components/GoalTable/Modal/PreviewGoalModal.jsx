import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal } from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import React, { useContext } from "react";
import { useQuery, useQueryClient } from "react-query";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import { TestContext } from "../../../../../State/Function/Main";
import useAuthToken from "../../../../../hooks/Token/useAuth";
import UserProfile from "../../../../../hooks/UserData/useUser";
import PreviewSkeleton from "../Skelton/PreviewSkeleton";

const PreviewGoalModal = ({ open, handleClose, id, performance, assignee }) => {
  const { handleAlert } = useContext(TestContext);
  const authToken = useAuthToken();

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

  const GoalStatus = [
    { label: "Not Started", value: "Not Started" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
    // { label: "Overdue", value: "Overdue" },
  ];

  // const sanitizedMeasurment = DOMPurify.sanitize(getGoal?.measurement);
  const { useGetCurrentRole, getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();
  const queryClient = useQueryClient();

  let { data: getSingleGoal, isFetching: goalFetching } = useQuery({
    queryKey: ["getSingleGoal", id],
    refetchOnMount: false,
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/performance/getSingleGoals/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    },
    enabled: !!id,
  });

  const sanitizedReview = DOMPurify.sanitize(getSingleGoal?.review);
  const sanitizedComments = DOMPurify.sanitize(getSingleGoal?.comments);
  const sanitizedmanagerMesurments = DOMPurify.sanitize(
    getSingleGoal?.measurments
  );
  const sanitizedDescription = DOMPurify.sanitize(getSingleGoal?.description);

  const SubmitGoal = async (goalStatus) => {
    try {
      const assignee = { label: user.name, value: user._id };

      let status =
        getSingleGoal?.creatorId === user._id
          ? "Goal Submitted"
          : "Goal Accepted";
      let requestData = { assignee, status };
      if (goalStatus)
        requestData = { ...requestData, goalStatus: goalStatus.value };

      await axios.patch(
        `${process.env.REACT_APP_API}/route/performance/updateSingleGoal/${id}`,
        { data: requestData },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", "Goal submitted successfully");
      queryClient.invalidateQueries("getSingleGoal");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
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
          {goalFetching ? (
            <PreviewSkeleton />
          ) : (
            <>
              <div className="flex justify-between py-4 items-center  px-4">
                <h1 id="modal-modal-title" className="text-2xl pl-2">
                  {getSingleGoal?.goal}
                </h1>
                <IconButton onClick={handleClose}>
                  <Close className="!text-[16px]" />
                </IconButton>
              </div>

              <div className="space-y-4 pb-4 px-4">
                <div className="flex justify-between">
                  <div className="flex w-full gap-2 items-center">
                    {/* <div
                      className={`bg-green-500 flex rounded-md p-2 text-white  border-gray-200 border-[.5px]  items-center`}
                    >
                      {getSingleGoal?.status
                        ? getSingleGoal?.status
                        : "Pending"}
                    </div> */}

                    <div className=" p-2 bg-gray-50 border-gray-200 border rounded-md">
                      Start Date: -{" "}
                      {getSingleGoal?.startDate &&
                        format(new Date(getSingleGoal?.startDate), "PP")}
                    </div>
                    <div className=" p-2 bg-gray-50 border-gray-200 border rounded-md">
                      End Date : -{" "}
                      {getSingleGoal?.endDate &&
                        format(new Date(getSingleGoal?.endDate), "PP")}
                    </div>

                    <div
                      className={`${"bg-[ghostwhite]"} flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center`}
                    >
                      {/* <Icon className="text-gray-700" /> */}
                      <Select
                        aria-errormessage=""
                        placeholder={"Status"}
                        styles={{
                          control: (styles) => ({
                            ...styles,
                            borderWidth: "0px",
                            boxShadow: "none",
                          }),
                        }}
                        components={{
                          IndicatorSeparator: () => null,
                        }}
                        value={GoalStatus?.find(
                          (item) => item.label === getSingleGoal?.goalStatus
                        )}
                        className={`${"bg-[ghostwhite]"} bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                        options={GoalStatus}
                        onChange={(value) => {
                          SubmitGoal(value);
                        }}
                      />
                    </div>
                  </div>

                  {role === "Employee" &&
                    getSingleGoal?.status === "pending" &&
                    performance?.stages === "Goal setting" && (
                      <div className="w-max">
                        <button
                          onClick={SubmitGoal}
                          className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-6 py-2 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
                        >
                          Submit Goal
                        </button>
                      </div>
                    )}
                </div>
                <div className="hover:bg-gray-100 rounded-md px-2">
                  <p className="font-semibold text-[#67748E]">Description</p>
                  <p
                    className="preview  "
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  ></p>
                </div>

                <div className="hover:bg-gray-100 rounded-md  px-2 ">
                  <p className="font-semibold text-[#67748E]">Measurments</p>
                  <p
                    className="preview"
                    dangerouslySetInnerHTML={{
                      __html: sanitizedmanagerMesurments
                        ? sanitizedmanagerMesurments
                        : "No data",
                    }}
                  ></p>
                </div>
                <div className="hover:bg-gray-100 rounded-md  px-2 ">
                  <p className="font-semibold text-[#67748E]">
                    Monitoring points
                  </p>
                  <p
                    className="preview"
                    dangerouslySetInnerHTML={{
                      __html: sanitizedComments ? sanitizedComments : "No data",
                    }}
                  ></p>
                </div>

                {getSingleGoal?.rating && (
                  <div className="hover:bg-gray-100 rounded-md px-2">
                    <p className="font-semibold text-[#67748E]">Ratings</p>
                    <p className="preview ">{getSingleGoal?.rating}</p>
                  </div>
                )}
                {getSingleGoal?.review && (
                  <div className="hover:bg-gray-100 rounded-md px-2">
                    <p className="font-semibold text-[#67748E]">Review</p>
                    <p
                      className="preview "
                      dangerouslySetInnerHTML={{
                        __html: sanitizedReview ? sanitizedReview : "No data",
                      }}
                    ></p>
                  </div>
                )}
                <div className="hover:bg-gray-100 rounded-md px-2">
                  <p className="font-semibold text-[#67748E]">Attachments</p>
                  <p className="">No data</p>
                </div>
                {role === "Employee" && (
                  <div className="hover:bg-gray-100 rounded-md ">
                    <p className="px-2">Assigned to</p>
                    <p className="">No data</p>
                  </div>
                )}
                {/* <div className="hover:bg-gray-100 rounded-md ">
                  <p className="px-2">Reporter to</p>
                  <p className="px-2 mt-2 flex items-center gap-2">
                    <Avatar sx={{ width: 35, height: 35 }} /> Test user
                  </p>
                </div> */}
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default PreviewGoalModal;
