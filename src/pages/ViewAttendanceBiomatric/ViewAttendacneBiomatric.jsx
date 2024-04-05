import { Container, Typography  , IconButton} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery } from "react-query";
import EmployeeTypeSkeleton from "../SetUpOrganization/components/EmployeeTypeSkeleton";
import { Info } from "@mui/icons-material";
import TableViewIcon from '@mui/icons-material/TableView';
import CalculateHourEmpModal from "../../components/Modal/CalculateHourEmpModal/CalculateHourEmpModal";

const ViewAttendacneBiomatric = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();

  //for  Get Query
  const { data: empAttendanceData, isLoading } = useQuery(
    ["empAttendanceData", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-attendance-data`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );
  console.log("empAttendanceData", empAttendanceData);


  // for open the modal for display employee and calculate hour
  const [modalOpen, setModalOpen] = useState(false);
  const [attendanceId , setAttendanceId] = useState(null);
  const handleModalOpen = (id) => {
    setAttendanceId(id);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setAttendanceId(null)
   
  };

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center">
          <Typography variant="h4" className=" text-center pl-10  mb-6 mt-2">
            Employee
          </Typography>

          {isLoading ? (
            <EmployeeTypeSkeleton />
          ) : empAttendanceData?.length > 0 ? (
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
                      Action
                    </th>
                    
                  </tr>
                </thead>
                <tbody>
                  {empAttendanceData?.map((empAttendanceData, id) => (
                    <tr className="!font-medium border-b" key={id}>
                      <td className="!text-left pl-8 py-3 ">{id + 1}</td>
                      <td className="!text-left  pl-4 py-3 ">
                        {empAttendanceData?.EmployeeId?.empId || ""}
                      </td>
                      <td className="!text-left  pl-4 py-3 ">
                        {empAttendanceData?.EmployeeId?.first_name || ""}
                      </td>
                      <td className="!text-left pl-4 py-3">
                      <IconButton aria-label="view" size="small" onClick={() => handleModalOpen(empAttendanceData?._id || "")}>
                        <TableViewIcon sx={{ color: 'green' }} />
                        </IconButton>

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
                <h1 className="text-lg font-semibold">Add Loan Type</h1>
              </article>
              <p>No loan type found. Please add the loan type.</p>
            </section>
          )}
        </article>
      </Container>

      <CalculateHourEmpModal
        handleClose={handleModalClose}
        open={modalOpen}
        organisationId={organisationId}
        attendanceId = {attendanceId}
      />
    </>
  );
};

export default ViewAttendacneBiomatric;
