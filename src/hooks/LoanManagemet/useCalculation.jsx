import dayjs from "dayjs";
import useLaonState from "./useLaonState";
const useCalculation = () => {
  const {
    rateOfIntereset,
    loanAmount,
    noOfEmi,
    setNoOfEmi,
    setCompletedDate,
    loanDisbursementDate,
  } = useLaonState();

  // calculate the loan completion datea
  const handleNoOfEmiChange = (e) => {
    const value = e.target.value;
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
  const simpleInterest = parseInt(loanAmount) * roi * parseInt(noOfEmi);

  // Calculate interest per month
  const interestMonthly = isNaN(simpleInterest)
    ? 0
    : simpleInterest / parseInt(noOfEmi);
  const interestPerMonth = interestMonthly.toFixed(2);

  // Calculate principal monthly
  const principalMonthly =
    isNaN(loanAmount) || isNaN(noOfEmi)
      ? 0
      : parseInt(loanAmount) / parseInt(noOfEmi);
  const principalPerMonth = principalMonthly.toFixed(2);

  // Calculate total sdeduction
  const totalDeductionMonthly = parseFloat(interestPerMonth) + principalMonthly;
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
