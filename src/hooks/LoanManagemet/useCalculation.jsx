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
  console.log("roi" , roi); 

   // Calculate principal monthly
   const principalMonthly =
   isNaN(loanAmount) || isNaN(noOfEmi)
     ? 0
     : parseInt(loanAmount) / parseInt(noOfEmi);
 const principalPerMonth = principalMonthly.toFixed(2);
 console.log("iprincipal montlhy" , principalMonthly);

  const value = parseInt(loanAmount) * roi 
  console.log(value);

  const value2 = parseInt(value)/12
  console.log(value2);

  const value3 = parseInt(value2) * parseInt(noOfEmi);
  console.log(value3);

  // Calculate simple interest
  const simpleInterest = (parseInt(loanAmount) * roi * parseInt(noOfEmi))/12*100;
  console.log("simple interest" , simpleInterest);

  // Calculate interest per month
  const interestMonthly = isNaN(simpleInterest)
    ? 0
    : simpleInterest / parseInt(noOfEmi);
  const interestPerMonth = interestMonthly.toFixed(2);
  console.log("intrest montlhy" , interestMonthly);

 

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
