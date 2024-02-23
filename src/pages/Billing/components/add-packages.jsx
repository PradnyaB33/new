import { zodResolver } from "@hookform/resolvers/zod";
import { PostAdd } from "@mui/icons-material";
import { Box, Button, Modal } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
  width: 450,
};
const MiniPackagesForm = ({ handleClose, open, setPackage }) => {
  const packageSchema = z.object({
    package: z.enum([
      "basicPackageCount",
      "remotePunchingPackageCount",
      "performancePackageCount",
      "basicTrainingPackageCount",
      "communicationPackageCount",
      "loanManagementPackageCount",
      "cateringFoodPackageCount",
    ]),
  });
  let defaultValues = {};

  const { control, formState, handleSubmit } = useForm({
    defaultValues,
    resolver: zodResolver(packageSchema),
  });
  const { errors, isDirty } = formState;
  function onSubmit(data) {
    setPackage((prevData) => [...prevData, [data.package, "0"]]);
    handleClose();
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
        <h1 className="text-xl pl-2 font-semibold font-sans">Add package</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <AuthInputFiled
            name="package"
            icon={PostAdd}
            control={control}
            type="naresh-select"
            placeholder="Select package "
            label="Select package  *"
            errors={errors}
            error={errors.package}
            options={[
              {
                value: "basicPackageCount",
                label: "Basic package 35₹ /employee",
              },
              {
                value: "remotePunchingPackageCount",
                label: "Remote punching 35₹ /employee",
              },
              {
                value: "performancePackageCount",
                label: "Performance evaluation 35₹ /employee",
              },

              {
                value: "basicTrainingPackageCount",
                label: "Basic training package 35₹ /employee",
              },
              {
                value: "communicationPackageCount",
                label: "Communication package 35₹ /employee",
              },
              {
                value: "loanManagementPackageCount",
                label: "Loan management package 35₹ /employee",
              },
              {
                value: "cateringFoodPackageCount",
                label: "Catering Food package 35₹ /employee",
              },
              {
                value: "analyticsAndReportingPackageCount",
                label: "Analytics and reporting package 35₹ /employee",
              },
              {
                value: "skillMatrixPackageCount",
                label: "Analytics and reporting package 35₹ /employee",
              },
            ]}
          />
          <Button variant="contained" disabled={!isDirty} type="submit">
            Add
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default MiniPackagesForm;
function transformString(inputString, excludedWords = []) {
  return inputString
    .split(/(?=[A-Z])/)
    .map((word) => {
      console.log(`🚀 ~ file: manage-package-form.jsx:74 ~ word:`, word);
      const formattedWord = word.charAt(0).toUpperCase() + word.slice(1);
      return excludedWords.includes(formattedWord) ? "" : formattedWord;
    })
    .join(" ")
    .trim();
}
