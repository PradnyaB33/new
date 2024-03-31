import { Book, CheckCircleOutline, FitnessCenter } from "@mui/icons-material";
import { Box, Modal } from "@mui/material";
import React from "react";
import StepFormWrapper from "../../../../components/step-form/wrapper";
import useMultiStepForm from "../../../../hooks/useStepForm";
import Step1 from "./components/step1/page";
import Step2 from "./components/step2/page";
import Step3 from "./components/step3/page";

const Stepper = ({ setOpen, open }) => {
  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(3);
  const useSwitch = (step) => {
    switch (step) {
      case 1:
        return <Step1 {...{ nextStep }} />;
      case 2:
        return <Step2 {...{ nextStep }} />;
      case 3:
        return <Step3 {...{ nextStep }} />;
      default:
        return null;
    }
  };
  const stepper = [
    {
      label: "Training Details",
      icon: Book,
    },
    {
      label: "Training Attendees",
      icon: FitnessCenter,
    },
    {
      label: "Confirmation",
      icon: CheckCircleOutline,
    },
  ];
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      keepMounted
    >
      <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white">
        <StepFormWrapper
          {...{
            goToStep,
            totalSteps,
            step,
            isFirstStep,
            isLastStep,
            nextStep,
            prevStep,
            stepper,
          }}
        >
          {useSwitch(step)}
        </StepFormWrapper>
      </Box>
    </Modal>
  );
};

export default Stepper;