import {
  Button,
  Container,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import AttendanceBioModal from "../../components/Modal/AttedanceBioModal/AttendanceBioModal";

const EmpInfoPunchStatus = () => {
  const { organisationId } = useParams();
  const [tableData, setTableData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fileName, setFileName] = useState("");
  const itemsPerPage = 10;
  console.log(setTotalPages);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);
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
    const selectedEmployeeId = currentItems[index][0];
    const selectedEmployeeRecords = tableData.filter(
      (employee) => employee[0] === selectedEmployeeId
    );

    const allSelected = selectedEmployeeRecords.every((record) =>
      selectedEmployees.some((emp) => emp[0] === record[0])
    );

    if (allSelected) {
      const deselectedEmployees = selectedEmployees.filter(
        (emp) => emp[0] !== selectedEmployeeId
      );
      setSelectedEmployees(deselectedEmployees);
    } else {
      setSelectedEmployees((prevSelected) => [
        ...prevSelected,
        ...selectedEmployeeRecords,
      ]);
    }
  };

  console.log("selected employee", selectedEmployees);

  // for open the modal for display employee
  const [empModalOpen, setEmpModalOpen] = useState(false);
  const handleEmpModalOpen = () => {
    setEmpModalOpen(true);
  };
  const handleEmpModalClose = () => {
    setEmpModalOpen(false);
    setSelectedEmployees([]);
  };

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center">
          <Typography variant="h4" className="text-center pl-10 mb-6 mt-2">
            Employee’s Punch Sync
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
              <Tooltip title={fileName} arrow>
                <Button variant="contained" component="span">
                  {fileName ? fileName.substring(0, 10) + "..." : "Upload File"}
                </Button>
              </Tooltip>
            </label>
            <Tooltip title={"Sync the employee here"} arrow>
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
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <Tooltip title={"Search employee by employee name"} arrow>
                <TextField
                  placeholder="Search Employee Name...."
                  variant="outlined"
                  size="small"
                  sx={{ width: 300 }}
                  value={searchName}
                  onChange={handleSearchName}
                />
              </Tooltip>
            </div>
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <Tooltip title={"Search employee by employee id"} arrow>
                <TextField
                  placeholder="Search Employee ID...."
                  variant="outlined"
                  size="small"
                  sx={{ width: 300 }}
                  value={searchId}
                  onChange={handleSearchId}
                />
              </Tooltip>
            </div>
            <div className="flex items-center gap-3">
              <Tooltip title={"Search employee by employee department"} arrow>
                <TextField
                  placeholder="Search Department...."
                  variant="outlined"
                  size="small"
                  sx={{ width: 300 }}
                  value={searchDepartment}
                  onChange={handleSearchDepartment}
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
                {currentItems &&
                  currentItems?.length > 0 &&
                  currentItems?.map((row, index) => (
                    <tr key={index}>
                      <td className="!text-left pl-8 py-3">
                        <Tooltip title={"Select the employee"} arrow>
                          <input
                            type="checkbox"
                            checked={selectedEmployees.some(
                              (emp) => emp[0] === row[0]
                            )}
                            onChange={() => handleEmployeeSelect(index)}
                          />
                        </Tooltip>
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

          {/* Pagination */}

          <nav
            className="pagination"
            style={{
              textAlign: "center",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <Button
              onClick={prePage}
              disabled={currentPage === 1}
              variant="outlined"
              style={{ marginRight: "10px" }}
            >
              Prev
            </Button>
            {currentPage === 1 && (
              <Button
                onClick={() => paginate(2)}
                variant="outlined"
                style={{ marginRight: "10px" }}
              >
                Next
              </Button>
            )}
            {currentPage === 2 && (
              <Button
                onClick={() => paginate(1)}
                variant="outlined"
                style={{ marginRight: "10px" }}
              >
                1
              </Button>
            )}
            <Button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              variant="outlined"
            >
              Next
            </Button>
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
