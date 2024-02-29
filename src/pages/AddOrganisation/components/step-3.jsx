import { zodResolver } from "@hookform/resolvers/zod";
import { Calculate } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useOrg from "../../../State/Org/Org";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// Assuming you have a schema for Step 3 data
export function convertCamelToTitle(packageName) {
  return packageName.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
    return str.toUpperCase();
  });
}
const packageCountSchema = z.object({
  count: z.string(),
});
const Step3 = ({ nextStep }) => {
  const { count, setStep3Data } = useOrg();
  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      count,
    },
    resolver: zodResolver(packageCountSchema),
  });
  const { errors, isDirty } = formState;
  const onSubmit = (data) => {
    console.log(`🚀 ~ file: step-3.jsx:26 ~ data:`, data);
    setStep3Data(data.count);
    nextStep();
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="item-center flex flex-col"
        noValidate
      >
        <AuthInputFiled
          name="count"
          icon={Calculate}
          control={control}
          type="text"
          placeholder="Member Count"
          label="Member Count *"
          errors={errors}
          error={errors.count}
        />
        <Button
          disabled={!isDirty}
          type="submit"
          variant="contained"
          className="!w-max !mx-auto"
        >
          Confirm & Pay
        </Button>
      </form>
    </div>
  );
};

export default Step3;
