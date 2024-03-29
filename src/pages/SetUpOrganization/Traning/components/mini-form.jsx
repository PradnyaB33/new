import { Button } from "@mui/material";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ViewModuleOutlined } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
const organizationSchema = z.object({
  isEnable: z.boolean(),
});

const MiniForm = ({ data, mutate }) => {
  console.log(`🚀 ~ file: mini-form.jsx:14 ~ data:`, data?.isEnable);
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      isEnable: data?.isEnable ? data?.isEnable : false,
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
      <div className="w-full p-4 flex">
        <AuthInputFiled
          name="isEnable"
          icon={ViewModuleOutlined}
          control={control}
          type="checkbox"
          placeholder="Enable Module"
          label="Enable Module"
          errors={errors}
          error={errors.isEnable}
          descriptionText={
            "After enabling this package organisation will able to do training in itself and also able to do training in other organisation."
          }
        />
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
