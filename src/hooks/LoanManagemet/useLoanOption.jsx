import useLoanQuery from "./useLoanQuery";



const useLoanOption = (organisationId) => {

  const {LoanTypeListCall} = useLoanQuery(organisationId);

  const LoanTypeList = LoanTypeListCall();
  console.log("loan type list" , LoanTypeList);
  
  const LoanTypeListOption = LoanTypeList?.data?.map((item) => {
    return {
      value: item?._id,
      label: item?.loanName
      ,
    };
  });

 console.log("loan type option" , LoanTypeListOption);
  return {
    LoanTypeListOption

  };
};

export default useLoanOption;
