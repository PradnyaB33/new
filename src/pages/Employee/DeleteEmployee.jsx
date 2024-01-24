import { Delete, Warning } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Container,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import { Menu, MenuItem } from "@mui/material";
import * as XLSX from "xlsx";
import { GetApp, Publish } from "@mui/icons-material";
import { Tooltip } from "@mui/material";
import { useParams } from "react-router-dom";

const DeleteEmployee = () => {
  const { handleAlert } = useContext(TestContext);
  const { setAppAlert, cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const queryClient = useQueryClient();
  const [nameSearch, setNameSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [availableEmployee, setAvailableEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [numbers, setNumbers] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [deleteMultiEmpConfirmation, setDeleteMultiEmpConfirmation] =
    useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showConfirmationExcel, setShowConfirmationExcel] = useState(false);
  const { organisationId } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  // pull the employee data
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

  // function for previous button , next button and current button
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

  // Delete Query for deleting single Employee
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    setAvailableEmployee((prevEmployees) =>
      prevEmployees.filter((employee) => employee._id !== id)
    );
    setDeleteConfirmation(null);
  };
  const deleteMutation = useMutation(
    (id) =>
      axios.delete(`${process.env.REACT_APP_API}/route/employee/delete/${id}`, {
        headers: {
          Authorization: authToken,
        },
      }),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("employee");
        handleAlert(true, "success", "Employee deleted succesfully");
      },
    }
  );

  // Delete Query for deleting Multiple Employee
  const handleEmployeeSelection = (id) => {
    const selectedIndex = selectedEmployees.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [...selectedEmployees, id];
    } else {
      newSelected = selectedEmployees.filter((employeeId) => employeeId !== id);
    }
    setSelectedEmployees(newSelected);
  };

  const handleDeleteMultiple = () => {
    // Check if any employees are selected
    if (selectedEmployees.length === 0) {
      handleAlert(true, "error", "Please select employees to delete");
      return;
    }
    // Display confirmation dialog for deleting multiple employees
    setDeleteMultiEmpConfirmation(true);
  };

  // Handle confirmation of deleting multiple employees
  const confirmDeleteMultiple = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/route/employee/delete-multiple`,
        {
          headers: {
            Authorization: authToken,
          },
          data: { ids: selectedEmployees },
        }
      );
      console.log(response);
      queryClient.invalidateQueries("employee");
      handleAlert(true, "success", "Employees deleted successfully");
      // Filter the available employees, removing the deleted ones
      setAvailableEmployee((prevEmployees) =>
        prevEmployees.filter(
          (employee) => !selectedEmployees.includes(employee._id)
        )
      );
      // Reset selectedEmployees after successful deletion
      setSelectedEmployees([]);
    } catch (error) {
      handleAlert(true, "error", "Failed to delete employees");
    } finally {
      setDeleteMultiEmpConfirmation(false);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // deleting the employee from excel sheet
  // generate excel sheet
  const generateExcel = () => {
    try {
      const wb = XLSX.utils.book_new();
      const wsData = [
        [
          "Employee Id",
          "First Name",
          "Last Name",
          "Email",
          "Phone Number",
          "Profile",
        ],
      ];
      // Add Employee information to the worksheet data
      availableEmployee.forEach((employee) => {
        wsData.push([
          employee._id, // Assuming _id is the Employee Id
          employee.first_name,
          employee.last_name,
          employee.email,
          employee.phone_number,
          employee.profile.join(", "), // Join profile array into a string
        ]);
      });
      // Create a worksheet and add data to workbook
      const ws = XLSX.utils.aoa_to_sheet(wsData);

      const columnWidths = [
        { wch: 30 }, // Employee Id
        { wch: 20 }, // First Name
        { wch: 20 }, // Last Name
        { wch: 35 }, // Email
        { wch: 15 }, // Phone Number
        { wch: 35 }, // Profile
      ];
      ws["!cols"] = columnWidths;
      XLSX.utils.book_append_sheet(wb, ws, "EmployeeSheet");
      // Save workbook to a file
      XLSX.writeFile(wb, "EmployeeDataTemplate.xlsx");
    } catch (error) {
      console.error("Error generating Excel:", error);
    }
  };

  const handleFileInputChange = (e) => {
    // Update the state with the selected file
    setSelectedFile(e.target.files[0]);
  };

  // delete query for deleting multiple employee from excel
  const handleDeleteFromExcel = async () => {
    try {
      const fileInput = document.getElementById("fileInput");
      const file = fileInput.files[0];
      if (!file) {
        console.error("Please upload an Excel file.");
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Please upload an Excel file.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = async function (e) {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const ws = workbook.Sheets["EmployeeSheet"];
          const deleteColumnIndex = XLSX.utils.decode_range(ws["!ref"]).e.c;

          if (deleteColumnIndex === undefined) {
            setAppAlert({
              alert: true,
              type: "error",
              msg: "Delete column not found in the Excel sheet.",
            });
            return;
          }

          const employeesToDelete = [];
          for (
            let row = 1;
            row <= XLSX.utils.decode_range(ws["!ref"]).e.r;
            row++
          ) {
            const deleteCommand =
              ws[XLSX.utils.encode_cell({ r: row, c: deleteColumnIndex })];
            if (
              deleteCommand &&
              deleteCommand.v &&
              deleteCommand.v.toLowerCase() === "delete"
            ) {
              const employeeIdToDelete =
                ws[XLSX.utils.encode_cell({ r: row, c: 0 })].v;

              const employeeToDelete = availableEmployee.find(
                (emp) => emp._id === employeeIdToDelete
              );
              if (employeeToDelete) {
                employeesToDelete.push(employeeToDelete);
              }
            }
          }

          if (employeesToDelete.length === 0) {
            setAppAlert({
              alert: true,
              type: "error",
              msg: "Failed to delete employee from Excel. Please try again.",
            });
            setShowConfirmationExcel(false);
            return;
          }

          for (const employee of employeesToDelete) {
            try {
              await axios.delete(
                `${process.env.REACT_APP_API}/route/employee/delete/${employee._id}`,
                { headers: { Authorization: authToken } }
              );

              setAvailableEmployee((prevEmployees) =>
                prevEmployees.filter((emp) => emp._id !== employee._id)
              );

              setAppAlert({
                alert: true,
                type: "success",
                msg: "Employee deleted from the Excel sheet!",
              });
            } catch (error) {
              console.error("Error deleting employee:", error);
              setAppAlert({
                alert: true,
                type: "error",
                msg: "Failed to delete employee from Excel. Please try again.",
              });
            }
          }
          handleClose();
          setShowConfirmationExcel(false);
        } catch (error) {
          console.error("Error processing Excel data:", error);
          setAppAlert({
            alert: true,
            type: "error",
            msg: "Error processing Excel data.",
          });
          setShowConfirmationExcel(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error handling Excel delete:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error handling Excel delete.",
      });
      setShowConfirmationExcel(false);
    }
  };

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center">
          <h1 className="text-lg pl-2 font-semibold text-center modal-title py-2">
            Delete Employee
          </h1>

          <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
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
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <Tooltip
                title={
                  <span>
                    To perform bulk deletion:
                    <ol>
                      <li>Generate an Excel file with employee data.</li>
                      <li>
                        Write "delete" in front of user IDs in the Excel sheet.
                      </li>
                      <li>Save the file and upload it.</li>
                      <li>
                        Click on the delete button to execute bulk deletion.
                      </li>
                    </ol>
                  </span>
                }
                arrow
              >
                <div>
                  <Button
                    className="!font-semibold !bg-sky-500 flex items-center gap-2"
                    variant="contained"
                    onClick={handleMenuClick}
                  >
                    Bulk Delete
                  </Button>
                </div>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={generateExcel}>
                  <GetApp style={{ color: "blue", marginRight: "20px" }} />{" "}
                  Generate Excel
                </MenuItem>
                <MenuItem>
                  <label
                    htmlFor="fileInput"
                    className="flex items-center gap-2"
                  >
                    <Publish style={{ color: "green", marginRight: "15px" }} />
                    <span>
                      {selectedFile ? selectedFile.name : "Choose File"}
                    </span>
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      id="fileInput"
                      className="w-full rounded opacity-0 absolute inset-0"
                      style={{ zIndex: -1 }}
                      onChange={handleFileInputChange}
                    />
                  </label>
                </MenuItem>

                <MenuItem onClick={() => setShowConfirmationExcel(true)}>
                  <Delete style={{ color: "red", marginRight: "25px" }} />
                  <span>Delete</span>
                </MenuItem>
              </Menu>
            </div>

            <div className="flex items-center gap-3">
              <Tooltip title="Check at least one checkbox to delete" arrow>
                <div>
                  <Button
                    className="!font-semibold !bg-sky-500 flex items-center gap-2"
                    variant="contained"
                    onClick={handleDeleteMultiple}
                  >
                    Delete
                  </Button>
                </div>
              </Tooltip>
            </div>
          </div>

          <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
            <table className="min-w-full bg-white text-left !text-sm font-light">
              <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                <tr className="!font-semibold">
                  <th scope="col" className="!text-left pl-8 py-3">
                    Employee Selection
                  </th>
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
                  <th scope="col" className="px-6 py-3">
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
                  .map((item, id) => (
                    <tr className="!font-medium border-b" key={id}>
                      <td className="!text-left pl-8 py-3">
                        <Checkbox
                          checked={selectedEmployees.indexOf(item._id) !== -1}
                          onChange={() => handleEmployeeSelection(item._id)}
                        />
                      </td>
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
                      <td className="py-3">{item.phone_number}</td>
                      <td className="whitespace-nowrap px-6 py-2">
                        <IconButton
                          onClick={() => handleDeleteConfirmation(item._id)}
                        >
                          <Delete className="!text-xl" color="error" />
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

      {/* this dialogue for deleting single employee */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle color={"error"}>
          <Warning color="error" /> All information of employee will be deleted.
          Are you sure you want to delete it?
        </DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this employee, as this action
            cannot be retrived
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(deleteConfirmation)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* This Dialogue for delting Multiple Employe */}
      <Dialog
        open={deleteMultiEmpConfirmation}
        onClose={() => setDeleteMultiEmpConfirmation(false)}
      >
        <DialogTitle color={"error"}>
          <Warning color="error" /> All information of employees will be
          deleted. Are you sure you want to delete it?
        </DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this selected employee, as
            this action cannot be retrived
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteMultiEmpConfirmation(false)}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={confirmDeleteMultiple}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* This Dialogue for delting Multiple Employe from excel sheet*/}
      <Dialog
        open={showConfirmationExcel}
        onClose={() => setShowConfirmationExcel(false)}
      >
        <DialogTitle color={"error"}>
          <Warning color="error" /> All information of employees will be
          deleted. Are you sure you want to delete it?
        </DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this employee, as this action
            cannot be retrived
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowConfirmationExcel(false)}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleDeleteFromExcel}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteEmployee;
