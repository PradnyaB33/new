import { useEffect } from "react";
import Bottom from "./bottom";
import Header from "./header";

const StepFormWrapper = ({
  totalSteps,
  step,
  goToStep,
  nextStep,
  prevStep,
  isFirstStep,
  isLastStep,
  children,
  className,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);
  return (
    <div
      className={`p-8 flex flex-col gap-4 border border-primary m-4 rounded-lg ${className}`}
    >
      <Header {...{ goToStep, totalSteps, step }} />
      {children}
      <Bottom {...{ isFirstStep, isLastStep, nextStep, prevStep }} />
    </div>
  );
};

export default StepFormWrapper;
