import { Close } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import React from "react";
import EmptyAlertBox from "../../../../components/EmptyAlertBox";
import SingleEmployeeTab from "../../Tabs/SingleEmployeeTab";

const RightSideTable = ({ setIsOpen, isOpen }) => {
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
    },
  }));

  return (
    <div
      className={` ${
        !!isOpen
          ? "rounded-md visible w-[50%]  max-h-[76vh] overflow-y-auto h-max  "
          : "hidden"
      }`}
    >
      <div className="p-4 flex justify-between gap-4 w-full">
        <div className="flex  gap-4">
          <Avatar src={isOpen?.empId?.user_logo_url} />
          <h1 className="text-2xl font-semibold">
            {isOpen?.empId?.first_name} {isOpen?.empId?.last_name}
          </h1>
        </div>
        <IconButton onClick={() => setIsOpen(null)}>
          <Close />
        </IconButton>
      </div>

      {/* Task Completed bar */}
      {isOpen?.goals?.length > 0 && (
        <div className="px-4 ">
          <div className="space-y-3">
            <div className="flex justify-between">
              <h1 className="font-semibold text-[#67748E] ">Task status</h1>
              <h1 className="font-semibold text-[#67748E] ">
                {Math.round(
                  (isOpen?.goals?.filter(
                    (goal) => goal.goalStatus === "Goal Completed"
                  ).length /
                    isOpen?.goals.length) *
                    100
                )}{" "}
                % Done
              </h1>
            </div>
            <BorderLinearProgress
              variant="determinate"
              value={Math.round(
                (isOpen?.goals?.filter(
                  (goal) => goal.goalStatus === "Goal Completed"
                ).length /
                  isOpen?.goals.length) *
                  100
              )}
            />
          </div>
        </div>
      )}

      {/* <TestTab /> */}

      <SingleEmployeeTab />
      {/* Table of all task for employee */}
      <div className="p-4 ">
        {isOpen?.goals?.length <= 0 ? (
          <EmptyAlertBox
            title={"Goals Not Found"}
            desc={
              "This employee does not have any goals in current appraisal period"
            }
          />
        ) : (
          <table
            className={`  table-auto  border border-collapse min-w-full  text-left  !text-sm font-light `}
          >
            <thead className="border-b bg-gray-100 font-bold">
              <tr className="!font-semibold ">
                <th scope="col" className="!text-left px-2 w-max py-2 text-sm ">
                  Sr. No
                </th>

                <th scope="col" className="py-2 text-sm px-2 ">
                  Goal Name
                </th>
                <th scope="col" className="py-2 text-sm px-2 ">
                  Goal Status
                </th>
              </tr>
            </thead>

            <tbody>
              {isOpen?.goals?.map((goal, id) => (
                <tr
                  className={` hover:bg-gray-50 !font-medium  w-max border-b `}
                >
                  <td className="!text-left  cursor-pointer py-3    px-2 text-sm w-[70px]  ">
                    {id + 1}
                  </td>
                  <td
                    // onClick={() => handleOpen(goal._id)}
                    className="text-sm cursor-pointer truncate text-left   px-2"
                  >
                    <p className="space-x-3 truncate">{goal.goal}</p>
                  </td>
                  <td
                    // onClick={() => handleOpen(goal._id)}
                    className="text-sm cursor-pointer truncate text-left   px-2"
                  >
                    <p className="space-x-3 truncate">{goal.goalStatus}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RightSideTable;
