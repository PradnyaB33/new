import { zodResolver } from "@hookform/resolvers/zod";
import { FilterCenterFocusOutlined } from "@mui/icons-material";
import { Box, Button, Modal } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
const packageSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  middle_name: z.string(),
  email: z.string().isEmail,
  password: z.string(),
  phone_number: z.string(),
  joining_date: z.date(),
  gender: z.date(),
  profile: z.enum(["Employee", "Delegate Super Admin"]),
  citizenship: z.enum(["Indian", "Delegate Super Admin"]),
});
const AddDelegate = () => {
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      first_name: undefined,
    },
    resolver: zodResolver(packageSchema),
  });
  const { errors, isDirty } = formState;
  const navigate = useNavigate();
  const onSubmit = (data) => {
    console.log("data", data);
  };
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
      <Box className="border-none !z-10 shadow-md outline-none rounded-md gap-2 flex flex-col absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-white p-4 h-[350px] overflow-auto md:w-[48rem] w-[350px]">
        <h1 className="text-xl pl-2 font-semibold font-sans">
          Add delegate super admin
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 w-full"
          noValidate
        >
          <div className="flex flex-col flex-wrap w-full">
            <AuthInputFiled
              name={"name"}
              icon={FilterCenterFocusOutlined}
              control={control}
              type="number"
              placeholder={"name"}
              label={`name *`}
              errors={errors}
              error={errors.name}
              className={""}
            />
            <AuthInputFiled
              name={"name"}
              icon={FilterCenterFocusOutlined}
              control={control}
              type="number"
              placeholder={"name"}
              label={`name *`}
              errors={errors}
              error={errors.name}
            />
            <AuthInputFiled
              name={"name"}
              icon={FilterCenterFocusOutlined}
              control={control}
              type="number"
              placeholder={"name"}
              label={`name *`}
              errors={errors}
              error={errors.name}
            />
            <AuthInputFiled
              name={"name"}
              icon={FilterCenterFocusOutlined}
              control={control}
              type="number"
              placeholder={"name"}
              label={`name *`}
              errors={errors}
              error={errors.name}
            />
            <AuthInputFiled
              name={"name"}
              icon={FilterCenterFocusOutlined}
              control={control}
              type="number"
              placeholder={"name"}
              label={`name *`}
              errors={errors}
              error={errors.name}
            />
            <AuthInputFiled
              name={"name"}
              icon={FilterCenterFocusOutlined}
              control={control}
              type="number"
              placeholder={"name"}
              label={`name *`}
              errors={errors}
              error={errors.name}
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
