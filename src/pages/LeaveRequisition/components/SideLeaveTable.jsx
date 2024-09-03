import {
  ArrowBackIos,
  CalendarMonth,
  DeleteOutlined,
} from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { format } from "date-fns";
import moment from "moment";
import React, { useContext } from "react";
import Select from "react-select";
import useLeaveTable from "../../../hooks/Leave/useLeaveTable";
import { TestContext } from "../../../State/Function/Main";
import useCreateLeaveRequest from "../hooks/useCreateLeaveRequest";
import useCustomStates from "../hooks/useCustomStates";

const SideLeaveTable = ({ leaveTableData, empId }) => {
  const {
    newAppliedLeaveEvents,
    updateLeaveEvent,
    removeNewAppliedLeaveEvents,
    setChangeTable,
  } = useCustomStates();
  const { leaveMutation } = useCreateLeaveRequest(empId);
  console.log(`🚀 ~ newAppliedLeaveEvents:`, newAppliedLeaveEvents);
  const { handleAlert } = useContext(TestContext);
  const { withOutLeaves } = useLeaveTable();

  let newLeave = [];

  if (
    Array.isArray(leaveTableData?.leaveTypes) &&
    withOutLeaves?.LeaveTypedEdited
  ) {
    newLeave = [
      ...leaveTableData?.leaveTypes
        ?.filter((item) => item?.count > 0)
        ?.map((leave) => ({
          value: leave?._id,
          label: leave?.leaveName,
        })),
      ...withOutLeaves?.LeaveTypedEdited?.filter(
        (item) => item?.leaveName !== "Public Holiday" && item?.count < 0
      )?.map((leave) => ({
        value: leave?._id,
        label: leave?.leaveName,
      })),
    ];
  }

  const handleChange = (value, id) => {
    updateLeaveEvent(id, value);
  };

  return (
    <>
      <div className="w-[30%] max-h-[80vh] overflow-y-auto h-auto bg-white rounded-md border ">
        <header className="flex items-center gap-2 p-4 bg-gray-200">
          <Tooltip title="Go Back to Leave Table">
            <ArrowBackIos
              fontSize="small"
              className="cursor-pointer"
              color="primary"
              onClick={() => {
                setChangeTable(true);
              }}
            />
          </Tooltip>
          <h1 className="text-xl  text-gray-700  border-b-2   font-semibold  tracking-tight">
            Selected Leaves
          </h1>
        </header>

        {newAppliedLeaveEvents?.map((item, id) => (
          <div key={id} className="border-b p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-2">
                <h1 className="text-lg">
                  {format(new Date(item?.start), "PP")}
                  {!moment(item.start).isSame(item.end) &&
                    " to " + format(new Date(item?.end), "PP")}
                </h1>

                <div
                  className={`flex rounded-md px-2 bg-white border-gray-200 border-[.5px] items-center`}
                >
                  <CalendarMonth className="text-gray-700 md:text-lg !text-[1em]" />
                  <Select
                    aria-errormessage=""
                    placeholder={"Select leave type"}
                    isClearable
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        borderWidth: "0px",
                        boxShadow: "none",
                      }),

                      menu: (styles) => ({
                        ...styles,
                        maxHeight: "250px",
                        overflowY: "auto",
                      }),
                      menuList: (styles) => ({
                        ...styles,
                        maxHeight: "250px", // Adjust the max maxHeght of the menu
                        overflowY: "auto",
                      }),
                    }}
                    className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    options={newLeave}
                    onChange={(leave) => {
                      handleChange(leave, id);
                      //   setEmployee(value?.value);
                    }}
                  />
                </div>
              </div>

              <IconButton onClick={() => removeNewAppliedLeaveEvents(id)}>
                <DeleteOutlined color="error" />
              </IconButton>
            </div>
          </div>
        ))}

        <div className="p-4 w-full flex justify-end ">
          <button
            type="button"
            onClick={() => leaveMutation.mutate()}
            className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-2 mr-4 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Apply for Leaves
          </button>
        </div>
      </div>
    </>
  );
};

export default SideLeaveTable;
