import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  IconButton,
  TextField,
  Typography,
  Pagination,
  Stack,
  Grid,
  Box,
  PaginationItem,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button
} from "@mui/material";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { TestContext } from "../../State/Function/Main";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";

const EmployeeListToRole = ({ organisationId }) => {

  const csvTemplateData = [
    { empId: "", first_name: "", last_name: "", email: "", password: "" },
  ];

  const csvHeaders = [
    { label: "empId", key: "empId" },
    { label: "first_name", key: "first_name" },
    { label: "last_name", key: "last_name" },
    { label: "email", key: "email" },
    { label: "password", key: "password" },
    { label: "date_of_birth", key: "date_of_birth" },
    { label: "phone_number", key: "phone_number" },
    { label: "address", key: "address" },
    { label: "gender", key: "gender" },
    { label: "adhar_card_number", key: "adhar_card_number" },
    { label: "pan_card_number", key: "pan_card_number" },
    { label: "bank_account_no", key: "bank_account_no" },
    { label: "citizenship", key: "citizenship" },
  ];

  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  const orgId = useParams().organisationId;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { setAppAlert } = useContext(UseContext);

  const [org, setOrg] = useState();
  const [members, setMembers] = useState();
  const [nameSearch, setNameSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [excelConfirmation, setExcelConfirmation] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/get/${orgId}`
      );
      setOrg(resp.data.organizations);
    })();
  }, [orgId]);

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/getmembers/${orgId}`
      );
      setMembers(resp.data.members);
    })();
  }, [orgId]);

  // Fetch function to get paginated employees
  const fetchAvailableEmployee = async (organisationId, authToken, page) => {
    const apiUrl = `${process.env.REACT_APP_API}/route/employee/get-paginated-emloyee/${organisationId}?page=${page}&nameSearch=${nameSearch}&deptSearch=${deptSearch}&locationSearch=${locationSearch}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: authToken,
      },
    });
    return response.data;
  };

  // Use React Query to fetch employee data
  const { data } = useQuery(
    ["employees", organisationId, currentPage],
    () => fetchAvailableEmployee(organisationId, authToken, currentPage),
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  );

  const totalPages = data?.totalPages || 1;
  const availableEmployee1 = data?.employees || [];

  // to navigate to other component
  const handleEditClick = (empId) => {
    navigate(`/organisation/${organisationId}/edit-employee/${empId}`);
  };

  const handleAddEmployee = () => {
    navigate(`/organisation/${organisationId}/employee-onboarding`);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
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
        queryClient.invalidateQueries("employees");
        handleAlert(true, "success", "Employee deleted succesfully");

      },
    }
  );

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    queryClient.invalidateQueries("employee");
    setDeleteConfirmation(null);
  };

  const handleExcelConfirmation = () => {
    setExcelConfirmation();
  };

  const handleExcelCloseConfirmation = () => {
    setExcelConfirmation(null);
  };
  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleFileUpload = async (e) => {
    // setIsLoading(true);
    const file = e.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(fileExtension)) {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Only Excel files are allowed",
      });
      // setIsLoading(false);
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      worksheet["!cols"] = [
        { wch: 30 },
        { wch: 40 },
        { wch: 30 },
        { wch: 30 },
        { wch: 30 },
      ];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      console.log("JSON Data:", jsonData);

      const finalData = jsonData.map((data) => {
        const isoDate = convertToISOFormat(data.date_of_birth);
        console.log(
          "Original Date:",
          data.date_of_birth,
          "Converted ISO Date:",
          isoDate
        );

        return {
          empId: data.empId,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: data.password,
          organizationId: orgId,
          date_of_birth: isoDate,
          phone_number: data.phone_number,
          address: data.address,
          gender: data.gender,
          adhar_card_number: data.adhar_card_number,
          pan_card_number: data.pan_card_number,
          bank_account_no: data.bank_account_no,
          citizenship: data.citizenship,
        };
      });

      console.log("Final Data:", finalData);


      const validEmployees = [];

      for (const employee of finalData) {
        // Validation for PAN and Aadhar card
        if (!isValidPanCard(employee.pan_card_number)) {
          setAppAlert({
            alert: true,
            type: "error",
            msg: `Invalid PAN card format for employee no ${employee.empId}`,
          });
          continue;
        }

        if (!isValidAadharCard(employee.adhar_card_number)) {
          setAppAlert({
            alert: true,
            type: "error",
            msg: `Invalid Aadhar card format for employee no ${employee.empId}`,
          });
          continue;
        }

        // If validations pass, add the employee to the validEmployees array
        validEmployees.push(employee);
      }

      if (validEmployees.length > 0) {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API}/route/employee/add-employee-excel`, // Adjusted endpoint
            validEmployees,
            {
              headers: {
                Authorization: authToken,
              },
            }
          );
          console.log(`${response.data.message}`);
          setAppAlert({
            alert: true,
            type: "success",
            msg: response.data.message,
          });

        } catch (error) {
          console.error("Error posting employees:", error);
          setAppAlert({
            alert: true,
            type: "error",
            msg: error.response?.data?.message || "An error occurred while posting employees.",
          });
        }
      } else {
        setAppAlert({
          alert: true,
          type: "warning",
          msg: "No valid employees to submit.",
        });
      }







      // for (const employee of finalData) {
      //   // Validation for PAN and Aadhar card
      //   if (!isValidPanCard(employee.pan_card_number)) {
      //     setAppAlert({
      //       alert: true,
      //       type: "error",
      //       msg: `Invalid PAN card format for employee no ${employee.empId}`,
      //     });
      //     continue;
      //   }

      //   if (!isValidAadharCard(employee.adhar_card_number)) {
      //     setAppAlert({
      //       alert: true,
      //       type: "error",
      //       msg: `Invalid Aadhar card format for employee no ${employee.empId}`,
      //     });
      //     continue;
      //   }

      //   try {
      //     await axios.post(
      //       `${process.env.REACT_APP_API}/route/employee/add-employee`,
      //       employee,
      //       {
      //         headers: {
      //           Authorization: authToken,
      //         },
      //       }
      //     );
      //     console.log(`Employee ${employee.empId} posted successfully`);
      //   } catch (error) {
      //     console.error(`Error posting employee ${employee.empId}:`, error);
      //     setAppAlert({
      //       alert: true,
      //       type: "error",
      //       msg: error.response.data.message,
      //     });
      //   }
      // }

      // Clear file input value to allow re-uploading the same file
      fileInputRef.current.value = null;

      // setIsLoading(false);
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Onboarding Process Completed",
      });
      // window.location.reload();

    };

    reader.readAsBinaryString(file);
  };

  const isValidPanCard = (panCard) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panCard);
  const isValidAadharCard = (aadharCard) => /^\d{12}$/.test(aadharCard);

  const convertExcelSerialDateToISO = (serialDate) => {
    // Excel uses a base date of December 30, 1899
    const excelBaseDate = new Date(Date.UTC(1899, 11, 30));
    // Excel serial dates count days from this base date
    const date = new Date(
      excelBaseDate.getTime() + serialDate * 24 * 60 * 60 * 1000
    );
    // Ensure that the date is in the correct format without time component
    return date.toISOString().split("T")[0];
  };

  const convertToISOFormat = (dateStr) => {
    if (!isNaN(dateStr)) {
      return convertExcelSerialDateToISO(Number(dateStr));
    }

    const dateStrString = String(dateStr).trim();
    const match = dateStrString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (match) {
      const [, month, day, year] = match.map(Number);
      // JavaScript Date months are 0-indexed, so subtract 1 from month
      const date = new Date(Date.UTC(year, month - 1, day));
      // Format to ISO (yyyy-mm-dd) and ensure no time component is included
      return date.toISOString().split("T")[0];
    } else {
      console.error(
        "Invalid date format. Expected mm/dd/yyyy or Excel serial date. Received:",
        dateStr
      );
      return null;
    }
  };

  return (
    <>
      <BoxComponent>
        <HeadingOneLineInfo heading="Employees" info="Select and Manage Your Employee list" />
        <Grid container lg={12} sx={{ mt: 1 }}>
          <Grid item lg={2} sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', bgcolor: "white", p: "5px", borderRadius: "5%", mr: 2 }}>
            <p className="font-semibold text-gray-500 text-md">Onboarding Limit</p>
            <span>{org?.memberCount}</span>
          </Grid>
          <Grid item lg={2} sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', bgcolor: "white", p: "5px", borderRadius: "5%", mr: 2 }}>
            <p className="font-semibold text-gray-500 text-md">Current Employee</p>
            <span>{members?.length}</span>
          </Grid>
          <Grid item lg={2} sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', bgcolor: "white", p: "5px", borderRadius: "5%" }}>
            <p className="font-semibold text-gray-500 text-md">Vacancy</p>
            <span>{org?.memberCount - (members?.length || 0)}</span>
          </Grid>
        </Grid>

        <Grid container spacing={2} lg={12} sx={{ my: 1, justifyContent: "space-between" }}>
          <Grid container item spacing={2} lg={6} sx={{ flexGrow: 1 }}>
            <Grid item lg={4}>
              <TextField
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder="Search Employee"
                variant="outlined"
                size="small"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid item lg={4}>
              <TextField
                onChange={(e) => setDeptSearch(e.target.value)}
                placeholder="Search Department"
                variant="outlined"
                size="small"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid item lg={4}>
              <TextField
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Search Location"
                variant="outlined"
                size="small"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
          </Grid>

          <Grid container item spacing={2} lg={6} sx={{ justifyContent: "flex-end" }}>
            <Grid item lg={5}>
              <button
                type="button"
                className="w-full p-2 px-3 bg-[#008000] shadow-md rounded-md font-semibold text-white"
                onClick={handleExcelConfirmation}
              >
                Excel Onboarding
              </button>
            </Grid>
            <Grid item lg={5}>
              <button
                type="button"
                className="w-full p-2 px-3 bg-[#1514FE] shadow-md rounded-md font-semibold text-white"
                onClick={() => handleAddEmployee()}
              >
                Add Employee
              </button>
            </Grid>
          </Grid>
        </Grid>
        <Box>
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
                {availableEmployee1.length > 0 &&
                  availableEmployee1
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
                              location.city
                                .toLowerCase()
                                .includes(locationSearch)
                          ))
                      );
                    })
                    .map((item, id) => (
                      <tr className="!font-medium border-b" key={id}>
                        <td className="!text-left pl-8 py-1">{id + 1}</td>
                        <td className="py-1 pl-8">{item?.first_name}</td>
                        <td className="py-1 pl-8">{item?.last_name}</td>
                        <td className="py-1 pl-8">{item?.email}</td>
                        <td className="py-1 pl-8">{item?.empId}</td>
                        <td className="py-1 pl-8">
                          {item?.worklocation?.map((location, index) => (
                            <span key={index}>{location?.city}</span>
                          ))}
                        </td>
                        <td className="py-1 pl-8 ">
                          {item?.deptname?.map((dept, index) => (
                            <span key={index}>{dept?.departmentName}</span>
                          ))}
                        </td>
                        <td className="whitespace-nowrap px-6 py-1">
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            onClick={() => handleEditClick(item._id)}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            aria-label="delete"
                            onClick={() => handleDeleteConfirmation(item?._id)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {/* Pagination */}
            {/* <Stack
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
            </Stack> */}
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
                siblingCount={0}
                boundaryCount={0}
                hidePrevButton={currentPage === 1}
                hideNextButton={currentPage === totalPages}
                onChange={(event, value) => setCurrentPage(value)}
                renderItem={(item) => (
                  <PaginationItem
                    {...item}
                    components={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                  />
                )}
              />
            </Stack>
          </div>
        </Box>
      </BoxComponent>
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this employee, as this action
            cannot be undone.
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

      {/* excel */}


      <Dialog open={excelConfirmation !== null} onClose={handleExcelConfirmation}>
        <DialogTitle>Excel Onboarding</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You can onboard employees efficiently by downloading the template,
            filling in the employee data, and uploading the completed Excel
            sheet below.
          </Typography>
          <Typography variant="h6" gutterBottom>
            Upload Excel file to generate employee
          </Typography>

          {/* Input field directly visible for file upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginBottom: '20px',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />

          {/* Show uploaded file name */}
          {uploadedFileName && (
            <Typography className="text-center text-sm text-gray-600">
              Uploaded File: {uploadedFileName}
            </Typography>
          )}

          {/* CSV Download Button */}
          <CSVLink
            data={csvTemplateData}
            headers={csvHeaders}
            filename="employee_onboard_template.csv"
            style={{ BorderBottom: "1px solid grey" }}
          >

            Click to Download CSV Template

          </CSVLink>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleExcelCloseConfirmation} variant="outlined" color="primary" size="small">
            Cancel
          </Button>
          <Button variant="contained" size="small">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
};

export default EmployeeListToRole;

