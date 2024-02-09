import React, { useContext, useState } from "react";

import { Info, WorkHistory } from "@mui/icons-material";
import { Autocomplete, Avatar, Card, TextField } from "@mui/material";
import axios from "axios";
import { CategoryScale, Chart } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
import UserProfile from "../../../../hooks/auth/useUser";
Chart.register(CategoryScale);

const ManagerEmployeeChart = ({ EmployeeDataOfManager }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  // const RemainingLeaves = useLeaveTable();
  const [userId, setuserId] = useState(user?._id);

  // const { data: remainingLeaves } = RemainingLeaves;

  // const dataPie = {
  //   labels: remainingLeaves?.leaveTypes?.map((item) => item.leaveName) ?? [],
  //   datasets: [
  //     {
  //       label: "Total Leaves",
  //       data: remainingLeaves?.leaveTypes?.map((item) => item.count) ?? [],
  //       backgroundColor:
  //         remainingLeaves?.leaveTypes?.map((item) => item.color) ?? [],
  //     },
  //   ],
  // };

  // const optionsPie = {
  //   responsive: false,
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: "right",
  //     },
  //   },
  // };

  const getYearLeaves = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/getYearLeaves/${userId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  };

  const { data: LeaveYearData } = useQuery(
    ["leaveData", userId],
    getYearLeaves
  );

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const allMonths = monthNames;

  const organizeDataByMonth = (data) => {
    const organizedData = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      return {
        month,
        year: null,
        PresentPercent: 0,
        absentPercent: 0,
      };
    });

    data?.forEach((monthData) => {
      const monthIndex = monthData.month - 1;
      organizedData[monthIndex] = {
        month: monthData.month,
        year: monthData.year,
        availableDays: monthData.availableDays,
        unpaidleaveDays: monthData.unpaidleaveDays,
        paidleaveDays: monthData.paidleaveDays,
      };
    });

    return organizedData;
  };

  const EmployeeleaveData = organizeDataByMonth(LeaveYearData);
  const MonthArray = allMonths.map((month) => month);

  const data = {
    labels: MonthArray,
    datasets: [
      {
        label: "Available Days",
        data: EmployeeleaveData.map((monthData) => monthData.availableDays),
        backgroundColor: "#00b0ff",
        borderWidth: 1,
      },
      {
        label: "Unpaid Leave Days",
        data: EmployeeleaveData.map((monthData) => monthData.unpaidleaveDays),
        backgroundColor: "#f50057",
        borderWidth: 1,
      },
      {
        label: "Paid Leave Days",
        data: EmployeeleaveData.map((monthData) => monthData.paidleaveDays),
        backgroundColor: "#4caf50",
        borderWidth: 1,
      },
    ],
  };

  const handleSelect = (event, newValue) => {
    if (newValue) {
      setuserId(newValue?._id);
    } else {
      setuserId(user._id);
    }
  };
  const options = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <>
      <Card elevation={3}>
        <div className="flex w-full px-4 items-center justify-between">
          <div className="flex items-center gap-2 py-2  ">
            <Avatar
              variant="circle"
              className="!bg-sky-400 p-1 !h-[32px] !w-[32px] rounded-full"
            >
              <WorkHistory className="!text-lg" />
            </Avatar>
            <h1 className="md:text-xl text-lg font-semibold py-3">
              Attendence Overview
            </h1>
          </div>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            sx={{ width: 300 }}
            size="small"
            onChange={handleSelect}
            options={EmployeeDataOfManager?.data[0]?.reporteeIds ?? []}
            getOptionLabel={(option) => option?.first_name}
            renderOption={(props, option) => (
              <li className="flex" {...props}>
                <p>
                  {option?.first_name} {option?.last_name}
                </p>
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Search employee" />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Card elevation={0} className="w-full ">
            {MonthArray?.length <= 0 ? (
              <Card
                elevation={1}
                className="!bg-gray-50  mx-4 py-6 px-8 rounded-md"
              >
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="!text-2xl" />
                  <h1 className="text-xl font-semibold">
                    Leave Data Not found for this employee
                  </h1>
                </article>
              </Card>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="h-[250px] md:h-[340px] w-full ">
                  <Bar
                    options={options}
                    data={data}
                    style={{
                      padding: "15px",
                    }}
                  />
                </div>

                {/* <Card className="w-[45%]" elevation={0}>
                  <div className="px-4 pt-4">
                    <h1 className="text-xl">Total Leave's Left</h1>
                  </div>
                  <div className="p-2  flex items-center  ">
                    <Pie data={dataPie} options={optionsPie} />
                  </div>
                </Card> */}
              </div>
            )}
          </Card>
        </div>
      </Card>
    </>
  );
};

export default ManagerEmployeeChart;
