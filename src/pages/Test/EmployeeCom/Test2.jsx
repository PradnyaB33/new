import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddBusiness,
  Badge,
  ClosedCaption,
  ContactMail,
  Key,
  KeyOff,
  LocationCity,
  MonetizationOn,
  PersonAddAlt,
  PersonPin,
  Today,
  TodayOutlined,
  Work,
} from "@mui/icons-material";
import moment from "moment";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpOption from "../../../hooks/Employee-OnBoarding/useEmpOption";
import useEmpState from "../../../hooks/Employee-OnBoarding/useEmpState";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";

const Test2 = ({ isLastStep, nextStep, prevStep }) => {
  const organisationId = useParams("");
  const {
    Departmentoptions,
    onBoardManageroptions,
    RolesOptions,
    Shiftoptions,
    locationoption,
    cosnotoptions,
    salaryTemplateoption,
    empTypesoption,
    Designationoption,
  } = useEmpOption(organisationId);

  const {
    confirmPassword,
    designation,
    profile,
    worklocation,
    deptname,
    employmentType,
    empId,
    mgrempid,
    joining_date,
    salarystructure,
    dept_cost_center_no,
    companyemail,
    setStep2Data,
    password,
    shift_allocation,
    date_of_birth,
  } = useEmpState();

  const isAtLeastNineteenYearsOld = (value) => {
    const dob = new Date(value);
    // let differenceInYears = currentDate.getFullYear() - dob.getFullYear();
    // const monthDiff = currentDate.getMonth() - dob.getMonth();

    // // If the birth month is after the current month, reduce the age by 1
    // if (
    //   monthDiff < 0 ||
    //   (monthDiff === 0 && currentDate.getDate() < dob.getDate())
    // ) {
    //   differenceInYears--;
    // }

    const birth = moment(date_of_birth, "YYYY-MM-DD");
    const currentValue = moment(dob, "YYYY-MM-DD");
    const differenceInDOB = currentValue.diff(birth, "years");

    return differenceInDOB >= 19;
  };

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleCPassword, setVisibleCPassword] = useState(false);

  const { data } = useSubscriptionGet(organisationId);
  console.log(`🚀 ~ subscriptionDetails:`, data?.organisation?.foundation_date);
  const EmployeeSchema = z
    .object({
      password: z
        .string()
        .min(8)
        .refine((value) => passwordRegex.test(value), {
          message:
            "Password must contain at least one number, one special character, and be at least 8 characters long",
        }),
      confirmPassword: z.string(),
      designation: z.object({
        label: z.string(),
        value: z.string(),
      }),
      worklocation: z.object({
        label: z.string(),
        value: z.string(),
      }),
      deptname: z.object({
        label: z.string(),
        value: z.string(),
      }),
      employmentType: z.object({
        label: z.string(),
        value: z.string(),
      }),
      empId: z
        .string()
        .min(1, { message: "Employee code is required" })
        .max(25, { message: "Employee code is not greater than 25 character" }),
      mgrempid: z
        .object({
          label: z.string().optional(),
          value: z.string().optional(),
        })
        .optional()
        .nullable(),
      joining_date: z
        .string()
        .refine(isAtLeastNineteenYearsOld, {
          message: "Employee must be at least 19 years old",
        })
        .refine(
          (value) => {
            const joiningDate = moment(value, "YYYY-MM-DD");
            console.log(`🚀 ~ joiningDate:`, joiningDate);
            const orgDate = moment(
              data?.organisation?.foundation_date,
              "YYYY-MM-DD"
            );
            console.log(`🚀 ~ orgDate:`, orgDate, joiningDate);
            return orgDate.isBefore(joiningDate);
          },
          {
            message:
              "Joining date cannot be before the organisation's foundation date",
          }
        )
        .refine(
          (value) => {
            const joiningDate = moment(value, "YYYY-MM-DD"); // replace 'YYYY-MM-DD' with your date format
            const currentDate = moment();
            return joiningDate.isSameOrBefore(currentDate);
          },
          {
            message: "Joining date cannot be in the future",
          }
        ),
      salarystructure: z.object({
        label: z.string(),
        value: z.string(),
      }),
      dept_cost_center_no: z.object({
        label: z.string(),
        value: z.string(),
      }),

      companyemail: z.string().email(),
      profile: z.string().array().optional(),
      shift_allocation: z.object({
        label: z.string(),
        value: z.string(),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password don't match",
      path: ["confirmPassword"],
    });

  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      confirmPassword: confirmPassword,
      password: password,
      designation: designation,
      profile: profile,
      worklocation: worklocation,
      deptname: deptname,
      employmentType: employmentType,
      empId: empId,
      mgrempid: mgrempid,
      joining_date: joining_date,
      salarystructure: salarystructure,
      dept_cost_center_no: dept_cost_center_no,
      companyemail: companyemail,
      shift_allocation: shift_allocation,
    },
    resolver: zodResolver(EmployeeSchema),
  });

  const { errors } = formState;
  const onsubmit = (data) => {
    setStep2Data(data);
    nextStep();
  };

  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Company Info</h1>

      <form
        onSubmit={handleSubmit(onsubmit)}
        className="w-full flex space-y-2  flex-1 flex-col"
      >
        <div className="md:flex block w-full ">
          <AuthInputFiled
            name="empId"
            icon={Work}
            control={control}
            type="text"
            placeholder="Employee Code"
            label="Employee Code *"
            errors={errors}
            error={errors.empId}
          />
        </div>
        <div className="grid grid-cols-1  md:grid-cols-3 w-full gap-3">
          <AuthInputFiled
            name="deptname"
            value={deptname}
            icon={AddBusiness}
            control={control}
            type="select"
            placeholder="Department"
            label="Select Department  *"
            errors={errors}
            error={errors.deptname}
            options={Departmentoptions}
          />
          <AuthInputFiled
            name="mgrempid"
            value={mgrempid}
            icon={PersonAddAlt}
            control={control}
            isClearable={true}
            type="select"
            placeholder="Manager"
            label="Select Manager "
            errors={errors}
            error={errors.mgrempid}
            options={onBoardManageroptions}
          />
          <AuthInputFiled
            name="profile"
            icon={PersonPin}
            control={control}
            type="mutltiselect"
            value={profile}
            placeholder="Role"
            label="Select Role "
            errors={errors}
            error={errors.profile}
            options={RolesOptions}
          />
        </div>

        <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-3">
          <AuthInputFiled
            name="companyemail"
            icon={ContactMail}
            control={control}
            type="text"
            placeholder="Email"
            label="Company Email *"
            errors={errors}
            error={errors.companyemail}
            wrapperMessage={"Note this email is used for login credentails"}
          />
          <AuthInputFiled
            name="joining_date"
            icon={TodayOutlined}
            control={control}
            type="date"
            placeholder="dd-mm-yyyy"
            label="Date of Joining *"
            errors={errors}
            error={errors.joining_date}
          />
        </div>
        <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-3">
          <AuthInputFiled
            name="password"
            visible={visiblePassword}
            setVisible={setVisiblePassword}
            icon={Key}
            control={control}
            type="password"
            placeholder=""
            label="Password *"
            errors={errors}
            error={errors.password}
          />
          <AuthInputFiled
            name="confirmPassword"
            visible={visibleCPassword}
            setVisible={setVisibleCPassword}
            icon={KeyOff}
            control={control}
            type="password"
            placeholder=""
            label="Confirm Password *"
            errors={errors}
            error={errors.confirmPassword}
          />
        </div>
        <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-3">
          <AuthInputFiled
            name="designation"
            icon={Work}
            control={control}
            value={designation}
            placeholder="Designation"
            label="Select Designation *"
            type="select"
            options={Designationoption}
            errors={errors}
            error={errors.designation}
          />
          <AuthInputFiled
            name="shift_allocation"
            value={shift_allocation}
            icon={Today}
            control={control}
            type="select"
            options={Shiftoptions}
            placeholder="Shift"
            label="Select Shift *"
            errors={errors}
            error={errors.shift_allocation}
          />
        </div>
        <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-3">
          <AuthInputFiled
            name="dept_cost_center_no"
            value={dept_cost_center_no}
            icon={ClosedCaption}
            control={control}
            options={cosnotoptions}
            type="select"
            placeholder="Department Cost No"
            label="Select Department Cost No*"
            errors={errors}
            error={errors.dept_cost_center_no}
          />
          <AuthInputFiled
            name="worklocation"
            value={worklocation}
            icon={LocationCity}
            control={control}
            type="select"
            placeholder="Location"
            label="Select Location *"
            options={locationoption}
            errors={errors}
            error={errors.worklocation}
          />
        </div>
        <div className="grid grid-cols-1  md:grid-cols-2 w-full gap-3">
          <AuthInputFiled
            value={employmentType}
            name="employmentType"
            icon={Badge}
            control={control}
            type="select"
            placeholder="Employment Type "
            label="Select Employment Type *"
            options={empTypesoption}
            errors={errors}
            error={errors.employmentType}
          />
          <AuthInputFiled
            name="salarystructure"
            value={salarystructure}
            icon={MonetizationOn}
            control={control}
            type="select"
            placeholder="Salary Temp"
            label="Select Salary Template *"
            options={salaryTemplateoption}
            errors={errors}
            error={errors.salarystructure}
          />
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

export default Test2;
