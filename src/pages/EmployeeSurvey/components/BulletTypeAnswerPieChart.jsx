import { Skeleton, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import 'chart.js/auto';

const BulletTypeAnswerPieChart = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [chartData, setChartData] = useState({});

    const questions = [
        {
            question: "Question 1",
            labels: ['Answer 1', 'Answer 2', 'Answer 3', 'Answer 4'],
            data: [25, 20, 30, 25],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        },
        {
            question: "Question 2",
            labels: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
            data: [15, 25, 35, 25],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        },
        {
            question: "Question 3",
            labels: ['Answer A', 'Answer B', 'Answer C', 'Answer D'],
            data: [45, 25, 35, 25],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        },
    ];

    useEffect(() => {
        // Simulate fetching data with a delay
        setTimeout(() => {
            const data = questions[currentQuestionIndex];

            const chartData = {
                labels: data.labels,
                datasets: [
                    {
                        data: data.data,
                        backgroundColor: data.backgroundColor,
                        hoverBackgroundColor: data.backgroundColor,
                    },
                ],
            };

            const options = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw + '%';
                            },
                        },
                    },
                },
            };

            setChartData({ data: chartData, options });
            setIsLoading(false);
        }, 100); // Adjust the delay as needed
    }, [currentQuestionIndex]); // Re-run effect when currentQuestionIndex changes

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setIsLoading(true);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setIsLoading(true);
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    return (
        <div className="mb-2 w-full h-max bg-white rounded-md border p-3">
            {isLoading ? (
                <div className="p-4 !pb-2 space-y-2">
                    <h1 className="text-lg font-bold text-[#67748E]">
                        {questions[currentQuestionIndex].question}
                    </h1>
                    <Skeleton variant="rounded" height={150} animation="wave" />
                </div>
            ) : (
                <div className="w-full">
                    <div className="border-b-[2px] flex w-full px-4 items-center justify-between">
                        <div className="flex items-center gap-2 py-2">
                            <h1 className="text-lg font-bold text-[#67748E]">
                                {questions[currentQuestionIndex].question}
                            </h1>
                        </div>
                    </div>
                    <div className="p-2 w-auto">
                        <Pie data={chartData.data} options={chartData.options} />
                    </div>
                    <div className="flex justify-end gap-4 ">
                        <button
                            style={{
                                color: "#007bff",
                                padding: "8px 12px",
                                border: "1px solid #007bff",
                                textDecoration: "none",
                                borderRadius: "4px",
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                            }}
                            className="page-link"
                            onClick={handlePrev}
                        >
                            Prev
                        </button>
                        <button
                            style={{
                                color: "#007bff",
                                padding: "8px 12px",
                                border: "1px solid #007bff",
                                textDecoration: "none",
                                borderRadius: "4px",
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                            }}
                            className="page-link"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulletTypeAnswerPieChart;
