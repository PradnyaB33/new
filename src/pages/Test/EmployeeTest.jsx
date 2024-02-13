import {
  AddCircle,
  Business,
  CheckCircle,
  Person,
  West,
} from "@mui/icons-material";
import React from "react";
import { Link } from "react-router-dom";
import StepFormWrapper from "../../components/step-form/wrapper";
import useMultiStepForm from "../../hooks/useStepForm";
import Test1 from "./EmployeeCom/Test1 ";
import Test2 from "./EmployeeCom/Test2";
import Test3 from "./EmployeeCom/Test3";
import Test4 from "./EmployeeCom/Test4";

const EmployeeTest = () => {
  const {
    step,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
    totalSteps,
    goToStep,
  } = useMultiStepForm(4);

  const stepper = [
    {
      label: "Personal details",
      icon: Person,
    },
    {
      label: "Company info",
      icon: Business,
    },
    {
      label: "Additional fields",
      icon: AddCircle,
    },
    {
      label: "Confirm",
      icon: CheckCircle,
    },
  ];

  const useSwitch = (step) => {
    switch (step) {
      case 1:
        return <Test1 {...{ nextStep }} />;
      case 2:
        return <Test2 {...{ nextStep }} />;
      case 3:
        return <Test3 {...{ nextStep }} />;
      case 4:
        return <Test4 {...{ nextStep }} />;

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
        Employee Onboarding
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

export default EmployeeTest;