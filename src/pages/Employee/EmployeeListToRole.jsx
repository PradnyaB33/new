import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Pagination,
  PaginationItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import BasicButton from "../../components/BasicButton";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import Card from "../peformance/components/Card";

import { LuUpload } from "react-icons/lu";
import UserProfile from "../../hooks/UserData/useUser";

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
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
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
  const [file, setFile] = useState(null);

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

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(fileExtension)) {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Only Excel files are allowed",
      });
      return;
    }

    setUploadedFileName(selectedFile.name);
    setFile(selectedFile);
    console.log(`🚀 ~ selectedFile:`, selectedFile);
  };

  const handleSubmit = async () => {
    // if (!file) {
    //   setAppAlert({
    //     alert: true,
    //     type: "error",
    //     msg: "No file selected",
    //   });
    //   return;
    // }

    console.log("File:", file);

    const reader = new FileReader();

    reader.onload = async (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      console.log("running:", file);
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
        console.log(`🚀 ~ employee:`, employee);
        // Validation for PAN and Aadhar card
        // if (!isValidPanCard(employee.pan_card_number)) {
        //   setAppAlert({
        //     alert: true,
        //     type: "error",
        //     msg: `Invalid PAN card format for employee no ${employee.empId}`,
        //   });
        //   continue;
        // }

        // if (!isValidAadharCard(employee.adhar_card_number)) {
        //   setAppAlert({
        //     alert: true,
        //     type: "error",
        //     msg: `Invalid Aadhar card format for employee no ${employee.empId}`,
        //   });
        //   continue;
        // }

        // If validations pass, add the employee to the validEmployees array
        validEmployees.push(employee);
      }

      console.log("validEmployees", validEmployees);

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

          handleExcelCloseConfirmation();
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
            msg:
              error.response?.data?.message ||
              "An error occurred while posting employees.",
          });
        }
      } else {
        setAppAlert({
          alert: true,
          type: "warning",
          msg: "No valid employees to submit.",
        });
        setExcelConfirmation(null);
      }

      // Clear file input value to allow re-uploading the same file
      fileInputRef.current.value = null;

      setAppAlert({
        alert: true,
        type: "success",
        msg: "Onboarding Process Completed",
      });
    };

    reader.readAsBinaryString(file);
  };

  // const isValidPanCard = (panCard) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panCard);
  // const isValidAadharCard = (aadharCard) => /^\d{12}$/.test(aadharCard);

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
        <HeadingOneLineInfo
          heading="Employees"
          info={
            role === "Employee" ||
              role === "Department-Admin" ||
              role === "Delegate-Department-Admin" ||
              role === "Accountant" ||
              role === "Delegate-Accountant" ||
              role === "Manager"
              ? "Here you can see employee list"
              : "Select and Manage Your Employee list"
          }
        />
        {role === "Employee" ||
          role === "Department-Admin" ||
          role === "Delegate-Department-Admin" ||
          role === "Accountant" ||
          role === "Delegate-Accountant" ||
          role === "Manager" ? null : (
          <Grid className="flex   gap-8">
            <Card title={"Onboarding Limit"} data={org?.memberCount} />
            <Card title={"Current Employee"} data={members?.length} />
            <Card title={"Vacancy"} data={org?.memberCount - members?.length} />
          </Grid>
        )}
        <Grid
          container
          spacing={2}
          lg={12}
          sx={{ my: 1, justifyContent: "space-between" }}
        >
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

          {role === "Employee" ||
            role === "Department-Admin" ||
            role === "Delegate-Department-Admin" ||
            role === "Accountant" ||
            role === "Delegate-Accountant" ||
            role === "Manager" ? null : (
            <div className="flex items-end gap-2">
              <BasicButton
                title={"Excel Onboarding"}
                onClick={handleExcelConfirmation}
                color={"success"}
              />
              <BasicButton title={"Add Employee"} onClick={handleAddEmployee} />
            </div>
          )}
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

                  {role === "Employee" ||
                    role === "Department-Admin" ||
                    role === "Delegate-Department-Admin" ||
                    role === "Accountant" ||
                    role === "Delegate-Accountant" ||
                    role === "Manager" ? null : (
                    <th scope="col" className="px-6 py-3">
                      Actions
                    </th>
                  )}
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
                        <td className="py-1 pl-8 ">
                          {item?.deptname?.map((dept, index) => (
                            <span key={index}>{dept?.departmentName}</span>
                          ))}
                        </td>
                        {role === "Employee" ||
                          role === "Department-Admin" ||
                          role === "Delegate-Department-Admin" ||
                          role === "Accountant" ||
                          role === "Delegate-Accountant" ||
                          role === "Manager" ? null : (
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
                              onClick={() =>
                                handleDeleteConfirmation(item?._id)
                              }
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </td>
                        )}
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
                    components={{
                      previous: ArrowBackIcon,
                      next: ArrowForwardIcon,
                    }}
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

      <Dialog
        open={excelConfirmation !== null}
        onClose={handleExcelCloseConfirmation}
      >
        <DialogContent>
          <h1 className="text-[1.5rem]  text-gray-700   font-semibold  tracking-tight">
            Excel Onboarding
          </h1>
          <p className="text-gray-500  leading-tight tracking-tight ">
            You can onboard employees efficiently by downloading the template,
            filling in the employee data, and uploading the completed Excel
            sheet below.
          </p>

          <br />
          {/* <Typography variant="p" sx={{ fontWeight: "600", mb: 2 }}>
            Upload Excel file to generate employee
          </Typography> */}

          {/* Input field directly visible for file upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv"
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              marginBottom: "20px",
              width: "100%",
              boxSizing: "border-box",
              display: "none", // Hide the file input
            }}
          />

          <div className={`space-y-1  `}>
            <label className={`font-semibold text-gray-500 text-md`}>
              {" "}
              Upload Excel file to generate employee
            </label>

            <div
              onClick={() => fileInputRef.current.click()}
              className={`outline-none cursor-pointer border-gray-200 border-[.5px]
            } flex  rounded-md items-center justify-center px-2  gap-4  bg-white py-2`}
            >
              <LuUpload className="text-xl text-gray-600" />
              <h1 className="text-lg text-gray-600">
                Click to upload the file
              </h1>
            </div>
          </div>

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
            style={{ textDecoration: "underline", margin: "10px 0" }}
          >
            Click to Downloa CSV Template
          </CSVLink>
        </DialogContent>
        <DialogActions>
          <BasicButton
            onClick={handleExcelCloseConfirmation}
            variant="outline"
            color="danger"
            title="Cancel"
          />
          <BasicButton
            title={"submit"}
            color={"primary"}
            onClick={handleSubmit}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EmployeeListToRole;

// import {
//   AddCircle,
//   Business,
//   CheckCircle,
//   Person,
//   West,
// } from "@mui/icons-material";
// import {
//   Button,
//   Checkbox,
//   CircularProgress,
//   FormControlLabel,
//   IconButton,
// } from "@mui/material";
// import axios from "axios";
// import React, { useContext, useEffect, useRef, useState } from "react";
// import { CSVLink } from "react-csv";
// import { useNavigate, useParams } from "react-router-dom";
// import * as XLSX from "xlsx";
// import { UseContext } from "../../State/UseState/UseContext";
// import StepFormWrapper from "../../components/step-form/wrapper";
// import useGetUser from "../../hooks/Token/useUser";
// import useMultiStepForm from "../../hooks/useStepForm";
// import Test1 from "./EmployeeCom/Test1 ";
// import Test2 from "./EmployeeCom/Test2";
// import Test3 from "./EmployeeCom/Test3";
// import Test4 from "./EmployeeCom/Test4";
// import SelfOnboardingFromModal from "../Self-Onboarding/SelfOnboardingFromModal";

// const convertExcelSerialDateToISO = (serialDate) => {
//   // Excel uses a base date of December 30, 1899
//   const excelBaseDate = new Date(Date.UTC(1899, 11, 30));
//   // Excel serial dates count days from this base date
//   const date = new Date(
//     excelBaseDate.getTime() + serialDate * 24 * 60 * 60 * 1000
//   );
//   // Ensure that the date is in the correct format without time component
//   return date.toISOString().split("T")[0];
// };

// // Helper function to convert date format from mm/dd/yyyy or Excel serial date to ISO format
// const convertToISOFormat = (dateStr) => {
//   if (!isNaN(dateStr)) {
//     return convertExcelSerialDateToISO(Number(dateStr));
//   }

//   const dateStrString = String(dateStr).trim();
//   const match = dateStrString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
//   if (match) {
//     const [, month, day, year] = match.map(Number);
//     // JavaScript Date months are 0-indexed, so subtract 1 from month
//     const date = new Date(Date.UTC(year, month - 1, day));
//     // Format to ISO (yyyy-mm-dd) and ensure no time component is included
//     return date.toISOString().split("T")[0];
//   } else {
//     console.error(
//       "Invalid date format. Expected mm/dd/yyyy or Excel serial date. Received:",
//       dateStr
//     );
//     return null;
//   }
// };

// // Validation functions
// const isValidPanCard = (panCard) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panCard);
// const isValidAadharCard = (aadharCard) => /^\d{12}$/.test(aadharCard);

// const EmployeeTest = () => {
//   const { authToken } = useGetUser();
//   const fileInputRef = useRef(null);
//   const { setAppAlert } = useContext(UseContext);
//   const [org, setOrg] = useState();
//   const [members, setMembers] = useState();
//   const [showExcelOnboarding, setShowExcelOnboarding] = useState(false);
//   const [uploadedFileName, setUploadedFileName] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   //selfOnboarding Employee Modal
//   const [openModal, setOpenModal] = useState(false);
//   const handleSelfOnboardingClick = () => {
//     setOpenModal(true);
//   };

//   const orgId = useParams().organisationId;

//   useEffect(() => {
//     (async () => {
//       const resp = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/get/${orgId}`
//       );
//       setOrg(resp.data.organizations);
//     })();
//   }, [orgId]);

//   useEffect(() => {
//     (async () => {
//       const resp = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/getmembers/${orgId}`
//       );
//       setMembers(resp.data.members);
//     })();
//   }, [orgId]);

//   const handleFileUpload = async (e) => {
//     setIsLoading(true);
//     const file = e.target.files[0];
//     const fileExtension = file.name.split(".").pop().toLowerCase();
//     if (!["xlsx", "xls", "csv"].includes(fileExtension)) {
//       setAppAlert({
//         alert: true,
//         type: "error",
//         msg: "Only Excel files are allowed",
//       });
//       setIsLoading(false);
//       return;
//     }

//     setUploadedFileName(file.name);
//     const reader = new FileReader();

//     reader.onload = async (event) => {
//       const binaryStr = event.target.result;
//       const workbook = XLSX.read(binaryStr, { type: "binary" });
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];

//       worksheet["!cols"] = [
//         { wch: 30 },
//         { wch: 40 },
//         { wch: 30 },
//         { wch: 30 },
//         { wch: 30 },
//       ];

//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
//       console.log("JSON Data:", jsonData);

//       const finalData = jsonData.map((data) => {
//         const isoDate = convertToISOFormat(data.date_of_birth);
//         console.log(
//           "Original Date:",
//           data.date_of_birth,
//           "Converted ISO Date:",
//           isoDate
//         );

//         return {
//           empId: data.empId,
//           first_name: data.first_name,
//           last_name: data.last_name,
//           email: data.email,
//           password: data.password,
//           organizationId: orgId,
//           date_of_birth: isoDate,
//           phone_number: data.phone_number,
//           address: data.address,
//           gender: data.gender,
//           adhar_card_number: data.adhar_card_number,
//           pan_card_number: data.pan_card_number,
//           bank_account_no: data.bank_account_no,
//           citizenship: data.citizenship,
//         };
//       });

//       console.log("Final Data:", finalData);

//       const validEmployees = [];

//       for (const employee of finalData) {
//         // Validation for PAN and Aadhar card
//         if (!isValidPanCard(employee.pan_card_number)) {
//           setAppAlert({
//             alert: true,
//             type: "error",
//             msg: `Invalid PAN card format for employee no ${employee.empId}`,
//           });
//           continue;
//         }

//         if (!isValidAadharCard(employee.adhar_card_number)) {
//           setAppAlert({
//             alert: true,
//             type: "error",
//             msg: `Invalid Aadhar card format for employee no ${employee.empId}`,
//           });
//           continue;
//         }

//         // If validations pass, add the employee to the validEmployees array
//         validEmployees.push(employee);
//       }

//       // if (validEmployees.length > 0) {
//       //   try {
//       //     const response = await axios.post(
//       //       `${process.env.REACT_APP_API}/route/employee/add-employee-excel`, // Adjusted endpoint
//       //       validEmployees,
//       //       {
//       //         headers: {
//       //           Authorization: authToken,
//       //         },
//       //       }
//       //     );
//       //     console.log(`${response.data.message}`);

//       //     setAppAlert({
//       //       alert: true,
//       //       type: "success",
//       //       msg: response.data.message,
//       //     });

//       //   } catch (error) {
//       //     console.error("Error posting employees:", error);
//       //     setAppAlert({
//       //       alert: true,
//       //       type: "error",
//       //       msg: error.response?.data?.message || "An error occurred while posting employees.",
//       //     });
//       //   }
//       // }
//       // else {
//       //   setAppAlert({
//       //     alert: true,
//       //     type: "warning",
//       //     msg: "No valid employees to submit.",
//       //   });
//       // }

//  if (validEmployees.length > 0 && validEmployees.length < 50 ) {
//         try {
//           const response = await axios.post(
//             `${process.env.REACT_APP_API}/route/employee/add-employee-excel`, // Adjusted endpoint
//             validEmployees,
//             {
//               headers: {
//                 Authorization: authToken,
//               },
//             }
//           );
//            console.log(`${response.data.message}`);

//           setAppAlert({
//             alert: true,
//             type: "success",
//             msg: response.data.message,
//           });
//         } catch (error) {
//           console.error("Error posting employees:", error);
//           setAppAlert({
//             alert: true,
//             type: "error",
//             msg:
//               error.response?.data?.message ||
//               "An error occurred while posting employees.",
//           });
//         }
//       }
//       else {
//         setAppAlert({
//           alert: true,
//           type: "warning",
//           msg: " only 50 Employee onboard through Excel Or No valid employees to submit.",
//         });
//       }

//       // for (const employee of finalData) {
//       //   // Validation for PAN and Aadhar card
//       //   if (!isValidPanCard(employee.pan_card_number)) {
//       //     setAppAlert({
//       //       alert: true,
//       //       type: "error",
//       //       msg: `Invalid PAN card format for employee no ${employee.empId}`,
//       //     });
//       //     continue;
//       //   }

//       //   if (!isValidAadharCard(employee.adhar_card_number)) {
//       //     setAppAlert({
//       //       alert: true,
//       //       type: "error",
//       //       msg: `Invalid Aadhar card format for employee no ${employee.empId}`,
//       //     });
//       //     continue;
//       //   }

//       //   try {
//       //     await axios.post(
//       //       `${process.env.REACT_APP_API}/route/employee/add-employee`,
//       //       employee,
//       //       {
//       //         headers: {
//       //           Authorization: authToken,
//       //         },
//       //       }
//       //     );
//       //     console.log(`Employee ${employee.empId} posted successfully`);
//       //   } catch (error) {
//       //     console.error(`Error posting employee ${employee.empId}:`, error);
//       //     setAppAlert({
//       //       alert: true,
//       //       type: "error",
//       //       msg: error.response.data.message,
//       //     });
//       //   }
//       // }

//       // Clear file input value to allow re-uploading the same file
//       fileInputRef.current.value = null;

//       setIsLoading(false);

//       // // window.location.reload();

//     };

//     reader.readAsBinaryString(file);
//   };

//   const handleButtonClick = () => {
//     fileInputRef.current.click();
//   };

//   const csvTemplateData = [
//     { empId: "", first_name: "", last_name: "", email: "", password: "" },
//   ];

//   const csvHeaders = [
//     { label: "empId", key: "empId" },
//     { label: "first_name", key: "first_name" },
//     { label: "last_name", key: "last_name" },
//     { label: "email", key: "email" },
//     { label: "password", key: "password" },
//     { label: "date_of_birth", key: "date_of_birth" },
//     { label: "phone_number", key: "phone_number" },
//     { label: "address", key: "address" },
//     { label: "gender", key: "gender" },
//     { label: "adhar_card_number", key: "adhar_card_number" },
//     { label: "pan_card_number", key: "pan_card_number" },
//     { label: "bank_account_no", key: "bank_account_no" },
//     { label: "citizenship", key: "citizenship" },
//   ];

//   const {
//     step,
//     nextStep,
//     prevStep,
//     isFirstStep,
//     isLastStep,
//     totalSteps,
//     goToStep,
//   } = useMultiStepForm(4);
//   const navigate = useNavigate();

//   const stepper = [
//     {
//       label: "Personal Details",
//       icon: Person,
//     },
//     {
//       label: "Company Info",
//       icon: Business,
//     },
//     {
//       label: "Additional Fields",
//       icon: AddCircle,
//     },
//     {
//       label: "Confirm",
//       icon: CheckCircle,
//     },
//   ];

//   const useSwitch = (step) => {
//     switch (step) {
//       case 1:
//         return <Test1 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
//       case 2:
//         return <Test2 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
//       case 3:
//         return <Test3 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
//       case 4:
//         return <Test4 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen h-auto  mt-16">
//       {isLoading && (
//         <div className="fixed z-[100000] flex items-center justify-center bg-black/10 top-0 bottom-0 left-0 right-0">
//           <CircularProgress />
//         </div>
//       )}
//       <header className="text-xl w-full pt-6 flex flex-col md:flex-row items-start md:items-center gap-2 bg-white shadow-md p-4  ">
//         {/* Back Button */}
//         <div className="flex-shrink-0">
//           <IconButton onClick={() => navigate(-1)}>
//             <West className="text-xl" />
//           </IconButton>
//         </div>

//         {/* Main Header Content */}
//         <div className="flex flex-col md:flex-row justify-between w-full md:ml-4">
//           <div className="mb-2 md:mb-0 md:mr-4">
//             <h1 className="text-xl font-bold">Employee Onboarding</h1>
//             <p className="text-sm text-gray-600">
//               Welcome your employees by creating their profiles here.
//             </p>
//           </div>
//           <div className="flex flex-wrap items-center gap-2 md:gap-4">
//             <div className="w-full md:w-auto">
//               <h1 className="text-sm">Onboarding Limit: {org?.memberCount}</h1>
//             </div>
//             <div className="w-full md:w-auto">
//               <h1 className="text-sm">
//                 Current Employee Count: {members?.length}
//               </h1>
//             </div>
//             <div className="w-full md:w-auto">
//               <h1 className="text-sm">
//                 Vacancy Count: {org?.memberCount - (members?.length || 0)}
//               </h1>
//             </div>

//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={showExcelOnboarding}
//                   onChange={() => setShowExcelOnboarding(!showExcelOnboarding)}
//                 />
//               }
//               label="Excel Onboarding"
//             />

//             <div className="w-full md:w-auto">
//               <button className="text-base text-blue-500 text-pretty font-bold"
//               onClick={handleSelfOnboardingClick}
//               >
//                 {/* Self-Onboarding Employee */}
//               </button>
//             </div>

//     <SelfOnboardingFromModal
//       open={openModal}
//       handleClose={() => setOpenModal(false)}
//     />
//           </div>
//         </div>
//       </header>

//       {showExcelOnboarding && (
//         <div className="w-full flex justify-center items-center mt-6">
//           <div className="flex flex-col gap-4 py-4 bg-white shadow-md">
//             <h1 className="text-xl text-center">Excel Onboarding</h1>
//             <div className="w-full flex flex-col"></div>
//             <h1 className="text-xs text-gray-600 w-[80%] m-auto text-center">
//               You can onboard employees efficiently by downloading the template,
//               filling in the employee data, and uploading the completed Excel
//               sheet below.
//             </h1>
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileUpload}
//               accept=".xlsx, .xls, .csv"
//               style={{ display: "none" }}
//             />
//             {uploadedFileName && (
//               <div className="text-center text-sm text-gray-600">
//                 Uploaded File: {uploadedFileName}
//               </div>
//             )}
//             <div className="flex gap-5 w-full justify-center">
//               <Button size="small" variant="contained" color="warning">
//                 <CSVLink
//                   data={csvTemplateData}
//                   headers={csvHeaders}
//                   filename="employee_onboard_template.csv"
//                   className="btn btn-secondary text-white"
//                   target="_blank"
//                 >
//                   Download EXCEL Template
//                 </CSVLink>
//               </Button>
//               <Button
//                 size="large"
//                 onClick={handleButtonClick}
//                 variant="contained"
//               >
//                 Upload Excel File
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       <section className="md:px-8 flex space-x-2 md:py-6">
//         <article className="w-full rounded-lg bg-white">
//           <div className="w-full md:px-5 px-1">
//             <StepFormWrapper
//               {...{
//                 goToStep,
//                 totalSteps,
//                 step,
//                 isFirstStep,
//                 nextStep,
//                 prevStep,
//                 isLastStep,
//                 stepper,
//               }}
//             >
//               {useSwitch(step)}
//             </StepFormWrapper>
//           </div>
//         </article>
//       </section>
//     </div>
//   );
// };

// export default EmployeeTest;
