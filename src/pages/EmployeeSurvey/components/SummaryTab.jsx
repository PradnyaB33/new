import React, { useContext } from 'react';
import axios from 'axios';
import UserProfile from '../../../hooks/UserData/useUser';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { UseContext } from '../../../State/UseState/UseContext';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const SummaryTab = () => {
  const { surveyId } = useParams();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const organisationId = user?.organizationId;

  const { cookies } = useContext(UseContext);
  const authToken = cookies['aegis'];

  const { data: surveyData } = useQuery(
    ['surveyResponseSurverId', organisationId, surveyId, authToken],
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

  const aggregateAnswers = (responses) => {
    const aggregatedData = {};

    responses.forEach(response => {
      response.questions.forEach(question => {
        if (!aggregatedData[question.questionId]) {
          aggregatedData[question.questionId] = {
            question: question.question,
            type: question.questionType,
            answers: {},
          };
        }

        const answerArray = Array.isArray(question.answer) ? question.answer : [question.answer];
        answerArray.forEach(answer => {
          if (!aggregatedData[question.questionId].answers[answer]) {
            aggregatedData[question.questionId].answers[answer] = 0;
          }
          aggregatedData[question.questionId].answers[answer] += 1;
        });
      });
    });

    return aggregatedData;
  };

  const renderChart = (question) => {
    const data = question.answers;
    const labels = Object.keys(data);
    const values = Object.values(data);

    switch (question.type) {
      case 'Checkboxes':
      case 'Multi-choice':
        const barData = {
          labels: labels,
          datasets: [
            {
              label: 'Responses',
              data: values,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            },
          ],
        };
        return <div style={{ width: "400px" }} className='bg-white w-full h-max shadow-md rounded-sm border items-center p-4'>
          <div className="p-2  w-auto "><Bar data={barData} />
          </div></div>

      case 'Dropdown':
        const pieData = {
          labels: labels,
          datasets: [
            {
              label: 'Responses',
              data: values,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
            },
          ],
        };

        return (
          <div style={{ width: "400px" }} className='bg-white w-full h-max shadow-md rounded-sm border items-center p-4'>
            <div className="p-2  w-auto ">
              <Pie data={pieData} />
            </div>
          </div>
        )

      case 'Paragraph':
      case 'Short Answer':
      default:
        return (
          <div className='bg-white w-full h-max shadow-md rounded-sm border items-center p-4'>
            <ul>
              {labels.map((answer, index) => (
                <li key={index}>{answer}</li>
              ))}
            </ul>
          </div>
        );
    }
  };

  const aggregatedData = surveyData ? aggregateAnswers(surveyData) : {};

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '60%', padding: '20px' }}>
        {Object.keys(aggregatedData).map(questionId => (
          <div key={questionId} style={{ marginBottom: '20px' }}>
            <p className='text-xl py-2'>Q. {aggregatedData[questionId].question}</p>
            {renderChart(aggregatedData[questionId])}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryTab;
