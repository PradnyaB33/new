import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import { Button } from "@mui/material";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Business, Money } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
const organizationSchema = z.object({
  allowance: z.boolean(),
  allowanceQuantity: z.string(),
  dualWorkflow: z.boolean(),
});

const MiniForm = ({ data, mutate }) => {
  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      allowance: data?.remotePunchingObject?.allowance || false,
      allowanceQuantity: data?.remotePunchingObject?.allowanceQuantity
        ? `${data?.remotePunchingObject?.allowanceQuantity}`
        : "0",
      dualWorkflow: data?.remotePunchingObject?.dualWorkflow || false,
    },
    resolver: zodResolver(organizationSchema),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(`🚀 ~ file: RemoteSetup.jsx:35 ~ data:`, data);
    mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full grid grid-cols-2 grid-rows-2 p-4 gap-4">
        <AuthInputFiled
          name="dualWorkflow"
          icon={Business}
          control={control}
          type="checkbox"
          placeholder="Dual workflow"
          label="Dual workflow "
          errors={errors}
          error={errors.dualWorkflow}
          descriptionText={
            "Enabling workflow ensures account approval after manager's approval otherwise added directly as allowance."
          }
        />
        <AuthInputFiled
          name="allowance"
          icon={PriceChangeOutlinedIcon}
          control={control}
          type="checkbox"
          placeholder="Enable extra allowance"
          label="Enable extra allowance "
          errors={errors}
          error={errors.allowance}
          descriptionText={
            "Enabling allowance will allow the employee to get extra amount."
          }
        />
        {watch("allowance") && (
          <AuthInputFiled
            name="allowanceQuantity"
            icon={Money}
            control={control}
            type="number"
            placeholder="Allowance"
            label="Allowance *"
            errors={errors}
            error={errors.allowanceQuantity}
          />
        )}
      </div>
      <div className="w-full flex justify-center mb-4 mt-2">
        <Button variant="contained" type="submit">
          Apply For Changes
        </Button>
      </div>
    </form>
  );
};

export default MiniForm;
