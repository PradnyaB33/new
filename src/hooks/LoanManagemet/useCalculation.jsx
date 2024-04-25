// import dayjs from "dayjs";
// import useLaonState from "./useLaonState";

// const useCalculation = () => {
//   const {
//     rateOfIntereset,
//     loanAmount,
//     noOfEmi,
//     setNoOfEmi,
//     setCompletedDate,
//     loanDisbursementDate,
//   } = useLaonState();

//   // Calculate completion date
//   const handleNoOfEmiChange = (e) => {
//     const value = e.target.value;
//     setNoOfEmi(value);
//     calculateCompletionDate(loanDisbursementDate, value);
//   };

//   const calculateCompletionDate = (disbursementDate, emiCount) => {
//     const monthsToAdd = parseInt(emiCount);
//     if (!isNaN(monthsToAdd)) {
//       const completionDate = dayjs(disbursementDate)
//         .add(monthsToAdd - 1, "month")
//         .format("MM-DD-YYYY");
//       setCompletedDate(completionDate);
//     }
//   };

//   // calculate the rate of interest in %
//   const roi = rateOfIntereset / 100;
//   console.log("roi", roi);

//   // Calculate principal monthly
//   const principalMonthly =
//     isNaN(loanAmount) || isNaN(noOfEmi)
//       ? 0
//       : parseInt(loanAmount) / parseInt(noOfEmi);
//   const principalPerMonth = principalMonthly.toFixed(2);

//   const value = parseInt(loanAmount) * roi;
//   console.log(value);

//   const value2 = parseInt(value) / 12;
//   const interestPerMonths = value2.toFixed(2);

//   const value3 = parseInt(value2) * parseInt(noOfEmi);
//   console.log(value3);

//   // Calculate total sdeduction
//   const totalDeductionMonthly = parseFloat(value2) + principalMonthly;
//   const totalDeductionPerMonth = totalDeductionMonthly.toFixed(2);

//   // calculate total amount with simple interest
//   const totalAmountWithSimpleInterests = parseInt(loanAmount) + value3;
//   const totalAmountWithSimpleInterest =
//     totalAmountWithSimpleInterests.toFixed(2);
//   console.log(totalAmountWithSimpleInterest);

//   return {
//     principalPerMonth,
//     interestPerMonths,
//     totalDeductionPerMonth,
//     totalAmountWithSimpleInterest,
//     handleNoOfEmiChange,
//   };
// };

// export default useCalculation;

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

  const roi = rateOfIntereset / 100;
  console.log("roi", roi);

  // Calculate principal monthly
  const principalMonthly =
    isNaN(loanAmount) || isNaN(noOfEmi) || loanAmount === "" || noOfEmi === ""
      ? 0
      : parseFloat(loanAmount) / parseInt(noOfEmi);
  const principalPerMonth = principalMonthly.toFixed(2);
  console.log("iprincipal montlhy", principalMonthly);

  const value = parseInt(loanAmount) * roi;
  console.log(value);

  const value2 = parseInt(value) / 12;
  console.log(value2);

  const value3 = parseInt(value2) * parseInt(noOfEmi);
  console.log(value3);

  // Calculate simple interest
  const simpleInterest =
    ((parseInt(loanAmount) * roi * parseInt(noOfEmi)) / 12) * 100;
  console.log("simple interest", simpleInterest);

  // Calculate interest per month
  const interestMonthly = isNaN(simpleInterest)
    ? 0
    : simpleInterest / parseInt(loanAmount);
  const interestPerMonth = interestMonthly.toFixed(2);
  console.log("intrest montlhy", interestMonthly);

  // Calculate total sdeduction
  const totalDeductionMonthly = parseFloat(value2) + principalMonthly;
  const totalDeductionPerMonth = totalDeductionMonthly.toFixed(2);

  // Calculate total amount with simple interest
  const totalAmountWithSimpleInterest =
    isNaN(loanAmount) || isNaN(noOfEmi) || loanAmount === "" || noOfEmi === ""
      ? 0
      : parseFloat(loanAmount) +
        parseFloat(interestPerMonths) * parseInt(noOfEmi);

  return {
    principalPerMonth,
    interestPerMonths,
    totalDeductionPerMonth,
    totalAmountWithSimpleInterest: totalAmountWithSimpleInterest,
    handleNoOfEmiChange,
  };
};

export default useCalculation;
