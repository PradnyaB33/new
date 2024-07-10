import React, { useState, useContext } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import UserProfile from '../../../hooks/UserData/useUser';
import { UseContext } from '../../../State/UseState/UseContext';

const QuestionStats = () => {
    const { surveyId } = useParams();
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const organisationId = user?.organizationId;

    const { cookies } = useContext(UseContext);
    const authToken = cookies['aegis'];

    // State to manage popup visibility and selected question
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [openPopup, setOpenPopup] = useState(false);

    // Fetch survey responses
    const { data: surveyResponses, isLoading, isError } = useQuery(
        ['surveyResponses', organisationId, surveyId, authToken],
        async () => {
            const response = await axios.get(
                `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-response-survey-surveyId/${surveyId}`,
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            return response.data;
        }
    );

    // Function to handle opening the popup with detailed responses
    const handleOpenPopup = (questionId) => {
        // Filter survey responses based on questionId and collect all answers
        const answers = [];
        surveyResponses.forEach((survey) => {
            const question = survey.questions.find((q) => q.questionId === questionId);
            if (question && question.answer !== undefined) {
                answers.push(question.answer);
            }
        });

        // Set the selected question and its answers
        const selectedQues = surveyResponses.find((survey) =>
            survey.questions.some((q) => q.questionId === questionId)
        ).questions.find((question) => question.questionId === questionId);

        setSelectedQuestion({ ...selectedQues, answers });
        setOpenPopup(true);
    };

    // Function to handle closing the popup
    const handleClosePopup = () => {
        setSelectedQuestion(null);
        setOpenPopup(false);
    };

    // Render function for detailed responses
    const renderDetailedResponses = () => {
        if (!selectedQuestion) {
            return null;
        }

        let answerContent = null;

        // Handle different question types
        switch (selectedQuestion.questionType) {
            case 'Short Answer':
            case 'Paragraph':
                answerContent = <p>{selectedQuestion.answer}</p>;
                break;
            case 'Checkboxes':
            case 'Multi-choice':
                answerContent = (
                    <ul>
                        {selectedQuestion.answers.map((ans, index) => (
                            <li key={index}>{ans}</li>
                        ))}
                    </ul>
                );
                break;
            case 'Dropdown':
                answerContent = <p>{selectedQuestion.answer}</p>;
                break;
            case 'Date':
                answerContent = <p>{selectedQuestion.answer}</p>;
                break;
            default:
                answerContent = <p>No answer found</p>;
        }

        return <div>{answerContent}</div>;
    };

    // Function to calculate count of responses for each question dynamically
    const calculateQuestionCounts = (questionId) => {
        if (!surveyResponses) return 0;

        // Filter survey responses based on questionId and check if answer exists
        const questionResponses = surveyResponses.filter((survey) => {
            const question = survey.questions.find((q) => q.questionId === questionId);
            return question && question.answer !== undefined;
        });

        return questionResponses.length;
    };

    // Get unique question IDs from survey responses
    const getUniqueQuestionIds = () => {
        if (!surveyResponses) return [];

        // Use Set to store unique question IDs
        let questionIds = new Set();
        surveyResponses.forEach((survey) => {
            survey.questions.forEach((question) => {
                questionIds.add(question.questionId);
            });
        });

        // Convert Set to array
        return Array.from(questionIds);
    };

    // List of unique question IDs
    const questionIds = getUniqueQuestionIds();

    return (
        <div>
            <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                {isLoading ? (
                    <p>Loading...</p>
                ) : isError ? (
                    <p>Error fetching data</p>
                ) : (
                    <table className="min-w-full bg-white text-left !text-sm font-light">
                        <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                            <tr className="!font-semibold">
                                <th scope="col" className="!text-left pl-8 py-3">
                                    Question
                                </th>
                                <th scope="col" className="!text-left pl-8 py-3">
                                    Count
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionIds.map((questionId, index) => {
                                // Find the first matching question in any survey response
                                const matchingQuestion = surveyResponses
                                    .find((survey) =>
                                        survey.questions.some((q) => q.questionId === questionId)
                                    )
                                    ?.questions.find((q) => q.questionId === questionId);

                                return (
                                    <tr key={index} className="!font-medium border-b">
                                        <td className="!text-left pl-8 py-3">
                                            {matchingQuestion?.question}
                                        </td>
                                        <td className="py-3 pl-8">
                                            <Button
                                                variant="outlined"
                                                sx={{ textTransform: 'none', width: '40px' }}
                                                onClick={() => handleOpenPopup(questionId)}
                                            >
                                                {calculateQuestionCounts(questionId)}
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Popup Dialog for Detailed Responses */}
            <Dialog open={openPopup} onClose={handleClosePopup}>
                <DialogTitle>{selectedQuestion?.question}</DialogTitle>
                <DialogContent dividers>
                    {/* Render detailed responses */}
                    {renderDetailedResponses()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePopup} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default QuestionStats;
