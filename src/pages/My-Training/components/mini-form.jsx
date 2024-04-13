import { zodResolver } from "@hookform/resolvers/zod";
import { DateRangeOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";

const MiniForm = ({ mutate }) => {
  const formSchema = z.object({
    startDate: z.string(),
    endDate: z.string(),
  });

  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      proofOfSubmissionUrl: undefined,
    },
    resolver: zodResolver(formSchema),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(data);
    mutate(data);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-bold text-left w-full">Schedule Training</h1>
      <div className="grid grid-cols-2 gap-8">
        <AuthInputFiled
          name="startDate"
          label="Start Date"
          icon={DateRangeOutlined}
          control={control}
          type="date"
          placeholder="Start Date"
          error={errors.startDate}
          errors={errors}
          min={new Date().toISOString().split("T")[0]}
        />
        <AuthInputFiled
          name="endDate"
          icon={DateRangeOutlined}
          label="End Date"
          control={control}
          type="date"
          placeholder="End Date"
          error={errors.endDate}
          errors={errors}
          min={watch("startDate")}
        />
      </div>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className="!w-fit"
      >
        Submit
      </Button>
    </form>
  );
};

export default MiniForm;
{
  /* <div className="space-y-1 w-full items-center flex flex-col ">
  <Controller
    control={control}
    name={"proofOfSubmissionUrl"}
    render={({ field }) => {
      return (
        <PdfInput
          className={
            "!rounded-lg !w-full !object-cover !h-44 !bg-cover !bg-center"
          }
          field={field}
        />
      );
    }}
  />
  <div className="h-4 !mb-1">
    <ErrorMessage
      errors={errors}
      name={"proofOfSubmissionUrl"}
      render={({ message }) => {
        return <p className="text-sm text-red-500">{message}</p>;
      }}
    />
  </div>
  <Button type="submit" variant="contained" color="primary">
    Submit
  </Button>
</div>; */
}
