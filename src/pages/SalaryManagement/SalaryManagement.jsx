import { TextField } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import CreateSalaryModel from "../../components/Modal/CreateSalaryModel/CreateSalaryModel";
import { Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SalaryManagement = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const [nameSearch, setNameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [availableEmployee, setAvailableEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [numbers, setNumbers] = useState([]);
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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

  // modal for create salary
  const [open, setOpen] = React.useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);

  const handleCreateModalOpen = (empId) => {
    setCreateModalOpen(true);
    queryClient.invalidateQueries(["salary", empId]);
    setEmployeeId(empId);
  };

  const handleClose = () => {
    setOpen(false);
    setEmployeeId(null);
    setCreateModalOpen(false);
  };

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <article className="SetupSection bg-white w-full  h-max shadow-md rounded-sm border  items-center">
          <h1
            id="modal-modal-title"
            className="text-lg pl-2 font-semibold text-center modal-title py-2"
          >
            Employee List for Salary Management
          </h1>

          <div className="p-4  border-b-[.5px] flex items-center justify-between  gap-3 w-full border-gray-300">
            <div className="flex items-center  gap-3 ">
              <TextField
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder="Search Employee Name...."
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
              />
            </div>
            <div className="flex items-center  gap-3 ">
              <TextField
                onChange={(e) => setDeptSearch(e.target.value)}
                placeholder="Search Department Name...."
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
              />
            </div>
            <div className="flex items-center  gap-3 ">
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
                    SR NO
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
                    Location
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Department
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Salary Template
                  </th>

                  <th scope="col" className="px-6 py-3 ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {availableEmployee
                  .filter((item) => {
                    return (
                      (!nameSearch.toLowerCase() ||
                        (item.first_name &&
                          item.first_name
                            .toLowerCase()
                            .includes(nameSearch))) &&
                      (!deptSearch ||
                        (item.deptname &&
                          item.deptname.some((dept) =>
                            dept.departmentName
                              .toLowerCase()
                              .includes(deptSearch.toLowerCase())
                          ))) &&
                      (!locationSearch.toLowerCase() ||
                        item.worklocation.some(
                          (location) =>
                            location.city &&
                            location.city.toLowerCase().includes(locationSearch)
                        ))
                    );
                  })
                  ?.map((item, id) => (
                    <tr className="!font-medium border-b" key={id}>
                      <td className="!text-left pl-8 py-3">{id + 1}</td>
                      <td className="py-3">{item.first_name}</td>
                      <td className="py-3">{item.last_name}</td>
                      <td className="py-3">{item.email}</td>
                      <td className="py-3">
                        {item?.worklocation?.map((location, index) => (
                          <span key={index}>{location.city}</span>
                        ))}
                      </td>
                      <td className="py-3">
                        {item?.deptname?.map((dept, index) => {
                          return (
                            <span key={index}>{dept?.departmentName}</span>
                          );
                        })}
                      </td>
                      <td className="py-3">{item?.salarystructure?.name}</td>
                      <td className="whitespace-nowrap ">
                        <div>
                          <Button
                            onClick={handleMenuOpen}
                            className="px-4 py-2 text-base bg-blue-500 text-white rounded-lg"
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth={false}
                            margin="normal"
                          >
                            Actions
                          </Button>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                          >
                            <MenuItem
                              onClick={() => handleCreateModalOpen(item._id)}
                            >
                              Create Salary
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                navigate(
                                  `/organisation/${organisationId}/salary-calculate/${item._id}`
                                )
                              }
                            >
                              Calculate Salary
                            </MenuItem>
                          </Menu>
                        </div>
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
      </section>

      {/* Create model */}
      <CreateSalaryModel
        id={organisationId}
        open={open}
        handleClose={handleClose}
      />
      <CreateSalaryModel
        id={organisationId}
        open={createModalOpen}
        handleClose={handleClose}
        empId={employeeId}
      />
    </>
  );
};

export default SalaryManagement;
