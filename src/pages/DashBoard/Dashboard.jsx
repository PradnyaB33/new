//😎
import axios from "axios";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import React, { useState } from "react";
import { useQuery } from "react-query";
// import { useLocation } from 'react-router-dom';
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import useAuthToken from "../../hooks/Token/useAuth";
import UserProfile from "../../hooks/UserData/useUser";
import HRgraph from "./Components/Bar/HRgraph";
import LineGraph from "./Components/Bar/LineGraph";
// import LeaveDisplayList from "./Components/List/LeaveDisplayList";
// import PublicHolidayDisplayList from "./Components/List/PublicHolidayDisplayList";
import { Box, Grid, Typography } from "@mui/material";
import useHook from "../../hooks/UserProfile/useHook";
import EmployeeAllLeavePie from "./Components/EmployeeAllLeavePie/EmployeeAllLeavePie";
import EmployeeLeaveDonut from "./Components/Pie/EmployeeLeavePie";
Chart.register(CategoryScale);

const Dashboard = () => {
  const authToken = useAuthToken();
  const { getCurrentUser, } = UserProfile();
  // const role = useGetCurrentRole();
  const [selectedyear, setSelectedYear] = useState({
    value: new Date().getFullYear(),
    label: new Date().getFullYear(),
  });
  const user = getCurrentUser();
  console.log("user", user);

  const { UserInformation } = useHook();
  console.log("UserInformation", UserInformation);
  const getSalaryTemplate = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/route/employeeSalary/viewpayslip/${user._id}/${user.organizationId}/${selectedyear.value}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: EmployeSalaryData } = useQuery(
    ["salary-template-employee", selectedyear],
    getSalaryTemplate
  );
  // const location = useLocation();
  const formattedDate = new Date(UserInformation?.joining_date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return (
    <>
      <BoxComponent>
        <HeadingOneLineInfo
          heading={"Dashboard"}
          info={
            "Get insights of Employee's data with interactive charts and reports"
          }
        />
        <Grid container spacing={2}>
          <Grid item lg={2}>
            <Grid lg={12} >
              <img
                src={UserInformation?.user_logo_url}
                alt="Profile"
                style={{
                  objectFit: "cover",
                }}
              />
            </Grid>
            <Grid className="border bg-gray-50" lg={12} sx={{ bgcolor: "white" }}>
              <Box sx={{ textAlign: "center", p: "16px" }}>
                <Typography variant="h5">
                  {UserInformation?.first_name} {UserInformation?.last_name}
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  {UserInformation?.designation[0]?.designationName}
                </Typography>
              </Box>

              <Box className="border border-t-[.5px]" sx={{ p: "10px 10px" }}>
                <Typography>Join Date: {formattedDate}</Typography>
              </Box>

              <Box sx={{ p: "10px 10px" }}>
                <Typography>Contact: {UserInformation?.additional_phone_number}</Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid item container lg={10}>
            <Grid container spacing={2} lg={12} sx={{ height: "300px" }}>
              <Grid item lg={6} sx={{ height: "100%" }}>
                <EmployeeAllLeavePie />
              </Grid>
              <Grid item lg={6} sx={{ height: "100%" }}>
                <EmployeeLeaveDonut />
              </Grid>
            </Grid>

            <Grid item container spacing={2} lg={12}>
              <Grid item lg={6}>
                <LineGraph
                  salarydata={EmployeSalaryData?.employeeSalaryViaYear}
                  selectedyear={selectedyear}
                  setSelectedYear={setSelectedYear}
                  employee={EmployeSalaryData?.employeeInfo}
                />
              </Grid>
              <Grid item lg={6}>
                <HRgraph />
              </Grid>
            </Grid>
            <Grid>
            </Grid>
          </Grid>
        </Grid>
      </BoxComponent>
    </>
  );
};

export default Dashboard;

// <div>
// <div className="flex md:flex-row flex-col w-full justify-between gap-2">
//   <div className="space-y-3 md:space-y-0 md:my-4 mb-1 flex md:gap-2 gap-1 flex-col md:!w-[60%] w-[100%] md:pb-2">
//     {/* Employee Attandance */}
//     <HRgraph />
//     {/* Salary Overview */}

//     <LineGraph
//       salarydata={EmployeSalaryData?.employeeSalaryViaYear}
//       selectedyear={selectedyear}
//       setSelectedYear={setSelectedYear}
//       employee={EmployeSalaryData?.employeeInfo}
//     />
//     {/* <SinglePayGraph /> */}
//   </div>

//   <div className="md:w-[40%] md:my-4 my-1 md:px-2 space-y-3 md:space-y-4">
//     <EmployeeLeavePie />
//     <PublicHolidayDisplayList />
//     <LeaveDisplayList />
//   </div>
// </div>
// </div>
