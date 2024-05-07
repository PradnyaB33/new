import { Container, TextField } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import CreateSalaryModel from "../../components/Modal/CreateSalaryModel/CreateSalaryModel";
import { MoreVert } from "@mui/icons-material";
import {Menu,MenuItem,} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import UpdateSalaryModal from "../../components/Modal/CreateSalaryModel/UpdateSalaryModal";

const SalaryManagement = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [nameSearch, setNameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [availableEmployee, setAvailableEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [numbers, setNumbers] = useState([]);
  const { organisationId } = useParams();
 

  const navigate = useNavigate();

  const fetchAvailableEmployee = async (page) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${page}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: authToken,
        },
      });
      setAvailableEmployee(response.data.employees);
      setCurrentPage(page);
      setTotalPages(response.data.totalPages || 1);
      // Generate an array of page numbers
      const numbersArray = Array.from(
        { length: response.data.totalPages || 1 },
        (_, index) => index + 1
      );
      setNumbers(numbersArray);
    } catch (error) {
      console.log(error);
      handleAlert(true, "error", "Failed to Fetch Employee");
    }
  };

  useEffect(() => {
    fetchAvailableEmployee(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const prePage = () => {
    if (currentPage !== 1) {
      fetchAvailableEmployee(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== totalPages) {
      fetchAvailableEmployee(currentPage + 1);
    }
  };

  const changePage = (id) => {
    fetchAvailableEmployee(id);
  };  

   // for morevert icon
   const [anchorEl, setAnchorEl] = useState(null);
   const [employeeId, setEmployeeId] = useState(null);

   const handleClick = (e, id) => {
     setAnchorEl(e.currentTarget);
     setEmployeeId(id);
   };
   const handleCloseIcon = () => {
     setAnchorEl(null);
   };

  // modal for create salary
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const handleCreateModalOpen = () => {
    setCreateModalOpen(true);
  };

  const handleClose = () => {
    setCreateModalOpen(false);
    setAnchorEl(null);
  };  


   // modal for update salary
   const [updateModalOpen, setUpdateModalOpen] = useState(false);
   const handleUpdateModalOpen = () => {
     setUpdateModalOpen(true);
   }; 

   const handleUpdateModalClose = () => {
      setUpdateModalOpen(false);
      setAnchorEl(null);
   }; 

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center">
          <h1 className="text-lg pl-2 font-semibold text-center modal-title py-2">
            Salary Management
          </h1>
          <p className="text-xs text-gray-600 text-center">
            Create and calculate the salary of your employee here.
          </p>

          <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <TextField
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder="Search Employee Name...."
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
              />
            </div>
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <TextField
                onChange={(e) => setDeptSearch(e.target.value)}
                placeholder="Search Department Name...."
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
              />
            </div>
            <div className="flex items-center gap-3">
              <TextField
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search Location ...."
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
              />
            </div>
          </div>

          <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
            <table className="min-w-full bg-white  text-left !text-sm font-light">
              <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                <tr className="!font-semibold">
                  <th scope="col" className="!text-left pl-8 py-3">
                    Sr. No
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    First Name
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Last Name
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Email
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Employee Id
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Location
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Department
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Salary Template
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Calculate Salary
                  </th>
                </tr>
              </thead>
              <tbody>
                {availableEmployee.length > 0 &&  availableEmployee
                  .filter((item) => {
                    return (
                      (!nameSearch.toLowerCase() ||
                        (item.first_name !== null &&
                          item.first_name !== undefined &&
                          item.first_name
                            .toLowerCase()
                            .includes(nameSearch))) &&
                      (!deptSearch ||
                        (item.deptname !== null &&
                          item.deptname !== undefined &&
                          item.deptname.some(
                            (dept) =>
                              dept.departmentName !== null &&
                              dept.departmentName
                                .toLowerCase()
                                .includes(deptSearch.toLowerCase())
                          ))) &&
                      (!locationSearch.toLowerCase() ||
                        item.worklocation.some(
                          (location) =>
                            location &&
                            location.city !== null &&
                            location.city !== undefined &&
                            location.city.toLowerCase().includes(locationSearch)
                        ))
                    );
                  })
                  ?.map((item, id) => (
                    <tr className="!font-medium border-b" key={id}>
                      <td className="!text-left pl-8 py-3">{id + 1}</td>
                      <td className="py-3 pl-8">{item?.first_name}</td>
                      <td className="py-3 pl-8 ">{item?.last_name}</td>
                      <td className="py-3 pl-8">{item?.email}</td>
                      <td className="py-3 pl-8">{item?.empId}</td>
                      <td className="py-3 pl-8">
                        {item?.worklocation?.map((location, index) => (
                          <span key={index}>{location?.city}</span>
                        ))}
                      </td>
                      <td className="py-3">
                        {item?.deptname?.map((dept, index) => {
                          return (
                            <span key={index}>{dept?.departmentName}</span>
                          );
                        })}
                      </td>
                      <td className="py-3 pl-8">
                        {item?.salarystructure?.name}
                      </td>
                      <td>
                          <MoreVert
                          onClick={(e) => handleClick(e, item._id)} 
                          className="cursor-pointer"
                        />
                        <Menu
                          elevation={2}
                          anchorEl={anchorEl}
                          key={id}
                          open={Boolean(anchorEl)}
                          onClose={handleCloseIcon}
                        >
                          <Tooltip title="Button for creating salary">
                            <MenuItem onClick={() => handleCreateModalOpen()}>
                              <AddBoxIcon
                                color="primary"
                                aria-label="edit"
                                style={{
                                  color: "#f50057",
                                  marginRight: "10px",
                                }}
                              />
                            </MenuItem>
                          </Tooltip>
                          <Tooltip title="Button for editing salary">
                            <MenuItem  onClick={() => handleUpdateModalOpen()}>
                              <EditIcon
                                color="primary"
                                aria-label="edit"
                                style={{
                                  color: "#2196f3",
                                  marginRight: "10px",
                                }}
                              />
                            </MenuItem>
                          </Tooltip>
                        
                        </Menu>
                      </td>
                      <td>
                        <button
                          type="submit"
                          onClick={() =>
                            navigate(
                              `/organisation/${organisationId}/salary-calculate/${item._id}`
                            )
                          }
                          className="flex group justify-center gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
                        >
                          Calculate Salary
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <nav
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "30px",
                marginBottom: "20px",
              }}
            >
              <ul
                style={{ display: "inline-block", marginRight: "5px" }}
                className="pagination"
              >
                <li
                  style={{ display: "inline-block", marginRight: "5px" }}
                  className="page-item"
                >
                  <button
                    style={{
                      color: "#007bff",
                      padding: "8px 12px",
                      border: "1px solid #007bff",
                      textDecoration: "none",
                      borderRadius: "4px",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    className="page-link"
                    onClick={prePage}
                  >
                    Prev
                  </button>
                </li>
                {/* Map through page numbers and generate pagination */}
                {numbers.map((n, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === n ? "active" : ""}`}
                    style={{
                      display: "inline-block",
                      marginRight: "5px",
                    }}
                  >
                    <a
                      href={`#${n}`}
                      style={{
                        color: currentPage === n ? "#fff" : "#007bff",
                        backgroundColor:
                          currentPage === n ? "#007bff" : "transparent",
                        padding: "8px 12px",
                        border: "1px solid #007bff",
                        textDecoration: "none",
                        borderRadius: "4px",
                        transition: "all 0.3s ease",
                      }}
                      className="page-link"
                      onClick={() => changePage(n)}
                    >
                      {n}
                    </a>
                  </li>
                ))}
                <li style={{ display: "inline-block" }} className="page-item">
                  <button
                    style={{
                      color: "#007bff",
                      padding: "8px 12px",
                      border: "1px solid #007bff",
                      textDecoration: "none",
                      borderRadius: "4px",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    className="page-link"
                    onClick={nextPage}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </article>
      </Container>

      <CreateSalaryModel
        id={organisationId}
        open={createModalOpen}
        handleClose={handleClose}
        empId={employeeId}
      />
       <UpdateSalaryModal
        id={organisationId}
        open={updateModalOpen}
        handleClose={handleUpdateModalClose}
        empId={employeeId}
      />
    </>
  );
};

export default SalaryManagement;
