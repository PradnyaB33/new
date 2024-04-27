import { Container, Typography, IconButton, Tooltip } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery } from "react-query";
import EmployeeTypeSkeleton from "../SetUpOrganization/components/EmployeeTypeSkeleton";
import { Info } from "@mui/icons-material";
import CalculateHourEmpModal from "../../components/Modal/CalculateHourEmpModal/CalculateHourEmpModal";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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

  // for open the modal for display employee and calculate hour
  const [modalOpen, setModalOpen] = useState(false);
  const [empPunchingData, setEmpPunchingData] = useState();
  const handleModalOpen = (data) => {
    setEmpPunchingData(data);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center">
          <Typography variant="h4" className=" text-center pl-10  mb-6 mt-2">
            Employee’s Time Track
          </Typography>
          <p className="text-xs text-gray-600 pl-10   mb-6 text-center">
            Track the attendance of employees here.
          </p>

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
                      Employee Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {empAttendanceData &&
                    empAttendanceData.length > 0 &&
                    empAttendanceData.map((empAttendanceItem, id) => (
                      <tr className="!font-medium border-b" key={id}>
                        <td className="!text-left pl-8 py-3 ">{id + 1}</td>
                        <td className="!text-left  pl-7 py-3 ">
                          {empAttendanceItem?.EmployeeId?.empId || ""}
                        </td>
                        <td className="!text-left  pl-7 py-3 ">
                          {empAttendanceItem?.EmployeeId?.first_name || ""}
                        </td>
                        <td className="!text-left  pl-7 py-3 ">
                          {empAttendanceItem?.EmployeeId?.email || ""}
                        </td>
                        <td className="!text-left pl-4 py-3">
                          <Tooltip
                            title={"Calculate the hours of employee"}
                            arrow
                          >
                            <IconButton
                              aria-label="view"
                              size="small"
                              onClick={() => handleModalOpen(empAttendanceItem)}
                            >
                              <AccessTimeIcon sx={{ color: "green" }} />
                            </IconButton>
                          </Tooltip>
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
                <h1 className="text-lg font-semibold">No Sync Data Found</h1>
              </article>
              <p>Please sync the data of employee.</p>
            </section>
          )}
        </article>
      </Container>

      <CalculateHourEmpModal
        handleClose={handleModalClose}
        open={modalOpen}
        organisationId={organisationId}
        empPunchingData={empPunchingData}
      />
    </>
  );
};

export default ViewAttendacneBiomatric;
