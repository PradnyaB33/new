import useLaonState from "./useLaonState";
import dayjs from "dayjs";

const useCalculation = () => {
  const {
    rateOfIntereset,
    loanAmount,
    setNoOfEmi,
    setCompletedDate,
    loanDisbursementDate,
  } = useLaonState();

  // calculate the loan completion date
  const handleNoOfEmiChange = (value) => {
    setNoOfEmi(value);
    calculateCompletionDate(loanDisbursementDate, value);
  };

  const calculateCompletionDate = (disbursementDate, emiCount) => {
    const monthsToAdd = parseInt(emiCount);
    if (!isNaN(monthsToAdd)) {
      const completionDate = dayjs(disbursementDate)
        .add(monthsToAdd - 1, "month")
        .format("MM-DD-YYYY");
      setCompletedDate(completionDate);
    }
  };

  // calculate the rate of interest in %
  const roi = rateOfIntereset / 100;

  // Calculate simple interest
  const simpleInterest = parseInt(loanAmount) * roi * parseInt(loanAmount);

  // Calculate interest per month
  const interestMonthly = isNaN(simpleInterest)
    ? 0
    : simpleInterest / parseInt(loanAmount);
  const interestPerMonth = interestMonthly.toFixed(2);

  // Calculate principal monthly
  const principalMonthly =
    isNaN(loanAmount) || isNaN(loanAmount)
      ? 0
      : parseInt(loanAmount) / parseInt(loanAmount);
  const principalPerMonth = principalMonthly.toFixed(2);

  // Calculate total deduction
  const totalDeductionMonthly =
    parseFloat(interestPerMonth) + parseFloat(principalMonthly);
  const totalDeductionPerMonth = totalDeductionMonthly.toFixed(2);

  // calculate total amount with simple interest
  const totalAmountWithSimpleInterest = parseInt(loanAmount) + simpleInterest;
  console.log(totalAmountWithSimpleInterest);

  return {
    interestPerMonth,
    principalPerMonth,
    totalDeductionPerMonth,
    totalAmountWithSimpleInterest,
    handleNoOfEmiChange,
  };
};

export default useCalculation;
