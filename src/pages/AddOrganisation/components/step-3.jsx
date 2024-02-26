import { zodResolver } from "@hookform/resolvers/zod";
import { CorporateFare, PeopleAltOutlined } from "@mui/icons-material";
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
    remotePunchingPackage,
    performancePackage,
    basicTrainingPackage,
    communicationPackage,
    loanManagementPackage,
    cateringFoodPackage,
    analyticsAndReportingPackage,
    skillMatrixPackage,
    setStep3Data,
    data,
  } = useOrg();

  const universalSelection = {
    remotePunchingPackage,
    performancePackage,
    basicTrainingPackage,
    communicationPackage,
    loanManagementPackage,
    cateringFoodPackage,
    analyticsAndReportingPackage,
    skillMatrixPackage,
  };
  const step3Schema = z.object({
    ...Object.fromEntries(
      Object.keys(universalSelection)
        .filter((packageName) => universalSelection[packageName])
        .map((packageName) => [
          `${packageName}Count`,
          z.string().refine(
            (doc) => {
              if (Number(doc) > 1) {
                return true;
              } else {
                return false;
              }
            },
            { message: "Number should be greater than 1" }
          ),
        ])
    ),
    basicPackageCount: z
      .string()
      .min(1)
      .refine(
        (doc) => {
          if (Number(doc) > 1) {
            return true;
          } else {
            return false;
          }
        },
        { message: "Number should be greater than 1" }
      ),
  });

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(step3Schema),
    defaultValues: data,
  });
  const { errors } = formState;
  console.log(`🚀 ~ file: step-3.jsx:53 ~ errors:`, errors);
  const onSubmit = (data) => {
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
          name={`basicPackageCount`}
          icon={PeopleAltOutlined}
          control={control}
          type="number"
          placeholder={`How many member will be in your organisation`}
          label={`Organisation Member Count *`}
          errors={errors}
          error={errors.basicPackageCount}
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
          Confirm & Pay
        </Button>
      </form>
    </div>
  );
};

export default Step3;
