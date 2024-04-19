import { zodResolver } from "@hookform/resolvers/zod";
import { RecyclingRounded } from "@mui/icons-material";
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
  width: 500,
  height: "fit-content",
  overflow: "auto",
};
const formSchema = z.object({
  cycleCount: z.string().refine((doc) => Number(doc) > 0, {
    message: "Cycle Count is greater than 0",
  }),
});
const PrepaidCard = ({ handleClose, open, organisation }) => {
  const { createPrePaidPlan } = useManageSubscriptionMutation();
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(formSchema),
  });
  const { errors, isDirty } = formState;
  function onSubmit(data) {
    console.log(`🚀 ~ file: manage-package-form.jsx:34 ~ data:`);
    createPrePaidPlan({
      organizationId: organisation._id,
      data,
      cycleCount: 1,
    });
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
        className="border-none !z-10 shadow-md outline-none rounded-md flex flex-col gap-2"
      >
        <h1 className="text-md font-semibold font-sans">
          Your Price for next month wil be &nbsp;
          {getPrice(organisation?.packageInfo) * organisation?.memberCount}
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <AuthInputFiled
            name="cycleCount"
            icon={RecyclingRounded}
            control={control}
            type="number"
            placeholder="Cycle count used for recycle your subscription"
            label="Cycle Count *"
            errors={errors}
            error={errors.cycleCount}
            descriptionText={
              "if you select 2 then you will be charged every 3 months subscription with 2 cycle it mean it will be charged for 6 months subscription just amount will be charged at one time."
            }
          />
          <Button variant="contained" disabled={!isDirty} type="submit">
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default PrepaidCard;
const getPrice = (plan) => {
  if (plan === "Basic Plan") {
    return Math.round(0.611 * 90);
  } else if (plan === "Intermediate Plan") {
    return Math.round(0.944 * 90);
  } else {
    return 115;
  }
};
