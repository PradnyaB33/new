import { create } from "zustand";

const useLaonState = create((set) => {
  return {
    loanType: undefined,
    rateOfIntereset: undefined,
    loanAmount: undefined,
    loanDisbursementDate: undefined,
    noOfEmi: undefined,
    loanCompletedDate: undefined,
    loanPrincipalAmount: undefined,
    loanInteresetAmount: undefined,
    totalDeduction: undefined,

    setLoanType: (loanType) => set({ loanType }),
    setRateOfInterest: (rateOfIntereset) => set({ rateOfIntereset }),
    setLoanAmount: (loanAmount) => set({ loanAmount }),
    setDisbursementDate: (loanDisbursementDate) =>
      set({ loanDisbursementDate }),
    setNoOfEmi: (noOfEmi) => set({ noOfEmi }),
    setCompletedDate: (loanCompletedDate) => set({ loanCompletedDate }),
    setPrincipalAmount: (loanPrincipalAmount) => set({ loanPrincipalAmount }),
    setInteresetAmount: (loanInteresetAmount) => set({ loanInteresetAmount }),
    setTotalDeduction: (totalDeduction) => set({ totalDeduction }),
  };
});

export default useLaonState;