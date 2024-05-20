import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import ViewLoanDataNotificationModal from "./ViewLoanDataNotificaitonModal";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import { Info } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay";
const LoanNotificationToEmp = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  //for get loan data
  const { data: getApprovedRejectLoanDataByApprover } = useQuery(
    ["getApprovedRejectedData"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-approved-reject-loan-to-employee`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );
  console.log("data", getApprovedRejectLoanDataByApprover);

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

  // Sorting loan data based on updatedAt
  const sortedLoanData = getApprovedRejectLoanDataByApprover
    ? getApprovedRejectLoanDataByApprover.slice().sort((a, b) => {
        const timeA = new Date(a.updatedAt).getTime();
        const timeB = new Date(b.updatedAt).getTime();
        return timeB - timeA;
      })
    : [];

  // for update
  const [viewLoanDataOpenModal, setViewLoanDataOpenModal] = useState(false);
  const [loanData, setLoanData] = useState(null);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("all");

  const handleOpenViewLoanDataModal = (loan) => {
    setViewLoanDataOpenModal(true);
    setLoanData(loan);
  };

  const handleCloseViewLoanDataModal = () => {
    setViewLoanDataOpenModal(false);
  };

  const handleTimePeriodChange = (event) => {
    setSelectedTimePeriod(event.target.value);
  };

  // Filter loan data based on selected time period
  const filteredLoanData = () => {
    if (selectedTimePeriod === "all") {
      return sortedLoanData;
    } else {
      const currentTime = new Date();
      const cutoffDate = new Date(
        currentTime.getFullYear(),
        currentTime.getMonth() - parseInt(selectedTimePeriod) + 1,
        1
      );
      return getApprovedRejectLoanDataByApprover.filter(
        (loan) => new Date(loan.updatedAt) <= cutoffDate
      );
    }
  };

  return (
    <>
      <div style={{ marginTop: "5%" }}>
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
                  <option value="6">Sixth Month Ago</option>
                  <option value="12">Year Ago</option>
                </select>
              </div>
            </div>
            {filteredLoanData().length > 0 ? (
              filteredLoanData().map((loanData, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 shadow-md mt-4"
                >
                  <div className="font-bold">
                    <p className="text-lg font-semibold">
                      {loanData.status === "Ongoing"
                        ? "This loan is approved"
                        : "This loan is not approved"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Updated {getTimeAgo(loanData.updatedAt)} ago by{" "}
                      {loanData.approvalIds &&
                        loanData.approvalIds
                          .map((approval) => approval.email)
                          .join(", ")}
                    </p>
                  </div>
                  <div>
                    <Box sx={{ p: 2 }}>
                      <div className="flex justify-center gap-10">
                        <CalendarViewDayIcon
                          onClick={() => handleOpenViewLoanDataModal(loanData)}
                          sx={{ color: "primary.main" }}
                        />
                        <CloseIcon />
                      </div>
                    </Box>
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

      {/* for view modal open*/}
      <ViewLoanDataNotificationModal
        handleClose={handleCloseViewLoanDataModal}
        open={viewLoanDataOpenModal}
        loanData={loanData}
      />
    </>
  );
};

export default LoanNotificationToEmp;
