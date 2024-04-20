import React, { useContext } from "react";
import { Container, Typography } from "@mui/material";
import { Info } from "@mui/icons-material";
import axios from "axios";
import UserProfile from "../../hooks/UserData/useUser";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import useMissedPunchNotificationCount from "../../hooks/QueryHook/notification/MissPunchNotification/MissedPunchNotification";


const MissedPunchNotification = () => {
  const { missPunchData } = useMissedPunchNotificationCount();
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const organizationId = user.organizationId;
  const role = useGetCurrentRole();
  console.log(role);
  
  // for manager
  const handleApprovalUpdate = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organizationId}/update-approvalId`,
        {},
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      handleAlert(true, "success", "Approval updated successfully.");
      window.location.reload();
    } catch (error) {
      console.error("Error updating approval:", error);
      handleAlert(true, "error", "Failed to update approval.");
    }
  };


  //  for hr
  const handleApprovalUnavailableRecord = async (recordId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organizationId}/approved-unavailable-record/${recordId}`,
        {},
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      window.location.reload()
      handleAlert(true, "success", "Record approved successfully.");
    } catch (error) {
      console.error("Error approving record:", error);
      handleAlert(true, "error", "Failed to approve record.");
    }
  }; 
  
  
  const handleRejectUnavailableRecord = async (recordId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organizationId}/reject-unavailable-record/${recordId}`,
        {},
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      window.location.reload()
      handleAlert(true, "success", "Record approved successfully.");
    } catch (error) {
      console.error("Error approving record:", error);
      handleAlert(true, "error", "Failed to approve record.");
    }
  };


  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4">
        <Typography variant="h4" className="text-center pl-10 mb-6 mt-2">
          Missed Punch 
        </Typography>
        {missPunchData?.map((record, index) => (
          <article key={index} className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center mb-4">
            <Typography variant="h5" className=" pl-10 mb-6 mt-2">
              {record.employeeId.first_name} {record.employeeId.last_name}
            </Typography>
            {missPunchData.length > 0 ? (
              <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                <table className="min-w-full bg-white text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                    <tr className="font-semibold">
                      <th scope="col" className="!text-left pl-8 py-3">Sr. No</th>
                      <th scope="col" className="px-6 py-3">Date</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Punch In Time</th>
                      <th scope="col" className="px-6 py-3">Punch Out Time</th>
                      <th scope="col" className="px-6 py-3">Justify</th>
                      <th scope="col" className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {missPunchData?.map((record, id) => (
                      <tr className="!font-medium border-b" key={id}>
                        <td className="!text-left pl-8 py-3">{id + 1}</td>
                        <td className="!text-left pl-4 py-3">{new Date(record.recordDate).toLocaleDateString()}</td>
                        <td className="!text-left pl-4 py-3">{record.status}</td>
                        <td className="!text-left pl-4 py-3">{record.punchInTime ? new Date(record.punchInTime).toLocaleTimeString() : "-"}</td>
                        <td className="!text-left pl-4 py-3">{record.punchOutTime ? new Date(record.punchOutTime).toLocaleTimeString() : "-"}</td>
                        <td className="!text-left pl-4 py-3">{record.justify}</td>
                        <td className="!text-left pl-4 py-3">
                          {role === "Manager" ? (
                            <>
                              <button onClick={handleApprovalUpdate} className="bg-green-500 text-white px-2 py-1 rounded-md mr-2">Accept</button>
                              <button onClick={handleApprovalUpdate} className="bg-red-500 text-white px-2 py-1 rounded-md">Reject</button>
                            </>
                          ) : role === "HR" ? (
                            <>
                              <button onClick={() => handleApprovalUnavailableRecord(record._id)} className="bg-green-500 text-white px-2 py-1 rounded-md mr-2">Accept</button>
                              <button onClick={() => handleRejectUnavailableRecord(record._id)} className="bg-red-500 text-white px-2 py-1 rounded-md">Reject</button>
                            </>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="!text-2xl" />
                  <h1 className="text-lg font-semibold">No Missed Data Found</h1>
                </article>
                <p>Calculate the hours of employee.</p>
              </section>
            )}
          </article>
        ))}
      </Container>
    </>
  );
};

export default MissedPunchNotification;