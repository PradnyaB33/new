import {
  Business,
  Check,
  InventorySharp,
  PlusOneOutlined,
} from "@mui/icons-material";
import StepFormWrapper from "../../components/step-form/wrapper";
import useMultiStepForm from "../../hooks/useStepForm";
import Step1 from "./components/step-1";
import Step2 from "./components/step-2";
import Step3 from "./components/step-3";
import Step4 from "./components/step-4";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { Box } from "@mui/material";

const NewOrganisationForm = () => {
  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(4);
  console.log(`🚀 ~ step:`, step);

  // Function to switch between steps
  const useSwitch = (step) => {
    switch (step) {
      case 1:
        return <Step1 nextStep={nextStep} />;
      case 2:
        return <Step2 nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <Step3 nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <Step4 prevStep={prevStep} />;
      default:
        return null;
    }
  };

  // Define the stepper
  const stepper = [
    {
      label: "Organisation Details",
      icon: Business,
    },
    {
      label: "Package Info",
      icon: InventorySharp,
    },
    {
      label: "Member Count",
      icon: PlusOneOutlined,
    },
    {
      label: "All Done",
      icon: Check,
    },
  ];

  return (
    <BoxComponent>
      <Box sx={{ mb: "2%" }}>
        <HeadingOneLineInfo
          heading="Employee Onboading"
          info="Here you can add employee." />
      </Box>
      <div>
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
      </div>

    </BoxComponent>

  );
};

export default NewOrganisationForm;
