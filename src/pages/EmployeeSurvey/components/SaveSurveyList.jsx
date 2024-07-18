import React, { useContext, useState } from "react";
import axios from "axios";
import { CircularProgress, Typography } from "@mui/material";
import UserProfile from "../../../hooks/UserData/useUser";
import { UseContext } from "../../../State/UseState/UseContext";
import DOMPurify from "dompurify";
import { useQuery } from "react-query";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { format } from "date-fns";

const SaveSurveyList = () => {
    // Get organizationId
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const organisationId = user?.organizationId;

    // Get cookies
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    const [saveSurvey, setSaveSurvey] = useState(false);

    // Get open surveys
    const { data: surveys, isLoading, isError } = useQuery(
        ["openSurveys", organisationId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-save-survey`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response;
        },
        {
            enabled: !!organisationId && !!authToken,
        }
    );






    //handleOpenSurvey function
    const handleOpenSurvey = () => {
        setSaveSurvey(!saveSurvey);
    };
    console.log("saveSurvey", surveys);
    return (
        <div>
            <div className="flex  justify-between  gap-3 w-full border-gray-300 my-2">
                <div className="flex justify-start ">
                    <Typography variant="p">
                        Save Survey
                    </Typography>
                </div>
                <div className="flex justify-end">
                    <AddCircleOutlineIcon style={{ width: "40px" }} onClick={handleOpenSurvey} />
                    <Typography variant="p" className="">
                        Count: {surveys?.length}
                    </Typography>
                </div>
            </div>
            {saveSurvey ? (
                <>
                    <div className="border-t-[.5px] border-gray-300">
                        {/* <div className="flex justify-end gap-3 mb-3 md:mb-0 w-full md:w-auto">
              <TextField
                placeholder="Search"
                variant="outlined"
                size="small"
                sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
              />
            </div> */}
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
                            <div className="overflow-auto !p-0 border-[.5px] border-gray-200 mt-4">
                                <table className="min-w-full bg-white text-left !text-sm font-light">
                                    <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                                        <tr className="!font-semibold">
                                            <th scope="col" className="!text-left pl-8 py-3">
                                                Title
                                            </th>
                                            <th scope="col" className="!text-left pl-8 py-3">
                                                Start Date
                                            </th>
                                            <th scope="col" className="!text-left pl-8 py-3">
                                                End Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {surveys?.map((survey, index) => (
                                            <tr key={index} className="!font-medium border-b ">
                                                <td className="!text-left pl-8 py-3">
                                                    {DOMPurify.sanitize(survey.title, { USE_PROFILES: { html: false } })}
                                                </td>
                                                <td className="!text-left pl-8 py-3">
                                                    {survey && format(new Date(survey?.employeeSurveyStartingDate), "PP")}
                                                </td>
                                                {/* <td className="!text-left pl-8 py-3">
                                                    {survey && format(new Date(survey?.employeeSurveyEndingDate), "PP")}
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <section className="py-6 w-full">
                                <p>No data available</p>
                            </section>
                        )}
                </>) : null}
        </div>
    );
};

export default SaveSurveyList;
