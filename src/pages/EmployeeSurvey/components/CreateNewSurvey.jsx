import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from 'react-router-dom';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Select, TextField, MenuItem, Checkbox, Button, IconButton, FormControlLabel, Switch, Radio, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import WorkIcon from "@mui/icons-material/Work";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Email, West } from "@mui/icons-material";
import AuthInputFiled from '../../../components/InputFileds/AuthInputFiled';
import UserProfile from '../../../hooks/UserData/useUser';
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import useCreateEmployeeSurveyState from '../../../hooks/EmployeeSurvey/EmployeeSurvey';

const CreateNewSurvey = () => {
    //hooks
    const navigate = useNavigate();
    const { handleAlert } = useContext(TestContext);
    const { id } = useParams();

    //states
    const [questions, setQuestions] = useState([{ question: '', questionType: '', options: [], required: false }]);
    const [showSelectAll, setShowSelectAll] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    //get organisationId
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const organisationId = user?.organizationId;

    //get authToken
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    //get useCreateEmployeeSurveyState
    const {
        title,
        description,
        employeeSurveyStartingDate,
        employeeSurveyEndDate,
        to
    } = useCreateEmployeeSurveyState();

    //EmployeeSurveySchema
    const EmployeeSurveySchema = z.object({
        title: z.string(),
        description: z.string(),
        employeeSurveyStartingDate: z.string(),
        employeeSurveyEndDate: z.string(),
        to: z.array(
            z.object({
                label: z.string(),
                value: z.string(),
            })
        ),
    });

    //useForm
    const { control, formState, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            title,
            description,
            employeeSurveyStartingDate,
            employeeSurveyEndDate,
            to
        },
        resolver: zodResolver(EmployeeSurveySchema),
    });

    const { errors } = formState;

    // Fetch single survey data
    const { isLoading } = useQuery(
        ["singleDraftSurvey", id],
        async () => {
            const response = await axios.get(`${process.env.REACT_APP_API}/route/organization/${organisationId}/get-single-draft-survey/${id}`, {
                headers: {
                    Authorization: authToken,
                },
            });
            return response.data;
        },
        {
            onSuccess: (data) => {
                if (data) {
                    setValue("title", data?.title);
                    setValue("description", data?.description);
                    setValue("employeeSurveyStartingDate", dayjs(data?.employeeSurveyStartingDate).format('YYYY-MM-DD'));
                    setValue("employeeSurveyEndDate", dayjs(data?.employeeSurveyEndDate).format('YYYY-MM-DD'));
                    setQuestions(data?.questions?.map(q => ({
                        question: q.question,
                        questionType: q.questionType,
                        options: q.options?.map(opt => ({ title: opt, checked: false })),
                        required: q.required,
                    })));

                    setValue("to", data?.to?.map(option => ({ label: option, value: option })));
                }
            },
            enabled: !!id,
        },
    );

    //add and update employee survey
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
    },
        {
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

    //handleQuestionTypeChange function
    const handleQuestionTypeChange = (index, event) => {
        const selectedType = event.target.value;
        const newQuestions = [...questions];
        newQuestions[index].questionType = selectedType;
        newQuestions[index].options = [];
        setQuestions(newQuestions);
    };

    //handleAddOption function
    const handleAddOption = (index) => {
        const newQuestions = [...questions];
        newQuestions[index].options.push({ title: '', checked: false });
        setQuestions(newQuestions);
    };

    //handleOptionChange function
    const handleOptionChange = (qIndex, oIndex, key, value) => {
        const newQuestions = [...questions];
        if (key === 'title') {
            newQuestions[qIndex].options[oIndex].title = value;
        } else if (key === 'checked') {
            newQuestions[qIndex].options[oIndex].checked = !newQuestions[qIndex].options[oIndex].checked;
        } else if (key === 'radio') {
            newQuestions[qIndex].options.forEach((opt, index) => {
                opt.checked = index === oIndex;
            });
        }
        setQuestions(newQuestions);
    };

    //handleRequiredChange function
    const handleRequiredChange = (index) => {
        const newQuestions = [...questions];
        newQuestions[index].required = !newQuestions[index].required;
        setQuestions(newQuestions);
    };

    //handleAddQuestion function
    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', questionType: '', options: [], required: false }]);
    };

    //handleRemoveQuestion function
    const handleRemoveQuestion = (index) => {
        const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
        setQuestions(newQuestions);
    };

    //handleQuestionChange function
    const handleQuestionChange = (index, event) => {
        const newQuestions = [...questions];
        newQuestions[index].question = event.target.value;
        setQuestions(newQuestions);
    };

    //handleCopyQuestion function
    const handleCopyQuestion = (index) => {
        const newQuestions = [...questions];
        const copiedQuestion = { ...newQuestions[index] };
        newQuestions.splice(index + 1, 0, copiedQuestion);
        setQuestions(newQuestions);
    };

    //handleSuffleQuestion function
    const handleSuffleQuestion = (index) => {
        const newQuestions = [...questions];
        if (index > 0) {
            const shuffledQuestion = newQuestions[index];
            newQuestions.splice(index, 1);
            newQuestions.splice(index - 1, 0, shuffledQuestion);
            setQuestions(newQuestions);
        }
    };

    //get employee in to field
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

    //handleSelectAll function for select all employee
    const handleSelectAll = (fieldName) => {
        setValue(fieldName, employeeEmail);
    };

    //renderAnswerInput
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
                        <div className='mt-2'>
                            <Button onClick={() => handleAddOption(qIndex)} aria-label="add option">
                                Add Options
                            </Button></div>
                    </div>
                );
            case 'Dropdown':
                return (
                    <div>
                        {options?.map((option, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <TextField
                                    value={option.title}
                                    onChange={(e) => handleOptionChange(qIndex, index, 'title', e.target.value)}
                                    fullWidth
                                    style={{ marginLeft: '10px' }}
                                    variant='standard'
                                />
                            </div>
                        ))}
                        <div className='mt-2'>
                            <Button onClick={() => handleAddOption(qIndex)} aria-label="add option">
                                Add Options
                            </Button>
                        </div>
                    </div>
                );
            case 'Date':
                return (
                    <div className='mt-4'>
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
                    </div>
                );
            case 'Multi-choice':
                return (
                    <div>
                        {options?.map((option, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <Radio
                                    checked={option.checked}
                                    onChange={() => handleOptionChange(qIndex, index, 'radio')}
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
                )
            default:
                return null;
        }
    };

    //handleSubmitForm 
    const handleSubmitForm = (data, status) => {
        setFormSubmitted(true);
        const formData = {
            title: data.title,
            description: data.description,
            questions: questions?.map(q => ({
                question: q.question,
                questionType: q.questionType,
                options: q.options?.map(opt => opt.title),
                required: q.required,
            })),
            employeeSurveyStartingDate: data.employeeSurveyStartingDate,
            employeeSurveyEndDate: data.employeeSurveyEndDate,
            to: data.to?.map(option => option.value),
            creatorId: user?._id,
            status: status,
        };
        console.log("formdata", formData);
        mutation.mutate(formData, {
            onSuccess: (data) => {
                console.log('Form successfully submitted', data);
            },
            onError: (error) => {
                console.error('Error submitting form', error);
            },
        });
    };

    //handleClose function
    const handleClose = () => {
        navigate(`/organisation/${organisationId}/employee-survey`);
    };

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
            {isLoading ? (
                <div className="flex justify-center p-4">
                    <CircularProgress />
                </div>
            ) : (
                <section className="md:px-8 flex space-x-2 md:py-6">
                    <article className="w-full rounded-lg bg-white">
                        <div className="w-full md:px-5 px-1">
                            <div className="w-full mt-4 px-2 sm:px-4 lg:px-6">
                                <h1 className="text-xl mb-4 font-bold">Create Survey</h1>
                                <form onSubmit={handleSubmit((data) => handleSubmitForm(data, true))} className="w-full flex flex-col space-y-4">
                                    <div className="w-full">
                                        <AuthInputFiled
                                            name="title"
                                            control={control}
                                            type="texteditor"
                                            placeholder="Title"
                                            label="Title"
                                            errors={errors}
                                            error={errors.title}
                                        // className="!h-20"
                                        // mb-36 sm:mb-28 md:mb-0
                                        /></div>
                                    <div className="w-full">
                                        <AuthInputFiled
                                            name="description"
                                            control={control}
                                            type="texteditor"
                                            placeholder="Description"
                                            label="Description"
                                            errors={errors}
                                            error={errors.description}
                                        // className="!h-30"
                                        />
                                    </div>

                                    {questions?.map((q, index) => (
                                        <div className="grid grid-cols-1 w-full">
                                            <div key={index} >
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: "30px" }}>
                                                    <label className='font-semibold text-gray-500 text-md'>Question {index + 1}</label>
                                                    <div>
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
                                                            <MenuItem value="Multi-choice">Multi-choice</MenuItem>
                                                        </Select>
                                                        <div className="h-4 !mb-1">
                                                            {formSubmitted && (
                                                                <p className="text-sm text-red-500">Please select a question type</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div>
                                                        <TextField
                                                            placeholder="Enter Question"
                                                            variant='standard'
                                                            fullWidth
                                                            value={q.question}
                                                            onChange={(e) => handleQuestionChange(index, e)}
                                                        />
                                                    </div>
                                                </div>
                                                {renderAnswerInput(index)}
                                                <div className='flex justify-end'>
                                                    {index > 0 && (<IconButton onClick={() => handleSuffleQuestion(index)} aria-label="shuffle question">
                                                        <ArrowUpwardIcon />
                                                    </IconButton>)}
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
                                        </div>
                                    ))}
                                    <div className="flex gap-4 mt-4 justify-end">
                                        <Button color="primary" variant="outlined" onClick={handleAddQuestion}>
                                            Add Question
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" style={{ marginTop: "30px" }}>
                                        <AuthInputFiled
                                            name="employeeSurveyStartingDate"
                                            icon={WorkIcon}
                                            control={control}
                                            type="date"
                                            placeholder="dd-mm-yyyy"
                                            label="Starting date*"
                                            errors={errors}
                                            error={errors.employeeSurveyStartingDate}
                                            min={new Date().toISOString().split("T")[0]}
                                        />
                                        <AuthInputFiled
                                            name="employeeSurveyEndDate"
                                            icon={WorkIcon}
                                            control={control}
                                            type="date"
                                            placeholder="dd-mm-yyyy"
                                            label="Ending date*"
                                            errors={errors}
                                            error={errors.employeeSurveyEndDate}
                                            min={watch("employeeSurveyStartingDate")}
                                        />
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
                </section>)}
        </div>
    );
}

export default CreateNewSurvey;
