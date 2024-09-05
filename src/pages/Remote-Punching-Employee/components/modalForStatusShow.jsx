import React from 'react';

const ModalForStatusShow = ({ taskData }) => {
    if (!taskData) {
        return <div>No task data available.</div>;
    }

    return (
        <div className="overflow-auto ">
            <div>
                <h2 class=" text-2xl "> {taskData?.title}</h2>
                <p class="text-sm text-muted-foreground">
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
                        taskData.to.map((email) => (
                            <tr key={`${taskItem._id}-${email.value}`}>
                                <td className="py-3 px-2">{taskItem.taskName}</td>
                                <td className="py-3 px-2">{email.label}</td>
                                <td className="py-3 px-2">{taskItem.status}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ModalForStatusShow;
