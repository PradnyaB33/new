// import {
//   Button,
//   Container,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   TextField,
//   Typography,
//   Tooltip,
// } from "@mui/material";
// import axios from "axios";
// import React, { useContext, useEffect, useState } from "react";
// import { TestContext } from "../../../State/Function/Main";
// import { UseContext } from "../../../State/UseState/UseContext";
// const AttendanceBioModal = ({
//   handleClose,
//   open,
//   organisationId,
//   selectedEmployees,
// }) => {
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { handleAlert } = useContext(TestContext);
//   const [emailSearch, setEmailSearch] = useState("");
//   const [availableEmployee, setAvailableEmployee] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [numbers, setNumbers] = useState([]);
//   const [checkedEmployees, setCheckedEmployees] = useState([]);
//   const [emailNotFound, setEmailNotFound] = useState(false);
//   console.log("email not found", emailNotFound);

//   const fetchAvailableEmployee = async (page) => {
//     try {
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

const AttendanceBioModal = ({
  handleClose,
  open,
  organisationId,
  selectedEmployees,
}) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const [emailSearch, setEmailSearch] = useState("");
  const [availableEmployee, setAvailableEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [numbers, setNumbers] = useState([]);
  const [checkedEmployees, setCheckedEmployees] = useState([]);
  const [emailNotFound, setEmailNotFound] = useState(false);
  console.log(emailNotFound);

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
      const numbersArray = Array.from(
        { length: response.data.totalPages || 1 },
        (_, index) => index + 1
      );
      setNumbers(numbersArray);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAvailableEmployee(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  // Function to handle previous page
  const prePage = () => {
    if (currentPage !== 1) {
      fetchAvailableEmployee(currentPage - 1);
    }
  };

  // Function to handle next page
  const nextPage = () => {
    if (currentPage !== totalPages) {
      fetchAvailableEmployee(currentPage + 1);
    }
  };

  // Function to change page
  const changePage = (id) => {
    fetchAvailableEmployee(id);
  };

  // Function to handle checking/unchecking employee
  const handleCheckEmp = (employeeId) => {
    const isChecked = checkedEmployees.includes(employeeId);
    if (isChecked) {
      setCheckedEmployees(checkedEmployees.filter((id) => id !== employeeId));
    } else {
      setCheckedEmployees([...checkedEmployees, employeeId]);
    }
  };

  // Validate email format
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle sync
  const handleSync = async () => {
    try {
      if (checkedEmployees.length === 0 && emailSearch.trim() !== "") {
        setEmailNotFound(true);
        return;
      }
  
      // Verify email for each checked employee
      const invalidEmails = checkedEmployees.filter((employee) => {
        const email = employee?.email || "";
        return !validateEmail(email);
      });
  
      if (invalidEmails.length > 0) {
        handleAlert(true, "error", "Please enter valid email addresses.");
        return;
      }
  
      const syncedData = selectedEmployees.map((employee) => ({
        date: employee[3],
        punchingTime: employee[4],
        punchingStatus: employee[5],
      }));
      const EmployeeIds = checkedEmployees
        .map((employee) => employee._id)
        .filter(Boolean);
      EmployeeIds.forEach((EmployeeId) => {
        axios.post(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/add-attendance-data`,
          {
            EmployeeId: EmployeeId,
            punchingRecords: syncedData,
          },
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
      });

      handleAlert(true, "success", "Synced data successfully.");
      handleClose();
      setCheckedEmployees([]);
    } catch (error) {
      console.error("Failed to sync attendance data:", error);
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "1000px!important",
          height: "100%",
          maxHeight: "90vh!important",
        },
      }}
      open={open}
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogContent className="border-none !pt-0 !px-0 shadow-md outline-none rounded-md">
        <Container maxWidth="xl" className="bg-gray-50">
          <Typography variant="h4" className="text-center pl-10 mb-6 mt-2">
            Employee’s List
          </Typography>
          <p className="text-xs text-gray-600 pl-10 text-center">
            List of employees from the organisation.
          </p>

          <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <Tooltip title={"Search employee by employee email"} arrow>
                <TextField
                  onChange={(e) => setEmailSearch(e.target.value)}
                  placeholder="Search Email...."
                  variant="outlined"
                  size="small"
                  sx={{ width: 300 }}
                />
              </Tooltip>
            </div>
          </div>

          <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
            <table className="min-w-full bg-white text-left !text-sm font-light">
              <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                <tr className="!font-semibold">
                  <th scope="col" className="!text-left pl-8 py-3">
                    Select
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Sr. No
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Employee Id
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
                </tr>
              </thead>
              <tbody>
                {availableEmployee &&
                  availableEmployee.length > 0 &&
                  availableEmployee
                    .filter((item) => {
                      return (
                        !emailSearch.toLowerCase() ||
                        (item.email !== null &&
                          item.email !== undefined &&
                          item.email.toLowerCase().includes(emailSearch))
                      );
                    })
                    .map((item, id) => (
                      <tr className="!font-medium border-b" key={id}>
                        <td className="!text-left pl-8 py-3">
                          <Tooltip title={"Select the employee"} arrow>
                            <input
                              type="checkbox"
                              onChange={() => handleCheckEmp(item)}
                            />
                          </Tooltip>
                        </td>
                        <td className="!text-left pl-8 py-3">{id + 1}</td>
                        <td className="py-3 pl-8">{item?.empId}</td>
                        <td className="py-3 pl-8">{item?.first_name}</td>
                        <td className="py-3 pl-8">{item?.last_name}</td>
                        <td className="py-3 pl-8">{item?.email}</td>
                        <td className="py-3 pl-8">
                          {item?.worklocation?.map((location, index) => (
                            <span key={index}>{location?.city}</span>
                          ))}
                        </td>
                        <td className="py-3 pl-8 ">
                          {item?.deptname?.map((dept, index) => (
                            <span key={index}>{dept?.departmentName}</span>
                          ))}
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
          <DialogActions sx={{ justifyContent: "center" }}>
            <Tooltip title={"Please select the employee to sync"} arrow>
              <Button variant="contained" color="primary" onClick={handleSync}>
                Sync
              </Button>
            </Tooltip>
            <Tooltip title={"Cancel the button"} arrow>
              <Button color="error" variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
            </Tooltip>
          </DialogActions>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceBioModal;