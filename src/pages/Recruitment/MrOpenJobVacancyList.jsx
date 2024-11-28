import React, { useContext, useState } from "react";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../components/BasicButton";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery, useQueryClient } from "react-query";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
} from "@mui/material";
import {
    EditOutlined as EditOutlinedIcon,
    DeleteOutline as DeleteOutlineIcon,
    Visibility as ViewIcon,
} from "@mui/icons-material";
import { TestContext } from "../../State/Function/Main";

const MrOpenJobVacancyList = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { organisationId } = useParams();
    const [open, setOpen] = useState(false);
    const [selectedVacancy, setSelectedVacancy] = useState(null); // Track selected vacancy for deletion
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { handleAlert } = useContext(TestContext);
    // Add Vacancy Handler
    const handleAddVacancy = () => {
        navigate(`/organisation/${organisationId}/my-open-job-vacancy`);
    };

    // Fetch job vacancies for the manager using React Query
    const { data, isLoading } = useQuery(
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

    // View Vacancy Handler
    const viewVacancy = (vacancyId) => {
        navigate(
            `/organisation/${organisationId}/my-open-job-vacancy/view/${vacancyId}`
        );
    };

    // Edit Vacancy Handler
    const editVacancy = (vacancyId) => {
        navigate(`/organisation/${organisationId}/my-open-job-vacancy/${vacancyId}`);
    };

    // Confirm Delete Vacancy
    const confirmDeleteVacancy = (vacancyId) => {
        setSelectedVacancy(vacancyId);
        setOpen(true);
    };

    // Handle Delete Vacancy
    const handleDelete = async () => {
        try {
            await axios.delete(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/manager/vacancy/${selectedVacancy}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );

            // Invalidate the cache to fetch updated data

            setOpen(false);
            setSelectedVacancy(null);
            handleAlert(true, "success", "Job vacancy deleted successfully.");
            queryClient.invalidateQueries(["JobVacancy", organisationId]);
        } catch (err) {
            alert("Failed to delete vacancy.");
        }
    };

    return (
        <div>
            {/* Header Section */}
            <Grid container sm={12} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                <Grid item xs={12} sm={6}>
                    <HeadingOneLineInfo
                        heading="Job Vacancy"
                        info="Here manager can view and add job vacancy"
                    />
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <BasicButton title={"Add Job Vacancy"} onClick={handleAddVacancy} />
                </Grid>
            </Grid>
            {/* Content Section */}
            <div className="overflow-auto !p-0 border-[.5px] border-gray-200 mt-2">
                {isLoading && (
                    <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
                        <CircularProgress />
                    </div>
                )}

                {!isLoading && data && data.length === 0 && <p>No job vacancies found.</p>}

                {/* Display Job Vacancies */}
                {!isLoading && data && data.length > 0 && (
                    <table className="min-w-full bg-white text-left !text-sm font-light">
                        <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                            <tr className="!font-semibold">
                                <th scope="col" className="whitespace-nowrap  !text-left pl-8 py-3">
                                    Sr. No
                                </th>
                                <th scope="col" className="whitespace-nowrap  !text-left pl-8 py-3">
                                    Job Position
                                </th>
                                <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                                    Department
                                </th>
                                <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                                    Experience
                                </th>
                                <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                                    Vacancy
                                </th>
                                <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                                    Assign HR
                                </th>
                                <th scope="col" className="whitespace-nowrap !text-left pl-8 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {/* Render Vacancy Data */}
                            {data.map((vacancy, index) => (
                                <tr
                                    key={vacancy._id}
                                    className="whitespace-nowrap  border-b hover:bg-gray-100"
                                >
                                    <td className="pl-8 py-3">{index + 1}</td>
                                    <td className="whitespace-nowrap  pl-8 py-3">{vacancy.jobPosition}</td>
                                    <td className="whitespace-nowrap  pl-8 py-3">
                                        {vacancy?.department?.departmentName}
                                    </td>
                                    <td className="whitespace-nowrap pl-8 py-3">
                                        {vacancy.experienceRequired}
                                    </td>
                                    <td className="whitespace-nowrap pl-8 py-3">{vacancy.vacancies}</td>
                                    <td className="whitespace-nowrap pl-8 py-3">
                                        {vacancy.hrAssigned.email}
                                    </td>
                                    <td className="pl-8 whitespace-nowrap ">
                                        <IconButton
                                            onClick={() => viewVacancy(vacancy._id)}
                                            color="primary"
                                            aria-label="view"
                                        >
                                            <ViewIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => editVacancy(vacancy._id)}
                                            color="primary"
                                            aria-label="edit"
                                        >
                                            <EditOutlinedIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => confirmDeleteVacancy(vacancy._id)}
                                            color="error"
                                            aria-label="delete"
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} className="p-0">
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <p>
                        Are you sure you want to delete this job vacancy?
                    </p>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpen(false)}
                        variant="outlined"
                        color="primary"
                        size="small"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={handleDelete}
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
};

export default MrOpenJobVacancyList;
