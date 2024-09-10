import axios from 'axios';
import React, { useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import { Button } from '@mui/material';

const ModalForStatusShow = ({ taskData }) => {
    const { organisationId } = useParams();
    const navigate = useNavigate();
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];

    // Get employee data for the "to" field
    const { data: employees } = useQuery(
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

    if (!taskData) {
        return <div>No task data available.</div>;
    }

    const handleComplete = (email) => {
        const employee = employees.find(emp => emp.email === email);
        console.log("employsdasdsaee", employee);

        if (employee) {
            navigate(`/organisation/${organisationId}/remote-task/${employee._id}`);
        } else {
            console.error("Employee not found");
        }
    }

    return (
        <div className="overflow-auto">
            <div>
                <h2 className="text-2xl mb-2">{taskData?.title}</h2>
                <p className="text-sm text-muted-foreground">
                    {taskData?.description}
                </p><br />
            </div>
            <table className="w-full table-auto border border-collapse min-w-full bg-white text-left !text-sm font-light">
                <thead className="border-b bg-gray-100 font-bold">
                    <tr className="!font-semibold">
                        <th scope="col" className="py-3 text-sm px-2">Task</th>
                        <th scope="col" className="py-3 text-sm px-2">Email</th>
                        <th scope="col" className="!text-left px-2 w-max py-3 text-sm">Status</th>
                        <th scope="col" className="!text-left px-2 w-max py-3 text-sm">Comments</th>
                    </tr>
                </thead>
                <tbody>
                    {taskData.taskName.map((taskItem) =>
                        taskData.to.map((email) => {
                            // Find the acceptedBy entry for this email
                            const acceptedByEntry = taskItem.acceptedBy.find(
                                (entry) => entry.employeeEmail === email.value
                            );
                            return (
                                <tr className="border-b" key={`${taskItem._id}-${email.value}`}>
                                    <td className="py-3 px-2">{taskItem.taskName}</td>
                                    <td className="py-3 px-2">{email.label}</td>
                                    <td className="py-3 px-2">
                                        {acceptedByEntry
                                            ? acceptedByEntry.status
                                                ?
                                                acceptedByEntry.status === "Completed" ?
                                                    // acceptedByEntry.status
                                                    <Button onClick={() => handleComplete(email.value)}>Completed</Button>
                                                    : acceptedByEntry.status
                                                : acceptedByEntry.accepted
                                                    ? 'Accept'
                                                    : 'Reject'
                                            : 'Assigned'}
                                    </td>
                                    <td className="py-3 px-2">
                                        {acceptedByEntry ? acceptedByEntry.comments : ''}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ModalForStatusShow;
