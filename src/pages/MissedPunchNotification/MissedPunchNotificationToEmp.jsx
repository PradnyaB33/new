import React, { useContext, useState } from "react";
import { Container } from "@mui/material";
import { useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { Info } from "@mui/icons-material";
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
  console.log(getMissedPunchData);

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

  const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");
  const handleTimePeriodChange = (event) => {
    setSelectedTimePeriod(event.target.value);
  };

  const filteredMissedPunchData = () => {
    if (!getMissedPunchData) {
      return [];
    }

    if (selectedTimePeriod === "all") {
      return getMissedPunchData;
    } else {
      const filteredData = [];
      getMissedPunchData.forEach((data) => {
        const filteredRecords = data.unavailableRecords.filter(
          (record) => record.status === selectedTimePeriod
        );
        if (filteredRecords.length > 0) {
          filteredData.push({
            ...data,
            unavailableRecords: filteredRecords,
          });
        }
      });
      return filteredData;
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
                <label htmlFor="statusDropdown">Select Status: </label>
                <select
                  id="statusDropdown"
                  value={selectedTimePeriod}
                  onChange={handleTimePeriodChange}
                  className="bg-white border rounded-lg px-3 py-2 outline-none "
                  style={{ width: "300px" }}
                >
                  <option value="all">All</option>
                  <option value="Available">Available</option>
                  <option value="Leave">Leave</option>
                </select>
              </div>
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
