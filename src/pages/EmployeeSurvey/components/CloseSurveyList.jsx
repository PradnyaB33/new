import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import UserProfile from "../../../hooks/UserData/useUser";
import { UseContext } from "../../../State/UseState/UseContext";
import DOMPurify from "dompurify";
import { useQuery } from "react-query";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import * as XLSX from "xlsx";

const CloseSurveyList = () => {
  // Hooks
  const navigate = useNavigate();

  // Get organizationId
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const organisationId = user?.organizationId;

  // Get cookies
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const [closeSurvey, setCloseSurvey] = useState(false)

  //get open survey
  const { data: surveys, isLoading, isError } = useQuery(
    ["closedSurveys", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-close-survey`,
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

  const handleSurveyDetails = (surveyId) => {
    navigate(`/organisation/:organisationId/survey-details/${surveyId}`);
  }

  const handleCloseSurvey = () => {
    setCloseSurvey(!closeSurvey)
  }

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
      <div className="flex  justify-between  gap-3 w-full border-gray-300 my-2">
        <div className="flex justify-start ">
          <Typography variant="p">
            Close Survey
          </Typography>
        </div>
        <div className="flex justify-end">
          <AddCircleOutlineIcon style={{ width: "40px" }} onClick={handleCloseSurvey} />
          <Typography variant="p" className="">
            Count: {surveys?.length}
          </Typography>
        </div>
      </div>
      {closeSurvey ? (
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
                            onClick={() => handleSurveyDetails(survey._id)}
                            sx={{ textTransform: "none", width: "140px" }}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <section className="py-6 px-8 w-full">
                <p>Nothing to closed survey</p>
              </section>
            )}
        </>
      ) : null}
    </div>
  );
};

export default CloseSurveyList;

