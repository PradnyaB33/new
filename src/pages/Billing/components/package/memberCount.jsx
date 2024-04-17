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
const PackageForm = ({ handleClose, open, organisation }) => {
  console.log(
    `🚀 ~ file: manage-package-form.jsx:22 ~ organisation:`,
    organisation
  );
  const { updateMemberCount } = useManageSubscriptionMutation();

  const packageSchema = z.object({
    memberCount: z
      .string()
      .refine((doc) => Number(doc) > 0, { message: "Count is greater than 0" }),
  });

  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      memberCount: `${organisation?.memberCount}` || "",
    },
    resolver: zodResolver(packageSchema),
  });

  const { errors, isDirty } = formState;
  function onSubmit(data) {
    updateMemberCount({ organizationId: organisation._id, ...data });
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
        {/* <h1 className="text-xl pl-2 font-semibold font-sans">
          Manage subscription
        </h1> */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <AuthInputFiled
            name="memberCount"
            icon={Numbers}
            control={control}
            type="number"
            placeholder="Member Count "
            label="Member Count *"
            errors={errors}
            error={errors.memberCount}
          />
          <Button variant="contained" disabled={!isDirty} type="submit">
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default PackageForm;
