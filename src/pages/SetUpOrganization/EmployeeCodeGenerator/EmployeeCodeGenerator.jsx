import React, { useContext } from "react";
import Setup from "../Setup";
import { BorderColor } from "@mui/icons-material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import { Button, IconButton } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import { useQuery } from "react-query";
import CreateEmpCodeModel from "../../../components/Modal/EmpCodeModel/CreateEmpCodeModel";
import EditEmpCodeModel from "../../../components/Modal/EmpCodeModel/EditEmpCodeModel";
const EmployeeCodeGenerator = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { organisationId } = useParams();

  // Modal states and function for edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [empCodeId, setEmpCodeId] = useState(null);
  // Modal states and function for create
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // for create the emp sal cal day
  // for open the modal
  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };
  // for close the modal
  const handleCreateModalClose = () => {
    setCreateModalOpen(false);
  };

  // for update the emp sal cal day
  const handleEditModalOpen = (empCode) => {
    setEditModalOpen(true);
    setEmpCodeId(empCode);
  };

  const handleEditModelClose = () => {
    setEmpCodeId(null);
    setEditModalOpen(false);
  };

  const getEmployeeCodeData = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: authToken,
      },
    };

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/employee-code/${organisationId}`,
        config
      );

      return response.data.getEmployeeCode; // Return employeeCodes directly
    } catch (error) {
      // Handle errors if necessary
      console.error("Error fetching employee codes:", error);
      return [];
    }
  };

  const { data: employeeCodes } = useQuery({
    queryKey: ["employee-code"],
    queryFn: getEmployeeCodeData,
  });

  return (
    <section className="bg-gray-50 min-h-screen w-full">
      <Setup>
        <article className="SetupSection bg-white w-[100%] md:w-[80%]  h-max shadow-md rounded-sm border  items-center">
          <div className="p-4  border-b-[.5px] flex items-center justify-between  gap-3 w-full border-gray-300">
            <div className="flex items-center  gap-3 ">
              <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                <EventNoteOutlinedIcon className="!text-lg text-white" />
              </div>
              <h1 className="!text-lg tracking-wide">
                Employee Code Generate for Organization
              </h1>
            </div>
            <Button
              className="!font-semibold !bg-sky-500 flex items-center gap-2"
              variant="contained"
              onClick={handleCreateModalOpen}
            >
              Generate Employee Code
            </Button>
          </div>

          <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
            <table className="min-w-full bg-white  text-left !text-sm font-light">
              <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                <tr className="!font-semibold ">
                  <th scope="col" className="!text-left pl-8 py-3 ">
                    SR NO
                  </th>
                  <th scope="col" className="py-3 ">
                    Employee Code
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {employeeCodes?.map((empCode, id) => (
                  <tr className="!font-medium border-b" key={id}>
                    <td className="!text-left pl-8 py-3 ">{id + 1}</td>
                    <td className="py-3 ">{empCode.code}</td>
                    <td className="whitespace-nowrap px-6 py-2">
                      <IconButton
                        onClick={() => handleEditModalOpen(empCode._id)}
                      >
                        <BorderColor className="!text-xl" color="success" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </Setup>

      {/* for create */}
      <CreateEmpCodeModel
        handleClose={handleCreateModalClose}
        open={createModalOpen}
        organisationId={organisationId}
      />
      {/* for update */}
      <EditEmpCodeModel
        handleClose={handleEditModelClose}
        organisationId={organisationId}
        open={editModalOpen}
        empCodeId={empCodeId}
      />
    </section>
  );
};

export default EmployeeCodeGenerator;
