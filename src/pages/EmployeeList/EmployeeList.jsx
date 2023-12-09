import { IconButton, TextField } from "@mui/material";
import axios from "axios";
import { BorderColor } from "@mui/icons-material";
import React, { useContext, useEffect, useState } from "react";
import Setup from "../SetUpOrganization/Setup";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import { useQueryClient } from "react-query";
import EditModelOpen from "../../components/Modal/EditEmployeeModal/EditEmployeeModel";
const EmployeeList = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const queryClient = useQueryClient();
  const [nameSearch, setNameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [availableEmployee, setAvailableEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [numbers, setNumbers] = useState([]);

  const fetchAvailableEmployee = async (page) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee?page=${page}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

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
  // Modal states and function
  const [open, setOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [employeeId, setemployeeId] = useState(null);

  const handleEditModalOpen = (empId) => {
    setEditModalOpen(true);
    queryClient.invalidateQueries(["employee", empId]);
    setemployeeId(empId);
  };

  const handleClose = () => {
    setOpen(false);
    setemployeeId(null);
    setEditModalOpen(false);
  };

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-[80%]  h-max shadow-md rounded-sm border  items-center">
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
                      Phone Number
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
                        (!deptSearch.toLowerCase() ||
                          (item.deptname &&
                            item.deptname
                              .toLowerCase()
                              .includes(deptSearch))) &&
                        (!locationSearch.toLowerCase() ||
                          item.worklocation.some(
                            (location) =>
                              location.city &&
                              location.city
                                .toLowerCase()
                                .includes(locationSearch)
                          ))
                      );
                    })
                    .map((item, id) => (
                      <tr className="!font-medium border-b" key={id}>
                        <td className="!text-left pl-8 py-3">{id + 1}</td>
                        <td className="py-3">{item.first_name}</td>
                        <td className="py-3">{item.last_name}</td>
                        <td className="py-3">{item.email}</td>
                        <td className="py-3">
                          {item.worklocation.map((location, index) => (
                            <span key={index}>{location.city}</span>
                          ))}
                        </td>
                        <td className="py-3">{item.deptname}</td>
                        <td className="py-3">{item.phone_number}</td>
                        <td className="whitespace-nowrap px-6 py-2">
                          <IconButton
                            onClick={() => handleEditModalOpen(item._id)}
                          >
                            <BorderColor className="!text-xl" color="success" />
                          </IconButton>
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
                      className={`page-item ${
                        currentPage === n ? "active" : ""
                      }`}
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
        </Setup>
      </section>

      {/* edit model */}
      <EditModelOpen open={open} handleClose={handleClose} />
      <EditModelOpen
        handleClose={handleClose}
        open={editModalOpen}
        employeeId={employeeId}
      />
    </>
  );
};

export default EmployeeList;
