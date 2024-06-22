import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { SiMicrosoftexcel } from "react-icons/si";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import { getTDSYearsOptions, reportTypeOptions } from "./data";

import * as XLSX from "xlsx";
import { TestContext } from "../../../State/Function/Main";
import useGetAllManager from "../../../hooks/Employee/useGetAllManager";

const ReportForm = () => {
  const { handleAlert } = useContext(TestContext);
  const tdsYearOptions = getTDSYearsOptions();
  const formSchema = z
    .object({
      reportType: z.object({
        label: z.string(),
        value: z.string(),
      }),
      timeRange: z
        .object({
          startDate: z.string(),
          endDate: z.string(),
        })
        .optional(),
      start: z.string().optional(),
      end: z.string().optional(),
      manager: z
        .object({
          label: z.string().optional(),
          value: z.string().optional(),
        })
        .optional(),
      financialYear: z
        .object({
          label: z.string().optional(),
          value: z.string().optional(),
        })
        .optional(),
    })
    .refine(
      (data) => {
        // If reportType is 'Attendance', timeRange is required
        if (data.reportType.value === "Attendance" && !data.timeRange) {
          return false;
        }
        // If reportType is 'Salary', start and end are required
        if (data.reportType.value === "Salary" && (!data.start || !data.end)) {
          return false;
        }
        return true;
      },
      {
        // Custom error message
        message: "Invalid data",
      }
    );
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    getValues,
  } = useForm({
    defaultValues: {},
    resolver: zodResolver(formSchema),
  });

  const { organisationId } = useParams();
  const authToken = useAuthToken();

  const GenerateAttendence = (data) => {
    const dateRange = data[0]?.attendance?.map((date) => date.date) || [];

    const headers = [
      "Employee Id",
      "Employee Name",
      ...dateRange,
      "Total Present",
      "Total Absent",
      "Not Applied",
    ];

    const employeeInfo = data?.map((item) => [
      item?.empID,
      item?.name,
      ...item?.attendance?.map((date) => date?.present),
      item?.totalDaysPresent,
      item?.totalDaysAbsent,
      item?.totalDaysNotApplied,
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...employeeInfo]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "AttendanceReport.xlsx");
    console.log("invoked in outside");
    handleAlert(true, "success", "Attendance Report Generated successfully");
  };

  const GenerateSalary = (employees) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Array of month names for conversion
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    employees.forEach((employee, index) => {
      // Create a new worksheet
      let ws_data = [
        ["Serial No", "Employee Name", "Emp ID"],
        [1, employee.employeeName, employee.empId],
      ];

      // Get the keys from the first salary object (assuming all salary objects have the same structure)
      const salaryKeys = Object.keys(employee.salary[0]);
      ws_data[0] = ws_data[0].concat(salaryKeys);

      employee.salary.forEach((salary, salaryIndex) => {
        let salaryValues = Object.values(salary);

        // Convert month number to name
        if (salary.hasOwnProperty("month")) {
          salaryValues = salaryValues.map((value, index) =>
            salaryKeys[index] === "month" ? monthNames[value - 1] : value
          );
        }

        ws_data.push(
          [salaryIndex + 1].concat(ws_data[1].slice(1), salaryValues)
        );
      });

      // Remove the employee details from the second row after using them
      ws_data.splice(1, 1);

      const ws = XLSX.utils.aoa_to_sheet(ws_data);

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, `${employee.employeeName}`);
    });

    // Write the workbook to a file
    XLSX.writeFile(wb, "Salary.xlsx");
  };

  const GenerateTDS = (data) => {
    const headers = [
      "",
      "Employee Id",
      "Employee Name",
      "Regime",
      "Salary",
      "Other Declaration",
      "Salary Declaration",
      "Section Declaration",
      "Before Cess",
      "After Standard Deduction Taxable Income",
      "Cess",
      "Taxable Income",
    ];

    const employeeInfo = data?.map((item) => [
      "",
      item?.empId,
      item?.employeeName,
      item?.regime,
      item?.salary,
      item?.afterStandardDeduction,
      item?.otherDeclaration,
      item?.salaryDeclaration,
      item?.sectionDeclaration,
      item?.beforeCess,
      item?.cess,
      item?.taxableIncome,
    ]);
    const title = ["", "TDS Challan Report"];
    const year = ["", getValues("financialYear")?.label];
    const ws = XLSX.utils.aoa_to_sheet([
      "",
      title,
      year,
      "",
      headers,
      ...employeeInfo,
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "TDSReport.xlsx");
  };

  const OnSubmit = useMutation(
    async (data) => {
      console.log(getValues("start"), getValues("end"));

      let queryData = {
        reportType: data.reportType.value,
        startDate: data?.timeRange?.startDate,
        endDate: data?.timeRange?.endDate,
        manager: data?.manager?.value ?? "",
      };

      if (data.reportType.value === "salary") {
        let startMonth = data.start.split("-")[1];
        let endMonth = data.end.split("-")[1];
        let startYear = data.start.split("-")[0];
        let endYear = data.end.split("-")[0];
        queryData = {
          reportType: data.reportType.value,
          startMonth: startMonth,
          endMonth: endMonth,
          startYear: startYear,
          endYear: endYear,
        };
      }

      if (data.reportType.value === "tds") {
        queryData = {
          reportType: data.reportType.value,
          financialYear: data.financialYear.value,
        };
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/mis/generateReport/${organisationId}`,
        {
          params: queryData,
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        if (getValues("reportType")?.value === "Attendence") {
          GenerateAttendence(data);
        }
        if (getValues("reportType")?.value === "salary") {
          GenerateSalary(data);
        }
        if (getValues("reportType")?.value === "tds") {
          GenerateTDS(data);
        }
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const ManagerList = useGetAllManager(organisationId);

  const Manageroptions = ManagerList?.manager?.map((item) => {
    return {
      value: item?._id,
      label: `${item?.first_name} ${item?.last_name}`,
    };
  });

  return (
    <form onSubmit={handleSubmit((data) => OnSubmit.mutate(data))}>
      <div className="grid gap-2 grid-cols-2">
        <AuthInputFiled
          name="reportType"
          control={control}
          type="select"
          // icon={Work}
          placeholder="Report Type"
          label="Select Report Type *"
          readOnly={false}
          maxLimit={15}
          options={reportTypeOptions}
          errors={errors}
          error={errors.reportType}
        />

        {/* <AuthInputFiled
          name="timeRange"
          control={control}
          type="calender"
          icon={Work}
          asSingle={false}
          placeholder="Report Type"
          label="Select Time Range *"
          readOnly={false}
          maxLimit={15}
          useRange={true}
          //   options={reportTypeOptions}
          errors={errors}
          error={errors.timeRange}
        /> */}
      </div>
      {watch("reportType")?.value === "Attendence" && (
        <div className="grid gap-2 grid-cols-2">
          <AuthInputFiled
            name="timeRange"
            control={control}
            type="calender"
            // icon={Work}
            asSingle={false}
            placeholder="Report Type"
            label="Select Time Range *"
            readOnly={false}
            maxLimit={15}
            useRange={true}
            //   options={reportTypeOptions}
            errors={errors}
            error={errors.timeRange}
          />
        </div>
      )}

      {watch("reportType")?.value === "tds" && (
        <div className="grid gap-2 grid-cols-2">
          <AuthInputFiled
            name="financialYear"
            control={control}
            type="select"
            // icon={Work}
            placeholder="Ex : 2024-2025"
            label="Select year *"
            readOnly={false}
            maxLimit={15}
            options={tdsYearOptions}
            errors={errors}
            error={errors.financialYear}
          />
        </div>
      )}

      {watch("reportType")?.value === "salary" && (
        <div className="grid gap-2 grid-cols-2">
          <AuthInputFiled
            name="start"
            control={control}
            type="month"
            // icon={Work}
            placeholder="Ex : January-2022"
            label="Select Start Month *"
            readOnly={false}
            maxLimit={15}
            // options={ReportYearsOptions}
            errors={errors}
            error={errors.start}
          />
          <AuthInputFiled
            name="end"
            control={control}
            type="month"
            // icon={Work}
            placeholder="Ex : March-2022"
            label="Select End Month *"
            readOnly={false}
            maxLimit={15}
            // options={ReportYearsOptions}
            errors={errors}
            error={errors.end}
          />
        </div>
      )}
      <div className="grid gap-2 grid-cols-2">
        {/* <AuthInputFiled
          name="department"
          control={control}
          type="select"
          icon={Work}
          placeholder="ex: Department1"
          label="Select Department "
          readOnly={false}
          maxLimit={15}
          options={reportTypeOptions}
          errors={errors}
          error={errors.department}
        /> */}
        {watch("reportType")?.value !== "tds" && (
          <AuthInputFiled
            name="manager"
            control={control}
            type="select"
            // icon={Work}
            placeholder="ex: Manager1"
            label="Select Manager "
            readOnly={false}
            maxLimit={15}
            options={Manageroptions}
            isClearable={true}
            errors={errors}
            error={errors.manager}
          />
        )}
      </div>

      <button
        className={` flex group justify-center w-max gap-2 items-center rounded-sm h-[30px] px-4 py-4 text-md font-semibold text-white bg-green-500 hover:bg-green-500 focus-visible:outline-green-500`}
      >
        <SiMicrosoftexcel /> Generate Report
      </button>
    </form>
  );
};

export default ReportForm;
