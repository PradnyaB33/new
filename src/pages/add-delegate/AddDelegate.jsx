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
import { Box, Button, Modal } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import useGetDelegateSuperAdmin from "../../hooks/QueryHook/Delegate-Super-Admin/hook";
import useDelegateSuperAdmin from "../../hooks/QueryHook/Delegate-Super-Admin/mutation";
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
});
const AddDelegate = () => {
  const { addDelegateMutation } = useDelegateSuperAdmin();
  const { data, isLoading } = useGetDelegateSuperAdmin();
  console.log(`🚀 ~ file: AddDelegate.jsx:38 ~ data:`, data);
  const { control, formState, handleSubmit, getValues } = useForm({
    defaultValues: {
      first_name: undefined,
      last_name: undefined,
      middle_name: undefined,
      joining_date: undefined,
      email: undefined,
      phone_number: undefined,
      password: undefined,
      date_of_birth: undefined,
      gender: undefined,
      profile: "Delegate-Super-Admin",
      citizenship: undefined,
    },
    resolver: zodResolver(packageSchema),
  });
  const { errors, isDirty } = formState;
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    console.log("data", data);
    await addDelegateMutation.mutate(data);
  };
  console.log(`🚀 ~ file: AddDelegate.jsx:56 ~ getValues:`, getValues());

  return (
    <Modal
      keepMounted={false}
      open={true}
      onClose={() => {
        navigate(-1);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="border-none !z-10 shadow-md outline-none rounded-md gap-2 flex flex-col absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-white p-4 overflow-auto w-fit items-center h-min">
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
      </Box>
    </Modal>
  );
};

export default AddDelegate;
