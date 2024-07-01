import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress, IconButton, Button } from "@mui/material";
import { UseContext } from "../../../State/UseState/UseContext";
import UserProfile from "../../../hooks/UserData/useUser";
import DOMPurify from "dompurify";
import { West } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";

const EmployeeSurveyForm = () => {
    const navigate = useNavigate();
    const { surveyId } = useParams();
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    // State for loading and survey data
    const [isLoading, setIsLoading] = useState(true);
    const [surveyData, setSurveyData] = useState(null);
    console.log("surveyData", surveyData);
    // Get organizationId
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const organisationId = user?.organizationId;

    // Initialize useForm to get control and errors from react-hook-form
    const { control, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchSurvey = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-single-open-survey/${surveyId}`,
                    {
                        headers: {
                            Authorization: authToken,
                        },
                    }
                );

                const data = response.data;
                setSurveyData(data);
            } catch (error) {
                console.error("Error fetching survey data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSurvey();
    }, [authToken, surveyId, organisationId]);


    const onSubmit = async (formData) => {
        const data = {
            title: surveyData.title,
            description: surveyData.description,
            questions: surveyData.questions.map((q, index) => ({
                question: q.question,
                answer: q.questionType === "Checkboxes"
                    ? q.options.filter((_, optIndex) => formData[`question_${index}_option_${optIndex}`])
                    : formData[`answer_${index}`],
            })),
        };
        console.log("data...........", data);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/send-survey-responses`,
                data,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response;
        } catch (error) {
            console.error("Error", error);
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <div className="bg-gray-50 min-h-screen h-auto">
            <header className="text-xl w-full pt-6 flex items-start gap-2 bg-white shadow-md p-4">
                <IconButton onClick={() => navigate(-1)}>
                    <West className=" !text-xl" />
                </IconButton>
                <div className="flex justify-between w-full">
                    <div>
                        Employee Survey
                        <p className="text-xs text-gray-600">Fill employee survey form</p>
                    </div>
                </div>
            </header>

            <section className="md:px-8 flex space-x-2 md:py-6">
                <article className="w-full rounded-lg bg-white">
                    <div className="w-full md:px-5 px-1">
                        <div className="w-full mt-4">
                            <h1 className="text-2xl mb-4 font-bold">
                                {DOMPurify.sanitize(surveyData.title, { USE_PROFILES: { html: false } })}
                            </h1>
                            <p className="text-2xl mb-4">
                                {DOMPurify.sanitize(surveyData?.description, { USE_PROFILES: { html: false } })}
                            </p>
                            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-1 space-y-2 flex-col">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {surveyData?.questions.map((q, index) => (
                                        <div key={q._id}>
                                            <div>
                                                <p className="text-2xl mb-4 font-bold">{q.question}</p>
                                            </div>
                                            <div>
                                                {q.questionType === "Short Answer" && (
                                                    <AuthInputFiled
                                                        name={`answer_${index}`}
                                                        control={control}
                                                        type="text"
                                                        placeholder="Enter answer*"
                                                        readOnly={false}
                                                        maxLimit={15}
                                                        errors={errors}
                                                        error={errors[`answer_${index}`]}
                                                    />
                                                )}
                                                {q.questionType === "Checkboxes" && (
                                                    q.options.map((option, optIndex) => (
                                                        <div key={optIndex} className="flex">
                                                            <div className="flex justify-start">
                                                                <AuthInputFiled
                                                                    name={`question_${index}_option_${optIndex}`}
                                                                    control={control}
                                                                    type="checkbox"
                                                                    errors={errors}
                                                                    error={errors.pwd}

                                                                /></div>
                                                            <span className="flex justify-start">{option}</span>

                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button type="submit" variant="contained" color="primary" className="mt-4">
                                    Submit
                                </Button>
                            </form>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    );
};

export default EmployeeSurveyForm;
