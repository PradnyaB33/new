import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { Info } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";

const MissedPunchNotificationToEmp = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  //for get loan data
  const { data: getMissedPunchData } = useQuery(
    ["getMissedPunchData"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/missed-punch-notification-to-employee`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  const getTimeAgo = (updatedAt) => {
    const now = new Date();
    const updatedTime = new Date(updatedAt);
    const elapsedMilliseconds = now - updatedTime;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    if (elapsedSeconds < 60) {
      return `${elapsedSeconds} seconds`;
    } else if (elapsedSeconds < 3600) {
      const minutes = Math.floor(elapsedSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else if (elapsedSeconds < 86400) {
      const hours = Math.floor(elapsedSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      const days = Math.floor(elapsedSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""}`;
    }
  };

  // Sorting missed punch data based on updatedAt
  const sortedMissedPunchData = getMissedPunchData
    ? getMissedPunchData.slice().sort((a, b) => {
        const timeA = new Date(a.updatedAt).getTime();
        const timeB = new Date(b.updatedAt).getTime();
        return timeB - timeA;
      })
    : [];

  const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");
  const handleTimePeriodChange = (event) => {
    setSelectedTimePeriod(event.target.value);
  };

  // Filter loan data based on selected time period
  const filteredMissedPunchData = () => {
    if (selectedTimePeriod === "all") {
      console.log(sortedMissedPunchData);
      return sortedMissedPunchData;
    } else {
      const currentTime = new Date();
      const cutoffDate = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth() - parseInt(selectedTimePeriod) + 1,
        1
      );
      return getMissedPunchData.filter(
        (data) => new Date(data.updatedAt) <= cutoffDate
      );
    }
  };

  return (
    <>
      <div style={{ marginTop: "7%" }}>
        <Container maxWidth="xl" className="bg-gray-50 min-h-screen mt-4">
          <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center">
            <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
              <div className="flex  gap-3 ">
                <div className="mt-1">
                  <CircleNotificationsIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Notification</h1>
                  <p className="text-xs text-gray-600">
                    Here you can see your notification.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
              <div className="flex items-center gap-3 mb-3 md:mb-0">
                <select
                  value={selectedTimePeriod}
                  onChange={handleTimePeriodChange}
                  className="bg-white border rounded-lg px-3 py-2 outline-none "
                  style={{ width: "300px" }}
                >
                  <option value="all">All</option>
                  <option value="1">Last Month Ago</option>
                  <option value="2">Second Month Ago</option>
                  <option value="3">Third Month Ago</option>
                  <option value="4">Fourth Month Ago</option>
                  <option value="5">Fifth Month Ago</option>
                  <option value="6">Sixth Month Ago</option>
                  <option value="7">Seventh Month Ago</option>
                  <option value="8">Eigth Month Ago</option>
                  <option value="9">Ningth Month Ago</option>
                  <option value="10">Tenth Month Ago</option>
                  <option value="11">Eleventh Month Ago</option>
                  <option value="12">Year Ago</option>
                </select>
              </div>
              <Box sx={{ p: 2 }}>
                <div className="flex justify-center gap-10">
                  <CloseIcon />
                </div>
              </Box>
            </div>
            {filteredMissedPunchData().length > 0 ? (
              filteredMissedPunchData().map((missedData, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 shadow-md mt-4"
                >
                  <div className="font-bold">
                    {missedData.unavailableRecords &&
                      missedData.unavailableRecords.map((record, id) => (
                        <div key={id} className="mb-2">
                          <p className="text-lg font-semibold">
                            {record.status === "Available"
                              ? `${moment(record.recordDate).format(
                                  "YYYY-MM-DD"
                                )}   This unavailable record is approved as available`
                              : ` ${moment(record.recordDate).format(
                                  "YYYY-MM-DD"
                                )} This unavailable record is approved as a leave.`}
                          </p>
                          <p className="text-sm text-gray-500">
                            Updated {getTimeAgo(record.updatedAt)} ago by{" "}
                            {record.approvedId.email}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="!text-2xl" />
                  <h1 className="text-lg font-semibold">No Notifications</h1>
                </article>
                <p>No notifications found.</p>
              </section>
            )}
          </article>
        </Container>
      </div>
    </>
  );
};

export default MissedPunchNotificationToEmp;
