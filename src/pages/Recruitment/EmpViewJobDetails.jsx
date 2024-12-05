import React, { useState } from 'react';
import BoxComponent from '../../components/BoxComponent/BoxComponent';
import HeadingOneLineInfo from '../../components/HeadingOneLineInfo/HeadingOneLineInfo';
import { Box, CircularProgress, Dialog, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import useGetUser from '../../hooks/Token/useUser';
import BasicButton from '../../components/BasicButton';
import { formatDistanceToNow, parseISO } from "date-fns";
import { IoBag, IoLocationSharp } from "react-icons/io5";
import JobAppliedAppoveRequestToMR from './components/JobAppliedAppoveRequestToMR';

const EmpViewJobDetails = () => {
    const { vacancyId, organisationId } = useParams();
    const { authToken } = useGetUser();

    const [open, setOpen] = useState();
    // Fetch specific job opening
    const { data, isLoading, isError, error } = useQuery(
        ['jobOpening', vacancyId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-open/${vacancyId}`,
                {
                    headers: {
                        Authorization: authToken, // Replace with actual auth token
                    },
                }
            );
            return response.data.data;
        },
        {
            enabled: !!vacancyId, // Ensure the query only runs if vacancyId is available
        }
    );

    if (isLoading) {
        return (
            <BoxComponent>
                <CircularProgress />
            </BoxComponent>
        );
    }

    if (isError) {
        return (
            <BoxComponent>
                <Typography color="error">
                    Error fetching job details: {error?.response?.data?.message || error.message}
                </Typography>
            </BoxComponent>
        );
    }

    const jobDetails = data;

    const formatPostedDate = (dateString) => {
        if (!dateString) return "Unknown Date";
        try {
            return `${formatDistanceToNow(parseISO(dateString))} ago`; // Example: "Posted 2 days ago"
        } catch (error) {
            console.error("Error formatting posted date:", error);
            return "Invalid Date";
        }
    };

    const handleApply = () => {
        setOpen(true);
    };

    return (
        <BoxComponent>
            <HeadingOneLineInfo heading="Job Details" info="Here employee view and apply for job" />
            <Box>
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "10px",
                        padding: "16px",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                        transition: "box-shadow 0.3s ease",
                        border: "1px solid #e0e0e0",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)")
                    }
                >
                    <h3
                        style={{
                            marginTop: 0,
                            fontSize: "1.5rem",
                            color: "#333",
                        }}
                    >
                        {jobDetails?.jobPosition || "Job Position Not Available"}
                    </h3>
                    <div>
                        <h4>{jobDetails?.organizationId?.orgName}</h4>
                    </div>
                    <div style={{ color: "#555" }}>
                        <p className="flex">
                            <IoBag className="my-1" />
                            {jobDetails.experienceRequired || "Not Provided"}
                        </p>
                        <p className="flex">
                            <IoLocationSharp className="my-1" />{" "}
                            {jobDetails.location?.city || "Not Provided"},{" "}
                            {jobDetails.location?.state || "Not Provided"},{" "}
                            {jobDetails.location?.country || "Not Provided"}
                        </p>
                        <div className="flex space-x-1">
                            <p>
                                <strong>Posted:</strong>{" "}
                                {formatPostedDate(jobDetails?.date)}
                            </p>
                            <p>
                                <strong>Opening:</strong>{" "}
                                {jobDetails?.vacancies || "Not Specified"}
                            </p>
                        </div>


                        <div className="flex space-x-1 justify-end mt-3">
                            <BasicButton title="Apply" onClick={handleApply} />
                        </div>
                    </div>
                </div>
            </Box>
            <Box sx={{ bgcolor: "White", p: 2, mt: 3 }}>
                <Box className="flex justify-between">
                    <Typography variant="h5" fontWeight="bold">
                        {jobDetails?.jobPosition || "Job Position Not Available"}
                    </Typography>
                </Box>
                <Typography>
                    <strong>Description:</strong> {jobDetails?.jobDescription || "N/A"}
                </Typography>
                <Typography>
                    <strong>Role:</strong> {jobDetails?.jobPosition || "N/A"}
                </Typography>
                <Typography>
                    <strong>Industry Type:</strong> {jobDetails?.organizationId?.industry_type || "N/A"}
                </Typography>
                <Typography>
                    <strong>Department:</strong> {jobDetails?.department?.departmentName || "N/A"}
                </Typography>
                <Typography>
                    <strong>Employment Type:</strong> {jobDetails?.jobType || "N/A"}
                </Typography>
                <Typography>
                    <strong>Mode of Working:</strong> {jobDetails?.modeOfWorking || "N/A"}
                </Typography>
                <Typography>
                    <strong>Job Type:</strong> {jobDetails?.jobType || "N/A"}
                </Typography>
                <Typography>
                    <strong>Working Time:</strong> {jobDetails?.workingTime || "N/A"}
                </Typography>
                <Typography>
                    <strong>Education:</strong> {jobDetails?.education || "N/A"}
                </Typography>
                <Typography>
                    <strong>Key Skills:</strong>{' '}
                    {jobDetails?.requiredSkill?.map(skill => skill.label).join(', ') || "N/A"}
                </Typography>  </Box>
            <Dialog open={open} onClose={() => setOpen(false)} className="p-0">
                <JobAppliedAppoveRequestToMR jobId={vacancyId} organisationId={organisationId} />

            </Dialog>
        </BoxComponent>
    );
};

export default EmpViewJobDetails;
