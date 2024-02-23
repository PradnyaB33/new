import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccountBalance,
  AccountBox,
  ContactEmergency,
  Email,
  LocationOn,
  Person,
  TodayOutlined,
} from "@mui/icons-material";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";

const Test1 = ({ nextStep, prevStep, isFirstStep, isLastStep }) => {
  const {
    setStep1Data,
    first_name,
    last_name,
    email,
    gender,
    phone_number,
    address,
    citizenship,
    adhar_card_number,
    pan_card_number,
    bank_account_no,
    date_of_birth,
  } = useEmpState();

  const isAtLeastNineteenYearsOld = (value) => {
    const currentDate = new Date();
    const dob = new Date(value);
    let differenceInYears = currentDate.getFullYear() - dob.getFullYear();
    const monthDiff = currentDate.getMonth() - dob.getMonth();

    // If the birth month is after the current month, reduce the age by 1
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < dob.getDate())
    ) {
      differenceInYears--;
    }

    return differenceInYears >= 19;
  };

  const EmployeeSchema = z.object({
    first_name: z
      .string()
      .min(1, { message: "Minimum 1 character required" })
      .max(15, { message: "Maximum 15 character allowed" })
      .regex(/^[a-zA-Z]+$/, { message: "Only character allowed" }),
    last_name: z
      .string()
      .min(1, { message: "Minimum 1 character required" })
      .max(15, { message: "Maximum 15 character allowed" })
      .regex(/^[a-zA-Z]+$/, { message: "Only character allowed" }),
    gender: z.string(),
    email: z.string().email(),
    phone_number: z
      .string()
      .max(10, { message: "Phone Number must be 10 digits" })
      .refine((value) => value.length === 10, {
        message: "Phone Number must be exactly 10 digits",
      }),
    address: z.string(),
    date_of_birth: z.string().refine(isAtLeastNineteenYearsOld, {
      message: "Employee must be at least 19 years old",
    }),
    citizenship: z
      .string()
      .min(3, { message: "min 3 character required" })
      .regex(/^[a-zA-Z]+$/, { message: "Only character allowed" }),
    adhar_card_number: z.string(),
    pan_card_number: z.string(),
    bank_account_no: z.string(),
  });

  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      first_name: first_name,
      last_name: last_name,
      date_of_birth: date_of_birth,
      email: email,
      gender: gender,
      phone_number: phone_number,
      address: address,
      citizenship: citizenship,
      adhar_card_number: adhar_card_number,
      pan_card_number: pan_card_number,
      bank_account_no: bank_account_no,
    },
    resolver: zodResolver(EmployeeSchema),
  });

  const { errors } = formState;

  const onSubmit = async (data) => {
    console.log(`🚀 ~ data:`, data);
    setStep1Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Personal Details</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex  flex-1 space-y-2 flex-col"
      >
        <div className="grid grid-cols-3 w-full gap-3">
          <AuthInputFiled
            name="first_name"
            icon={Person}
            control={control}
            type="text"
            placeholder="Jhon"
            label="Employee First Name *"
            errors={errors}
            error={errors.first_name}
          />

          <AuthInputFiled
            name="last_name"
            icon={Person}
            control={control}
            type="text"
            placeholder="Doe"
            label="Employee Last Name *"
            errors={errors}
            error={errors.last_name}
          />

          <AuthInputFiled
            name="date_of_birth"
            icon={TodayOutlined}
            control={control}
            type="date"
            placeholder="dd-mm-yyyy"
            label="Date of Birth *"
            errors={errors}
            error={errors.date_of_birth}
          />
        </div>

        <div className="grid grid-cols-2 w-full gap-3">
          <AuthInputFiled
            name="email"
            icon={Email}
            control={control}
            type="text"
            placeholder="Employee Email"
            label="Employee  Email *"
            errors={errors}
            error={errors.email}
          />

          <AuthInputFiled
            name="phone_number"
            icon={ContactEmergency}
            control={control}
            type="number"
            placeholder="1234567890"
            label="Contact 1 *"
            errors={errors}
            error={errors.phone_number}
          />
        </div>

        <AuthInputFiled
          name="address"
          icon={Person}
          control={control}
          type="textarea"
          placeholder="Address"
          label="Permanent Address *"
          errors={errors}
          error={errors.address}
        />

        <div className="space-y-1 ">
          <label
            htmlFor={"gender"}
            className={`${
              errors.gender && "text-red-500"
            }  text-gray-500  font-bold  text-sm md:text-md`}
          >
            Gender *
          </label>
          <Controller
            control={control}
            name={"gender"}
            id={"gender"}
            render={({ field }) => (
              <>
                <div
                  className={`flex items-center gap-5 rounded-md  px-2   bg-white py-1 md:py-[6px]`}
                >
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    {...field}
                  >
                    <FormControlLabel
                      value="female"
                      control={<Radio />}
                      label="Female"
                    />
                    <FormControlLabel
                      value="male"
                      control={<Radio />}
                      label="Male"
                    />
                    <FormControlLabel
                      value="transgender"
                      control={<Radio />}
                      label="Transgender"
                    />
                  </RadioGroup>
                </div>
              </>
            )}
          />
          <div className="h-4 w-[200px]  !z-50   !mb-1">
            <ErrorMessage
              errors={errors}
              name={"gender"}
              render={({ message }) => (
                <p className="text-sm mb-4 relative !bg-white  text-red-500">
                  {message}
                </p>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 w-full gap-2">
          <AuthInputFiled
            name="adhar_card_number"
            icon={AccountBox}
            control={control}
            type="number"
            placeholder="Aadhaar No"
            label="Employee Aadhar No *"
            errors={errors}
            error={errors.adhar_card_number}
          />
          <AuthInputFiled
            name="pan_card_number"
            icon={AccountBox}
            control={control}
            type="text"
            placeholder="Employee Pan No"
            label="Employee Pan No *"
            errors={errors}
            error={errors.pan_card_number}
          />
        </div>

        <div className="grid grid-cols-2 w-full gap-2">
          <AuthInputFiled
            name="bank_account_no"
            icon={AccountBalance}
            control={control}
            type="number"
            placeholder="Bank Account No"
            label="Bank Account No*"
            errors={errors}
            error={errors.bank_account_no}
          />
          <AuthInputFiled
            name="citizenship"
            icon={LocationOn}
            control={control}
            type="text"
            placeholder="Citizenship Status."
            label="Citizenship Status. *"
            errors={errors}
            error={errors.citizenship}
            pattern="[A-Za-z\s]+"
          />
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            disabled={isLastStep}
            class="!w-max flex group justify-center px-6 gap-2 items-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Test1;
