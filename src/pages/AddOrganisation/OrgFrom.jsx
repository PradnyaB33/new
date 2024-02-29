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
const NewOranisationForm = () => {
  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(4);

  const useSwitch = (step) => {
    switch (step) {
      case 1:
        return <Step1 {...{ nextStep }} />;
      case 2:
        return <Step2 {...{ nextStep }} />;
      case 3:
        return <Step3 {...{ nextStep }} />;
      case 4:
        return <Step4 {...{ nextStep }} />;
      default:
        return null;
    }
  };
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
      label: "Package Count",
      icon: PlusOneOutlined,
    },
    {
      label: "All Done",
      icon: Check,
    },
  ];

  return (
    <div className="pt-10">
      <div className="m-4 md:w-[1200px] w-auto md:m-auto border-gray-400 border p-4 rounded-lg">
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
    </div>
  );
};

export default NewOranisationForm;
