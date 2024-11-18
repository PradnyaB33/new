import React, { useContext } from 'react';
import BoxComponent from '../../components/BoxComponent/BoxComponent';
import HeadingOneLineInfo from '../../components/HeadingOneLineInfo/HeadingOneLineInfo';
import BasicButton from '../../components/BasicButton';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { UseContext } from '../../State/UseState/UseContext';
import { useQuery, useQueryClient } from 'react-query';
import { CircularProgress, IconButton } from '@mui/material';
import { EditOutlined as EditOutlinedIcon, DeleteOutline as DeleteOutlineIcon, Visibility as View } from '@mui/icons-material';

const MrOpenJobVacancyList = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { organisationId } = useParams();

    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    // Handler for adding a new vacancy
    const handleAddVacancy = () => {
        navigate(`/organisation/${organisationId}/my-open-job-position`);
    };

    // Fetch job vacancies for the manager using React Query
    const { data, isLoading, isError, error } = useQuery(
        ["JobVacancy", organisationId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/vacancies`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.data;
        }
    );

    // View vacancy function (navigate to the same component)
    const viewVacancy = (vacancyId) => {
        navigate(`/organisation/${organisationId}/my-open-job-position/view/${vacancyId}`);
    };

    // Edit vacancy function (navigate to the same component)
    const editVacancy = (vacancyId) => {
        navigate(`/organisation/${organisationId}/my-open-job-position/${vacancyId}`);
    };

    // Delete vacancy function
    const deleteVacancy = async (vacancyId) => {
        try {
            // Send delete request to the server
            await axios.delete(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/vacancy/${vacancyId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            // Invalidate the "JobVacancy" query to trigger re-fetch
            queryClient.invalidateQueries(["JobVacancy", organisationId]);

            alert("Vacancy deleted successfully!");
        } catch (err) {
            alert("Failed to delete vacancy.");
        }
    };


    return (
        <BoxComponent>
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <HeadingOneLineInfo heading="Job Vacancy" info="Here manager can view and add job vacancy" />
                <BasicButton title={"Add Job Vacancy"} onClick={handleAddVacancy} />
            </div>

            {/* Content Section */}
            <div className="mt-6">
                {isLoading && (
                    <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
                        <CircularProgress />
                    </div>
                )}
                {isError && <p>Error loading vacancies: {error.message}</p>}
                {!isLoading && data && data.length === 0 && <p>No job vacancies found.</p>}

                {/* Display Job Vacancies */}
                {!isLoading && data && data.length > 0 && (
                    <table className="min-w-full bg-white text-left !text-sm font-light">
                        <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                            <tr className="!font-semibold">
                                <th scope="col" className="!text-left pl-8 py-3">Sr. No</th>
                                <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">Job Position</th>
                                <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">Department</th>
                                <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">Experience</th>
                                <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Render Vacancy Data */}
                            {data.map((vacancy, index) => (
                                <tr key={vacancy._id} className="border-b hover:bg-gray-100">
                                    <td className="pl-8 py-3">{index + 1}</td>
                                    <td className="pl-8 py-3">{vacancy.positionTitle}</td>
                                    <td className="pl-8 py-3">{vacancy.department}</td>
                                    <td className="pl-8 py-3">{vacancy.experienceRequired}</td>
                                    <td className="whitespace-nowrap pl-8">
                                        <IconButton onClick={() => viewVacancy(vacancy._id)} color="primary" aria-label="view">
                                            <View />
                                        </IconButton>
                                        <IconButton onClick={() => editVacancy(vacancy._id)} color="primary" aria-label="edit">
                                            <EditOutlinedIcon />
                                        </IconButton>
                                        <IconButton onClick={() => deleteVacancy(vacancy._id)} color="error" aria-label="delete">
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </BoxComponent>
    );
};

export default MrOpenJobVacancyList;
