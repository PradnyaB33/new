import {
  Button,
  Container,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import AttendanceBioModal from "../../components/Modal/AttedanceBioModal/AttendanceBioModal";
import { West } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery } from "react-query";
import axios from "axios";

const EmpInfoByDynimacally = () => {
  // Hooks
  const navigate = useNavigate();
  const param = useParams();
  const organisationId = param?.organisationId;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { handleAlert } = useContext(TestContext);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  console.log(setTotalPages);

  // Get cookies
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  // Get punching data by org
  const { data: tempPunchData, isLoading } = useQuery(
    ["tempPunchData", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-temp-punching-data`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      enabled: !!organisationId && !!authToken,
    }
  );

  console.log("tempPunchData", tempPunchData);

  // to define the function for search by name
  const handleSearchName = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1);
  };

  // to define the function for search by id
  const handleSearchId = (e) => {
    setSearchId(e.target.value);
    setCurrentPage(1);
  };

  // to define the function for search by department
  const handleSearchDepartment = (e) => {
    setSearchDepartment(e.target.value);
    setCurrentPage(1);
  };

  // pagination
  const prePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const changePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPaginationNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= halfMaxPagesToShow) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage + halfMaxPagesToShow >= totalPages) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (
          let i = currentPage - halfMaxPagesToShow;
          i <= currentPage + halfMaxPagesToShow;
          i++
        ) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const paginationNumbers = getPaginationNumbers();

  //  to open the model
  const [empModalOpen, setEmpModalOpen] = useState(false);
  const handleEmpModalOpen = () => {
    if (selectedEmployees.length === 0) {
      handleAlert(false, "error", "Please check the employee before syncing.");
    } else {
      setEmpModalOpen(true);
    }
  };

  // to close the model
  const handleEmpModalClose = () => {
    setEmpModalOpen(false);
    setSelectedEmployees([]);
  };

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className=" bg-white w-full h-max shadow-md rounded-sm border items-center">
          <div className=" mt-3">
            <IconButton onClick={() => navigate(-1)}>
              <West className="text-xl" />
            </IconButton>
          </div>

          <Typography variant="h4" className="text-center pl-10 mb-6 mt-2">
            Employee’s Punch Sync
          </Typography>
          <p className="text-xs text-gray-600 pl-10 text-center">
            Track the attendance of employees here by using the sync button.
          </p>

          <div className="flex items-center justify-center mt-4">
            <Tooltip title={"Please check the employee before syncing."} arrow>
              <Button
                variant="contained"
                component="span"
                onClick={handleEmpModalOpen}
              >
                Sync
              </Button>
            </Tooltip>
          </div>

          <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex items-center gap-3 mb-3 md:mb-0 w-full md:w-auto">
              <Tooltip title={"Search employee by employee name"} arrow>
                <TextField
                  placeholder="Search Employee Name...."
                  variant="outlined"
                  size="small"
                  sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
                  value={searchName}
                  onChange={handleSearchName}
                />
              </Tooltip>
            </div>
            <div className="flex items-center gap-3 mb-3 md:mb-0 w-full md:w-auto">
              <Tooltip title={"Search employee by employee id"} arrow>
                <TextField
                  placeholder="Search Employee ID...."
                  variant="outlined"
                  size="small"
                  sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
                  value={searchId}
                  onChange={handleSearchId}
                />
              </Tooltip>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Tooltip title={"Search employee by employee department"} arrow>
                <TextField
                  placeholder="Search Department...."
                  variant="outlined"
                  size="small"
                  sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
                  value={searchDepartment}
                  onChange={handleSearchDepartment}
                />
              </Tooltip>
            </div>
          </div>

          {isLoading && (
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-200 border-b-2 border-gray-300">
                    <th className="pl-8 py-2 text-left">
                      <input type="checkbox" />
                    </th>
                    <th className="!text-left pl-8 py-3">Sr No.</th>
                    <th className="py-3 pl-8 !text-left">Employee ID</th>
                    <th className="py-3 pl-8 !text-left">Name</th>
                    <th className="py-3 pl-8 !text-left">Department</th>
                    <th className="py-3 pl-8 !text-left">Date</th>
                    <th className="py-3 pl-8 !text-left">Day</th>
                    <th className="py-3 pl-8 !text-left">In Time</th>
                    <th className="py-3 pl-8 !text-left">Out Time</th>
                  </tr>
                </thead>
                <tbody>
                  {tempPunchData?.map((data, index) => (
                    <tr key={index} className="!font-medium border-b">
                      <td className="!text-left pl-8 py-3">
                        {data["Employee ID"]}
                      </td>
                      <td className="!text-left pl-8 py-3">
                        {data["First Name"]}
                      </td>
                      <td className="!text-left pl-8 py-3">
                        {data.Department}
                      </td>
                      <td className="!text-left pl-8 py-3">{data.Date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-between p-4">
            <Button
              variant="contained"
              color="primary"
              onClick={prePage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div>
              {paginationNumbers &&
                paginationNumbers?.map((number, index) => (
                  <Button
                    key={index}
                    variant={number === currentPage ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => number !== "..." && changePage(number)}
                    disabled={number === "..."}
                  >
                    {number}
                  </Button>
                ))}
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </article>
      </Container>

      <AttendanceBioModal
        handleClose={handleEmpModalClose}
        open={empModalOpen}
        organisationId={organisationId}
        selectedEmployees={selectedEmployees}
      />
    </>
  );
};

export default EmpInfoByDynimacally;
