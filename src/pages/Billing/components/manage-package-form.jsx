import { zodResolver } from "@hookform/resolvers/zod";
import { AttachMoney, Numbers } from "@mui/icons-material";
import { Box, Button, Modal } from "@mui/material";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useSubscriptionMutation from "../../../hooks/QueryHook/Subscription/mutation";
import MiniPackagesForm from "./add-packages";
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
const PackageForm = ({ handleClose, open, packages, organisation }) => {
  const { handleAlert } = useContext(TestContext);
  const [mainPackages, setmainPackages] = useState(packages);
  const { updateSubscriptionMutation } = useSubscriptionMutation();

  const [close, setClose] = useState(false);
  const packageSchema = z.object({
    planDetails: z.object({
      value: z.string(),
      label: z.string(),
      isDisabled: z.boolean(),
    }),
    count: z.string(),
  });

  const { control, formState, handleSubmit, getValues } = useForm({
    defaultValues: {
      planDetails: {
        value: organisation?.subscriptionDetails?.plan_id,
        label: "Aegis Basic Plan",
        isDisabled: false,
      },
      count: organisation?.subscriptionDetails?.quantity,
    },
    resolver: zodResolver(packageSchema),
  });

  console.log(
    `🚀 ~ file: manage-package-form.jsx:45 ~ getValues:`,
    getValues()
  );
  const { errors, isDirty } = formState;
  function onSubmit(data) {
    console.log(`🚀 ~ file: manage-package-form.jsx:34 ~ data:`, data);
    updateSubscriptionMutation.mutate({
      subscriptionId: organisation?.subscriptionDetails?.id,
      data,
      handleClose,
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
        className="border-none !z-10 shadow-md outline-none rounded-md gap-2 flex flex-col"
      >
        <h1 className="text-xl pl-2 font-semibold font-sans">
          Manage subscription
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <AuthInputFiled
            name="planDetails"
            icon={AttachMoney}
            control={control}
            type="select"
            placeholder="Plan name"
            label="Select plan *"
            errors={errors}
            error={errors.planDetails}
            options={[
              {
                value:
                  process.env?.REACT_APP_BASICPLAN || "plan_NgWEcv4vEvrZFc",
                label: "Aegis Basic Plan",
                isDisabled: false,
              },
              {
                value:
                  process.env?.REACT_APP_INTERMEDIATE || "plan_NgWFMMrbumeC2U",
                label: "Aegis Intermediate Plan",
                isDisabled: false,
              },
              {
                value:
                  process.env?.REACT_APP_ENTERPRISE || "plan_NgWFtyZ4Ifd8WD",
                label: "Aegis Enterprize Plan",
                isDisabled: true,
              },
            ]}
          />
          <AuthInputFiled
            name="count"
            icon={Numbers}
            control={control}
            type="number"
            placeholder="Member Count "
            label="Member Count *"
            errors={errors}
            error={errors.count}
          />
          <Button variant="contained" disabled={!isDirty} type="submit">
            Submit
          </Button>
        </form>
        <MiniPackagesForm
          open={close}
          handleClose={() => setClose(false)}
          setPackage={setmainPackages}
          billedPackage={mainPackages}
        />
      </Box>
    </Modal>
  );
};

export default PackageForm;
function transformString(inputString, excludedWords = []) {
  return inputString
    .split(/(?=[A-Z])/)
    .map((word) => {
      const formattedWord = word.charAt(0).toUpperCase() + word.slice(1);
      return excludedWords.includes(formattedWord) ? "" : formattedWord;
    })
    .join(" ")
    .trim();
}
