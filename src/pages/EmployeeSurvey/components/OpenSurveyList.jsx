import { Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const OpenSurveyList = () => {
  // Hooks
  const navigate = useNavigate();

  // Example JSON data
  const surveyData = [
    { title: "Employee satisfaction surveys", status: "Take Survey" },
    { title: "Employee performance surveys", status: "Complete Survey" },
    { title: "Professional development surveys", status: "Take Survey" },
    { title: "Employee attitude surveys", status: "Complete Survey" },
    { title: "Employer improvement surveys", status: "Take Survey" },
    { title: "Employee experience/opinion surveys", status: "Take Survey" },
  ];

  // State for survey list
  const [surveys, setSurveys] = useState(surveyData);
  console.log(`🚀 ~ file: OpenSurveyList.jsx:22 ~ setSurveys:`, setSurveys);

  // Handle form navigation
  const handleSurveyForm = () => {
    navigate("/organisation/:organisationId/survey-form");
  };

  // Generate Excel function
  const generateExcel = () => {
    const data = [["Title", "Status"]];
    surveys.forEach((survey) => {
      data.push([survey.title, survey.status]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SurveyData");

    XLSX.writeFile(wb, "survey_data.xlsx");
  };

  return (
    <div>
      <div className="p-4 border-y-[.5px]  border-gray-300">
        <div className="flex justify-end gap-3 mb-3 md:mb-0 w-full md:w-auto">
          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
          />
          <Button variant="contained" color="warning" onClick={generateExcel}>
            Generate Excel
          </Button>
        </div>
      </div>
      <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
        <table className="min-w-full bg-white  text-left !text-sm font-light">
          <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
            <tr className="!font-semibold">
              <th scope="col" className="!text-left pl-8 py-3">
                Title
              </th>
              <th scope="col" className="!text-left pl-8 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((survey, index) => (
              <tr key={index} className="!font-medium border-b">
                <td className="!text-left pl-8 py-3">{survey.title}</td>
                <td className="py-3 pl-8">
                  <Button
                    variant="outlined"
                    onClick={handleSurveyForm}
                    sx={{ textTransform: "none", width: "140px" }}
                  >
                    {survey.status === "Take Survey"
                      ? "Take Survey"
                      : "Complete Survey"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpenSurveyList;
