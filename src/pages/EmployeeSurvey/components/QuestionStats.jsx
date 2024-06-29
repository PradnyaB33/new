import React from 'react';
import { Button } from '@mui/material';

const QuestionStats = () => {
    // Example JSON data
    const question = [
        { question: 'Do you enjoy our company’s culture?', count: 10 },
        { question: 'Do you enjoy working with your colleagues?', count: 2 },
        { question: 'When problems arise, how well does the company handle them?', count: 30 },
        { question: 'Are your daily tasks closely related to your professional skills?', count: 29 },
       
    ];

 return (
        <div>

            <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                <table className="min-w-full bg-white  text-left !text-sm font-light">
                    <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
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
                        {question.map((survey, index) => (
                            <tr key={index} className="!font-medium border-b">
                                <td className="!text-left pl-8 py-3">{survey.question}</td>
                                <td className="py-3 pl-8">
                                    <Button
                                        variant="outlined"
                                        sx={{ textTransform: "none", width: "40px" }}
                                    >
                                        {survey.count}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuestionStats;
