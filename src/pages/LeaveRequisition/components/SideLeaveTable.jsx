import {
  ArrowBackIos,
  CalendarMonth,
  DeleteOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { format } from "date-fns";
import React from "react";
import Select from "react-select";
import useCustomStates from "../hooks/useCustomStates";

const SideLeaveTable = () => {
  const { newAppliedLeaveEvents, removeNewAppliedLeaveEvents, setChangeTable } =
    useCustomStates();

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
                  {format(new Date(item?.start), "PP")} to{" "}
                  {format(new Date(item?.end), "PP")}
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
                    }}
                    className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    options={[
                      {
                        label: "Employee 1",
                        value: "Employee 1",
                      },
                    ]}
                    onChange={(value) => {
                      //   setEmployee(value?.value);
                    }}
                  />
                </div>
              </div>

              <div className="flex">
                <IconButton>
                  <EditOutlined color="primary" />
                </IconButton>
                <IconButton onClick={() => removeNewAppliedLeaveEvents(id)}>
                  <DeleteOutlined color="error" />
                </IconButton>
              </div>
            </div>
          </div>
        ))}

        <div className="p-4 w-full flex justify-end ">
          <button
            type="button"
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
