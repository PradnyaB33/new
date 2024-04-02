import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button, Container, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import AttendanceBioModal from "../../components/Modal/AttedanceBioModal/AttendanceBioModal";

const EmpInfoPunchStatus = () => {
  const { organisationId } = useParams();
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const itemsPerPage = 10;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setTableData(
        parsedData.slice(2).map((row) => ({ ...row, selected: false }))
      );
    };

    reader.readAsBinaryString(file);
  };

  const handleSearchName = (e) => {
    setSearchName(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchId = (e) => {
    setSearchId(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchDepartment = (e) => {
    setSearchDepartment(e.target.value);
    setCurrentPage(1);
  };

  // Filter data based on search criteria
  const filteredData = tableData.filter((row) => {
    return (
      row[1].toLowerCase().includes(searchName.toLowerCase()) &&
      row[0].toLowerCase().includes(searchId.toLowerCase()) &&
      row[2].toLowerCase().includes(searchDepartment.toLowerCase())
    );
  });

  // Calculate indexes of the items to display based on current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prePage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleEmployeeSelect = (index) => {
    const updatedEmployees = [...selectedEmployees];
    updatedEmployees[index] = {
      ...currentItems[index],
      selected: !currentItems[index].selected,
    };
    setSelectedEmployees(updatedEmployees.filter((employee) => employee));
  };

  console.log("selected employee", selectedEmployees);

  // for open the modal for display employee
  const [empModalOpen, setEmpModalOpen] = useState(false);
  const handleEmpModalOpen = () => {
    setEmpModalOpen(true);
  };
  const handleEmpModalClose = () => {
    setEmpModalOpen(false);
  };

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center">
          <Typography variant="h4" className="text-center pl-10 mb-6 mt-2">
            Attendance Management
          </Typography>
          <p className="text-xs text-gray-600 pl-10 text-center">
            Track the attendance of employees here by using the sync button.
          </p>

          <div className="flex items-center justify-center mt-4 gap-5">
            <label htmlFor="file-upload">
              <input
                style={{ display: "none" }}
                id="file-upload"
                type="file"
                accept=".xls,.xlsx"
                onChange={handleFileUpload}
              />
              <Button variant="contained" component="span">
                Upload File
              </Button>
            </label>
            <Button
              variant="contained"
              component="span"
              onClick={handleEmpModalOpen}
            >
              Sync
            </Button>
          </div>

          <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <TextField
                placeholder="Search Employee Name...."
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
                value={searchName}
                onChange={handleSearchName}
              />
            </div>
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <TextField
                placeholder="Search Employee ID...."
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
                value={searchId}
                onChange={handleSearchId}
              />
            </div>
            <div className="flex items-center gap-3">
              <TextField
                placeholder="Search Department...."
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
                value={searchDepartment}
                onChange={handleSearchDepartment}
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
                    Employee ID
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    First Name
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Department
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Date
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Punch Time
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Punch State
                  </th>
                  <th scope="col" className="!text-left pl-8 py-3">
                    Area
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row, index) => (
                  <tr key={index}>
                    <td className="!text-left pl-8 py-3">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.some(
                          (emp) => emp[0] === row[0]
                        )}
                        onChange={() => handleEmployeeSelect(index)}
                      />
                    </td>
                    <td className="!text-left pl-8 py-3">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-3 pl-8">{row[0]}</td>
                    <td className="py-3 pl-8">{row[1]}</td>
                    <td className="py-3 pl-8">{row[2]}</td>
                    <td className="py-3 pl-8">{row[3]}</td>
                    <td className="py-3 pl-8">{row[4]}</td>
                    <td className="py-3 pl-8">{row[5]}</td>
                    <td className="py-3 pl-8">{row[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
              </li>
              {/* Map through page numbers and generate pagination */}
              {Array.from(
                { length: Math.ceil(filteredData.length / itemsPerPage) },
                (_, i) => i + 1
              ).map((n, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === n ? "active" : ""}`}
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
                    }}
                    className="page-link"
                    onClick={() => paginate(n)}
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
                  disabled={
                    currentPage ===
                    Math.ceil(filteredData.length / itemsPerPage)
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
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

export default EmpInfoPunchStatus;
