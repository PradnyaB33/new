import { zodResolver } from "@hookform/resolvers/zod";
import { ContactMail } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { React, useContext } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpQuery from "../../../hooks/Employee-OnBoarding/useEmpQuery";
import { UseContext } from "../../../State/UseState/UseContext";
import useEmployeeState from "../../../hooks/Employee-OnBoarding/useEmployeeState";
import { useQuery } from "react-query";
import axios from "axios";

const Test3 = ({ isLastStep, nextStep, prevStep, isFirstStep }) => {
  const organisationId = useParams("");
  const { employeeId } = useParams("");
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { AdditionalListCall } = useEmpQuery(organisationId);
  const { addtionalFields, addtionalLoading } = AdditionalListCall();
  const { setStep3Data, data } = useEmployeeState();

  const EmployeeSchema = z.object({}).catchall(z.string().optional());

  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      ...data,
    },
    resolver: zodResolver(EmployeeSchema),
  });

  const { isFetching } = useQuery(
    ["employeeId", employeeId],
    async () => {
      if (employeeId !== null && employeeId !== undefined) {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get/profile/${employeeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );

        return response.data;
      }
    },
    {
      onSuccess: (data) => {
        if (data && data.employee && data.employee.additionalInfo) {
          const { additionalInfo } = data.employee;
          Object.keys(additionalInfo).forEach((key) => {
            setValue(key, additionalInfo[key]);
          });
        }
      },
    }
  );

  console.log(isFetching);

  const onSubmit = (testData) => {
    setStep3Data(testData);
    nextStep();
  };

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
      <h1 className="text-2xl mb-4 font-bold">Additional Info</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex  flex-1 flex-col"
      >
        <div className="grid grid-cols-2 w-full gap-3">
          {addtionalFields?.inputField?.inputDetail?.map((input, id) => (
            <>
              {input.isActive && (
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
              )}
            </>
          ))}
        </div>

        <div className="flex items-end w-full justify-between">
          <button
            type="button"
            onClick={() => {
              prevStep();
            }}
            className="!w-max flex group justify-center px-6  gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Prev
          </button>
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
