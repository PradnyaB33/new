import {
  BuildOutlined,
  ImportContacts,
  Person,
  Person2Outlined,
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

  const setper = [
    {
      label: "Personal details",
      icon: Person,
    },
    {
      label: "Company info",
      icon: BuildOutlined,
    },
    {
      label: "important info",
      icon: ImportContacts,
    },
    {
      label: "test info",
      icon: Person2Outlined,
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
        {/* <article
          className=" bg-gradient-to-r
           from-sky-600
           to-blue-300 h-auto w-max flex-col bg-white flex px-6 py-20  items-center "
        > */}
        {/* <div class=" h-[225px] w-[225px] rounded-lg overflow-hidden">
            <img
              class="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="none"
            />
          </div>

          <div className="flex items-center flex-col py-2 justify-center gap-2">
            <h1 className="font-bold text-lg">Jhon Show Doe</h1>

            <div>
              <div className="py-[2px] bg-slate-50 border-b-gray-200 border-[.5px] px-3 rounded-full text-blue-400 text-[.6rem]">
                Employee
              </div>
            </div>
          </div> */}
        {/* 
          <img className="h-[400px]" src="/Employee.svg" alt="none" />
        </article> */}

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
                setper,
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
