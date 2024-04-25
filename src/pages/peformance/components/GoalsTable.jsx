import {
  AssignmentTurnedInOutlined,
  CancelOutlined,
  CheckCircleOutlined,
  InfoOutlined,
  MoreHoriz,
  Search,
  StarOutlined,
} from "@mui/icons-material";
import {
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  Pagination,
  Stack,
} from "@mui/material";

import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { format } from "date-fns";
import moment from "moment";
import React, { useContext, useMemo, useState } from "react";
import { useQuery } from "react-query";
import Select from "react-select";
import { TestContext } from "../../../State/Function/Main";
import { CustomOption } from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import UserProfile from "../../../hooks/UserData/useUser";
import GoalsModel from "./GoalsModel";
import MonitoringModel from "./MonitoringModel";
import PreviewGoalModal from "./PreviewGoalModal";
import RatingModel from "./RatingModel";
import RevaluateModel from "./RevaluateModel";

const GoalStatus = ({ status }) => {
  return (
    <div
      className={`px-3 py-1 flex items-center gap-1 ${
        status === "Goal Completed" || status === "Goal Accepted"
          ? "text-green-500"
          : status === "Goal Rejected"
          ? "text-red-500"
          : status === "Rating Completed"
          ? " text-yellow-500"
          : ""
      } rounded-sm  w-max`}
    >
      {status === "Goal Completed" ? (
        <CheckCircleOutlined />
      ) : status === "Goal Accepted" ? (
        <AssignmentTurnedInOutlined />
      ) : status === "Goal Rejected" ? (
        <CancelOutlined />
      ) : status === "Rating Completed" ? (
        <StarOutlined />
      ) : (
        <InfoOutlined />
      )}{" "}
      {status}
    </div>
  );
};

const GoalsTable = ({ performance }) => {
  const [focusedInput, setFocusedInput] = useState(null);
  const [currentGoal, setCurrentGoal] = useState(null);
  const { useGetCurrentRole, getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();
  const [employeeGoals, setEmployeeGoals] = useState(user._id);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openRevaluate, setOpenRevaluate] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewId, setPreviewId] = useState(null);
  const [openMenu, setopenMenu] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { handleAlert } = useContext(TestContext);
  const openMenuBox = Boolean(anchorEl);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
    setPreviewModal(false);
    setPreviewId(null);
    setOpenRevaluate(false);
    setopenMenu(null);
    setOpenEdit(false);
  };

  const handleOpen = (id) => {
    setPreviewModal(true);
    setPreviewId(id);
  };

  const rowsPerPage = 10; // Define the number of rows per page
  const [page, setPage] = useState(1);

  const authToken = useAuthToken();
  const isTimeFinish = useMemo(() => {
    const endDate = moment(performance?.enddate);
    const currentDate = moment();
    return endDate.diff(currentDate, "days") > -1;
    //eslint-disable-next-line
  }, [performance?.enddate]);

  const { data: employeeData } = useQuery(["employee"], async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/getEmployeeUnderManager`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data;
  });

  const { data: orgGoals = [], isFetching } = useQuery(
    ["orggoals", employeeGoals],
    async () => {
      if (role === "Employee" || employeeGoals) {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/route/performance/getOrganizationGoals`,
          {
            headers: {
              Authorization: authToken,
            },
            params: {
              role,
              empId: employeeGoals,
            },
          }
        );
        return data;
      }
    }
  );

  console.log(`🚀 ~ orgGoals:`, orgGoals);
  const allSection80s = orgGoals?.goals?.flatMap((data) => data);

  // Now, calculate the total number of rows using reduce
  const totalRowCount = allSection80s?.reduce((total, section) => total + 1, 0);
  const handleFocus = (fieldName) => {
    setFocusedInput(fieldName);
  };

  const pages = Math.ceil(totalRowCount / rowsPerPage);

  const options = useMemo(() => {
    if (employeeData) {
      return employeeData.map((emp) => ({
        value: emp._id,
        label: `${emp.first_name} ${emp.last_name}`,
        image: emp.user_logo_url,
      }));
    }
    return [];
    //eslint-disable-next-line
  }, []);

  const acceptGoal = async (status) => {
    try {
      const data = {
        status,
        assignee: { label: employeeGoals, value: employeeGoals },
      };
      await axios.patch(
        `${process.env.REACT_APP_API}/route/performance/updateSingleGoal/${openMenu}`,
        { data },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", "Goal Accepted");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <section className="p-4 ">
      <div className="p-4  bg-white rounded-md border">
        <div className=" py-2">
          <h1 className="text-black  text-2xl">
            {role === "Employee" ? "My Goals" : "Manager Goals"}
          </h1>
          {role !== "Employee" && (
            <p>Select Assignee to view the assignee goals</p>
          )}
        </div>
        <div className="my-2 flex justify-between">
          <div className="flex gap-4">
            {/* <div className={`space-y-1  min-w-[60vw] `}>
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
            </div> */}
            {role !== "Employee" && (
              <div className={`space-y-1 w-full `}>
                <div
                  className={`flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center`}
                >
                  <Search className="text-gray-700 md:text-lg !text-[1em]" />
                  <Select
                    aria-errormessage=""
                    placeholder={"Assignee"}
                    isClearable
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        borderWidth: "0px",
                        boxShadow: "none",
                      }),
                    }}
                    className={` bg-white w-[300px] !outline-none px-2 !shadow-none !border-none !border-0`}
                    components={{
                      Option: CustomOption,
                      IndicatorSeparator: () => null,
                    }}
                    options={options}
                    onChange={(value) => {
                      setEmployeeGoals(value?.value);
                    }}
                  />
                </div>
              </div>
            )}
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
          ) : orgGoals?.length <= 0 ? (
            <h1 className="bg-blue-100 text-rose-600 space-x- p-2 2 px-4 rounded-sm text-lg">
              <InfoOutlined /> No goals found
            </h1>
          ) : (
            <div className="overflow-auto ">
              <table className="w-full table-auto  border border-collapse min-w-full bg-white  text-left  !text-sm font-light">
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

                    <th scope="col" className=" py-3 text-sm px-2 ">
                      status
                    </th>

                    <th scope="col" className=" py-3 text-sm px-2 ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orgGoals?.goals?.map((goal, id) => (
                    <tr
                      key={id}
                      className={` hover:bg-gray-50 !font-medium  w-max border-b `}
                    >
                      <td
                        onClick={() => handleOpen(goal._id)}
                        className="!text-left  cursor-pointer py-4    px-2 text-sm w-[70px]  "
                      >
                        {id + 1}
                      </td>
                      <td
                        onClick={() => handleOpen(goal._id)}
                        className="text-sm cursor-pointer truncate text-left   px-2"
                      >
                        <p className=" truncate">{goal.goalId.goal}</p>
                      </td>

                      <td
                        onClick={() => handleOpen(goal._id)}
                        className=" cursor-pointer text-left !p-0 !w-[250px]  "
                      >
                        <p
                          className={`
                        px-2 md:w-full w-max text-sm`}
                        >
                          {format(new Date(goal.goalId.startDate), "PP")} -{" "}
                          {format(new Date(goal.goalId.endDate), "PP")}
                        </p>
                      </td>

                      <td
                        onClick={() => handleOpen(goal._id)}
                        className="cursor-pointer text-left text-sm w-[200px]  "
                      >
                        <GoalStatus status={goal?.status} />
                      </td>

                      {isTimeFinish &&
                        goal?.status !== "Goal Completed" &&
                        (role !== "Employee" ||
                          performance?.stages === "Goal setting" ||
                          performance?.stages ===
                            "Employee acceptance/acknowledgement stage") && (
                          <td className="cursor-pointer text-left text-sm  ">
                            <IconButton
                              id="basic-button"
                              aria-controls={
                                openMenu ? "basic-menu" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={openMenu ? "true" : undefined}
                              onClick={(e) => {
                                handleClick(e);
                                setCurrentGoal(goal);
                                setopenMenu(goal._id);
                              }}
                            >
                              <MoreHoriz />
                            </IconButton>
                          </td>
                        )}
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
            </div>
          )}
        </div>
      </div>

      <GoalsModel
        performance={performance}
        open={open}
        options={options}
        handleClose={handleClose}
      />

      <Menu
        id="basic-menu"
        open={openMenuBox}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        elevation={2}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <div className="flex !pl-0 !pr-2 !w-[200px] flex-col !z-10  mx-4 !py-3 bg-white   !items-start !justify-start">
          <h1 className="text-lg">Goal Setting</h1>
        </div>
        <Divider variant="fullWidth" orientation="horizontal" />

        {performance?.stages === "Goal setting" &&
          role === "Employee" &&
          currentGoal?.status === "Goal Rejected" && (
            <MenuItem
              className="!p-0"
              onClick={() => {
                setOpenEdit(true);
                setPreviewId(openMenu);
                handleMenuClose();
              }}
            >
              <div className=" flex  w-full h-full items-center  transition-all gap-4  py-2 px-4">
                Reapply goal
              </div>
            </MenuItem>
          )}
        {role === "Manager" &&
          performance?.stages === "Goal setting" &&
          currentGoal?.status !== "Goal Accepted" && (
            <>
              <MenuItem
                className="!p-0"
                onClick={() => acceptGoal("Goal Accepted")}
              >
                <div className="hover:!bg-green-500  flex  w-full h-full items-center hover:!text-white transition-all gap-4  py-2 px-4">
                  Approve goal
                </div>
              </MenuItem>
              <MenuItem
                className="!p-0"
                onClick={() => acceptGoal("Goal Rejected")}
              >
                <div className="hover:!bg-red-500 !text-red-500 flex  w-full h-full items-center hover:!text-white transition-all gap-4  py-2 px-4">
                  Reject Goal
                </div>
              </MenuItem>
            </>
          )}
        {performance?.stages !==
          "Employee acceptance/acknowledgement stage" && (
          <MenuItem
            onClick={() => {
              setOpenEdit(true);
              setPreviewId(openMenu);
              handleMenuClose();
            }}
          >
            {performance?.stages ===
            "KRA stage/Ratings Feedback/Manager review stage"
              ? "Add review & rating"
              : performance?.stages ===
                "Monitoring stage/Feedback collection stage"
              ? "Add monitoring form"
              : "Edit Goal"}
          </MenuItem>
        )}

        {performance?.stages === "Goal setting" && (
          <MenuItem className="!p-0" onClick={() => handleMenuClose()}>
            <div className="hover:!bg-red-500 !text-red-500 flex  w-full h-full items-center hover:!text-white transition-all gap-4  py-2 px-4">
              Delete goal
            </div>
          </MenuItem>
        )}

        {performance?.stages === "Employee acceptance/acknowledgement stage" &&
          role === "Employee" && (
            <>
              <MenuItem
                onClick={() => {
                  setOpenRevaluate(true);
                  handleMenuClose();
                }}
              >
                Request for revaluation
              </MenuItem>
              <MenuItem
                onClick={() => acceptGoal("Goal Completed")}
                className="!p-0"
              >
                <div className="hover:!bg-green-500 !text-green-500 flex  w-full h-full items-center hover:!text-white transition-all gap-4  py-2 px-4">
                  Accept goal rating
                </div>
              </MenuItem>
            </>
          )}
      </Menu>

      {performance?.stages === "Monitoring stage/Feedback collection stage" ? (
        <MonitoringModel
          open={openEdit}
          id={openMenu}
          assignee={employeeGoals}
          options={options}
          performance={performance}
          handleClose={handleClose}
        />
      ) : performance?.stages ===
        "KRA stage/Ratings Feedback/Manager review stage" ? (
        <RatingModel
          open={openEdit}
          id={openMenu}
          assignee={employeeGoals}
          options={options}
          performance={performance}
          handleClose={handleClose}
        />
      ) : (
        <GoalsModel
          open={openEdit}
          id={openMenu}
          assignee={employeeGoals}
          options={options}
          performance={performance}
          handleClose={handleClose}
        />
      )}
      <PreviewGoalModal
        open={previewModal}
        performance={performance}
        assignee={employeeGoals}
        id={previewId}
        handleClose={handleClose}
      />
      <RevaluateModel
        open={openRevaluate}
        id={openMenu}
        assignee={employeeGoals}
        options={options}
        performance={performance}
        handleClose={handleClose}
      />
    </section>
  );
};

export default GoalsTable;
