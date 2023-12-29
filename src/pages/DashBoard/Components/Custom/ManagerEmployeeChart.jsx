import React, { useContext } from "react";
import { Bar, Pie } from "react-chartjs-2";

import { Info, WorkHistory } from "@mui/icons-material";
import { Autocomplete, Avatar, Card, TextField } from "@mui/material";
import axios from "axios";
import { CategoryScale, Chart } from "chart.js";
import { useQuery } from "react-query";
import { UseContext } from "../../../../State/UseState/UseContext";
import useLeaveTable from "../../../../hooks/Leave/useLeaveTable";
Chart.register(CategoryScale);

const ManagerEmployeeChart = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];

  const RemainingLeaves = useLeaveTable();

  const { data: remainingLeaves, isLoading } = RemainingLeaves;

  const dataPie = {
    labels: remainingLeaves?.leaveTypes?.map((item) => item.leaveName) ?? [],
    datasets: [
      {
        label: "Total Leaves",
        data: remainingLeaves?.leaveTypes?.map((item) => item.count) ?? [],
        backgroundColor:
          remainingLeaves?.leaveTypes?.map((item) => item.color) ?? [],
      },
    ],
  };

  const optionsPie = {
    responsive: false,
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
    },
  };

  const getYearLeaves = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/getYearLeaves`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return data.data[0].reporteeIds;
  };
  const getAllEmployeeForManger = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/countofEmployees`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  };

  const { data: LeaveYearData } = useQuery("leaveData", getYearLeaves);
  const { data: EmployeeDataOfManager } = useQuery(
    "employeeData",
    getAllEmployeeForManger
  );

  console.log(EmployeeDataOfManager?.data[0]?.reporteeIds);

  const renderOptions = EmployeeDataOfManager?.data[0]?.reporteeIds?.map(
    (item, id) => <div>{item.name}</div>
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

  function getFilteredAndReversedMonths(data) {
    const filteredMonths = data
      ?.filter((element) => monthNames[element.month - 1])
      ?.map((element) => monthNames[element.month - 1]);
    const reversedMonths = filteredMonths?.reverse();
    return reversedMonths;
  }

  const reversedMonthsArray = getFilteredAndReversedMonths(LeaveYearData);

  const organizeDataByMonth = (data) => {
    const organizedData = [];

    for (let i = 0; i < data?.length; i++) {
      const monthData = data[i];
      const monthIndex = monthData.month - 1; // Month numbers are 1-based

      if (!organizedData[monthIndex]) {
        organizedData[monthIndex] = {
          month: monthData.month,
          year: monthData.year,
          availableDays: 0,
          unpaidleaveDays: 0,
          paidleaveDays: 0,
        };
      }
      organizedData[monthIndex].availableDays += monthData.availableDays;
      organizedData[monthIndex].unpaidleaveDays += monthData.unpaidleaveDays;
      organizedData[monthIndex].paidleaveDays += monthData.paidleaveDays;
    }

    // Filter out undefined elements and reverse the array
    const reversedData = organizedData.filter((monthData) => monthData);
    return reversedData;
  };

  const reversedOrganizedData = organizeDataByMonth(LeaveYearData);

  const data = {
    labels: reversedMonthsArray,
    datasets: [
      {
        label: "Available Days",
        data: reversedOrganizedData.map((monthData) => monthData.availableDays),
        backgroundColor: "#00b0ff",
        borderWidth: 1,
      },
      {
        label: "Unpaid Leave Days",
        data: reversedOrganizedData.map(
          (monthData) => monthData.unpaidleaveDays
        ),
        backgroundColor: "#f50057",
        borderWidth: 1,
      },
      {
        label: "Paid Leave Days",
        data: reversedOrganizedData.map((monthData) => monthData.paidleaveDays),
        backgroundColor: "#4caf50",
        borderWidth: 1,
      },
    ],
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
            <h1 className="text-xl font-semibold py-3">
              Employee Attendence Overview
            </h1>
          </div>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            sx={{ width: 300 }}
            size="small"
            options={EmployeeDataOfManager?.data[0]?.reporteeIds}
            getOptionLabel={(option) => option.first_name}
            renderOption={(props, option) => (
              <li className="flex" {...props}>
                <p>
                  {option.first_name} {option.last_name}
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
            {/* <div className="p-4 py-4 flex justify-between items-center">
              <h1 className="text-xl">Overall Attendence</h1>
            </div> */}

            {reversedMonthsArray?.length > 0 ? (
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
              <Bar
                data={data}
                style={{
                  padding: "15px",
                }}
              />
            )}
          </Card>
          <Card elevation={0}>
            <div className="px-4 pt-4">
              <h1 className="text-xl">Total Leave's Left</h1>
            </div>
            <div className="p-2 flex items-center  w-full">
              <Pie data={dataPie} options={optionsPie} />
            </div>
          </Card>
        </div>
      </Card>
    </>
  );
};

export default ManagerEmployeeChart;
