import { Edit } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { React, useState } from "react";
import { useQuery } from "react-query";
import usePerformanceApi from "../../../../hooks/Performance/usePerformanceApi";
import useAuthToken from "../../../../hooks/Token/useAuth";
import UserProfile from "../../../../hooks/UserData/useUser";
import Rate_Review_Model from "../GoalTable/Modal/Rate_Review_Model";

const ReviewTable = ({ tableData }) => {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const { fetchPerformanceSetup } = usePerformanceApi();
  const user = UserProfile().getCurrentUser();

  const authToken = useAuthToken();
  const { data: performance } = useQuery(["performancePeriod"], () =>
    fetchPerformanceSetup({ user, authToken })
  );

  const handleClose = () => {
    setOpenEdit(false);
  };

  const handleOpen = (id) => {
    setOpenEdit(true);
    setOpenMenu(id);
  };

  const itemsPerPage = 10;

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

            <th scope="col" className="py-3 text-sm px-2 ml-auto ">
              Review
            </th>
            <th scope="col" className="py-3 text-sm px-2 ml-auto ">
              Rating
            </th>
            <th scope="col" className="py-3 text-sm px-2 ml-auto ">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map((goal, id) => (
            <tr className={` hover:bg-gray-50 !font-medium  w-max border-b `}>
              <td
                onClick={() => setIsOpen(goal)}
                className="!text-left  cursor-pointer py-4    px-2 text-sm w-[70px]  "
              >
                {id + 1}
              </td>

              <td
                onClick={() => setIsOpen(goal)}
                className="text-sm cursor-pointer  text-left   px-2"
              >
                <div className="flex items-center gap-4">
                  <Avatar src={goal?.empId?.user_logo_url} />

                  <p className="text-sm">
                    {goal?.empId?.first_name} {goal?.empId?.last_name}
                  </p>
                </div>
              </td>

              <td
                onClick={() => setIsOpen(goal)}
                className="text-sm cursor-pointer truncate text-left ml-auto   px-2"
              >
                <p className="space-x-3 truncate">
                  {goal?.others[0]?.managerFeedback
                    ? goal?.others[0]?.managerFeedback
                    : "-"}
                </p>
              </td>
              <td
                onClick={() => setIsOpen(goal)}
                className="text-sm cursor-pointer truncate text-left ml-auto   px-2"
              >
                <p className="space-x-3 truncate">
                  {goal?.others[0]?.managerRating
                    ? goal?.others[0]?.managerRating
                    : "-"}
                </p>
              </td>
              <td className="cursor-pointer text-left text-sm  ">
                <IconButton className="!text-blue-500" id="basic-button">
                  <Edit
                    onClick={() => handleOpen(goal)}
                    className="!h-5 !w-5"
                  />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Rate_Review_Model
        open={openEdit}
        id={openMenu}
        performance={performance}
        handleClose={handleClose}
      />
    </div>
  );
};

export default ReviewTable;
