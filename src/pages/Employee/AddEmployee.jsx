import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip, FormControl, FormLabel } from "@mui/material";
import {
  Lock,
  NoEncryption,
  PermContactCalendar,
  Phone,
  Email,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import { z } from "zod";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import useHook from "./Component/useHook";

const AddEmployee = () => {
  const {
    getDesignationData,
    getLocationData,
    getEmployementTypeData,
    getSalaryInputData,
    getDepartmentData,
    getInputFieldData,
    getProfileData,
  } = useHook();

  const staticTitle =
    "This form is used to add relavant information of employee ";
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const AddEmployeeSchema = z
    .object({
      first_name: z
        .string()
        .min(2)
        .max(30)
        .regex(/^[a-zA-Z]+$/),

      last_name: z
        .string()
        .min(2)
        .max(30)
        .regex(/^[a-zA-Z]+$/),
      phone_number: z
        .string()
        .min(10, { message: "Phone Number must be 10 digit" })
        .regex(/^[0-9]+$/),
      email: z.string().email(),
      companyemail: z.string().email(),
      password: z
        .string()
        .min(8)
        .refine((value) => passwordRegex.test(value), {
          message:
            "Password must contain at least one number, one special character, and be at least 8 characters long",
        }),
      confirmPassword: z.string(),
      bank_account_no: z.number(),
      empId: z.string(),
      date_of_birth: z.date(),
      joining_date: z.date(),
      address: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password don't match",
      path: ["confirmPassword"],
    });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AddEmployeeSchema),
    defaultValues: {
      first_name: undefined,
      last_name: undefined,
      phone_number: undefined,
      email: undefined,
      password: undefined,
      bank_account_no: undefined,
      empId: undefined,
      companyemail: undefined,
      citizenship: undefined,
      address: undefined,
      date_of_birth: undefined,
      joining_date: undefined,
    },
  });
  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="content-center  flex justify-center my-0 p-0">
        <div className="w-[700px] shadow-lg rounded-lg border py-3 px-8">
          <div className="flex items-center justify-center ">
            <Tooltip title={`${staticTitle}`}>Add Employee</Tooltip>
          </div>
          <form className=" w-full  flex-1" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center gap-2">
              <AuthInputFiled
                name="first_name"
                icon={PermContactCalendar}
                control={control}
                type="text"
                placeholder="jhon"
                label="First Name *"
                errors={errors}
                error={errors.first_name}
              />

              <AuthInputFiled
                name="last_name"
                icon={PermContactCalendar}
                control={control}
                type="text"
                placeholder="jhon"
                label="Last Name *"
                errors={errors}
                error={errors.last_name}
              />
            </div>
            <div className="flex items-center gap-2">
              <AuthInputFiled
                name="phone_number"
                icon={Phone}
                control={control}
                label={"Phone Number *"}
                type={"number"}
                errors={errors}
                error={errors.phone}
                placeholder={"123456789"}
              />
              <AuthInputFiled
                name="email"
                icon={Email}
                control={control}
                type="email"
                placeholder="test@gmai..."
                label="Email Address *"
                errors={errors}
                error={errors.email}
              />
            </div>
            <div className="flex items-center gap-2">
              <AuthInputFiled
                name="password"
                icon={Lock}
                control={control}
                type="password"
                placeholder="****"
                label="Password *"
                errors={errors}
                error={errors.password}
              />

              <AuthInputFiled
                name="confirmPassword"
                icon={NoEncryption}
                control={control}
                type="password"
                placeholder="****"
                label="Confirm Password *"
                errors={errors}
                error={errors.confirmPassword}
              />
            </div>
            <div className="flex items-center gap-2">
              <AuthInputFiled
                name="bank_account_no"
                icon={PermContactCalendar}
                control={control}
                type="number"
                placeholder="jhon"
                label="Bank Account No *"
                errors={errors}
                error={errors.bank_account_no}
              />

              <AuthInputFiled
                name="empId"
                icon={PermContactCalendar}
                control={control}
                type="number"
                placeholder="jhon"
                label="Emp Id *"
                errors={errors}
                error={errors.empId}
              />
            </div>
            <div className="flex items-center gap-2">
              <AuthInputFiled
                name="companyemail"
                icon={Email}
                control={control}
                type="email"
                placeholder="test@gmai..."
                label="Company Email Address *"
                errors={errors}
                error={errors.companyemail}
              />

              <AuthInputFiled
                name="citizenship"
                icon={NoEncryption}
                control={control}
                type="text"
                placeholder="indian"
                label="Citizenships"
                errors={errors}
                error={errors.citizenship}
              />
            </div>
            <AuthInputFiled
              name="address"
              icon={PermContactCalendar}
              control={control}
              type="text"
              placeholder="Pune"
              label="Address"
              errors={errors}
              error={errors.address}
            />
            <div className="flex items-center gap-20">
              <FormControl component="fieldset">
                <FormLabel component="legend">Date of Birth</FormLabel>
                <div className="w-100">
                  <Controller
                    name="date_of_birth"
                    control={control}
                    render={({ field }) => {
                      return (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer
                            className="w-full"
                            components={["DatePicker"]}
                            required
                          >
                            <DatePicker
                              label="Date of Birth"
                              {...field}
                              slotProps={{
                                textField: { size: "small", fullWidth: true },
                              }}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      );
                    }}
                  />
                </div>
              </FormControl>
              <FormControl component="fieldset">
                <FormLabel component="legend">Joining Date</FormLabel>
                <div className="w-100">
                  <Controller
                    name="joining_date"
                    control={control}
                    render={({ field }) => {
                      return (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer
                            className="w-full"
                            components={["DatePicker"]}
                            required
                          >
                            <DatePicker
                              label="Joining Date"
                              {...field}
                              slotProps={{
                                textField: { size: "small", fullWidth: true },
                              }}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      );
                    }}
                  />
                </div>
              </FormControl>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddEmployee;
