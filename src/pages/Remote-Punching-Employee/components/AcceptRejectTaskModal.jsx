import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { UseContext } from '../../../State/UseState/UseContext';
import UserProfile from '../../../hooks/UserData/useUser';
import { Box } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { TestContext } from '../../../State/Function/Main';

const AcceptRejectTaskModal = () => {
    const { organisationId } = useParams();
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    const { handleAlert } = useContext(TestContext);
    const { getCurrentUser } = UserProfile();
    const user = getCurrentUser();
    const userEmail = user?.email;

    const [value, setValue] = useState(0);

    const { data, error, isLoading, refetch } = useQuery(["addedTask", organisationId], async () => {
        const response = await axios.get(
            `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}`,
            {
                headers: {
                    Authorization: authToken,
                },
            }
        );
        return response.data;

    },
    );
    console.log("data", data);

    const filteredTasks = data?.remotePunchingTasks?.filter(task =>
        task.to.some(toItem => toItem.value === userEmail)
    );

    const groupedTasks = filteredTasks?.reduce((acc, task) => {
        task.taskName.forEach(nameObj => {
            const taskName = nameObj.taskName;
            if (!acc[taskName]) {
                acc[taskName] = [];
            }
            acc[taskName].push(task);
        });
        return acc;
    }, {});

    const handleAccept = async (subtaskId, employeeEmail, taskId) => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}/${taskId}/accept-reject`,
                {
                    subtaskId,
                    employeeEmail,
                    accepted: true
                },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }

            );
            handleAlert(true, "success", "Task accepted successfully");
            refetch();
        } catch (error) {
            console.error('Error accepting task:', error);
            handleAlert(true, "error", "Failed to accept task");
        }
    };

    const handleReject = async (taskId, employeeEmail, subtaskId) => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_API}/route/set-remote-task/${organisationId}/${taskId}/accept-reject`,
                {
                    subtaskId,
                    employeeEmail,
                    accepted: false
                },
                {
                    headers: {
                        Authorization: authToken,
                    },
                }
            );
            handleAlert(true, "success", "Task reject successfully");
            refetch();
        } catch (error) {
            console.error('Error rejecting task:', error);
            handleAlert(true, "error", "Failed to reject task");
        }
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading tasks</p>;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    }

    const getTasksByTab = (isAccepted) => {
        return groupedTasks && Object.entries(groupedTasks).map(([taskName, tasks]) => {
            const filteredByAcceptance = tasks.filter(task => {
                const acceptance = task.taskName.find(nameObj => nameObj.taskName === taskName)?.acceptedBy;
                return acceptance.some(acc => acc.employeeEmail === userEmail && acc.accepted === isAccepted);
            });

            return filteredByAcceptance.length > 0 ? (
                <div key={taskName} className="mb-6">
                    {filteredByAcceptance.map(task => (
                        <div key={task._id} className="mb-4 p-2 border rounded">
                            <p><strong>Title:</strong> {task.title}</p>
                            <p><strong>Description:</strong> {task.description}</p>
                            <p><strong>Task:</strong> {taskName}</p>

                            {isAccepted ? null : (
                                task.to.map((toItem) => (
                                    toItem.value === userEmail && (
                                        <div key={toItem._id} className="flex justify-between items-center mt-2">
                                            <div className="flex space-x-2" style={{ alignItems: "right" }}>
                                                <button
                                                    className="px-4 py-2 bg-green-500 text-white rounded"
                                                    onClick={() => handleAccept(
                                                        task.taskName.find(nameObj => nameObj.taskName === taskName)._id,
                                                        toItem.value, task._id,
                                                    )}
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    className="px-4 py-2 bg-red-500 text-white rounded"
                                                    onClick={() => handleReject(
                                                        task._id,
                                                        toItem.value,
                                                        task.taskName.find(nameObj => nameObj.taskName === taskName)._id
                                                    )}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    )
                                ))
                            )}
                        </div>
                    ))}
                </div>
            ) : null;
        });
    };

    return (
        <div className="bg-gray-50 p-3 h-[400px] overflow-scroll">
            <div className="bg-white rounded-lg shadow-lg w-full">
                <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex", paddingLeft: "20px" }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                    >
                        <Tab label="Available Task" {...a11yProps(0)} />
                        <Tab label="Accepted Task" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <div className="p-4">
                    {value === 0 && getTasksByTab(false)}
                    {value === 1 && getTasksByTab(true)}
                </div>
            </div>
        </div>
    );
}

export default AcceptRejectTaskModal;
