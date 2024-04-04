import { DeleteOutlined, EditOutlined, Search } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import React, { useState } from "react";
import Select from "react-select";
import GoalsModel from "./GoalsModel";

const GoalsTable = () => {
  const [focusedInput, setFocusedInput] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleFocus = (fieldName) => {
    setFocusedInput(fieldName);
  };

  const options = [
    {
      label: "test",
      value: "test",
    },
  ];
  return (
    <section className="p-4 ">
      <div className="p-4  bg-white rounded-md border">
        <h1 className="text-xl py-2">Manager Goals</h1>
        <div className="my-2 flex justify-between">
          <div className="flex gap-4">
            <div className={`space-y-1  min-w-[60vw] `}>
              <div
                onFocus={() => {
                  handleFocus("search");
                }}
                onBlur={() => setFocusedInput(null)}
                className={` ${
                  focusedInput === "search"
                    ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                    : "outline-none border-gray-200 border-[.5px]"
                } flex  rounded-md items-center px-2   bg-white py-1 md:py-[6px]`}
              >
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <input
                  type={"text"}
                  placeholder={"Search goals"}
                  className={`border-none bg-white w-full outline-none px-2  `}
                  formNoValidate
                />
              </div>
            </div>
            <div className={`space-y-1 w-full `}>
              <div
                className={`flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center`}
              >
                <Search className="text-gray-700 md:text-lg !text-[1em]" />
                <Select
                  aria-errormessage=""
                  placeholder={"Assignee"}
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
                  options={options}
                  //   value={field?.value}
                  //   onChange={(value) => {
                  //     updateField(name, value);
                  //     field.onChange(value);
                  //   }}
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-2 mr-4 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Add Goal
          </button>
        </div>
        <div className="bg-white w-full overflow-x-auto">
          <table className=" table-auto border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
            <thead className="border-b bg-gray-100 font-bold">
              <tr className="!font-semibold ">
                <th
                  scope="col"
                  className="!text-left px-2 w-max py-3 text-sm border"
                >
                  Sr. No
                </th>
                <th scope="col" className="py-3 text-sm px-2 border">
                  Goal Name
                </th>

                <th scope="col" className="py-3 text-sm px-2 border">
                  Time
                </th>
                <th scope="col" className="py-3 text-sm px-2 border">
                  Assignee
                </th>
                <th scope="col" className=" py-3 text-sm px-2 border">
                  status
                </th>

                <th scope="col" className=" py-3 text-sm px-2 border">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className={`!font-medium w-[70px]  border-b `}>
                <td className="!text-left  px-2 text-sm w-[70px] border ">1</td>
                <td className="text-sm truncate text-left w-[250px] border px-2">
                  <p>test</p>
                </td>

                <td className=" text-left !p-0 w-[300px] border ">
                  <p
                    className={`
                        px-2 md:w-full w-max text-sm`}
                  >
                    test one
                  </p>
                </td>

                <td className=" text-left !p-0 w-[250px] ">
                  <div className="flex gap-2 p-2 items-center">
                    <Avatar sx={{ width: 34, height: 34 }} />
                    Test user
                  </div>
                </td>
                <td className="text-left text-sm w-[200px]  border">
                  <p className="px-2  md:w-full w-max">test status</p>
                </td>

                <td className="whitespace-nowrap px-2  w-[220px]">
                  <IconButton color="primary" aria-label="edit">
                    <EditOutlined />
                  </IconButton>
                  <IconButton color="error" aria-label="delete">
                    <DeleteOutlined />
                  </IconButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <GoalsModel open={open} options={options} handleClose={handleClose} />
    </section>
  );
};

export default GoalsTable;
