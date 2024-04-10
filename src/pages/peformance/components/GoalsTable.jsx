import { DeleteOutlined, EditOutlined, Search } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  CircularProgress,
  IconButton,
  Pagination,
  Stack,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import React, { useState } from "react";
import { useQuery } from "react-query";
import Select from "react-select";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import GoalsModel from "./GoalsModel";
import PreviewGoalModal from "./PreviewGoalModal";

const GoalsTable = ({ performance }) => {
  const [focusedInput, setFocusedInput] = useState(null);

  console.log(performance, "performance data");

  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewId, setPreviewId] = useState(null);
  const handleClose = () => {
    setOpen(false);
    setPreviewModal(false);
    setPreviewId(null);
    setOpenEdit(false);
  };

  const handleOpen = (id) => {
    setPreviewModal(true);
    setPreviewId(id);
  };

  const rowsPerPage = 10; // Define the number of rows per page
  const [page, setPage] = useState(1);

  const authToken = useAuthToken();

  const { data: orgGoals, isFetching } = useQuery("orggoals", async () => {
    if (role === "Employee") {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/performance/getEmployeeGoals`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    }
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/performance/getOrganizationGoals`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  });

  const allSection80s = orgGoals?.flatMap((data) => data);

  // Now, calculate the total number of rows using reduce
  const totalRowCount = allSection80s?.reduce((total, section) => total + 1, 0);
  const handleFocus = (fieldName) => {
    setFocusedInput(fieldName);
  };

  const pages = Math.ceil(totalRowCount / rowsPerPage);

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

          {performance?.stages === "Goal setting" && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-2 mr-4 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
            >
              Add Goal
            </button>
          )}
        </div>
        <div className="bg-white w-full overflow-x-auto">
          {isFetching ? (
            <CircularProgress />
          ) : (
            <>
              <table className=" table-auto border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
                <thead className="border-b bg-gray-100 font-bold">
                  <tr className="!font-semibold ">
                    <th
                      scope="col"
                      className="!text-left px-2 w-max py-3 text-sm "
                    >
                      Sr. No
                    </th>
                    <th scope="col" className="py-3 text-sm px-2 ">
                      Goal Name
                    </th>

                    <th scope="col" className="py-3 text-sm px-2 ">
                      Time
                    </th>
                    <th scope="col" className="py-3 text-sm px-2 ">
                      Assignee
                    </th>
                    <th scope="col" className=" py-3 text-sm px-2 ">
                      status
                    </th>

                    <th scope="col" className=" py-3 text-sm px-2 ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orgGoals?.map((goal, id) => (
                    <tr
                      key={id}
                      className={` hover:bg-gray-50 !font-medium w-[70px]  border-b `}
                    >
                      <td
                        onClick={() => handleOpen(goal._id)}
                        className="!text-left  cursor-pointer   px-2 text-sm w-[70px]  "
                      >
                        {id + 1}
                      </td>
                      <td
                        onClick={() => handleOpen(goal._id)}
                        className="text-sm cursor-pointer truncate text-left w-[350px]  px-2"
                      >
                        <p>{goal.goal}</p>
                      </td>

                      <td
                        onClick={() => handleOpen(goal._id)}
                        className=" cursor-pointer text-left !p-0 w-[300px]  "
                      >
                        <p
                          className={`
                        px-2 md:w-full w-max text-sm`}
                        >
                          {format(new Date(goal.startDate), "PP")} -{" "}
                          {format(new Date(goal.endDate), "PP")}
                        </p>
                      </td>

                      <td
                        onClick={() => handleOpen(goal._id)}
                        className="flex cursor-pointer w-[250px] items-start !text-left px-2 py-2"
                      >
                        <AvatarGroup max={6}>
                          {goal?.assignee.map((assignee, id) => (
                            <Tooltip
                              title={`${assignee.first_name} ${assignee.last_name}`}
                            >
                              <Avatar
                                src={assignee?.user_logo_url}
                                sx={{ width: 34, height: 34 }}
                              />
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                      </td>

                      <td
                        onClick={() => handleOpen(goal._id)}
                        className="cursor-pointer text-left text-sm w-[200px]  "
                      >
                        <p className="px-2  md:w-full w-max">
                          {goal.goalStatus}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-2  w-[220px]">
                        <IconButton
                          onClick={() => {
                            setOpenEdit(true);
                            setPreviewId(goal._id);
                          }}
                          color="primary"
                          aria-label="edit"
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton color="error" aria-label="delete">
                          <DeleteOutlined />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Stack
                direction={"row"}
                className="border-[.5px] border-gray-200 border-t-0 px-4 py-2 h-full  items-center w-full justify-between "
              >
                <div>
                  <h1>
                    Showing {page} to 1 of {totalRowCount} entries
                  </h1>
                </div>
                <Pagination
                  count={pages}
                  page={page}
                  color="primary"
                  shape="rounded"
                  onChange={(event, value) => setPage(value)}
                />
              </Stack>
            </>
          )}
        </div>
      </div>

      <GoalsModel open={open} options={options} handleClose={handleClose} />
      <GoalsModel
        open={openEdit}
        id={previewId}
        options={options}
        handleClose={handleClose}
      />
      <PreviewGoalModal
        open={previewModal}
        id={previewId}
        handleClose={handleClose}
      />
    </section>
  );
};

export default GoalsTable;
