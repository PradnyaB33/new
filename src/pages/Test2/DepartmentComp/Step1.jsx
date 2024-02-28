import { zodResolver } from "@hookform/resolvers/zod";
import { Business, Person } from "@mui/icons-material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useDepartmentState from "../../../hooks/DepartmentHook/useDepartmentState";
import useDeptOption from "../../../hooks/DepartmentHook/useDeptOption";
import { useParams } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotesIcon from "@mui/icons-material/Notes";
const Step1 = ({ nextStep, isLastStep }) => {
  const organisationId = useParams("");
  const {
    DepartmentLocationOptions,
    DepartmentHeadOptions,
    DelegateDepartmentHeadOptions,
  } = useDeptOption(organisationId);

  const {
    setStep1Data,
    dept_name,
    dept_description,
    dept_location,
    dept_head_name,
    dept_delegate_head_name,
  } = useDepartmentState();

  const DepartmentSchema = z.object({
    dept_name: z.string().min(2, { message: "Minimum two character required" }),
    dept_description: z.string(),
    dept_location: z.object({
      label: z.string(),
      value: z.string(),
    }),
    dept_head_name: z.object({
      label: z.string(),
      value: z.string(),
    }),
    dept_delegate_head_name: z.object({
      label: z.string(),
      value: z.string(),
    }),
  });

  const { control, formState, handleSubmit, getValues } = useForm({
    defaultValues: {
      dept_name: dept_name,
      dept_description: dept_description,
      dept_location: dept_location,
      dept_head_name: dept_head_name,
      dept_delegate_head_name: dept_delegate_head_name,
    },
    resolver: zodResolver(DepartmentSchema),
  });

  const { errors } = formState;

  const onSubmit = async (data) => {
    console.log(`🚀 ~ data:`, data);
    console.log(getValues());
    setStep1Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Department Details</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex  flex-1 space-y-2 flex-col"
      >
        <div className="grid grid-cols-2 w-full gap-3">
          <AuthInputFiled
            name="dept_name"
            icon={Business}
            control={control}
            type="text"
            placeholder="Department Name"
            label="Department Name *"
            errors={errors}
            error={errors.dept_name}
          />
          <AuthInputFiled
            name="dept_location"
            value={dept_location}
            icon={LocationOnIcon}
            control={control}
            type="select"
            placeholder="Department Location"
            label="Select Department Location*"
            errors={errors}
            error={errors.dept_location}
            options={DepartmentLocationOptions}
          />
        </div>

        <AuthInputFiled
          name="dept_description"
          icon={NotesIcon}
          control={control}
          type="textarea"
          placeholder="Department Description"
          label="Department Description"
          errors={errors}
          error={errors.dept_description}
        />

        <div className="grid grid-cols-2 w-full gap-2">
          <AuthInputFiled
            name="dept_head_name"
            value={dept_head_name}
            icon={Person}
            control={control}
            type="select"
            placeholder="Department Head"
            label="Select Department Head"
            errors={errors}
            error={errors.dept_head_name}
            options={DepartmentHeadOptions}
          />
          <AuthInputFiled
            name="dept_delegate_head_name"
            value={dept_delegate_head_name}
            icon={Person}
            control={control}
            type="select"
            placeholder="Delegate Department Head"
            label="Select Delegate Department Head"
            errors={errors}
            error={errors.dept_delegate_head_name}
            options={DelegateDepartmentHeadOptions}
          />
        </div>

        <div className="flex items-end w-full justify-end">
          <button
            type="submit"
            disabled={isLastStep}
            className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1;
