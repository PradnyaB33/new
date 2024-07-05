import {
  Button,
  Container,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { TestContext } from "../../State/Function/Main";
import AttendanceBioModal from "../../components/Modal/AttedanceBioModal/AttendanceBioModal";
import Info from "@mui/icons-material/Info";

const EmpInfoPunchStatus = () => {
  const { organisationId } = useParams();
  const { handleAlert } = useContext(TestContext);
  const [tableData, setTableData] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const itemsPerPage = 10;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFileName("");
      setTableData([]);
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    setLoading(true); // Set loading to true when file upload starts

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setTableData(
        parsedData.slice(2).map((row) => ({ ...row, selected: false }))
      );
      setLoading(false); // Set loading to false once data is parsed
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

  const filteredData = tableData.filter((row) => {
    return (
      row?.[1]?.toLowerCase()?.includes(searchName?.toLowerCase() ?? "") &&
      row?.[0]?.toLowerCase()?.includes(searchId?.toLowerCase() ?? "") &&
      row?.[2]?.toLowerCase()?.includes(searchDepartment?.toLowerCase() ?? "")
    );
  });

  useEffect(() => {
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
  }, [filteredData.length]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

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

  const [empModalOpen, setEmpModalOpen] = useState(false);
  const handleEmpModalOpen = () => {
    if (selectedEmployees.length === 0) {
      handleAlert(false, "error", "Please check the employee before syncing.");
    } else {
      setEmpModalOpen(true);
    }
  };

  const handleEmpModalClose = () => {
    setEmpModalOpen(false);
    setSelectedEmployees([]);
  };

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className=" bg-white w-full h-max shadow-md rounded-sm border items-center">
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

          {fileName === "" && (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">
                  Please select the file.
                </h1>
              </article>
              <p>File not found.</p>
            </section>
          )}

          {!loading && fileName !== "" && (
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-200 border-b-2 border-gray-300">
                    <th className="!text-left pl-8 py-3">
                      <Tooltip title={"Select the employee"} arrow>
                        <input
                          type="checkbox"
                          disabled={true}
                          style={{ cursor: "default" }}
                        />
                      </Tooltip>
                    </th>
                    <th className="!text-left pl-8 py-3">Sr No.</th>
                    <th className="py-3 pl-8">Employee ID</th>
                    <th className="py-3 pl-8">Name</th>
                    <th className="py-3 pl-8">Department</th>
                    <th className="py-3 pl-8">Date</th>
                    <th className="py-3 pl-8">Day</th>
                    <th className="py-3 pl-8">In Time</th>
                    <th className="py-3 pl-8">Out Time</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((row, index) => (
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
          )}

          {loading && (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">Loading...</h1>
              </article>
              <p>Data is loading.</p>
            </section>
          )}
        </article>
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
            marginBottom: "20px",
          }}
        >
          <ul className="pagination" style={{ display: "inline-block" }}>
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
            {paginationNumbers.map((n, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === n ? "active" : ""}`}
                style={{
                  display: "inline-block",
                  marginRight: "5px",
                }}
              >
                {n === "..." ? (
                  <span
                    style={{
                      color: "#007bff",
                      padding: "8px 12px",
                      border: "1px solid transparent",
                      textDecoration: "none",
                      borderRadius: "4px",
                      transition: "all 0.3s ease",
                      cursor: "default",
                    }}
                  >
                    ...
                  </span>
                ) : (
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
                )}
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
