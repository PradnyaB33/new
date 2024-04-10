import { Container, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery } from "react-query";
import EmployeeTypeSkeleton from "../SetUpOrganization/components/EmployeeTypeSkeleton";
import { Info } from "@mui/icons-material";

const ViewCalculateAttendance = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();

  //for  Get Query
  const { data: calculateAttendanceData, isLoading } = useQuery(
    ["calculateAttendanceData", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-punching-info`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );
   
  console.log(calculateAttendanceData);
 
  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center">
          <Typography variant="h4" className=" text-center pl-10  mb-6 mt-2">
            Employee
          </Typography>

          {isLoading ? (
            <EmployeeTypeSkeleton />
          ) : calculateAttendanceData?.length > 0 ? (
            <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
              <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                  <tr className="!font-semibold ">
                    <th scope="col" className="!text-left pl-8 py-3 ">
                      Sr. No
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Employee Id
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Employee Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Punch In
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Punch Out
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Total Hours
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    
                  </tr>
                </thead>
                <tbody>
                  {calculateAttendanceData?.map((employee, index) => (
                    <React.Fragment key={employee._id}>
                      {employee.punchingData.map((punchingData, id) => (
                        <tr className="!font-medium border-b" key={id}>
                          <td className="!text-left pl-8 py-3 ">{index * employee.punchingData.length + id + 1}</td>
                          <td className="!text-left  pl-4 py-3 ">{employee.EmployeeId.empId || ""}</td>
                          <td className="!text-left  pl-4 py-3 ">{employee.EmployeeId.first_name || ""}</td>
                          <td className="!text-left pl-4 py-3">{new Date(punchingData.recordDate).toLocaleDateString()}</td>
                          <td className="!text-left pl-4 py-3">{punchingData.punchInTime}</td>
                          <td className="!text-left pl-4 py-3">{punchingData.punchOutTime}</td>
                          <td className="!text-left pl-4 py-3">{punchingData.totalHours}</td>
                          <td className="!text-left pl-4 py-3">{punchingData.status}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold"> Sync The Data Of Employee</h1>
              </article>
              <p>No data found. Please sync the data.</p>
            </section>
          )}
        </article>
      </Container>
    </>
  );
};

export default ViewCalculateAttendance;
