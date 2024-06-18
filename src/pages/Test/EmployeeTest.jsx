import {
  AddCircle,
  Business,
  CheckCircle,
  Person,
  West,
} from "@mui/icons-material";
import { Button, Checkbox, FormControlLabel, IconButton } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { useNavigate, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { UseContext } from "../../State/UseState/UseContext";
import StepFormWrapper from "../../components/step-form/wrapper";
import useGetUser from "../../hooks/Token/useUser";
import useMultiStepForm from "../../hooks/useStepForm";
import Test1 from "./EmployeeCom/Test1 ";
import Test2 from "./EmployeeCom/Test2";
import Test3 from "./EmployeeCom/Test3";
import Test4 from "./EmployeeCom/Test4";

// Helper function to convert date format
const convertToISOFormat = (dateStr) => {
  let day, month, year;

  if (dateStr.includes("-")) {
    [day, month, year] = dateStr.split("-").map(Number);
  } else if (dateStr.includes("/")) {
    [day, month, year] = dateStr.split("/").map(Number);
  } else {
    throw new Error("Invalid date format");
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString();
};

// Validation functions
const isValidPanCard = (panCard) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panCard);
const isValidAadharCard = (aadharCard) => /^\d{12}$/.test(aadharCard);

const EmployeeTest = () => {
  const { authToken } = useGetUser();
  const fileInputRef = useRef(null);
  const { setAppAlert } = useContext(UseContext);
  const [org, setOrg] = useState();
  const [members, setMembers] = useState();
  const [showExcelOnboarding, setShowExcelOnboarding] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const orgId = useParams().organisationId;
  console.log(orgId);

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/get/${orgId}`
      );
      console.log("this is the data", resp.data.organizations);
      setOrg(resp.data.organizations);
    })();
  }, [orgId]);

  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/getmembers/${orgId}`
      );
      console.log("this is the data", resp.data.organizations);
      setMembers(resp.data.members);
    })();
  }, [orgId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (!["xlsx", "xls", "csv"].includes(fileExtension)) {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Only Excel files are allowed",
      });
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
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

      const finalData = jsonData.map((data) => ({
        empId: data.empId,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        organizationId: orgId,
        date_of_birth: convertToISOFormat(data.date_of_birth),
        phone_number: data.phone_number,
        address: data.address,
        gender: data.gender,
        adhar_card_number: data.adhar_card_number,
        pan_card_number: data.pan_card_number,
        bank_account_no: data.bank_account_no,
        citizenship: data.citizenship,
      }));

      console.log("Final Data", finalData);

      finalData.forEach(async (employee) => {
        // Validation for PAN and Aadhar card
        if (!isValidPanCard(employee.pan_card_number)) {
          setAppAlert({
            alert: true,
            type: "error",
            msg: `Invalid PAN card format for employee no ${employee.empId}`,
          });
          return;
        }

        if (!isValidAadharCard(employee.adhar_card_number)) {
          setAppAlert({
            alert: true,
            type: "error",
            msg: `Invalid Aadhar card format for employee no ${employee.empId}`,
          });
          return;
        }

        try {
          await axios.post(
            `${process.env.REACT_APP_API}/route/employee/add-employee`,
            employee,
            {
              headers: {
                Authorization: authToken,
              },
            }
          );
          console.log(`Employee ${employee.empId} posted successfully`);
          setAppAlert({
            alert: true,
            type: "success",
            msg: "Onboarding Process Completed",
          });
        } catch (error) {
          console.error(`Error posting employee ${employee.empId}:`, error);
          setAppAlert({
            alert: true,
            type: "error",
            msg: error.response.data.message,
          });
        }
      });

      // Clear file input value to allow re-uploading the same file
      fileInputRef.current.value = null;
    };

    reader.readAsBinaryString(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

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

  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(4);
  const navigate = useNavigate();

  const stepper = [
    {
      label: "Personal Details",
      icon: Person,
    },
    {
      label: "Company Info",
      icon: Business,
    },
    {
      label: "Additional Fields",
      icon: AddCircle,
    },
    {
      label: "Confirm",
      icon: CheckCircle,
    },
  ];

  const useSwitch = (step) => {
    switch (step) {
      case 1:
        return <Test1 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 2:
        return <Test2 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 3:
        return <Test3 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;
      case 4:
        return <Test4 {...{ nextStep, prevStep, isLastStep, isFirstStep }} />;

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen h-auto">
     <header className="text-xl w-full pt-6 flex flex-col md:flex-row items-start md:items-center gap-2 bg-white shadow-md p-4">
      {/* Back Button */}
      <div className="flex-shrink-0">
        <IconButton onClick={() => navigate(-1)}>
          <West className="text-xl" />
        </IconButton>
      </div>

      {/* Main Header Content */}
      <div className="flex flex-col md:flex-row justify-between w-full md:ml-4">
        <div className="mb-2 md:mb-0 md:mr-4">
          <h1 className="text-xl font-bold">Employee Onboarding</h1>
          <p className="text-sm text-gray-600">
            Welcome your employees by creating their profiles here.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          <div className="w-full md:w-auto">
            <h1 className="text-sm">
              Onboarding Limit: {org?.memberCount}
            </h1>
          </div>
          <div className="w-full md:w-auto">
            <h1 className="text-sm">
              Current Employee Count: {members?.length}
            </h1>
          </div>
          <div className="w-full md:w-auto">
            <h1 className="text-sm">
              Vacancy Count: {org?.memberCount - (members?.length || 0)}
            </h1>
          </div>
          <FormControlLabel
            control={
              <Checkbox
                checked={showExcelOnboarding}
                onChange={() => setShowExcelOnboarding(!showExcelOnboarding)}
              />
            }
            label="Excel Onboarding"
          />
        </div>
      </div>
    </header>

      {showExcelOnboarding && (
        <div className="w-full flex justify-center items-center mt-6">
          <div className="flex flex-col gap-4 py-4 bg-white shadow-md">
            <h1 className="text-xl text-center">Excel Onboarding</h1>
            <div className="w-full flex flex-col"></div>
            <h1 className="text-xs text-gray-600 w-[80%] m-auto text-center">
              You can onboard employees efficiently by downloading the template,
              filling in the employee data, and uploading the completed Excel
              sheet below.
            </h1>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx, .xls, .csv"
              style={{ display: "none" }}
            />
            {uploadedFileName && (
              <div className="text-center text-sm text-gray-600">
                Uploaded File: {uploadedFileName}
              </div>
            )}
            <div className="flex gap-5 w-full justify-center">
              <Button size="small" variant="contained" color="warning">
                <CSVLink
                  data={csvTemplateData}
                  headers={csvHeaders}
                  filename="employee_onboard_template.csv"
                  className="btn btn-secondary text-white"
                  target="_blank"
                >
                  Download CSV Template
                </CSVLink>
              </Button>
              <Button
                size="small"
                onClick={handleButtonClick}
                variant="contained"
              >
                Upload Excel File
              </Button>
            </div>
          </div>
        </div>
      )}

      <section className="md:px-8 flex space-x-2 md:py-6">
        <article className="w-full rounded-lg bg-white">
          <div className="w-full md:px-5 px-1">
            <StepFormWrapper
              {...{
                goToStep,
                totalSteps,
                step,
                isFirstStep,
                nextStep,
                prevStep,
                isLastStep,
                stepper,
              }}
            >
              {useSwitch(step)}
            </StepFormWrapper>
          </div>
        </article>
      </section>
    </div>
  );
};

export default EmployeeTest;
