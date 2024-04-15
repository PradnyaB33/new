import { zodResolver } from "@hookform/resolvers/zod";
import { Calculate, RecyclingRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useOrg from "../../../State/Org/Org";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";

const packageCountSchema = z.object({
  count: z
    .string()
    .refine((doc) => Number(doc) > 0, { message: "Count is greater than 0" }),
  cycleCount: z.string().refine((doc) => Number(doc) > 0, {
    message: "Cycle Count is greater than 0",
  }),
});
const Step3 = ({ nextStep }) => {
  const { count, setStep3Data, cycleCount } = useOrg();
  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      count,
      cycleCount,
    },
    resolver: zodResolver(packageCountSchema),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(`🚀 ~ file: step-3.jsx:26 ~ data:`, data);
    setStep3Data(data);
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
          type="number"
          placeholder="Member Count"
          label="Member Count *"
          errors={errors}
          error={errors.count}
        />
        <AuthInputFiled
          name="cycleCount"
          icon={RecyclingRounded}
          control={control}
          type="number"
          placeholder="Cycle count used for recycle your subscription"
          label="Cycle Count *"
          errors={errors}
          error={errors.cycleCount}
          descriptionText={
            "if you select 2 then you will be charged every 3 months subscription with 2 cycle it mean it will be 6 months subscription just amount will be charged one time."
          }
        />
        <Button type="submit" variant="contained" className="!w-max !mx-auto">
          Confirm & Pay
        </Button>
      </form>
    </div>
  );
};

export default Step3;
