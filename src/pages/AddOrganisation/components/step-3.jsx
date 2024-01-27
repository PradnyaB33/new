import { zodResolver } from "@hookform/resolvers/zod";
import { CorporateFare } from "@mui/icons-material";
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
const Step3 = ({ nextStep }) => {
  const {
    remotePunching,
    performanceManagement,
    analyticsAndReporting,
    skillMatrices,
    setStep3Data,
    data,
  } = useOrg();
  const universalSelection = {
    remotePunching,
    performanceManagement,
    analyticsAndReporting,
    skillMatrices,
  };
  const step3Schema = z.object({
    ...Object.fromEntries(
      Object.keys(universalSelection)
        .filter((packageName) => universalSelection[packageName])
        .map((packageName) => [`${packageName}Count`, z.string().min(1)])
    ),
    memberCount: z.string().min(1),
  });

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: data,
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(`🚀 ~ file: step-3.jsx:46 ~ data:`, data);
    setStep3Data(data);

    nextStep();
  };

  // Dynamically generate form fields based on selected packages

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="item-center flex flex-col"
        noValidate
      >
        <AuthInputFiled
          name={`memberCount`}
          icon={CorporateFare}
          control={control}
          type="number"
          placeholder={`How Many Member will be in your Organisation`}
          label={`Organisation MemberCount *`}
          errors={errors}
          error={errors.memberCount}
        />
        {Object.keys(universalSelection)
          .filter((packageName) => universalSelection[packageName])
          .map((packageName, i) => {
            return (
              <AuthInputFiled
                name={`${packageName}Count`}
                icon={CorporateFare}
                control={control}
                type="number"
                placeholder={`Enter ${convertCamelToTitle(packageName)} Count`}
                label={`${convertCamelToTitle(packageName)} Member Count *`}
                errors={errors}
                error={errors[`${packageName}`]}
              />
            );
          })}
        <Button type="submit" variant="contained" className="!w-max !mx-auto">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Step3;
