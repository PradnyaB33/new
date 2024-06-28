import { Typography, Container, Button} from "@mui/material";
import React, { useState } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from "react-router-dom";
import OpenSurveyList from "./components/OpenSurveyList";
import CloseSurveyList from "./components/CloseSurveyList";

const EmployeeSurvey = () => {
    const navigate = useNavigate();

    const [openSurvey, setOpenSurvey] = useState(false)
    const [closeSurvey, setCloseSurvey] = useState(false)

    const handleCreateNewSurvey = () => {
        navigate("/organisation/:organisationId/create-new-survey");
    }

    const handleOpenSurvey = () => {
        setOpenSurvey(!openSurvey)
    }

    const handleCloseSurvey = () => {
        setCloseSurvey(!closeSurvey)
    }

    return (
        <>
            <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
                <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center">
                    <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
                        <div className="flex  gap-2">
                            <div className="mt-1 pl-2">
                                <AssignmentIcon />
                            </div>
                            <div>
                                <h1 className="!text-lg">Employee Survey</h1>
                            </div>
                        </div>
                    </div>
                    <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
                        <div className="flex justify-end w-full">
                            <Button
                                className="!font-semibold !bg-sky-500 flex gap-2"
                                variant="contained"
                                onClick={handleCreateNewSurvey}
                            >
                                Create New Survey
                            </Button>
                        </div>
                    </div>
                    <div className="p-4  flex  justify-between  gap-3 w-full border-gray-300">
                        <div className="flex justify-start ">
                            <Typography variant="h6" className="pl-10 mb-6 mt-2">
                                Open Survey
                            </Typography>
                        </div>
                        <div className="mt-1 flex justify-end">
                            <AddCircleOutlineIcon style={{ width: "40px" }} onClick={handleOpenSurvey} />
                            <Typography variant="p" className="pl-10 mb-6 mt-2 w-50">
                                Count: 10
                            </Typography>
                        </div>
                    </div>
                    {openSurvey ? <OpenSurveyList /> : null}
                    <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
                        <div className="flex justify-start ">
                            <Typography variant="h6" className="pl-10 mb-6 mt-2">
                                Close Survey
                            </Typography>
                        </div>
                        <div className="mt-1 flex justify-end">
                            <AddCircleOutlineIcon style={{ width: "50px" }} onClick={handleCloseSurvey} />
                            <Typography variant="p" className="pl-10 mb-6 mt-2 w-50">
                                Count: 5
                            </Typography>
                        </div>
                    </div>
                    {closeSurvey ? <CloseSurveyList /> : null}
                </article>
            </Container></>
    );
};

export default EmployeeSurvey;
