import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import * as XLSX from "xlsx";
import UserProfile from "../../../hooks/UserData/useUser";
import { UseContext } from "../../../State/UseState/UseContext";
import DOMPurify from "dompurify";
import { useQuery } from "react-query";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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

  const [openSurvey, setOpenSurvey] = useState(false);

  // Get open surveys
  const { data: surveys, isLoading, isError } = useQuery(
    ["openSurveys", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-open-survey`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!organisationId && !!authToken,
    }
  );

  // Get response surveys
  const { data: responseSurvey } = useQuery(
    ["responseSurveys", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-response-survey`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!organisationId && !!authToken,
    }
  );
  console.log("responseSurvey", responseSurvey);
  // Handle form navigation
  const handleSurveyForm = (surveyId,responseId) => {
    console.log("responseId",responseId);
    navigate(`/organisation/${organisationId}/survey-form/${surveyId}/${responseId}`);
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

  const handleOpenSurvey = () => {
    setOpenSurvey(!openSurvey);
  };

  console.log("surveys.......", surveys);

  // Match surveys with their responses
  const matchedResponses = surveys?.map(survey => {
    const responses = responseSurvey?.filter(response => response?.surveyId === survey?._id);
    return {
      ...survey,
      responses: responses || []  // Attach responses array to each survey
    };
  });

  console.log("Matched Responses:", matchedResponses);

  return (
    <div>
      <div className="flex  justify-between  gap-3 w-full border-gray-300 my-2">
        <div className="flex justify-start ">
          <Typography variant="p">
            Open Survey
          </Typography>
        </div>
        <div className="flex justify-end">
          <AddCircleOutlineIcon style={{ width: "40px" }} onClick={handleOpenSurvey} />
          <Typography variant="p" className="">
            Count: {surveys?.length}
          </Typography>
        </div>
      </div>
      {openSurvey ? (
        <>
          <div className="p-4 border-y-[.5px] border-gray-300">
            <div className="flex justify-end gap-3 mb-3 md:mb-0 w-full md:w-auto">
              <TextField
                placeholder="Search"
                variant="outlined"
                size="small"
                sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
              />
              {(user?.profile.includes('Super-Admin') || user?.profile.includes('HR')) && (
                <Button variant="contained" color="warning" onClick={generateExcel}>
                  Generate Excel
                </Button>
              )}
            </div>
          </div>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <CircularProgress />
            </div>
          ) : isError ? (
            <div className="flex justify-center p-4 text-red-500">
              Error fetching data
            </div>
          ) :
            surveys && surveys?.length > 0 ? (
              <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                <table className="min-w-full bg-white text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                    <tr className="!font-semibold">
                      <th scope="col" className="!text-left pl-8 py-3">
                        Title
                      </th>

                      <th scope="col" className="!text-left pl-8 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchedResponses?.map((survey, index) => (
                      <tr key={index} className="!font-medium border-b ">
                        <td className="!text-left pl-8 py-3">
                          {DOMPurify.sanitize(survey.title, { USE_PROFILES: { html: false } })}
                        </td>
                        <td className="!text-left py-3 pl-6">
                          {survey.responses.length > 0 ? (
                            <Button
                              variant="outlined"
                              onClick={() => handleSurveyForm(survey._id,survey.responses[0]._id)}
                              sx={{ textTransform: "none", width: "100px" }}
                            >
                              {survey.responses[0].responseStatus}
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              onClick={() => handleSurveyForm(survey._id,survey.responses[0]._id)}
                              sx={{ textTransform: "none", width: "130px" }}
                            >
                              Take Survey
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <section className="py-6 px-8 w-full">
                <p>Nothing to open survey</p>
              </section>
            )}
        </>) : null}
    </div>
  );
};

export default OpenSurveyList;
