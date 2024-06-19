import { zodResolver } from "@hookform/resolvers/zod";
import { Work } from "@mui/icons-material";
import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { SiMicrosoftexcel } from "react-icons/si";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import { reportTypeOptions } from "./data";

import * as XLSX from "xlsx";
import { TestContext } from "../../../State/Function/Main";

const ReportForm = () => {
  const { handleAlert } = useContext(TestContext);
  const formSchema = z.object({
    reportType: z.object({
      label: z.string(),
      value: z.string(),
    }),
    timeRange: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
    // department: z.string(),
    // manager: z.string(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {},
    resolver: zodResolver(formSchema),
  });

  const { organisationId } = useParams();
  const authToken = useAuthToken();

  const OnSubmit = useMutation(
    async (data) => {
      const queryData = {
        reportType: data.reportType.value,
        startDate: data.timeRange.startDate,
        endDate: data.timeRange.endDate,
      };

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
        console.log(data);
        const dateRange = data[0]?.attendance?.map((date) => date.date) || [];

        const headers = ["Employee Id", "Employee Name", ...dateRange];
        console.log(`🚀 ~ headers:`, headers);

        const employeeInfo = data?.map((item) => [
          item?.empID,
          item?.name,
          ...item?.attendance?.map((date) => date?.present),
        ]);

        const ws = XLSX.utils.aoa_to_sheet([headers, ...employeeInfo]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        // XLSX.writeFile(wb, "AttendanceReport.xlsx");
        handleAlert(
          true,
          "success",
          "Attendance Report Generated successfully"
        );
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  return (
    <form onSubmit={handleSubmit((data) => OnSubmit.mutate(data))}>
      <div className="grid gap-2 grid-cols-2">
        <AuthInputFiled
          name="reportType"
          control={control}
          type="select"
          icon={Work}
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
      <div className="grid gap-2 grid-cols-2">
        <AuthInputFiled
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
        />
      </div>

      {/* <div className="grid gap-2 grid-cols-2">
        <AuthInputFiled
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
        />
        <AuthInputFiled
          name="manager"
          control={control}
          type="select"
          icon={Work}
          placeholder="ex: Manager1"
          label="Select Manager "
          readOnly={false}
          maxLimit={15}
          options={reportTypeOptions}
          errors={errors}
          error={errors.manager}
        />
      </div> */}

      <button
        className={` flex group justify-center w-max gap-2 items-center rounded-sm h-[30px] px-4 py-4 text-md font-semibold text-white bg-green-500 hover:bg-green-500 focus-visible:outline-green-500`}
      >
        <SiMicrosoftexcel /> Generate Report
      </button>
    </form>
  );
};

export default ReportForm;
