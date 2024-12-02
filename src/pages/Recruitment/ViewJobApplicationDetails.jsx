import axios from 'axios';
import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import useGetUser from '../../hooks/Token/useUser';
import { useParams } from 'react-router-dom';
import { CircularProgress, Box, Typography, Button } from '@mui/material';

const ViewJobApplicationDetails = () => {
    const { organisationId, jobId, applicationId } = useParams();
    const { authToken } = useGetUser();
    const queryClient = useQueryClient();

    // Use useMutation hook outside of conditional statements
    const mutation = useMutation(
        async (status) => {
            const response = await axios.put(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-application/${jobId}/${applicationId}/status`,
                { status },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data; // Return the updated application data
        },
        {
            onSuccess: () => {
                // Invalidate the query to refetch updated data
                queryClient.invalidateQueries(["jobApplicationDetails", organisationId, jobId, applicationId]);
            },
            onError: (err) => console.error("Error updating application status:", err),
        }
    );

    // Fetch the job application details
    const { data: application, isLoading, isError, error } = useQuery(
        ["jobApplicationDetails", organisationId, jobId, applicationId], // Updated query key
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-application/${jobId}/${applicationId}`,
                {
                    headers: {
                        Authorization: authToken, // Correct header format
                    },
                }
            );
            return response.data.data; // Return the application data
        },
        {
            enabled: Boolean(authToken), // Only enable query if token exists
            onError: (err) => console.error("Error fetching job application details:", err),
        }
    );

    // Handle loading state
    if (isLoading) {
        return <CircularProgress />;
    }

    // Handle error state
    if (isError) {
        return <Typography color="error">{error.message}</Typography>;
    }

    // Handle Shortlist button click
    const handleShortlist = () => {
        mutation.mutate("Shortlisted");
    };

    // Handle Reject button click
    const handleReject = () => {
        mutation.mutate("Rejected");
    };

    // Render application details
    return (
        <Box p={3}>
            {application ? (
                <div>
                    <Typography variant="h5">Application Details</Typography>
                    <Typography variant="h6">
                        Applicant Name: {application?.applicantId?.first_name} {application?.applicantId?.last_name}
                    </Typography>
                    <Typography variant="body1">Job Position: {application?.jobId?.jobPosition}</Typography>
                    <Typography variant="body2">Email: {application?.applicantId?.email}</Typography>
                    <Typography variant="body2">Phone: {application?.applicantId?.phone}</Typography>
                    <Typography variant="body2">Status: {application?.status}</Typography>
                    {/* Add any other fields you need to display here */}

                    {/* Action Buttons */}
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleShortlist}
                            disabled={application?.status === "Shortlisted"}
                            style={{ marginRight: "10px" }}
                        >
                            Shortlist
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleReject}
                            disabled={application?.status === "Rejected"}
                        >
                            Reject
                        </Button>
                    </Box>
                </div>
            ) : (
                <Typography>No application found</Typography>
            )}
        </Box>
    );
};

export default ViewJobApplicationDetails;
