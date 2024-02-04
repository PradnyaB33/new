import { zodResolver } from "@hookform/resolvers/zod";
import {
  BarChartOutlined,
  ExtensionOutlined,
  LocationOnOutlined,
  TimelineOutlined,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useOrg from "../../../State/Org/Org";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";

const organizationSchema = z.object({
  remotePunching: z.boolean(),
  performanceManagement: z.boolean(),
  analyticsAndReporting: z.boolean(),
  skillMatrices: z.boolean(),
});
const Step2MiniForm = ({
  remotePunching,
  performanceManagement,
  analyticsAndReporting,
  skillMatrices,
  nextStep,
}) => {
  const { setStep2Data } = useOrg();
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      remotePunching: remotePunching ? remotePunching : false,
      performanceManagement: performanceManagement
        ? performanceManagement
        : false,
      analyticsAndReporting: analyticsAndReporting
        ? analyticsAndReporting
        : false,
      skillMatrices: skillMatrices ? skillMatrices : false,
    },
    resolver: zodResolver(organizationSchema),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(`🚀 ~ file: step-2.jsx:71 ~ data:`, data);
    setStep2Data(data);
    nextStep();
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="item-center flex flex-col"
      noValidate
    >
      <div className="grid grid-cols-2 gap-4 px-4">
        <AuthInputFiled
          name="remotePunching"
          icon={LocationOnOutlined}
          control={control}
          type="checkbox"
          placeholder="Remote Punching"
          label="Remote Punching"
          errors={errors}
          error={errors.remotePunching}
        />
        <AuthInputFiled
          name="performanceManagement"
          icon={TimelineOutlined}
          control={control}
          type="checkbox"
          placeholder="Performance Management"
          label="Performance Management"
          errors={errors}
          error={errors.performanceManagement}
          disabled={true}
        />
        <AuthInputFiled
          name="analyticsAndReporting"
          icon={BarChartOutlined}
          control={control}
          type="checkbox"
          placeholder="Analytics And Reporting"
          label="Analytics And Reporting"
          errors={errors}
          error={errors.performanceManagement}
          disabled={true}
        />
        <AuthInputFiled
          name="skillMatrices"
          icon={ExtensionOutlined}
          control={control}
          type="checkbox"
          placeholder="Skill Matrices"
          label="Skill Matrices"
          errors={errors}
          error={errors.performanceManagement}
          disabled={true}
        />
      </div>
      <Button type="submit" variant="contained" className="!w-max !mx-auto">
        Submit
      </Button>
    </form>
  );
};

export default Step2MiniForm;
