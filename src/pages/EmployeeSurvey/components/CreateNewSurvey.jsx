import React, { useState, useContext, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { Select, Typography, TextField, MenuItem, Checkbox, Button, IconButton, FormControlLabel, Switch } from '@mui/material';
import AuthInputFiled from '../../../components/InputFileds/AuthInputFiled';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import axios from 'axios';
import UserProfile from '../../../hooks/UserData/useUser';
import { UseContext } from "../../../State/UseState/UseContext";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { Email, West } from "@mui/icons-material";
import { useNavigate, useParams } from 'react-router-dom';
import { TestContext } from "../../../State/Function/Main";

dayjs.extend(isSameOrBefore);

const CreateNewSurvey = () => {
    const navigate = useNavigate();
    const { handleAlert } = useContext(TestContext);
    const { id } = useParams();

    const [questions, setQuestions] = useState([{ question: '', questionType: '', options: [], required: false }]);
    const [employeeSurveyStartingDate, setEmployeeSurveyStartingDate] = useState(null);
    const [employeeSurveyEndDate, setEmployeeSurveyEndDate] = useState(null);
    const [showSelectAll, setShowSelectAll] = useState(false);
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const organisationId = user?.organizationId;

    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { control, formState: { errors }, handleSubmit, setValue } = useForm();

    // Fetch single survey data
    const { data: surveyData, isLoading } = useQuery(
        ["survey", id],
        async () => {
            const response = await axios.get(`${process.env.REACT_APP_API}/route/organization/${organisationId}/get-single-draft-survey/${id}`, {
                headers: {
                    Authorization: authToken,
                },
            });
            return response.data;
        },
        {
            enabled: !!id,
        }
    );

    useEffect(() => {
        if (surveyData) {
            setValue("title", surveyData.title);
            setValue("description", surveyData.description);

            setQuestions(surveyData.questions?.map(q => ({
                question: q.question,
                questionType: q.questionType,
                options: q.options?.map(opt => ({ title: opt, checked: false })),
                required: q.required,
            })));
            setEmployeeSurveyStartingDate(dayjs(surveyData.employeeSurveyStartingDate));
            setEmployeeSurveyEndDate(dayjs(surveyData.employeeSurveyEndDate));
            setValue("to", surveyData.to?.map(option => ({ label: option, value: option })));
        }
    }, [surveyData, setValue]);

    const mutation = useMutation(async (formData) => {
        let response;
        if (id) {
            // Update survey
            response = await axios.put(`${process.env.REACT_APP_API}/route/organization/${organisationId}/update-employee-survey/${id}`, formData,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
        } else {
            // Add new survey
            response = await axios.post(`${process.env.REACT_APP_API}/route/organization/${organisationId}/add-employee-survey-form`, formData,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
        }
        return response;
    }, {
        onSuccess: (response) => {
            if (response.status === 201 || response.status === 200) {
                navigate(`/organisation/${organisationId}/employee-survey`);
            };
            handleAlert(true, "success", "Saved employee survey successfully");
        },
        onError: (error) => {
            console.error('Error submitting form', error);
        },
    });

    const handleQuestionTypeChange = (index, event) => {
        const selectedType = event.target.value;
        const newQuestions = [...questions];
        newQuestions[index].questionType = selectedType;
        newQuestions[index].options = [];
        setQuestions(newQuestions);
    };

    const handleAddOption = (index) => {
        const newQuestions = [...questions];
        newQuestions[index].options.push({ title: '', checked: false });
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, key, value) => {
        const newQuestions = [...questions];
        if (key === 'title') {
            newQuestions[qIndex].options[oIndex].title = value;
        } else if (key === 'checked') {
            newQuestions[qIndex].options[oIndex].checked = !newQuestions[qIndex].options[oIndex].checked;
        }
        setQuestions(newQuestions);
    };

    const handleRequiredChange = (index) => {
        const newQuestions = [...questions];
        newQuestions[index].required = !newQuestions[index].required;
        setQuestions(newQuestions);
    };

    const renderAnswerInput = (qIndex) => {
        const { questionType, options } = questions[qIndex];
        switch (questionType) {
            case 'Short Answer':
                return (
                    <TextField
                        id="answer-input"
                        label="Short-answer text"
                        placeholder={`Enter ${questionType} Answer`}
                        fullWidth
                        variant='standard'
                        disabled
                    />
                );
            case 'Paragraph':
                return (
                    <TextField
                        id="answer-input"
                        label="Long-answer text"
                        placeholder={`Enter ${questionType} Answer`}
                        fullWidth
                        variant='standard'
                        disabled
                    />
                );
            case 'Checkboxes':
                return (
                    <div>
                        {options?.map((option, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <Checkbox
                                    checked={option.checked}
                                    onChange={() => handleOptionChange(qIndex, index, 'checked')}
                                    disabled
                                />
                                <TextField
                                    value={option.title}
                                    onChange={(e) => handleOptionChange(qIndex, index, 'title', e.target.value)}
                                    fullWidth
                                    style={{ marginLeft: '10px' }}
                                    variant='standard'
                                />
                            </div>
                        ))}
                        <Button onClick={() => handleAddOption(qIndex)} aria-label="add option">
                            Add Options
                        </Button>
                    </div>
                );
            case 'Dropdown':
                return (
                    <TextField
                        id="dropdown-options"
                        label="Dropdown Options (comma-separated)"
                        placeholder="Option 1, Option 2, Option 3"
                        fullWidth
                    />
                );
            case 'Date':
                return (
                    <TextField
                        id="date-input"
                        label="Select Date"
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        fullWidth
                        disabled
                    />
                );
            default:
                return null;
        }
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', questionType: '', options: [], required: false }]);
    };

    const handleRemoveQuestion = (index) => {
        const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
        setQuestions(newQuestions);
    };

    const handleQuestionChange = (index, event) => {
        const newQuestions = [...questions];
        newQuestions[index].question = event.target.value;
        setQuestions(newQuestions);
    };

    const handleCopyQuestion = (index) => {
        const newQuestions = [...questions];
        const copiedQuestion = { ...newQuestions[index] };
        newQuestions.splice(index + 1, 0, copiedQuestion);
        setQuestions(newQuestions);
    };

    const handleSubmitForm = (data, status) => {
        const formData = {
            title: data.title,
            description: data.description,
            questions: questions?.map(q => ({
                question: q.question,
                questionType: q.questionType,
                options: q.options?.map(opt => opt.title),
                required: q.required,
            })),
            employeeSurveyStartingDate,
            employeeSurveyEndDate,
            to: data.to?.map(option => option.value),
            creatorId: user?._id,
            status: status,
        };

        mutation.mutate(formData, {
            onSuccess: (data) => {
                console.log('Form successfully submitted', data);
            },
            onError: (error) => {
                console.error('Error submitting form', error);
            },
        });
    };

    const { data: employee } = useQuery(
        ["employee", organisationId],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/employee/${organisationId}/get-emloyee`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data.employees;
        }
    );

    const employeeEmail = employee
        ? employee?.map((emp) => ({
            label: emp.email,
            value: emp.email,
        }))
        : [];

    const handleSelectAll = (fieldName) => {
        setValue(fieldName, employeeEmail);
    };

    const handleClose = () => {
        navigate(`/organisation/${organisationId}/employee-survey`);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="bg-gray-50 min-h-screen h-auto">
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
                        <h1 className="text-xl font-bold">Create Employee Survey</h1>
                        <p className="text-sm text-gray-600">
                            Here you can create survey
                        </p>
                    </div>
                </div>
            </header>
            <section className="md:px-8 flex space-x-2 md:py-6">
                <article className="w-full rounded-lg bg-white">
                    <div className="w-full md:px-5 px-1">
                        <div className="w-full mt-4 p-4">
                            <h1 className="text-2xl mb-4 font-bold">Create Survey</h1>
                            <form onSubmit={handleSubmit((data) => handleSubmitForm(data, true))} className="w-full flex  flex-1 space-y-2 flex-col">
                                <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-2" style={{ marginBottom: "120px" }}>
                                    <AuthInputFiled
                                        name="title"
                                        control={control}
                                        type="texteditor"
                                        placeholder="Title"
                                        label="Title"
                                        errors={errors}
                                        rules={{ required: 'Title is required' }}
                                        className="!h-20"
                                    />
                                    <AuthInputFiled
                                        name="description"
                                        control={control}
                                        type="texteditor"
                                        placeholder="Description"
                                        label="Description"
                                        errors={errors}
                                        rules={{ required: 'Description is required' }}
                                        className="!h-20"
                                    />
                                </div>
                                {questions?.map((q, index) => (
                                    <div className="grid grid-cols-1 w-full">
                                        <div key={index} >
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Typography variant="p">Question {index + 1}</Typography>
                                                <div>
                                                    <IconButton onClick={() => handleCopyQuestion(index)} aria-label="copy question">
                                                        <FileCopyIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleRemoveQuestion(index)} aria-label="remove question">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                    <FormControlLabel
                                                        control={
                                                            <Switch
                                                                checked={q.required}
                                                                onChange={() => handleRequiredChange(index)}
                                                                name={`required-${index}`}
                                                                color="primary"
                                                            />
                                                        }
                                                        label="Required"
                                                    />
                                                </div>
                                            </div>
                                            <div className='flex gap-2 mb-2'>
                                                <TextField
                                                    placeholder="Enter Question"
                                                    variant='standard'
                                                    fullWidth
                                                    value={q.question}
                                                    onChange={(e) => handleQuestionChange(index, e)}
                                                />
                                                <Select
                                                    style={{ width: "200px" }}
                                                    labelId={`question-type-label-${index}`}
                                                    id={`question-type-select-${index}`}
                                                    value={q.questionType || ''}
                                                    onChange={(e) => handleQuestionTypeChange(index, e)}
                                                    displayEmpty
                                                >
                                                    <MenuItem value="" disabled>
                                                        Select Question Type
                                                    </MenuItem>
                                                    <MenuItem value="Short Answer">Short Answer</MenuItem>
                                                    <MenuItem value="Paragraph">Paragraph</MenuItem>
                                                    <MenuItem value="Checkboxes">Checkboxes</MenuItem>
                                                    <MenuItem value="Dropdown">Dropdown</MenuItem>
                                                    <MenuItem value="Date">Date</MenuItem>
                                                </Select>
                                            </div>
                                            {renderAnswerInput(index)}
                                        </div>
                                    </div>
                                ))}
                                <div className="flex gap-4 mt-4 justify-end">
                                    <Button color="primary" variant="outlined" onClick={handleAddQuestion}>
                                        Add Question
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 w-full gap-2" style={{ marginTop: "30px" }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Starting date"
                                            value={employeeSurveyStartingDate}
                                            onChange={(newDate) => {
                                                setEmployeeSurveyStartingDate(newDate);
                                            }}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                            disablePast
                                        />
                                    </LocalizationProvider>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Ending date"
                                            value={employeeSurveyEndDate}
                                            onChange={(newDate) => {
                                                setEmployeeSurveyEndDate(newDate);
                                            }}
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                            minDate={employeeSurveyStartingDate}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div className="space-y-2 ">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={showSelectAll}
                                                onChange={(e) => setShowSelectAll(e.target.checked)}
                                            />
                                        }
                                        label="Do you want to select all employee emails?"
                                    />
                                </div>

                                {showSelectAll && (
                                    <div className="space-y-2 ">
                                        <Button
                                            variant="outlined"
                                            onClick={() => handleSelectAll("to")}
                                        >
                                            Select All
                                        </Button>
                                    </div>
                                )}

                                <div className="space-y-2 ">
                                    <AuthInputFiled
                                        name="to"
                                        icon={Email}
                                        control={control}
                                        type="autocomplete"
                                        placeholder="To"
                                        label="To"
                                        readOnly={false}
                                        maxLimit={15}
                                        errors={errors}
                                        error={errors.to}
                                        optionlist={employeeEmail ? employeeEmail : []}
                                    />
                                </div>

                                <div className="flex gap-4 mt-4 justify-end">
                                    <Button type="submit" variant="contained" color="primary" onClick={() => handleSubmit((data) => handleSubmitForm(data, true))}>
                                        {id ? "Update Survey" : "Complete Survey"}
                                    </Button>
                                    <Button type="button" variant="outlined" color="primary" onClick={handleSubmit((data) => handleSubmitForm(data, false))}>
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
}

export default CreateNewSurvey;
