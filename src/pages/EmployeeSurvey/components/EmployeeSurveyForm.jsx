import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CircularProgress, IconButton, Button, FormControlLabel, Checkbox, Radio, RadioGroup, FormControl, TextField, Select, MenuItem } from "@mui/material";
import { UseContext } from "../../../State/UseState/UseContext";
import UserProfile from "../../../hooks/UserData/useUser";
import DOMPurify from "dompurify";
import { West } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import { useQuery, useMutation } from 'react-query';
import { TestContext } from "../../../State/Function/Main";

const EmployeeSurveyForm = () => {
    const navigate = useNavigate();
    const { handleAlert } = useContext(TestContext);
    const { surveyId, responseId } = useParams();
    console.log("responseId..", responseId);
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    // Get organizationId
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const organisationId = user?.organizationId;

    // useForm 
    const { control, handleSubmit, setValue,formState: { errors } } = useForm();

    // Get Form
    const { data: surveyData, error, isLoading } = useQuery(
        ['survey', organisationId, surveyId, authToken],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-single-open-survey/${surveyId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data;
        }
    );

    // Fetch single survey data
    const [singleResponseSurvey, setSingleResponseSurvey] = useState(null);
    console.log("singleResponseSurvey", singleResponseSurvey);

    const { isLoading: isLoading1 } = useQuery(
        ["singleResponseSurvey", surveyId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-single-response-survey/${surveyId}/${responseId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data;
        },
        {
            enabled: !!surveyId,
            onSuccess: (data) => {

                setSingleResponseSurvey(data);
                data.questions.forEach((q, index) => {
                    setValue(`answer_${index}`, q.answer);
                });
            },
        }
    );

    // Post Data
    const mutation = useMutation(
        async (data) => {
            await axios.post(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-employee-survey-response-form`,
                data,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
        },
        {
            onSuccess: (response) => {
                if (response.status === 201 || response.status === 200) {
                    navigate(`/organisation/${organisationId}/employee-survey`);
                }
                handleAlert(true, "success", "Saved survey response successfully");
            },
            onError: (error) => {
                console.error("Error submitting survey responses:", error);
            }
        }
    );

    const onSubmit = (formData, responseStatus) => {
        const data = {
            surveyId: surveyData._id,
            title: surveyData.title,
            description: surveyData.description,
            questions: surveyData.questions.map((q, index) => ({
                questionId:q?._id,
                questionType:q?.questionType,
                question: q?.question,
                answer: q.questionType === "Checkboxes"
                    ? q.options.filter((_, optIndex) => formData[`question_${index}_option_${optIndex}`])
                    : formData[`answer_${index}`],
            })),
            responseStatus: responseStatus,
            employeeId: user._id,
        };
        console.log("data..........", data);
        mutation.mutate(data);
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <div>Error fetching survey data</div>;
    }

    const handleClose = () => {
        navigate(`/organisation/${organisationId}/employee-survey`);
    };
    return (
        <div className="bg-gray-50 min-h-screen h-auto font-family">
            <header className="text-xl w-full pt-6 flex flex-col md:flex-row items-start md:items-center gap-2 bg-white shadow-md p-4">
                {/* Back Button */}
                <div className="flex-shrink-0">
                    <IconButton onClick={() => navigate(-1)}>
                        <West className="text-xl" />
                    </IconButton>
                </div>

                {/* Main Header Content */}
                <div className="flex flex-col md:flex-row justify-between w-full md:ml-4">
                    <div className="mb-2 md:mb-0 md:mr-4">
                        <h1 className="text-xl font-bold">Fill Employee Survey</h1>
                        <p className="text-sm text-gray-600">
                            Here you can fill survey
                        </p>
                    </div>
                </div>
            </header>

            <section className="md:px-8 flex space-x-2 md:py-6">
                <article className="w-full rounded-lg bg-white">
                    <div className="w-full md:px-5 px-1">
                        <div className="w-full mt-4 p-4">
                            <h1 className="text-2xl mb-4 font-bold">
                                {DOMPurify.sanitize(surveyData.title, { USE_PROFILES: { html: false } })}
                            </h1>
                            <p className="mb-5">
                                {DOMPurify.sanitize(surveyData?.description, { USE_PROFILES: { html: false } })}
                            </p>
                            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-1 space-y-2 flex-col">
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                    {surveyData?.questions.map((q, index) => (
                                        <div key={q._id}>
                                            <div>
                                                <p className="text-xl mb-4">{q.question}</p>
                                            </div>
                                            <div>
                                                {q.questionType === "Short Answer" && (
                                                    <AuthInputFiled
                                                        name={`answer_${index}`}
                                                        control={control}
                                                        type="text"
                                                        placeholder="Enter answer*"
                                                        readOnly={false}
                                                        maxLimit={100}
                                                        errors={errors}
                                                        error={errors[`answer_${index}`]}
                                                    />
                                                )}
                                                {q.questionType === "Paragraph" && (
                                                    <AuthInputFiled
                                                        name={`answer_${index}`}
                                                        control={control}
                                                        type="textarea"
                                                        placeholder="Enter detailed answer*"
                                                        readOnly={false}
                                                        maxLimit={150}
                                                        errors={errors}
                                                        error={errors[`answer_${index}`]}
                                                    />
                                                )}
                                                {q.questionType === "Checkboxes" && (
                                                    q.options.map((option, optIndex) => (
                                                        <div key={optIndex} className="flex items-center">
                                                            <Controller
                                                                name={`question_${index}_option_${optIndex}`}
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Checkbox {...field} />
                                                                )}
                                                            />
                                                            <span className="ml-2">{option}</span>
                                                        </div>
                                                    ))
                                                )}
                                                {q.questionType === "Dropdown" && (
                                                    <Controller
                                                        name={`answer_${index}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select {...field} fullWidth>
                                                                {q.options.map((option, optIndex) => (
                                                                    <MenuItem key={optIndex} value={option}>
                                                                        {option}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        )}
                                                    />
                                                )}
                                                {q.questionType === "Date" && (
                                                    <Controller
                                                        name={`answer_${index}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                type="date"
                                                                fullWidth
                                                                InputLabelProps={{ shrink: true }}
                                                            />
                                                        )}
                                                    />
                                                )}
                                                {q.questionType === "Multi-choice" && (
                                                    <FormControl component="fieldset">
                                                        <Controller
                                                            name={`answer_${index}`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <RadioGroup {...field}>
                                                                    {q.options.map((option, optIndex) => (
                                                                        <FormControlLabel
                                                                            key={optIndex}
                                                                            value={option}
                                                                            control={<Radio />}
                                                                            label={option}
                                                                        />
                                                                    ))}
                                                                </RadioGroup>
                                                            )}
                                                        />
                                                    </FormControl>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-4 mt-4 justify-end">
                                    <Button type="submit" variant="contained" color="primary" className="mt-4" onClick={handleSubmit((data) => onSubmit(data, "End"))}>
                                        Submit
                                    </Button>
                                    <Button type="button" variant="outlined" color="primary" onClick={handleSubmit((data) => onSubmit(data, "Complete Survey"))}>
                                        Save For Now
                                    </Button>
                                    <Button onClick={handleClose} variant="outlined" color="error">
                                        Close
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </article>
            </section>
        </div>
    );
};

export default EmployeeSurveyForm;
