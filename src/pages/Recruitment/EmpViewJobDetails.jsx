import React from 'react';
import BoxComponent from '../../components/BoxComponent/BoxComponent';
import HeadingOneLineInfo from '../../components/HeadingOneLineInfo/HeadingOneLineInfo';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import useGetUser from '../../hooks/Token/useUser';
import BasicButton from '../../components/BasicButton';

const EmpViewJobDetails = () => {
    const { vacancyId, organisationId } = useParams();
    const { authToken } = useGetUser();
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

    return (
        <BoxComponent>
            <HeadingOneLineInfo heading="Job Details" info="Here employee view and apply for job" />
            <Box sx={{ bgcolor: "White", p: 2 }}>
                <Box className="flex justify-between">
                    <Typography variant="h4" fontWeight="bold">
                        {jobDetails?.jobPosition || "Job Position Not Available"}
                    </Typography>
                    <BasicButton title="Apply Now" />
                </Box>
                <Typography>
                    <strong>Department:</strong> {jobDetails?.department?.name || "N/A"}
                </Typography>
                <Typography>
                    <strong>Location:</strong> {jobDetails?.location?.name || "N/A"}
                </Typography>
                <Typography>
                    <strong>Experience Required:</strong> {jobDetails?.experienceRequired || "N/A"}
                </Typography>
                <Typography>
                    <strong>Vacancies:</strong> {jobDetails?.vacancies || "N/A"}
                </Typography>
                <Typography>
                    <strong>Description:</strong> {jobDetails?.jobDescription || "N/A"}
                </Typography>
                <Typography>
                    <strong>Mode of Working:</strong> {jobDetails?.modeOfWorking || "N/A"}
                </Typography>
                <Typography>
                    <strong>Job Type:</strong> {jobDetails?.jobType || "N/A"}
                </Typography>
                <Typography>
                    <strong>Required Skills:</strong>{' '}
                    {jobDetails?.requiredSkill?.map(skill => skill.label).join(', ') || "N/A"}
                </Typography>
                <Typography>
                    <strong>Education:</strong> {jobDetails?.education || "N/A"}
                </Typography>
                <Typography>
                    <strong>Working Time:</strong> {jobDetails?.workingTime || "N/A"} hours/day
                </Typography>
                <Typography>
                    <strong>Created By:</strong> {jobDetails?.createdBy?.name || "N/A"}
                </Typography>
            </Box>
        </BoxComponent>
    );
};

export default EmpViewJobDetails;
