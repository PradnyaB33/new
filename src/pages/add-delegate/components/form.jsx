import { zodResolver } from "@hookform/resolvers/zod";
import {
  Adjust,
  CalendarMonth,
  Celebration,
  ContactEmergency,
  Email,
  Flag,
  Password,
  Person,
  Person2,
  Person3,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import moment from "moment";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useDelegateSuperAdmin from "../../../hooks/QueryHook/Delegate-Super-Admin/mutation";
const packageSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  middle_name: z.string(),
  joining_date: z.string(),
  email: z.string().email(),
  phone_number: z.string().min(10).max(10),
  password: z.string(),
  date_of_birth: z.string(),
  gender: z.enum(["Male", "Female", "Other"]),
  profile: z.enum(["Delegate-Super-Admin"]),
  citizenship: z.string(),
  _id: z.string(),
});
const MiniForm = ({ data }) => {
  const { addDelegateMutation } = useDelegateSuperAdmin();

  const { control, formState, handleSubmit, getValues } = useForm({
    defaultValues: {
      first_name: data?.delegateSuperAdmin?.first_name,
      last_name: data?.delegateSuperAdmin?.last_name,
      middle_name: data?.delegateSuperAdmin?.middle_name,
      joining_date: moment(data?.delegateSuperAdmin?.joining_date).format(
        "yyyy-MM-DD"
      ),
      email: data?.delegateSuperAdmin?.email,
      phone_number: data?.delegateSuperAdmin?.phone_number,
      password: undefined,
      date_of_birth: moment(data?.delegateSuperAdmin?.date_of_birth).format(
        "yyyy-MM-DD"
      ),
      gender: data?.delegateSuperAdmin?.gender,
      profile: "Delegate-Super-Admin",
      citizenship: data?.delegateSuperAdmin?.citizenship,
      _id: data?.delegateSuperAdmin?._id || "",
    },
    resolver: zodResolver(packageSchema),
  });

  const { errors, isDirty } = formState;
  const onSubmit = async (data) => {
    console.log("data", data);
    await addDelegateMutation.mutate(data);
  };

  console.log(`🚀 ~ file: form.jsx:61 ~ getValues:`, getValues());
  return (
    <>
      <h1 className="text-xl pl-2 font-semibold font-sans">
        Add Delegate Super Admin
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
        noValidate
      >
        <div className="grid grid-cols-2 gap-4 w-max">
          <AuthInputFiled
            name={"first_name"}
            icon={Person}
            control={control}
            type="text"
            placeholder={"eg. Sahil"}
            label={`First Name *`}
            errors={errors}
            error={errors?.first_name}
            className={"!min-w-80 !max-w-64"}
          />
          <AuthInputFiled
            className={"!min-w-80 !max-w-64"}
            name={"middle_name"}
            icon={Person2}
            control={control}
            type="text"
            placeholder={"eg. Hanmant"}
            label={`Middle name *`}
            errors={errors}
            error={errors?.middle_name}
          />
          <AuthInputFiled
            className={"!min-w-80 !max-w-64"}
            name={"last_name"}
            icon={Person3}
            control={control}
            type="text"
            placeholder={"eg. Barge"}
            label={`Last name *`}
            errors={errors}
            error={errors?.last_name}
          />
          <AuthInputFiled
            className={"!min-w-80 !max-w-64"}
            name={"joining_date"}
            icon={CalendarMonth}
            control={control}
            type="date"
            placeholder={"eg. Barge"}
            label={`Joining Date *`}
            errors={errors}
            error={errors?.joining_date}
          />
          <AuthInputFiled
            className={"!min-w-80 !max-w-64"}
            name={"email"}
            icon={Email}
            control={control}
            type="email"
            placeholder={"eg. sahilbarge@gmail.com"}
            label={`Enter your email *`}
            errors={errors}
            error={errors?.email}
          />
          <AuthInputFiled
            className={"!min-w-80 !max-w-64"}
            name={"phone_number"}
            icon={ContactEmergency}
            control={control}
            type="number"
            placeholder={"eg. 33333-44444"}
            label={`Enter your phone number*`}
            errors={errors}
            error={errors?.phone_number}
          />
          <AuthInputFiled
            className={"!min-w-80 !max-w-64"}
            name={"gender"}
            icon={Adjust}
            control={control}
            type="naresh-select"
            placeholder={"eg. Male"}
            label={`Select gender *`}
            errors={errors}
            error={errors?.gender}
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
            ]}
          />
          <AuthInputFiled
            className={"!min-w-80 !max-w-64"}
            name={"password"}
            icon={Password}
            control={control}
            type="password"
            placeholder={"Password here"}
            label={`Enter your password *`}
            errors={errors}
            error={errors?.password}
          />
          <AuthInputFiled
            className={"!min-w-80 !max-w-64"}
            name={"date_of_birth"}
            icon={Celebration}
            control={control}
            type="date"
            placeholder={"date_of_birth here"}
            label={`Date of birth *`}
            errors={errors}
            error={errors?.date_of_birth}
          />

          <AuthInputFiled
            className={"!min-w-80 !max-w-80"}
            name={"citizenship"}
            icon={Flag}
            control={control}
            type="text"
            placeholder={"eg. Indian"}
            label={`Citizenship *`}
            errors={errors}
            error={errors?.citizenship}
          />
        </div>

        <Button variant="contained" disabled={!isDirty} type="submit">
          Submit
        </Button>
      </form>
    </>
  );
};

export default MiniForm;
