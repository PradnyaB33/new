import { Container, Typography , TextField, IconButton } from "@mui/material";
import axios from "axios";
import React, { useContext , useState,} from "react";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery } from "react-query";
import ViewAttendanceCallModal from "../../components/Modal/ViewAttendanceCalModal/ViewAttendanceCalModal";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const ViewCalculateAttendance = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();
  const [emailSearch, setEmailSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [numbers, setNumbers] = useState([]);
  console.log(setTotalPages);
  console.log(setNumbers);
  // For Get Query
  const { data: calculateAttendanceData,  } = useQuery(
    ["calculateAttendanceData", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-punching-info`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );
   
  

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const changePage = (id) => {
    setCurrentPage(id);
  }; 

   // for open the modal for display employee
   const [empModalOpen, setEmpModalOpen] = useState(false);
   const [employee, setEmployee] = useState();
   const handleEmpModalOpen = (employee) => {
     setEmployee(employee)
     setEmpModalOpen(true);
   };
   const handleEmpModalClose = () => {
     setEmpModalOpen(false);
     setEmployee();
    
   };
 

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center">
          <Typography variant="h4" className="text-center pl-10 mb-6 mt-2">
          Employee’s Calendar View
          </Typography>
          <p className="text-xs text-gray-600 pl-10 text-center">
            View  the attendance of employees here.
          </p>

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
                    Sr. No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Employee Id
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Employee Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                  Employee Email
                  </th>  
                  <th scope="col" className="!text-left pl-8 py-3">
                    Action
                  </th>  
                </tr>
              </thead>
              <tbody>
                {calculateAttendanceData?.filter((item) => {
                  return (
                    !emailSearch.toLowerCase() ||
                    (item?.EmployeeId?.email !== null &&
                      item?.EmployeeId?.email !== undefined &&
                      item?.EmployeeId?.email.toLowerCase().includes(emailSearch))
                  );
                }).map((item, id) => (
                  <tr className="!font-medium border-b" key={id}>
                    <td className="!text-left pl-8 py-3">{id + 1}</td>
                    <td className="py-3 pl-6">{item?.EmployeeId?.empId || ""}</td>
                    <td className="py-3 pl-6">{item?.EmployeeId?.first_name || ""}</td>
                    <td className="py-3 pl-6">{item?.EmployeeId?.email || ""}</td>
                    <td className="!text-left pl-6 py-3">
                      <IconButton aria-label="view" size="small" onClick={() => {
                          handleEmpModalOpen(item);
                           }}>
                        <CalendarMonthIcon sx={{ color: 'green' }} />
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
      </Container> 

      <ViewAttendanceCallModal
        handleClose={handleEmpModalClose}
        open={empModalOpen}
        employee = {employee}
      />
    </>
  );
};

export default ViewCalculateAttendance;