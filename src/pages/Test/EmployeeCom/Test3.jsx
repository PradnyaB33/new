import { zodResolver } from "@hookform/resolvers/zod";
import { ContactMail } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { React } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpQuery from "../../../hooks/Employee-OnBoarding/useEmpQuery";

const Test3 = ({ isLastStep }) => {
  const organisationId = useParams("");
  const { AdditionalListCall } = useEmpQuery(organisationId);
  const { addtionalFields, addtionalLoading } = AdditionalListCall();
  console.log(`🚀 ~ addtionalFields:`, addtionalFields);

  const EmployeeSchema = z.object({
    "Shifts allocation": z.string(),
    gender: z.string(),
  });

  const { control, formState } = useForm({
    defaultValues: {},
    resolver: zodResolver(EmployeeSchema),
  });

  const { errors } = formState;

  if (addtionalLoading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Additional info</h1>

      <form className="w-full flex  flex-1 flex-col">
        <div className="grid grid-cols-2 w-full gap-3">
          {addtionalFields?.inputField?.inputDetail?.map((input, id) => (
            <AuthInputFiled
              name={input.label}
              placeholder={input.label}
              label={input.placeholder}
              icon={ContactMail}
              control={control}
              type={input.inputType}
              errors={errors}
              error={errors.label}
            />
          ))}
        </div>

        <div className="flex items-end w-full justify-end">
          <button
            type="submit"
            disabled={isLastStep}
            className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Test3;