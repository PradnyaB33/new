import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Container, IconButton, TextField, Typography , Tooltip } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
 import EditModelOpen from "../../components/Modal/EditEmployeeModal/EditEmployeeModel";
const EmployeeListToRole = () => {
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

  console.log(availableEmployee, "avialabel days");

  
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
    }
  };

  useEffect(() => {
    fetchAvailableEmployee(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  

  console.log(availableEmployee);

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

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [employeeId, setemployeeId] = useState(null);

  const handleEditModalOpen = (employeeId) => {
    setEditModalOpen(true);
    setemployeeId(employeeId);
  };

  const handleClose = () => {
    setemployeeId(null);
    setEditModalOpen(false);
  };

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center">
          <Typography variant="h4" className=" text-center pl-10  mb-6 mt-2">
          Employee List
          </Typography>
          <p className="text-xs text-gray-600 pl-10 text-center">
            Edit employee data here by using edit button.      
          </p>

          <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex items-center gap-3 mb-3 md:mb-0">
            <Tooltip title="No employees found" placement="top" open={availableEmployee.length < 1 && nameSearch !== ''}>
            <TextField
            onChange={(e) => setNameSearch(e.target.value)}
            placeholder="Search Employee Name...."
            variant="outlined"
            size="small"
            sx={{ width: 300 }}
           />
          </Tooltip>
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

          <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
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
                 
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
  {availableEmployee.length > 0 ? (
    availableEmployee
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
      .map((item, id) => (
        <tr className="!font-medium border-b" key={id}>
          <td className="!text-left pl-8 py-3">{id + 1}</td>
          <td className="py-3 pl-8">{item?.first_name}</td>
          <td className="py-3 pl-8">{item?.last_name}</td>
          <td className="py-3 pl-8">{item?.email}</td>
          <td className="py-3 pl-8">{item?.empId}</td>
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
          <td className="whitespace-nowrap px-6 py-2">
            <IconButton
              color="primary"
              aria-label="edit"
              onClick={() => handleEditModalOpen(item._id)}
            >
              <EditOutlinedIcon />
            </IconButton>
          </td>
        </tr>
      ))
  ) : (
    <tr>
      <td colSpan="8" className="text-center py-3">
        No results found.
      </td>
    </tr>
  )}
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
        </article>
      </Container>

      {/* edit model */}
      <EditModelOpen
        handleClose={handleClose}
        open={editModalOpen}
        employeeId={employeeId}
        organisationId={organisationId}
      />
    </>
  );
};

export default EmployeeListToRole;
