import { MoreHoriz } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import { useQuery } from "react-query";
import usePerformanceApi from "../../../../hooks/Performance/usePerformanceApi";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";

const ReviewTable = () => {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(null);
  console.log(`🚀 ~ isOpen:`, isOpen);
  const itemsPerPage = 10;

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

  const user = UserProfile().getCurrentUser();
  const role = UserProfile().useGetCurrentRole();
  const authToken = useAuthToken();
  const { fetchPerformanceSetup, getPerformanceDashboardTable } =
    usePerformanceApi();
  const { data: performance } = useQuery(["performancePeriod"], () =>
    fetchPerformanceSetup({ user, authToken })
  );

  const { data: tableData, isFetching } = useQuery(["dashboardTable"], () =>
    getPerformanceDashboardTable({ role, authToken })
  );

  const handleChange = (event, value) => {
    setPage(value);
  };

  const paginatedData = tableData?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  return (
    <div>
      <table
        className={`  table-auto  border border-collapse min-w-full  text-left  !text-sm font-light `}
      >
        <thead className="border-b bg-gray-100 font-bold">
          <tr className="!font-semibold ">
            <th scope="col" className="!text-left px-2 w-max py-3 text-sm ">
              Sr. No
            </th>

            <th scope="col" className="py-3 text-sm px-2 ">
              Assignee
            </th>

            <th scope="col" className="py-3 text-sm  ">
              Rating
            </th>
            <th scope="col" className="py-3 text-sm   ">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((goal, id) => (
            <tr className={` hover:bg-gray-50 !font-medium  w-max border-b `}>
              <td className="!text-left  cursor-pointer py-4    px-2 text-sm w-[70px]  ">
                {id + 1}
              </td>

              <td className="text-sm cursor-pointer  text-left   px-2">
                <div className="flex items-center gap-4">
                  <Avatar src={goal?.empId?.user_logo_url} />

                  <p className="text-sm">
                    {goal?.empId?.first_name} {goal?.empId?.last_name}
                  </p>
                </div>
              </td>

              <td className="text-sm cursor-pointer truncate text-left ml-auto   px-2">
                <p className="space-x-3 truncate">
                  {goal?.others?.ManagerRating
                    ? goal?.others?.ManagerRating
                    : "-"}
                </p>
              </td>
              <td className="text-sm cursor-pointer truncate text-left">
                <IconButton
                  id="basic-button"
                  //   aria-controls={openMenu ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  //   aria-expanded={openMenu ? "true" : undefined}
                  onClick={(e) => {
                    //   handleClick(e);
                    // setCurrentGoal(goal);
                    //   setopenMenu(goal);
                  }}
                >
                  <MoreHoriz />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewTable;
