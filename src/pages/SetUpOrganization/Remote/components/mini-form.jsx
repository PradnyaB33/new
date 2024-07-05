import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import { Button } from "@mui/material";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Business, LocationOn, Money } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
const organizationSchema = z.object({
  allowance: z.boolean(),
  allowanceQuantity: z.string(),
  dualWorkflow: z.boolean(),
  geoFencing: z.boolean(),
  faceRecognition: z.boolean(),
});

const MiniForm = ({ data, mutate }) => {
  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      allowance: data?.remotePunchingObject?.allowance || false,
      allowanceQuantity: data?.remotePunchingObject?.allowanceQuantity
        ? `${data?.remotePunchingObject?.allowanceQuantity}`
        : "0",
      dualWorkflow: data?.remotePunchingObject?.dualWorkflow || false,
      geoFencing: data?.remotePunchingObject?.geoFencing || false,
      faceRecognition: data?.remotePunchingObject?.faceRecognition || false,
    },
    resolver: zodResolver(organizationSchema),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
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
          placeholder="Dual Workflow"
          label="Dual Workflow "
          errors={errors}
          error={errors.dualWorkflow}
          descriptionText={
            "Enabling workflow ensures account approval after manager's approval otherwise added directly as allowance."
          }
        />
        <AuthInputFiled
          name="geoFencing"
          icon={LocationOn}
          control={control}
          type="checkbox"
          placeholder="Geo Fencing"
          label="Geo Fencing "
          errors={errors}
          error={errors.geoFencing}
          descriptionText={
            "Enabling Geo Fencing will allow the employee to punch in only from the allowed location."
          }
        />
        <AuthInputFiled
          name="faceRecognition"
          icon={LocationOn}
          control={control}
          type="checkbox"
          placeholder="Face Recognition"
          label="Face Recognition"
          errors={errors}
          error={errors.faceRecognition}
          descriptionText={
            "Enabling Face Recognition will allow the employee to punch in only after face recognition."
          }
        />
        <AuthInputFiled
          name="allowance"
          icon={PriceChangeOutlinedIcon}
          control={control}
          type="checkbox"
          placeholder="Enable Extra Allowance"
          label="Enable Extra Allowance "
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
