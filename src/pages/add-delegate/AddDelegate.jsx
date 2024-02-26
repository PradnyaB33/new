import { zodResolver } from "@hookform/resolvers/zod";
import { FilterCenterFocusOutlined } from "@mui/icons-material";
import { Box, Button, Modal } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
  width: 350,
  height: 450,
  overflow: "auto",
};
console.log(`🚀 ~ file: AddDelegate.jsx:20 ~ style:`, style);
const packageSchema = z.object({
  name: z.string(),
});
const AddDelegate = () => {
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      name: undefined,
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
      <Box
        // sx={style}
        className="border-none !z-10 shadow-md outline-none rounded-md gap-2 flex flex-col absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2 bg-white p-4 w-[450px] h-[350px]"
      >
        <h1 className="text-xl pl-2 font-semibold font-sans">
          Manage subscription
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
