import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useOrg from "../../../State/Org/Org";
import PriceInput from "./step-2-components/price-input";

const packageSchema = z.object({
  packageInfo: z.object({
    packageName: z.string(),
    packageId: z.string(),
  }),
});
const Step2 = ({ nextStep }) => {
  const { packageInfo, setStep2Data } = useOrg();
  const { handleSubmit, control, setValue, formState } = useForm({
    defaultValues: {
      packageInfo,
    },
    resolver: zodResolver(packageSchema),
  });
  const { isDirty, errors } = formState;
  console.log(`🚀 ~ file: step-2.jsx:24 ~ errors:`, errors);
  const onSubmit = (data) => {
    console.log(`🚀 ~ file: step-2.jsx:27 ~ data:`, data);
    setStep2Data(data?.packageInfo);
    nextStep();
  };
  return (
    <div>
      <div className="item-center flex flex-col gap-4" noValidate>
        <h1 className="text-xl text-Brand-washed-blue/brand-washed-blue-10">
          Choose you package
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="item-center flex flex-col gap-4"
        >
          <div className="flex gap-4 flex-col">
            <Controller
              control={control}
              name={"packageInfo"}
              render={({ field }) => {
                return <PriceInput field={field} />;
              }}
            />
            <div className="h-4 !mb-1">
              <ErrorMessage
                errors={errors}
                name={"packageInfo"}
                render={({ message }) => (
                  <p className="text-sm text-red-500">
                    {message ? "Please Select the Package First" : ""}
                  </p>
                )}
              />
            </div>
          </div>
          <Button
            disabled={!isDirty}
            type="submit"
            variant="contained"
            className="!w-max !mx-auto"
          >
            Next
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Step2;
