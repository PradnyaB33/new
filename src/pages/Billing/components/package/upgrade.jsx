import { zodResolver } from "@hookform/resolvers/zod";
import { FactoryOutlined, Numbers } from "@mui/icons-material";
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
const UpgradePackage = ({ handleClose, open, organisation }) => {
  const { updateMemberCount } = useManageSubscriptionMutation();

  const packageSchema = z.object({
    memberCount: z
      .string()
      .refine((doc) => Number(doc) > 0, { message: "Count is greater than 0" }),
    packageInfo: z.object({
      value: z.string(),
      label: z.string(),
    }),
    promoCode: z.string().optional(),
    paymentType: z.enum(["Phone_Pay", "RazorPay"]),
  });

  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      memberCount: `${organisation?.memberCount}` || "",
    },
    resolver: zodResolver(packageSchema),
  });

  const { errors, isDirty } = formState;
  function onSubmit(data) {
    updateMemberCount(
      { organizationId: organisation._id, ...data },
      handleClose
    );
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
        <h1 className="text-xl font-semibold font-sans">
          Upgrade subscription
        </h1>
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
          <AuthInputFiled
            name="paymentType"
            icon={FactoryOutlined}
            control={control}
            type="naresh-select"
            placeholder="Select your Merchant"
            label="Payment Gateway *"
            errors={errors}
            error={errors.paymentType}
            options={[
              { value: "Phone_Pay", label: "Phone_Pay" },
              { value: "RazorPay", label: "RazorPay" },
            ]}
            descriptionText={"Additional 2% charges on razorpay transaction"}
          />
          <AuthInputFiled
            name="promoCode"
            icon={Numbers}
            control={control}
            type="text"
            placeholder="Promo Code "
            label="Promo Code"
            errors={errors}
            error={errors.promoCode}
            descriptionText={`Your total Price will be ${
              watch("memberCount") * 100
            }`}
          />
          <Button variant="contained" disabled={!isDirty} type="submit">
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default UpgradePackage;
