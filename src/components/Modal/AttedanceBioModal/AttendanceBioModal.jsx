import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AttendanceBioModal = ({
  handleClose,
  open,
  organisationId,
  handleSync,
}) => {
  const [emailSearch, setEmailSearch] = useState("");
  const [availableEmployee, setAvailableEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  console.log(
    `🚀 ~ file: AttendanceBioModal.jsx:22 ~ setCurrentPage:`,
    setCurrentPage
  );
  const [totalPages, setTotalPages] = useState(1);
  const [numbers, setNumbers] = useState([]);
  const [checkedEmployees, setCheckedEmployees] = useState([]);

  useEffect(() => {
    fetchAvailableEmployee(currentPage);
    // eslint-disable-next-line
  }, [currentPage]);

  const fetchAvailableEmployee = async (page) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${page}`
      );
      setAvailableEmployee(response.data.employees);
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

  const handleEmployeeSelect = (employeeId) => {
    const isChecked = checkedEmployees.includes(employeeId);
    if (isChecked) {
      setCheckedEmployees(checkedEmployees.filter((id) => id !== employeeId));
    } else {
      setCheckedEmployees([...checkedEmployees, employeeId]);
    }
  };

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

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "1000px!important",
          height: "100%",
          maxHeight: "80vh!important",
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
          <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center">
            <Typography variant="h4" className="text-center pl-10 mb-6 mt-2">
              Employee
            </Typography>

            <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
              <div className="flex items-center gap-3 mb-3 md:mb-0">
                <TextField
                  onChange={(e) => setEmailSearch(e.target.value)}
                  placeholder="Search Email...."
                  variant="outlined"
                  size="small"
                  sx={{ width: 300 }}
                />
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
                  {availableEmployee
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
                          <input
                            type="checkbox"
                            onChange={() => handleEmployeeSelect(item.id)}
                            checked={checkedEmployees.includes(item.id)}
                          />
                        </td>
                        <td className="!text-left pl-8 py-3">{id + 1}</td>
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
                      className={`page-item ${
                        currentPage === n ? "active" : ""
                      }`}
                      style={{
                        display: "inline-block",
                        marginRight: "5px",
                      }}
                    >
                      <button
                        style={{
                          color: currentPage === n ? "#fff" : "#007bff",
                          backgroundColor:
                            currentPage === n ? "#007bff" : "transparent",
                          padding: "8px 12px",
                          border: "1px solid #007bff",
                          textDecoration: "none",
                          borderRadius: "4px",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        className="page-link"
                        onClick={() => changePage(n)}
                      >
                        {n}
                      </button>
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
              <Button color="error" variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSync(checkedEmployees)}
              >
                Sync
              </Button>
            </DialogActions>
          </article>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceBioModal;
