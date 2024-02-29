import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useOrg from "../../../State/Org/Org";
import PackageInfo from "../../../components/Modal/PackagesModal/package-info";
import PriceInput from "./step-2-components/price-input";

const packageSchema = z.object({
  packageId: z.string(),
});
const Step2 = ({ nextStep }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { packageId, setStep2Data } = useOrg();
  const { handleSubmit, control, setValue, formState } = useForm({
    defaultValues: {
      packageId,
    },
    resolver: zodResolver(packageSchema),
  });
  const { isDirty, errors } = formState;
  console.log(`🚀 ~ file: step-2.jsx:24 ~ errors:`, errors);
  const onSubmit = (data) => {
    console.log(`🚀 ~ file: step-2.jsx:27 ~ data:`, data);
    setStep2Data(data.packageId);
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
              name={"packageId"}
              render={({ field }) => {
                return (
                  <PriceInput
                    field={field}
                    setConfirmOpen={setConfirmOpen}
                    setValue={setValue}
                  />
                );
              }}
            />
            <div className="h-4 !mb-1">
              <ErrorMessage
                errors={errors}
                name={"packageId"}
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
        <PackageInfo
          open={confirmOpen}
          handleClose={() => {
            setConfirmOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default Step2;
