import React from "react";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";

const InputForm = () => {
  const inputFormSchema = z.object({
    selectedMonth: z.string(),
    selectedLeaveType: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    ),
    selectedStatus: z.string(),
  });
  return (
    <div>
      <h1 className="text-2xl font-bold">Your personal leave notification</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full p-4 flex flex-wrap gap-4">
          <AuthInputFiled
            control={control}
            name="selectedMonth"
            label="Select Month"
            type="month"
          />
        </div>
        <div className="w-full flex justify-center mb-4 mt-2">
          <Button disabled={!isDirty} variant="contained" type="submit">
            Apply For Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
