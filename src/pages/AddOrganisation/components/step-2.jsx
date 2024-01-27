import React from "react";
import useOrg from "../../../State/Org/Org";
import Step2MiniForm from "./step-2-mini-form";

const Step2 = ({ nextStep }) => {
  const {
    remotePunching,
    performanceManagement,
    analyticsAndReporting,
    skillMatrices,
  } = useOrg();

  return (
    <div>
      {(remotePunching === false || remotePunching === true) && (
        <Step2MiniForm
          {...{
            remotePunching,
            performanceManagement,
            analyticsAndReporting,
            skillMatrices,
            nextStep,
          }}
        />
      )}
    </div>
  );
};

export default Step2;
