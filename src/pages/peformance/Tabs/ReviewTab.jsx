import { format } from "date-fns";
import moment from "moment";
import { default as React, useState } from "react";
import { useQuery } from "react-query";
import usePerformanceApi from "../../../hooks/Performance/usePerformanceApi";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import Message from "../components/Message";
import ReviewTable from "../components/Review/ReviewTable";

const ReviewTab = () => {
  const authToken = useAuthToken();
  const [message, setMessage] = useState("Welcome to Goal Settings");
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();

  const { fetchPerformanceSetup } = usePerformanceApi();
  const { data: performance } = useQuery(
    ["performancePeriod"],
    () => fetchPerformanceSetup({ user, authToken }),
    {
      onSuccess: (data) => {
        const endDate = moment(data.enddate); // replace with your actual endDate field
        const currentDate = moment();

        console.log("enddate", endDate.diff(currentDate, "days"));
        if (data?.stages === "Send form to employee") {
          if (endDate.diff(currentDate, "days") <= 2) {
            setMessage(
              "The submission period for employee forms is soon closing."
            );
          }
          if (endDate.diff(currentDate, "days") < 0) {
            setMessage("Time for sending for has been ended.");
          } else {
            setMessage(
              "The process to send the form to the employee has now started."
            );
          }
        }

        if (data?.stages === "Goal setting") {
          if (endDate.diff(currentDate, "days") <= 2) {
            setMessage(
              "The submission period for goal setting is soon closing."
            );
          }
          if (endDate.diff(currentDate, "days") < 0) {
            setMessage("Time for setting up goal has been ended.");
          } else {
            setMessage("The process to set up goal has now started.");
          }
        }

        if (
          data?.stages === "KRA stage/Ratings Feedback/Manager review stage"
        ) {
          if (endDate.diff(currentDate, "days") <= 2) {
            setMessage(
              "The submission period for KRA stage/Ratings Feedback/Manager review is soon closing."
            );
          }
          if (endDate.diff(currentDate, "days") < 0) {
            setMessage(
              "Time for KRA stage/Ratings Feedback/Manager review has been ended."
            );
          } else {
            setMessage(
              "The process to KRA stage/Ratings Feedback/Manager review has now started."
            );
          }
        }
        if (data?.stages === "Monitoring stage/Feedback collection stage") {
          if (endDate.diff(currentDate, "days") < 0) {
            setMessage(
              "The submission period for KRA stage/Ratings Feedback/Manager review is soon closing."
            );
          }
          if (endDate.diff(currentDate, "days") < 0) {
            setMessage(
              "Time for KRA stage/Ratings Feedback/Manager review has been ended."
            );
          } else {
            setMessage(
              "The process to KRA stage/Ratings Feedback/Manager review has now started."
            );
          }
        }
        if (data?.stages === "Employee acceptance/acknowledgement stage") {
          if (endDate.diff(currentDate, "days") <= 2) {
            setMessage(
              "The submission period for employee acceptance/acknowledgement is soon closing."
            );
          }
          if (endDate.diff(currentDate, "days") < 0) {
            setMessage(
              "Time for employee acceptance/acknowledgement has been ended."
            );
          } else {
            setMessage(
              "The process to accept/acknowledge goal has now started."
            );
          }
        }
      },
    }
  );

  return (
    <div>
      <div className="flex items-center justify-between ">
        {/* <div className="w-full px-8 py-4  ">
          <h1 className="text-2xl ">Goal Settings</h1>
          <p>Manage and organize goals setting</p>
        </div> */}

        <div class="flex items-center justify-between ">
          <div class="space-y-1">
            <h2 class=" text-2xl tracking-tight">Review & Rate Employees</h2>
            <p class="text-sm text-muted-foreground">
              Rate and review employees based on their performance
            </p>
          </div>
        </div>
      </div>

      {/* <div className="py-4 w-full h-max">
        <div className="bg-blue-100 p-2 overflow-hidden rounded-md">
          <h1 className="text-lg scrolling-text text-red-600   gap-2 flex items-center">
            <InfoOutlined /> Important Notice :- {message}
          </h1>
        </div>
      </div> */}
      <Message />

      <div className="flex  pb-4  gap-8">
        <div className="min-w-[250px] border rounded-md">
          <div className=" px-4 py-3 bg-white  rounded-lg leading-none flex items-top justify-start space-x-6">
            <div className="space-y-1">
              <h1 className=" font-semibold text-[#67748E] ">
                Performance Period
              </h1>
              <p className="text-md  tracking-tight ">
                {performance?.appraisalStartDate &&
                  format(new Date(performance?.appraisalStartDate), "PP")}{" "}
                -{" "}
                {performance?.appraisalEndDate &&
                  format(new Date(performance?.appraisalEndDate), "PP")}
              </p>
            </div>
          </div>
        </div>
        <div className="min-w-[250px] border rounded-md">
          <div className=" px-4 py-3 bg-white  rounded-lg leading-none flex items-top justify-start space-x-6">
            <div className="space-y-1">
              <h1 className="font-semibold text-[#67748E] ">
                Current Cycle Period
              </h1>
              <p className="text-md  tracking-tight ">
                {performance?.startdate &&
                  format(new Date(performance?.startdate), "PP")}{" "}
                -{" "}
                {performance?.enddate &&
                  format(new Date(performance?.enddate), "PP")}
              </p>
            </div>
          </div>
        </div>
        <div className="min-w-[250px] border rounded-md">
          <div className=" px-4 py-3 bg-white  rounded-lg leading-none flex items-top justify-start space-x-6">
            <div className="space-y-1">
              <h1 className="font-semibold text-[#67748E] ">
                Performance Stage
              </h1>
              <p className="text-md  tracking-tight ">{performance?.stages}</p>
            </div>
          </div>
        </div>
      </div>

      <ReviewTable />
      {/* <GoalsTable performance={performance} /> */}
    </div>
  );
};

export default ReviewTab;
