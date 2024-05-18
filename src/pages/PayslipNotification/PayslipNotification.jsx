import React, { useState } from "react";
import usePayslipNotificationHook from "../../hooks/QueryHook/notification/PayslipNotification/usePayslipNotificaitonHook";
import dayjs from "dayjs";
import { Container } from "@mui/material";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
const PayslipNotification = () => {
  const { PayslipNotification } = usePayslipNotificationHook();
  console.log("payslipdata", PayslipNotification);

  // for select date
  const [selectedDate, setSelectedDate] = useState(null);
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value ? dayjs(event.target.value) : null);
  };

  const monthFromSelectedDate = selectedDate ? selectedDate.format("M") : null;
  const yearFromSelectedDate = selectedDate
    ? selectedDate.format("YYYY")
    : null;
  console.log({ monthFromSelectedDate, yearFromSelectedDate });

  const filteredPayslip = selectedDate
    ? PayslipNotification.find(
        (payslip) =>
          payslip.month === parseInt(monthFromSelectedDate) &&
          payslip.year === parseInt(yearFromSelectedDate)
      )
    : null;

  const getMonthName = (monthNumber) => {
    return dayjs()
      .month(monthNumber - 1)
      .format("MMMM");
  };

  return (
    <>
      <div style={{ marginTop: "5%" }}>
        <Container maxWidth="xl" className="bg-gray-50 min-h-screen mt-4">
          <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center">
            <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
              <div className="flex gap-3">
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
              <div className="flex flex-col gap-3 mb-3 md:mb-0">
                <h3 className="text-lg font-bold text-gray-700">
                  Please select the month
                </h3>
                <input
                  type="month"
                  value={selectedDate ? selectedDate.format("YYYY-MM") : ""}
                  onChange={handleDateChange}
                  style={{ width: "500px" }}
                  className="border border-gray-300 rounded-md p-2 mt-2"
                />
              </div>
            </div>
            {filteredPayslip ? (
              <div className="p-4">
                <Stack sx={{ width: "100%" }} spacing={2}>
                  <Alert severity="success">
                    {" "}
                    Your salary calculated for{" "}
                    {getMonthName(filteredPayslip.month)} {filteredPayslip.year}{" "}
                    .
                  </Alert>
                </Stack>
              </div>
            ) : selectedDate ? (
              <div className="p-4">
                {/* <h3 className="text-lg font-bold text-gray-700">
                  No payslip data found for the selected month and year.
                </h3> */}
                <Stack sx={{ width: "100%" }} spacing={2}>
                  <Alert severity="error">
                    No payslip created for the selected month and year..
                  </Alert>
                </Stack>
              </div>
            ) : (
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-700 mb-5">
                  All Payslip Notification
                </h3>
                {PayslipNotification &&
                  PayslipNotification.map((payslip) => (
                    <div key={payslip._id} className="mb-4">
                      <Stack sx={{ width: "100%" }} spacing={2}>
                        <Alert severity="success">
                          {" "}
                          Your salary calculated for{" "}
                          {getMonthName(payslip.month)} {payslip.year}.
                        </Alert>
                      </Stack>
                    </div>
                  ))}
              </div>
            )}
          </article>
        </Container>
      </div>
    </>
  );
};

export default PayslipNotification;
