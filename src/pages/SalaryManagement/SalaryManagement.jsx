import {
  Button,
  Container,
  TextField,
  IconButton,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import CreateSalaryModel from "../../components/Modal/CreateSalaryModel/CreateSalaryModel";
import ChallanModal from "./components/ChallanModal";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteSalaryModal from "../../components/Modal/CreateSalaryModel/DeleteSalaryModal";

const SalaryManagement = () => {
  // state
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [nameSearch, setNameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [availableEmployee, setAvailableEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { organisationId } = useParams();
  const [incomeValues, setIncomeValues] = useState([]);
  const [deductionsValues, setDeductionsValues] = useState([]);

  // get query for fetch the employee
  const fetchAvailableEmployee = async (page) => {
    try {
      const apiUrl = `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${page}&nameSearch=${nameSearch}&deptSearch=${deptSearch}&locationSearch=${locationSearch}`;
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: authToken,
        },
      });
      setAvailableEmployee(response.data.employees);
      setCurrentPage(page);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.log(error);
      handleAlert(true, "error", "Failed to Fetch Employee");
    }
  };

  useEffect(() => {
    fetchAvailableEmployee(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // modal for create salary
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const handleCreateModalOpen = (id) => {
    setCreateModalOpen(true);
    setEmployeeId(id);
  };

  const handleClose = () => {
    setCreateModalOpen(false);
    setEmployeeId(null);
    setIncomeValues([]);
    setDeductionsValues([]);
  };

  // modal for delete salary component
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const handleDeleteModalOpen = (id) => {
    setDeleteModalOpen(true);
    setEmployeeId(id);
  };
  const handlDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setEmployeeId(null);
  };

  const [openChallanModal, setOpenChallanModal] = useState(false);
  const handleChallanModalClose = () => {
    setOpenChallanModal(false);
  };

  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className=" bg-white w-full h-max shadow-md rounded-sm border items-center">
          <h1 className="text-lg pl-2 font-semibold text-center modal-title py-2">
            Salary Management
          </h1>
          <p className="text-xs text-gray-600 text-center">
            Create and calculate the salary of your employee here.
          </p>
          <div className="flex w-full justify-center my-2 items-center">
            <Button
              onClick={() => setOpenChallanModal(true)}
              variant="contained"
            >
              Generate Challan
            </Button>
          </div>

          <ChallanModal
            open={openChallanModal}
            handleClose={handleChallanModalClose}
            id={organisationId}
          />

          <div className="p-4 border-b-[.5px] flex flex-col md:flex-row items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <TextField
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder="Search Employee Name...."
                variant="outlined"
                size="small"
                sx={{ width: 300 }}
              />
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

          <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
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
                  <th scope="col" className="!text-left pl-8 py-3">
                    Salary Template
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Manage Salary
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody>
                {availableEmployee.length > 0 &&
                  availableEmployee
                    .filter((item) => {
                      return (
                        (!nameSearch.toLowerCase() ||
                          (item.first_name !== null &&
                            item.first_name !== undefined &&
                            item.first_name
                              .toLowerCase()
                              .includes(nameSearch.toLowerCase()))) &&
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
                              location.city
                                .toLowerCase()
                                .includes(locationSearch)
                          ))
                      );
                    })
                    ?.map((item, id) => (
                      <tr className="!font-medium border-b" key={id}>
                        <td className="!text-left pl-8 py-3">{id + 1}</td>
                        <td className="py-3 pl-8">{item?.first_name}</td>
                        <td className="py-3 pl-8 ">{item?.last_name}</td>
                        <td className="py-3 pl-8">{item?.email}</td>
                        <td className="py-3 pl-8">{item?.empId}</td>
                        <td className="py-3 pl-8">
                          {item?.worklocation?.map((location, index) => (
                            <span key={index}>{location?.city}</span>
                          ))}
                        </td>
                        <td className="py-3 pl-9">
                          {item?.deptname?.map((dept, index) => {
                            return (
                              <span key={index}>{dept?.departmentName}</span>
                            );
                          })}
                        </td>
                        <td className="py-3 pl-9">
                          {item?.salarystructure?.name}
                        </td>
                        <td className="py-3 pl-4">
                          <button
                            type="submit"
                            onClick={() => handleCreateModalOpen(item._id)}
                            className="flex group justify-center gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
                          >
                            Manage Salary
                          </button>
                        </td>
                        <td className="py-3 pl-4">
                          <IconButton
                            color="error"
                            aria-label="delete"
                            onClick={() => handleDeleteModalOpen(item._id)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {/* Pagination */}
            <Stack
              direction={"row"}
              className="border-[.5px] border-gray-200 bg-white border-t-0 px-4 py-2 h-full items-center w-full justify-between"
            >
              <div>
                <Typography variant="body2">
                  Showing page {currentPage} of {totalPages} pages
                </Typography>
              </div>
              <Pagination
                count={totalPages}
                page={currentPage}
                color="primary"
                shape="rounded"
                onChange={(event, value) => setCurrentPage(value)}
              />
            </Stack>
          </div>
        </article>
      </Container>

      {/* for create the salary modal */}
      <CreateSalaryModel
        id={organisationId}
        open={createModalOpen}
        handleClose={handleClose}
        empId={employeeId}
        incomeValues={incomeValues}
        setIncomeValues={setIncomeValues}
        deductionsValues={deductionsValues}
        setDeductionsValues={setDeductionsValues}
      />

      {/* delete salary modal */}
      <DeleteSalaryModal
        id={organisationId}
        open={deleteModalOpen}
        handleClose={handlDeleteModalClose}
        empId={employeeId}
      />
    </>
  );
};

export default SalaryManagement;
