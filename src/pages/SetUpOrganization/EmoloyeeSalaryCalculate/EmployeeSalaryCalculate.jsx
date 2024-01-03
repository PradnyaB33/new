import {
  BorderColor,
  Delete,
  Info,
  ManageAccountsOutlined,
  Warning,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import Setup from "../Setup";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import EmpSalaryDayModal from "../../../components/Modal/EmployeeSalaryDayModal/EmpSalaryDayModal";
const EmployeeSalaryCalculateDay = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { organisationId } = useParams();

  // Modal states and function
  const [open, setOpen] = React.useState(false);

  const handleOpen = (scrollType) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-[80%]  h-max shadow-md rounded-sm border  items-center">
            <div className="p-4  border-b-[.5px] flex items-center justify-between  gap-3 w-full border-gray-300">
              <div className="flex items-center  gap-3 ">
                <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                  <EventNoteOutlinedIcon className="!text-lg text-white" />
                </div>
                <h1 className="!text-lg tracking-wide">
                  Create Employee Salary Calculation Day For Organization
                </h1>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                variant="contained"
                onClick={() => handleOpen("paper")}
              >
                Create Employee Salary Calculate Day
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
                      Salary Calculation Day
                    </th>
                    <th scope="col" className="px-6 py-3 ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </article>
        </Setup>
      </section>

      {/* for create */}
      <EmpSalaryDayModal
        id={organisationId}
        open={open}
        handleClose={handleClose}
      />
    </>
  );
};

export default EmployeeSalaryCalculateDay;
