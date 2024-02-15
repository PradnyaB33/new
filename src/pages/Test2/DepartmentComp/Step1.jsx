import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccountBox,
  ContactEmergency,
  Email,
  Person,
} from "@mui/icons-material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useDepartmentState from "../../../hooks/DepartmentHook/useDepartmentState";

const Step1 = ({ nextStep, isLastStep }) => {
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
    dept_location: z.string(),
    dept_head_name: z.string(),
    dept_delegate_head_name: z.string(),
  });

  const { control, formState, handleSubmit } = useForm({
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
            icon={Email}
            control={control}
            type="text"
            placeholder="Department Name"
            label="Department Name *"
            errors={errors}
            error={errors.dept_name}
          />

          <AuthInputFiled
            name="dept_location"
            icon={ContactEmergency}
            control={control}
            type="text"
            placeholder="Department Location"
            label="Department Location"
            errors={errors}
            error={errors.phone_number}
          />
        </div>

        <AuthInputFiled
          name="dept_description"
          icon={Person}
          control={control}
          type="textarea"
          placeholder="Department Description"
          label="Department Description"
          errors={errors}
          error={errors.address}
        />

        <div className="grid grid-cols-2 w-full gap-2">
          <AuthInputFiled
            name="dept_head_name"
            icon={AccountBox}
            control={control}
            type="text"
            placeholder="Department Head Name"
            label=" Select Department Head Name"
            errors={errors}
            error={errors.dept_head_name}
          />
          <AuthInputFiled
            name="dept_delegate_head_name"
            icon={AccountBox}
            control={control}
            type="text"
            placeholder="Delegate Department Head Name"
            label="Select Delegate Department Head Name"
            errors={errors}
            error={errors.pan_card_number}
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
