import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextField } from "@mui/material";
import * as XLSX from "xlsx";
import UserProfile from "../../../hooks/UserData/useUser";
import { UseContext } from "../../../State/UseState/UseContext";
import DOMPurify from "dompurify";

const OpenSurveyList = () => {
  // Hooks
  const navigate = useNavigate();

  // Get organizationId
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const organisationId = user?.organizationId;

  // Get cookies
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  // State for survey list
  const [surveys, setSurveys] = useState([]);

  // Fetch surveys data
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-open-survey`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        setSurveys(response.data);
      } catch (error) {
        console.error("Error fetching survey data:", error);
      }
    };

    fetchSurveys();
  }, [authToken, organisationId]);

  // Handle form navigation
  const handleSurveyForm = () => {
    navigate("/organisation/:organisationId/survey-form");
  };

  // Generate Excel function
  const generateExcel = () => {
    const data = [["Title", "Status"]];
    surveys.forEach((survey) => {
      const cleanTitle = DOMPurify.sanitize(survey.title, { USE_PROFILES: { html: false } });
      data.push([cleanTitle, survey.status]);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "SurveyData");

    XLSX.writeFile(wb, "survey_data.xlsx");
  };

  return (
    <div>
      <div className="p-4 border-y-[.5px] border-gray-300">
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
      {surveys && surveys?.length > 0 ? (
        <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
          <table className="min-w-full bg-white text-left !text-sm font-light">
            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
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
              {surveys?.map((survey, index) => (
                <tr key={index} className="!font-medium border-b ">
                  <td className="!text-left pl-8 py-3">
                    {DOMPurify.sanitize(survey.title, { USE_PROFILES: { html: false } })}
                  </td>
                  <td className="!text-left py-3 pl-9">
                    <Button
                      variant="outlined"
                      onClick={handleSurveyForm}
                      sx={{ textTransform: "none", width: "140px" }}
                    >
                      {survey.status === "Take Survey" ? "Take Survey" : "Complete Survey"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
        : (
          <section className="py-6 px-8 w-full">
            <p>
              Nothing to draft
            </p>
          </section>
        )
      }
    </div>
  );
};

export default OpenSurveyList;
