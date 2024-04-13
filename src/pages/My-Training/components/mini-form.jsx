import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import PdfInput from "../../AddOrganisation/components/pdf-input";

const MiniForm = () => {
  const formSchema = z.object({
    proofOfSubmissionUrl: z.any().refine(
      (file) => {
        if (typeof file === "string") {
          return true;
        }
        return !!file && file.size >= 5 * 1024 && file.size <= 50 * 1024;
      },
      { message: "Image size maximum 50kb" }
    ),
  });

  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      proofOfSubmissionUrl: undefined,
    },
    resolver: zodResolver(formSchema),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form
      className=" items-center flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-xl font-bold text-left w-full">
        Submit Proof of Submission
      </h1>
      <div className="space-y-1 w-full items-center flex flex-col ">
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
      </div>
    </form>
  );
};

export default MiniForm;
