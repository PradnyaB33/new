import React from "react";
import useOrg from "../../../State/Org/Org";
import Step2MiniForm from "./step-2-mini-form";

const Step2 = ({ nextStep }) => {
  const {
    remotePunchingPackage,
    performancePackage,
    basicTrainingPackage,
    communicationPackage,
    loanManagementPackage,
    cateringFoodPackage,
    analyticsAndReportingPackage,
    skillMatrixPackage,
  } = useOrg();

  return (
    <div>
      {(remotePunchingPackage === false || remotePunchingPackage === true) && (
        <Step2MiniForm
          {...{
            remotePunchingPackage,
            performancePackage,
            basicTrainingPackage,
            communicationPackage,
            loanManagementPackage,
            cateringFoodPackage,
            analyticsAndReportingPackage,
            skillMatrixPackage,
            nextStep,
          }}
        />
      )}
    </div>
  );
};

export default Step2;
