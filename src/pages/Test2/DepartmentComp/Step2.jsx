import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useDepartmentState from "../../../hooks/DepartmentHook/useDepartmentState";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import NotesIcon from "@mui/icons-material/Notes";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
const Step2 = ({ isLastStep, nextStep }) => {
  const {
    dept_cost_center_name,
    dept_cost_center_description,
    dept_id,
    dept_cost_center_id,
    setStep2Data,
  } = useDepartmentState();

  const DepartmentSchema = z.object({
    dept_cost_center_name: z.string().optional(),
    dept_cost_center_description: z.string().optional(),
    dept_id: z.string(),
    dept_cost_center_id: z.string(),
  });

  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      dept_cost_center_name: dept_cost_center_name,
      dept_cost_center_description: dept_cost_center_description,
      dept_id: dept_id,
      dept_cost_center_id: dept_cost_center_id,
    },
    resolver: zodResolver(DepartmentSchema),
  });

  const { errors } = formState;
  const onsubmit = (data) => {
    console.log(data);
    setStep2Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Cost Center Info</h1>

      <form
        onSubmit={handleSubmit(onsubmit)}
        className="w-full flex space-y-2  flex-1 flex-col"
      >
        <div className="grid grid-cols-2 w-full gap-3">
          <AuthInputFiled
            name="dept_cost_center_name"
            icon={MonetizationOnIcon}
            control={control}
            type="text"
            placeholder="Department Cost Center Name"
            label="Department Cost Center Name"
            errors={errors}
            error={errors.dept_cost_center_name}
          />
          <AuthInputFiled
            name="dept_cost_center_description"
            icon={NotesIcon}
            control={control}
            type="text"
            placeholder="Department Cost Center Description"
            label="Department Cost Center Description"
            errors={errors}
            error={errors.dept_cost_center_description}
          />
        </div>

        <div className="grid grid-cols-2 w-full gap-3">
          <AuthInputFiled
            name="dept_id"
            icon={FormatListNumberedIcon}
            control={control}
            type="text"
            placeholder="Department ID"
            label="Department ID"
            errors={errors}
            error={errors.dept_id}
          />
          <AuthInputFiled
            name="dept_cost_center_id"
            icon={FormatListNumberedIcon}
            control={control}
            type="text"
            placeholder="Department Cost Center Id"
            label="Department Cost Center ID"
            errors={errors}
            error={errors.dept_cost_center_id}
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

export default Step2;
