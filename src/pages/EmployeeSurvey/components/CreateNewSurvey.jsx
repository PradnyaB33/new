import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Select, Paper, Typography, TextField, MenuItem, Checkbox, Button, IconButton, FormControlLabel, Switch } from '@mui/material';
import AuthInputFiled from '../../../components/InputFileds/AuthInputFiled';
import DeleteIcon from '@mui/icons-material/Delete';
import FileCopyIcon from '@mui/icons-material/FileCopy';

const CreateNewSurvey = () => {
    /**
     * useState for question
     */
    const [questions, setQuestions] = useState([
        { question: '', questionType: '', options: [], required: false }
    ]);

    /**
     * handleQuestionTypeChange function
     * @param {*} index 
     * @param {*} event 
     */
    const handleQuestionTypeChange = (index, event) => {
        const selectedType = event.target.value;
        const newQuestions = [...questions];
        newQuestions[index].questionType = selectedType;
        newQuestions[index].options = [];
        setQuestions(newQuestions);
    };

    /**
     * handleAddOption function
     * @param {*} index 
     */
    const handleAddOption = (index) => {
        const newQuestions = [...questions];
        newQuestions[index].options.push({ title: '', checked: false });
        setQuestions(newQuestions);
    };

    /**
     * handleOptionChange function
     */
    const handleOptionChange = (qIndex, oIndex, key, value) => {
        const newQuestions = [...questions];
        if (key === 'title') {
            newQuestions[qIndex].options[oIndex].title = value;
        } else if (key === 'checked') {
            newQuestions[qIndex].options[oIndex].checked = !newQuestions[qIndex].options[oIndex].checked;
        }
        setQuestions(newQuestions);
    };

    /**
     * handleRequiredChange function
     */
    const handleRequiredChange = (index) => {
        const newQuestions = [...questions];
        newQuestions[index].required = !newQuestions[index].required;
        setQuestions(newQuestions);
    };

    /**
     * renderAnswerInput function
     * @param {*} qIndex 
     * @returns 
     */
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
                        {options.map((option, index) => (
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

    /**
     * handleAddQuestion function
     */
    const handleAddQuestion = () => {
        setQuestions([...questions, { question: '', questionType: '', options: [], required: false }]);
    };

    /**
     * handleRemoveQuestion function
     */
    const handleRemoveQuestion = (index) => {
        const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
        setQuestions(newQuestions);
    };

    /**
     * handleQuestionChange function
     */
    const handleQuestionChange = (index, event) => {
        const newQuestions = [...questions];
        newQuestions[index].question = event.target.value;
        setQuestions(newQuestions);
    };

    /**
   * handleCopyQuestion function
   */
    const handleCopyQuestion = (index) => {
        const newQuestions = [...questions];
        const copiedQuestion = { ...newQuestions[index] };
        newQuestions.splice(index + 1, 0, copiedQuestion);
        setQuestions(newQuestions);
    };

    /**
     * handleSubmitForm function
     */
    const handleSubmitForm = (data) => {
        const formData = {
            title: data.title,
            description: data.description,
            questions: questions.map(q => ({
                question: q.question,
                questionType: q.questionType,
                options: q.options.map(opt => opt.title),
                required: q.required,
            })),
        };

        console.log('Form submitted', formData);
    };

    /**
     * useForm
     */
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm();

    return (
        <Paper
            sx={{
                width: "100%",
                maxWidth: "800px",
                margin: "6% auto",
                padding: "20px 40px",
            }}
        >
            <form onSubmit={handleSubmit(handleSubmitForm)}>
                <h1 className="text-xl my-2 font-semibold font-sans">
                    Create New Form
                </h1>
                <div className="space-y-2 ">
                    <AuthInputFiled
                        name="title"
                        control={control}
                        type="texteditor"
                        placeholder="Title"
                        label="Title"
                        errors={errors}
                    />
                </div>
                <div className="space-y-2 ">
                    <AuthInputFiled
                        name="description"
                        control={control}
                        type="texteditor"
                        placeholder="Description"
                        label="Description"
                        errors={errors}
                    />
                </div>
                {questions.map((q, index) => (
                    <div key={index} style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Question {index + 1}</Typography>
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
                                <MenuItem value="File upload">File upload</MenuItem>
                                <MenuItem value="Linear scale">Linear scale</MenuItem>
                                <MenuItem value="Date">Date</MenuItem>
                            </Select>

                        </div>
                        {renderAnswerInput(index)}
                    </div>
                ))}

                <div className="flex gap-4 mt-4 justify-end">
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={handleAddQuestion}
                    >
                        Add Question
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        Send
                    </Button>
                </div>
            </form>
        </Paper>
    );
}

export default CreateNewSurvey;