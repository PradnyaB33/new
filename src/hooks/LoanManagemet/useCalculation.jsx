import useLaonState from "./useLaonState";
import dayjs from "dayjs";
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
  console.log("roi", roi);

  // calculate the simple interest
  const simpleInterest = parseInt(loanAmount) * roi * parseInt(noOfEmi);
  console.log("simple interest", simpleInterest);

  // calculate the interest per month
  const interestMonthly = parseInt(simpleInterest) / parseInt(noOfEmi);
  const interestPerMonth = interestMonthly.toFixed(2);
  console.log("interest per month", interestPerMonth);

  // calculate the total amount
  const totalAmount = parseInt(simpleInterest) + parseInt(loanAmount);
  console.log("total amount", totalAmount);

  // calculate the principal monthly
  const principalMonthly = parseInt(loanAmount) / parseInt(noOfEmi);
  const principalPerMonth = principalMonthly.toFixed(2);
  console.log("principal monthly", principalPerMonth);

  // calculate the total duduction
  const totalDeductionMonthly = parseInt(interestPerMonth) + principalMonthly;
  const totalDeductionPerMonth = totalDeductionMonthly.toFixed(2);
  console.log("totalduction monthly", totalDeductionPerMonth);

  return {
    interestPerMonth,
    principalPerMonth,
    totalDeductionPerMonth,
    handleNoOfEmiChange,
  };
};

export default useCalculation;
