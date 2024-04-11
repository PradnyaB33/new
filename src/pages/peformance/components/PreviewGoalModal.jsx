import { Close } from "@mui/icons-material";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Modal,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import React, { useContext } from "react";
import { useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";

const PreviewGoalModal = ({ open, handleClose, id, performance }) => {
  const { handleAlert } = useContext(TestContext);

  const authToken = useAuthToken();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    overflow: "scroll",
    maxHeigh: "80vh",
    p: 4,
  };

  const { data: getGoal, isFetching } = useQuery({
    queryKey: "getGoal",
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/performance/getGoalDetails/${id}`,
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

  const sanitizedDescription = DOMPurify.sanitize(getGoal?.description);
  const sanitizedMeasurment = DOMPurify.sanitize(getGoal?.measurement);
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const queryClient = useQueryClient();

  const { data: getSingleGoal } = useQuery({
    queryKey: "getSingleGoal",
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
    enabled: role === "Employee" && !!id,
  });
  const sanitizedReview = DOMPurify.sanitize(getSingleGoal?.review);

  const SubmitGoal = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/performance/submitGoals`,
        { goalId: id },
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
          {isFetching ? (
            <CircularProgress />
          ) : (
            <>
              <div className="flex justify-between py-4 items-center  px-4">
                <h1 id="modal-modal-title" className="text-2xl pl-2">
                  {getGoal?.goal}
                </h1>
                <IconButton onClick={handleClose}>
                  <Close className="!text-[16px]" />
                </IconButton>
              </div>

              <div className="space-y-4 pb-4 px-4">
                <div className="flex justify-between">
                  <div className="flex gap-2 items-center">
                    <div
                      className={`bg-green-500 flex rounded-md p-2 text-white  border-gray-200 border-[.5px]  items-center`}
                    >
                      {getSingleGoal?.status
                        ? getSingleGoal?.status
                        : "Pending"}
                    </div>
                    {getSingleGoal?.rating && (
                      <div className=" p-2 bg-gray-50 border-gray-200 border rounded-md">
                        Rating: - {getSingleGoal?.rating}
                      </div>
                    )}

                    <div className=" p-2 bg-gray-50 border-gray-200 border rounded-md">
                      Start Date: -{" "}
                      {getGoal?.startDate &&
                        format(new Date(getGoal?.startDate), "PP")}
                    </div>
                    <div className=" p-2 bg-gray-50 border-gray-200 border rounded-md">
                      End Date : -{" "}
                      {getGoal?.endDate &&
                        format(new Date(getGoal?.endDate), "PP")}
                    </div>
                  </div>

                  {role === "Employee" && (
                    <button
                      onClick={SubmitGoal}
                      className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-6 py-2 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
                    >
                      Submit Goal
                    </button>
                  )}
                </div>
                <div className="hover:bg-gray-100 rounded-md ">
                  <p className="px-2">Description</p>
                  <p
                    className="preview px-2 "
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  ></p>
                </div>
                <div className="hover:bg-gray-100 rounded-md ">
                  <p className="px-2">Measurments</p>
                  <p
                    className="preview px-2 "
                    dangerouslySetInnerHTML={{
                      __html: sanitizedMeasurment
                        ? sanitizedMeasurment
                        : "No data",
                    }}
                  ></p>
                </div>
                {getSingleGoal?.review && (
                  <div className="hover:bg-gray-100 rounded-md ">
                    <p className="px-2">Review</p>
                    <p
                      className="preview px-2 "
                      dangerouslySetInnerHTML={{
                        __html: sanitizedReview ? sanitizedReview : "No data",
                      }}
                    ></p>
                  </div>
                )}
                <div className="hover:bg-gray-100 rounded-md ">
                  <p className="px-2">Attachments</p>
                  <p className="px-2">No data</p>
                </div>
                {role === "Employee" && (
                  <div className="hover:bg-gray-100 rounded-md ">
                    <p className="px-2">Assigned to</p>
                    <p className="px-2">No data</p>
                  </div>
                )}
                <div className="hover:bg-gray-100 rounded-md ">
                  <p className="px-2">Reporter to</p>
                  <p className="px-2 mt-2 flex items-center gap-2">
                    <Avatar sx={{ width: 35, height: 35 }} /> Test user
                  </p>
                </div>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default PreviewGoalModal;
