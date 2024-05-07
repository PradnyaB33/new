import React, { useContext, useState } from "react";

import { Info, WorkHistory } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Card,
  CircularProgress,
  TextField,
} from "@mui/material";
import axios from "axios";
import { CategoryScale, Chart } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useQuery } from "react-query";
import Select from "react-select";
import { UseContext } from "../../../../State/UseState/UseContext";
import UserProfile from "../../../../hooks/UserData/useUser";
Chart.register(CategoryScale);

const ManagerEmployeeChart = ({
  EmployeeDataOfManager,
  selectedyear,
  setSelectedYear,
}) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const [selectMonth, setSelectMonth] = useState(new Date().getMonth() + 1);
  const user = getCurrentUser();
  // const RemainingLeaves = useLeaveTable();
  const [userId, setuserId] = useState();

  const customStyles = {
    control: (base) => ({
      ...base,
      border: ".5px solid #f1f1f1",
      background: "#f9fafb",
      boxShadow: "none",
      hover: {
        cursor: "pointer !important",
      },
    }),
    menu: (base) => ({
      ...base,
      width: "max-content",
      minWidth: "100%",
      right: 0,
    }),
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#000",
      };
    },
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

  const yearOptions = years.map((year) => {
    return {
      value: year.toString(),
      label: year,
    };
  });

  const monthOptions = [
    {
      value: 1,
      label: "January",
    },
    {
      value: 2,
      label: "February",
    },
    {
      value: 3,
      label: "March",
    },
    {
      value: 4,
      label: "April",
    },
    {
      value: 5,
      label: "May",
    },
    {
      value: 6,
      label: "June",
    },
    {
      value: 7,
      label: "July",
    },
    {
      value: 8,
      label: "August",
    },
    {
      value: 9,
      label: "September",
    },
    {
      value: 10,
      label: "October",
    },
    {
      value: 11,
      label: "November",
    },
    {
      value: 12,
      label: "December",
    },
  ];
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

  const getYearLeaves = async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/leave/getAllLeaveForManager`,
      {
        headers: {
          Authorization: authToken,
        },
        params: {
          month: selectMonth.value,
          year: selectedyear.value,
        },
      }
    );
    return data;
  };

  const { data: LeaveYearData, isLoading: leaveYearLoading } = useQuery(
    ["leaveData", userId, selectedyear, selectMonth],
    getYearLeaves
  );

  // const monthNames = [
  //   "January",
  //   "February",
  //   "March",
  //   "April",
  //   "May",
  //   "June",
  //   "July",
  //   "August",
  //   "September",
  //   "October",
  //   "November",
  //   "December",
  // ];

  // const allMonths = monthNames;

  // const organizeDataByMonth = (data) => {
  //   const organizedData = Array.from({ length: 12 }, (_, index) => {
  //     console.log(`🚀 ~ LeaveYearData:`, LeaveYearData);
  //     const month = index + 1;
  //     return {
  //       month,
  //       year: null,
  //       PresentPercent: 0,
  //       absentPercent: 0,
  //     };
  //   });

  //   Array.isArray(data) &&
  //     data?.forEach((monthData) => {
  //       const monthIndex = monthData.month - 1;
  //       organizedData[monthIndex] = {
  //         month: monthData.month,
  //         year: monthData.year,
  //         availableDays: monthData.availableDays,
  //         unpaidleaveDays: monthData.unpaidleaveDays,
  //         paidleaveDays: monthData.paidleaveDays,
  //       };
  //     });

  //   return organizedData ?? [];
  // };

  // const EmployeeleaveData = organizeDataByMonth(LeaveYearData);
  // const MonthArray = allMonths.map((month) => month);

  const data = {
    labels: LeaveYearData?.map(
      (monthData) =>
        `${monthData?.employee?.employeeId?.first_name} ${monthData?.employee?.employeeId?.last_name}`
    ),
    datasets: [
      {
        label: "Available Days",
        data: LeaveYearData?.map((monthData) => monthData.availableDays),
        backgroundColor: "#00b0ff",
        borderWidth: 1,
      },
      {
        label: "Unpaid Leave Days",
        data: LeaveYearData?.map((monthData) => monthData.unpaidleaveDays),
        backgroundColor: "#f50057",
        borderWidth: 1,
      },
      {
        label: "Paid Leave Days",
        data: LeaveYearData?.map((monthData) => monthData.paidleaveDays),
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

  return (
    <>
      <Card elevation={3}>
        <div className="flex flex-col w-full px-4 items-start justify-between">
          <div className="flex items-center gap-2 py-2  ">
            <Avatar
              variant="circle"
              className="!bg-sky-400 p-1 !h-[32px] !w-[32px] rounded-full"
            >
              <WorkHistory className="!text-lg" />
            </Avatar>
            <h1 className="md:text-xl text-lg py-3">Attendance Overview</h1>
          </div>

          <div className="flex gap-2 w-full">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              className="w-full"
              // sx={{ width: 300 }}
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
                <TextField {...params} label="Search Employee" />
              )}
            />

            <div className="w-[25%]">
              <Select
                placeholder={"Select year"}
                onChange={(year) => {
                  setSelectedYear(year);
                }}
                components={{
                  IndicatorSeparator: () => null,
                }}
                styles={customStyles}
                value={selectedyear} // Add this line
                options={yearOptions}
              />
            </div>
            <div className="w-[30%]">
              <Select
                placeholder={"Select Month"}
                onChange={(month) => {
                  setSelectMonth(month);
                }}
                components={{
                  IndicatorSeparator: () => null,
                }}
                styles={customStyles}
                value={selectMonth} // Add this line
                options={monthOptions}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Card elevation={0} className="w-full ">
            {LeaveYearData?.length <= 0 ? (
              <Card elevation={0} className="  mx-4 py-6 ">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="!text-2xl" />
                  <h1 className="text-xl ">Data Not found for this employee</h1>
                </article>
              </Card>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex  justify-center w-full px-5 py-4 h-[340px]">
                  {leaveYearLoading ? (
                    <CircularProgress />
                  ) : (
                    // ) : LeaveYearData?.length <= 0 ? (
                    //   <div className="my-1 w-[90%] rounded-md flex items-center space-x-4 justify-center h-[10vh] bg-orange-200 font-bold ">
                    //     <Warning />
                    //     <h1 className="text-2xl ">No data found for this user</h1>
                    //       </div>
                    <Bar
                      options={options}
                      data={data}
                      style={{
                        padding: "15px",
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>
      </Card>
    </>
  );
};

export default ManagerEmployeeChart;
