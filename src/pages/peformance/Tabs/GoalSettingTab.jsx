import { InfoOutlined } from "@mui/icons-material";
import axios from "axios";
import { format } from "date-fns";
import moment from "moment";
import React, { useState } from "react";
import { useQuery } from "react-query";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import GoalsTable from "../components/GoalsTable";

const GoalSettingTab = () => {
  const authToken = useAuthToken();
  const [message, setMessage] = useState("Welcome to Goal Settings");
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const { data: performance } = useQuery(
    "performancePeriod",
    async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/performance/getSetup/${user.organizationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return data;
    },

    {
      onSuccess: (data) => {
        const endDate = moment(data.enddate); // replace with your actual endDate field
        const currentDate = moment();

        console.log(data.enddate, endDate.diff(currentDate, "days"));
        if (data?.stages === "Send form to employee") {
          if (endDate.diff(currentDate, "days") <= 2) {
            setMessage(
              "The submission period for employee forms is soon closing."
            );
          }
          if (endDate.diff(currentDate, "days") > 0) {
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
          if (endDate.diff(currentDate, "days") === 0) {
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
          if (endDate.diff(currentDate, "days") === 0) {
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
          if (endDate.diff(currentDate, "days") === 0) {
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
        <div className="w-full p-4  ">
          <h1 className="text-2xl ">Goal Settings</h1>
          <p>Manage and organize goals setting</p>
        </div>
      </div>

      <div className="flex  px-4  gap-8">
        <div className="min-w-[250px] border rounded-md">
          <div className=" px-4 py-3 bg-white  rounded-lg leading-none flex items-top justify-start space-x-6">
            <div className="space-y-1">
              <h1 className="text-xl ">Performance Period</h1>
              <p className="text-sm text-slate-800 ">
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
              <h1 className="text-xl text-slate-800">Performance Stage</h1>
              <p className="text-sm text-slate-800 ">{performance?.stages}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 w-full h-max">
        <div className="bg-blue-100 p-2 overflow-hidden rounded-md">
          <h1 className="text-lg scrolling-text text-red-600   gap-2 flex items-center">
            <InfoOutlined /> Important Notice :- {message}
          </h1>
        </div>
      </div>

      <GoalsTable performance={performance} />
    </div>
  );
};

export default GoalSettingTab;
