import { zodResolver } from "@hookform/resolvers/zod";
import { Numbers } from "@mui/icons-material";
import { Box, Button, Modal } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import useManageSubscriptionMutation from "./subscription-mutaiton";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
  width: 350,
  height: "fit-content",
  overflow: "auto",
};
const ManageSubscription = ({ handleClose, open, organisation }) => {
  const { updatePlan } = useManageSubscriptionMutation();

  const packageSchema = z.object({
    packageInfo: z.object({
      value: z.string(),
      label: z.string(),
    }),
  });

  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      packageInfo: {
        value: organisation?.packageInfo || "",
        label: organisation?.packageInfo || "",
      },
    },
    resolver: zodResolver(packageSchema),
  });

  const { errors, isDirty } = formState;
  function onSubmit(data) {
    updatePlan({ organizationId: organisation._id, ...data, handleClose });
  }
  return (
    <Modal
      keepMounted={false}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 shadow-md outline-none rounded-md flex flex-col"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <AuthInputFiled
            name="packageInfo"
            icon={Numbers}
            control={control}
            type="select"
            placeholder="Package Name "
            label="Package Name *"
            errors={errors}
            error={errors.packageInfo}
            options={[
              { value: "Intermediate Plan", label: "Intermediate Plan" },
              { value: "Basic Plan", label: "Basic Plan" },
            ]}
          />
          <Button variant="contained" disabled={!isDirty} type="submit">
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ManageSubscription;
