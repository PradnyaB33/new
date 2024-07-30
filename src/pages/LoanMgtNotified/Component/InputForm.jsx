import React from "react";
import LoanMgtCards from "./LoanMgtCard";
import useLoanNotification from "../../../hooks/QueryHook/notification/loan-notification/useLoanNotificaiton";

const InputForm = () => {
  const { getApprovedRejectLoanDataByApprover } = useLoanNotification();

  return (
    <div className="flex w-full flex-col gap-4">
      {getApprovedRejectLoanDataByApprover &&
      getApprovedRejectLoanDataByApprover.length > 0 ? (
        getApprovedRejectLoanDataByApprover.map((item, index) => (
          <LoanMgtCards key={index} items={item} />
        ))
      ) : (
        <h1>Sorry, no request found</h1>
      )}
    </div>
  );
};

export default InputForm;
