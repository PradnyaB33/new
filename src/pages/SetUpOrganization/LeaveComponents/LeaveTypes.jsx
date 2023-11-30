import { Add, BeachAccessOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import CreteLeaveTypeModal from "../../../components/Modal/LeaveTypeModal/create-leve-type-modal";
import Setup from "../Setup";
import LeaveTypeEditBox from "./components/leave-type-layoutbox";
import SkeletonForLeaveTypes from "./components/skeleton-for-leavetype";

const LeaveTypes = ({ open, handleClose, id }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();
  const [leaveTypeToDelete, setLeaveTypeToDelete] = useState(null);

  const { invalidateQueries } = useQueryClient();
  const { data, isLoading } = useQuery(
    "leaveTypes",
    async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      };
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/leave-types-details/get`,
        config
      );
      return response.data.data;
    },
    {
      onSuccess: (newData) => {
        // Update the query cache with the new data
        queryClient.setQueryData("leaveTypes", newData);
      },
    }
  );

  const handleDeleteType = (leaveTypeId) => {
    setLeaveTypeToDelete(leaveTypeId);
    setConfirmOpen(true);
    invalidateQueries("leaveTypes");
  };
  const { handleAlert } = useContext(TestContext);
  const handleCreateLeave = () => {
    console.log("he");

    setConfirmOpen(true);
  };

  return (
    <section className="bg-gray-50 min-h-screen w-full">
      <Setup>
        <div className="SetupSection w-[80%] h-full bg-white   shadow-xl  rounded-sm">
          <div className="p-4  border-b-[.5px] flex items-center  gap-3 w-full border-gray-300 justify-between">
            <div className="flex gap-3">
              {" "}
              <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                <BeachAccessOutlined className="!text-lg text-white" />
              </div>
              <h1 className="!text-lg tracking-wide">Create Leave Types</h1>
            </div>
            <Button
              className="!bg-[#0ea5e9]"
              variant="contained"
              onClick={handleCreateLeave}
            >
              <Add />
              Create Leave Types
            </Button>
          </div>

          <table className="min-w-full bg-white text-left text-sm font-light">
            <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
              <tr className="!font-medium shadow-lg">
                <th scope="col" className="px-6 py-3 ">
                  SR NO
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Leave Name
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Color
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Count
                </th>
                <th scope="col" className="px-6 py-3 ">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <SkeletonForLeaveTypes />
              ) : (
                <>
                  {data &&
                    data.map((leaveType, index) => (
                      <LeaveTypeEditBox
                        key={index}
                        leaveType={leaveType}
                        index={index}
                      />
                    ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </Setup>
      <CreteLeaveTypeModal
        open={confirmOpen}
        handleClose={() => setConfirmOpen(false)}
      />
    </section>
  );
};

export default LeaveTypes;
