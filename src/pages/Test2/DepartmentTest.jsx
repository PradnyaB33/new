import { Business, CheckCircle, West } from "@mui/icons-material";
import React from "react";
import StepFormWrapper from "../../components/step-form/wrapper";
import useMultiStepForm from "../../hooks/useStepForm";
import Step1 from "./DepartmentComp/Step1";
import Step2 from "./DepartmentComp/Step2";
import Step3 from "./DepartmentComp/Step3";
import PersonIcon from "@mui/icons-material/Person";

import { Link } from "react-router-dom";
const DepartmentTest = () => {
  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(3);

  const stepper = [
    {
      label: "Department details",
      icon: PersonIcon,
    },
    {
      label: "Cost Center info",
      icon: Business,
    },
    {
      label: "Confirm",
      icon: CheckCircle,
    },
  ];

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

  return (
    <div className="bg-gray-50 min-h-screen h-auto">
      <header className="text-xl w-full pt-6 bg-white shadow-md   p-4">
        <Link to={"/organizationList"}>
          <West className="mx-4 !text-xl" />
        </Link>
        Add Department
      </header>

      <section className="px-8 flex space-x-2 py-6">
        <article className="w-full rounded-lg bg-white ">
          <div className=" w-full px-5 ">
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
        </article>
      </section>
    </div>
  );
};

export default DepartmentTest;