import axios from "axios";
import React, { useContext, useState } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery } from "react-query";
import { Container, Typography, IconButton } from "@mui/material";
import { Info, Assignment } from "@mui/icons-material";
import UserProfile from "../../hooks/UserData/useUser";
import MissPunchJustifyModal from "../../components/Modal/MissPunchJustifyModal/MissPunchJustifyModal";

const MissPunchJustify = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  console.log(user);
  const organisationId = user.organizationId;
  console.log(organisationId);

  //for  Get Query
  const { data: unavailableRecord } = useQuery(
    ["unavailableRecord", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/unavailable-record`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  console.log("unavailable record", unavailableRecord);

  // for open the modal for display employee
  const [missPunchModalOpen, setMissPunchModalOpen] = useState(false);
  const [unavailableRecordId, setUnavailableRecordsId] = useState();
  const handleMissPunchModalOpen = (_id) => {
    setUnavailableRecordsId(_id);
    setMissPunchModalOpen(true);
  };
  const handleMissPunchModalClose = () => {
    setMissPunchModalOpen(false);
    setUnavailableRecordsId();
  };

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen py-8 px-4">
        <Typography variant="h4" className="text-center pl-10 mb-6 mt-2">
          Missed Justify
        </Typography>
        <p className="text-xs text-gray-600 pl-10 text-center">
          View the unavailable record.
        </p>
        {unavailableRecord && unavailableRecord.length > 0 ? (
          unavailableRecord.map((record, index) => (
            <article
              key={index}
              className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center mb-4"
            >
              <Typography variant="h7" className=" pl-2 mb-6 mt-2">
                {record.employeeId.first_name} {record.employeeId.last_name}
              </Typography>

              {record.unavailableRecords?.length > 0 ? (
                <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                  <table className="min-w-full bg-white text-left !text-sm font-light">
                    {/* Table Header */}
                    <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                      <tr className="font-semibold">
                        <th scope="col" className="!text-left pl-8 py-3">
                          Sr. No
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Punch In Time
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Punch Out Time
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Justify
                        </th>
                      </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody>
                      {record.unavailableRecords.map(
                        (unavailableRecord, id) => (
                          <tr className="!font-medium border-b" key={id}>
                            <td className="!text-left pl-8 py-3">{id + 1}</td>
                            <td className="!text-left pl-6 py-3">
                              {new Date(
                                unavailableRecord.recordDate
                              ).toLocaleDateString()}
                            </td>
                            <td className="!text-left pl-6 py-3">
                              {unavailableRecord.status}
                            </td>
                            <td className="!text-left pl-6 py-3">
                              {unavailableRecord.punchInTime
                                ? new Date(
                                    unavailableRecord.punchInTime
                                  ).toLocaleTimeString()
                                : "-"}
                            </td>
                            <td className="!text-left pl-6 py-3">
                              {unavailableRecord.punchOutTime
                                ? new Date(
                                    unavailableRecord.punchOutTime
                                  ).toLocaleTimeString()
                                : "-"}
                            </td>
                            <td className="!text-left pl-6 py-3">
                              <IconButton
                                color="primary"
                                onClick={() =>
                                  handleMissPunchModalOpen(
                                    unavailableRecord._id
                                  )
                                }
                              >
                                <Assignment />
                              </IconButton>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                  <article className="flex items-center mb-1 text-red-500 gap-2">
                    <Info className="!text-2xl" />
                    <h1 className="text-lg font-semibold">
                      No Missed Data Found
                    </h1>
                  </article>
                  <p>Calculate the hours of employee.</p>
                </section>
              )}
            </article>
          ))
        ) : (
          <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
            <article className="flex items-center mb-1 text-red-500 gap-2">
              <Info className="!text-2xl" />
              <h1 className="text-lg font-semibold">No Missed Data Found</h1>
            </article>
            <p>Calculate the hours of employee.</p>
          </section>
        )}
      </Container>

      <MissPunchJustifyModal
        handleClose={handleMissPunchModalClose}
        open={missPunchModalOpen}
        organisationId={organisationId}
        unavailableRecordId={unavailableRecordId}
      />
    </>
  );
};

export default MissPunchJustify;