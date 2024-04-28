import {
  AssignmentTurnedIn,
  Autorenew,
  Cancel,
  CheckCircle,
  Info,
  InfoOutlined,
  KeyboardDoubleArrowDown,
  MoreHoriz,
  RateReview,
  Search,
  Star,
} from "@mui/icons-material";
import {
  Avatar,
  Divider,
  IconButton,
  Menu,
  Pagination,
  Stack,
  Tooltip,
} from "@mui/material";

import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { format } from "date-fns";
import moment from "moment";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import Select from "react-select";
import { TestContext } from "../../../../State/Function/Main";
import { CustomOption } from "../../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";
import DeleteGoal from "./DeleteGoal";
import GoalsModel from "./GoalsModel";
import MonitoringModel from "./Modal/MonitoringModel";
import PreviewGoalModal from "./Modal/PreviewGoalModal";
import RatingModel from "./Modal/RatingModel";
import RevaluateModel from "./Modal/RevaluateModel";
import TabelSkeleton from "./Skelton/TabelSkeleton";

const GoalStatus = ({ status, performance }) => {
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
      {performance.stages === "Goal setting" &&
        (status === "Goal Completed" ? (
          <>
            <CheckCircle />
          </>
        ) : status === "Goal Approved" ? (
          <p className="text-green-500">
            <AssignmentTurnedIn className="text-xs" /> Ready to go
          </p>
        ) : status === "Goal Rejected" ? (
          <>
            <Cancel /> {status}
          </>
        ) : (
          <p className="text-gray-500">
            <Info /> Pending
          </p>
        ))}

      {performance?.stages === "Monitoring stage/Feedback collection stage" &&
        (status === "Monitoring Completed" ? (
          <p className="text-blue-500">
            <RateReview /> Monitoring Completed
          </p>
        ) : (
          <p className="text-gray-500">
            <Info /> Monitoring Pending
          </p>
        ))}

      {performance?.stages === "Employee acceptance/acknowledgement stage" &&
        (status === "Revaluation Requested" ? (
          <p
            // style={{ textShadow: "0 0 0  1px #333" }}
            className="text-[#3f51b5]"
          >
            <Autorenew /> Revaluation Requested
          </p>
        ) : status === "Goal Completed" ? (
          <p className="text-green-500">
            <CheckCircle /> Goal Completed
          </p>
        ) : (
          <p className="text-gray-500">
            <Info /> Goal Acceptance Pending
          </p>
        ))}

      {performance?.stages ===
        "KRA stage/Ratings Feedback/Manager review stage" &&
        (status === "Rating Completed" ? (
          <p
            // style={{ textShadow: "0 0 0  1px #333" }}
            className="text-[#ffd700] "
          >
            <Star /> Rating Completed
          </p>
        ) : (
          <p className="text-gray-500">
            <Info /> Rating Pending
          </p>
        ))}

      {/* {status === "Goal Completed" ? (
        <>
          <CheckCircle />
        </>
      ) : status === "Goal Approved" ? (
        <p className="text-green-500">
          <AssignmentTurnedIn className="text-xs" /> Ready to go
        </p>
      ) : status === "Goal Rejected" ? (
        <>
          <Cancel /> {status}
        </>
      ) : status === "Rating Completed" ? (
        <>
          <StarOutlined /> {status}
        </>
      ) : status === "Monitoring Completed" ? (
        <p className="text-blue-500">
          <RateReview /> Monitoring Completed
        </p>
      ) : (
        <>
          <Info /> {status}
        </>
      )} */}
    </div>
  );
};

const GoalsTable = ({ performance }) => {
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [employeeGoals, setEmployeeGoals] = useState();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openRevaluate, setOpenRevaluate] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewId, setPreviewId] = useState(null);
  const [openMenu, setopenMenu] = useState(null);
  const [search, setSearch] = useState("");
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
    setDeleteConfirmation(null);
  };

  const handleOpen = (id) => {
    setPreviewModal(true);
    setPreviewId(id);
  };

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
  const [page, setPage] = useState(1);

  const { data: orgGoals = [], isFetching } = useQuery(
    ["orggoals", employeeGoals, page],
    async () => {
      // if (role === "Employee" || employeeGoals) {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/performance/getOrganizationGoals`,
        {
          headers: {
            Authorization: authToken,
          },
          params: {
            role,
            empId: employeeGoals,
            page,
          },
        }
      );
      return data;
    },
    { refetchOnMount: false }
  );

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
        isGoalSettingCompleted: false,
        assignee: { label: openMenu.empId._id, value: openMenu.empId._id },
      };

      // let isGoalSettingCompleted = false;
      if (status === "Goal Approved") {
        data.isGoalSettingCompleted = true;
      }
      await axios.patch(
        `${process.env.REACT_APP_API}/route/performance/updateSingleGoal/${openMenu._id}`,
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

  useEffect(() => {
    console.log(search);
  }, [search]);

  // const isTrippleDotActive = useCallback((goal) => {
  //   if (isTimeFinish) {
  //     return false;
  //   }

  //   if (performance.stages === "Goal setting" && role === "Employee") {
  //     return goal?.status === "Goal Rejected" ? true : false;
  //   }
  // }, []);

  return (
    <section className="px-8 py-0 mb-10 ">
      <div className=" bg-white rounded-md ">
        {/* <div className=" py-2">
          <h1 className="text-black  text-2xl">
            {role === "Employee" ? "My Goals" : "Manager Goals"}
          </h1>
        </div> */}
        <div className="my-2 flex justify-between">
          <div className="flex gap-4">
            <div className={`space-y-1  min-w-[60vw] `}>
              <div
                // onFocus={() => {
                //   handleFocus("search");
                // }}
                // onBlur={() => setFocusedInput(null)}
                // className={` ${
                //   focusedInput === "search"
                //     ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                //     : "outline-none border-gray-200 border-[.5px]"
                // } flex  rounded-md items-center px-2   bg-white py-3 md:py-[6px]`}
                className="flex  rounded-md items-center px-2   bg-white py-3 md:py-[6px] outline-none border-gray-200 border-[.5px]"
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
          {isFetching || performance === undefined ? (
            // <CircularProgress />
            <TabelSkeleton />
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
                    <th scope="col" className="py-3 text-sm px-2 "></th>
                    <th scope="col" className="py-3 text-sm px-2 ">
                      Goal Name
                    </th>

                    <th scope="col" className="py-3 text-sm px-2 ">
                      Assignee
                    </th>

                    <th scope="col" className="py-3 text-sm px-2 ">
                      Time
                    </th>

                    <th scope="col" className=" py-3 text-sm px-2 ">
                      Status
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
                        {(page - 1) * 10 + id + 1}
                      </td>

                      <td
                        className="w-[30px] hover:bg-gray-50 !font-medium  border-b"
                        onClick={() => handleOpen(goal._id)}
                      >
                        {goal.downcasted && (
                          <Tooltip
                            className="cursor-pointer"
                            title="This goal is downcasted any changes will apply to all related downcasted goal"
                          >
                            <KeyboardDoubleArrowDown className="text-blue-500" />
                          </Tooltip>
                        )}{" "}
                      </td>
                      <td
                        onClick={() => handleOpen(goal._id)}
                        className="text-sm cursor-pointer truncate text-left   px-2"
                      >
                        <p className="space-x-3 truncate">{goal.goal}</p>
                      </td>

                      <td
                        onClick={() => handleOpen(goal._id)}
                        className="text-sm cursor-pointer  text-left   px-2"
                      >
                        <div className="flex items-center gap-4">
                          <Tooltip
                            title={`${goal.empId.first_name} ${goal.empId.last_name}`}
                          >
                            <Avatar src={goal.empId.user_logo_url} />
                          </Tooltip>
                          <p className="text-sm">
                            {goal.empId.first_name} {goal.empId.last_name}
                          </p>
                        </div>
                      </td>

                      <td
                        onClick={() => handleOpen(goal._id)}
                        className=" cursor-pointer text-left !p-0 !w-[250px]  "
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
                        className="cursor-pointer text-left text-sm w-[200px]  "
                      >
                        <GoalStatus
                          status={goal?.status}
                          performance={performance}
                        />
                      </td>

                      {/* {isTrippleDotActive(goal) ? "show" : "hide"} */}

                      {/* {isTimeFinish
                        ? performance?.stages === "Goal setting" &&
                          (goal?.status !== "Goal Approved" ||
                            goal?.status !== "Goal Rejected")
                          ? true
                          : false
                          ? performance?.stages ===
                              "Monitoring stage/Feedback collection stage" &&
                            role === "Manager"
                            ? true
                            : false
                          : "noo"
                        : "time finished"} */}

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
                                // setCurrentGoal(goal);
                                setopenMenu(goal);
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
                    Showing {page} to {orgGoals?.totalPages} of{" "}
                    {orgGoals?.totalGoals} entries
                  </h1>
                </div>
                <Pagination
                  count={orgGoals?.totalPages}
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

        {role === "Manager" &&
          performance?.stages === "Goal setting" &&
          openMenu?.status !== "Goal Approved" &&
          openMenu?.status !== "Goal Rejected" && (
            <>
              <MenuItem
                className="!p-0"
                onClick={() => acceptGoal("Goal Approved")}
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

        {performance?.stages ===
          "Monitoring stage/Feedback collection stage" && (
          <MenuItem
            onClick={() => {
              setOpenEdit(true);
              setPreviewId(openMenu);
              handleMenuClose();
            }}
          >
            Add monitoring form
          </MenuItem>
        )}

        {performance?.stages === "Goal setting" && (
          <>
            <MenuItem
              onClick={() => {
                setOpenEdit(true);
                setPreviewId(openMenu);
                handleMenuClose();
              }}
            >
              {openMenu?.status === "Goal Rejected" && role === "Employee"
                ? "Reapply for goal"
                : "Update Goal"}
            </MenuItem>
          </>
        )}
        {(performance?.stages ===
          "KRA stage/Ratings Feedback/Manager review stage" ||
          openMenu?.status === "Revaluation Requested") && (
          <MenuItem
            onClick={() => {
              setOpenEdit(true);
              setPreviewId(openMenu);
              handleMenuClose();
            }}
          >
            {openMenu?.status === "Revaluation Requested"
              ? "Revaluate Employee"
              : "Add review & rating"}
          </MenuItem>
        )}

        {performance?.stages === "Goal setting" && (
          <MenuItem
            className="!p-0"
            onClick={() => {
              setDeleteConfirmation(openMenu);
              handleMenuClose();
            }}
          >
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

      <DeleteGoal
        deleteConfirmation={deleteConfirmation}
        handleClose={handleClose}
      />

      {performance?.stages === "Monitoring stage/Feedback collection stage" ? (
        <MonitoringModel
          open={openEdit}
          id={openMenu}
          // assignee={openMenu}
          options={options}
          performance={performance}
          handleClose={handleClose}
        />
      ) : performance?.stages ===
          "KRA stage/Ratings Feedback/Manager review stage" ||
        openMenu?.status === "Revaluation Requested" ? (
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
