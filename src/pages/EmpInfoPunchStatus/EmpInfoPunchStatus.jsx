import React from "react";
import { Container, TextField, Typography, Button } from "@mui/material";

const EmpInfoPunchStatus = () => {
  const handleFileUpload = (e) => {
    const fileInput = document.getElementById("file-upload");
    const file = fileInput.files[0];
    console.log(file);
  };
  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center">
          <Typography variant="h4" className="text-center pl-10 mb-6 mt-2">
            Attendance Management
          </Typography>
          <p className="text-xs text-gray-600 pl-10 text-center">
            Track the attendance of employees here by using the sync button.
          </p>

          <div className="flex items-center justify-center mt-4">
            <label htmlFor="file-upload">
              <input
                style={{ display: "none" }}
                id="file-upload"
                type="file"
                accept=".xls,.xlsx,.csv"
                onChange={handleFileUpload}
              />
              <Button variant="contained" component="span">
                Upload File
              </Button>
            </label>
          </div>

          <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <TextField
                placeholder="Search Employee Name...."
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
              />
            </div>
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <TextField
                placeholder="Search Email...."
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
              />
            </div>
            <div className="flex items-center gap-3">
              <TextField
                placeholder="Search Employee Id ...."
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
              />
            </div>
          </div>

          <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
            <table className="min-w-full bg-white text-left !text-sm font-light">
              <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                <tr className="!font-semibold">
                  <th scope="col" className="!text-left pl-8 py-3">
                    Sr. No
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Employee ID
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    First Name
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Department
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Date
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Punch Time
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Punch State
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Area
                  </th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </div>
        </article>
      </Container>
    </>
  );
};

export default EmpInfoPunchStatus;
