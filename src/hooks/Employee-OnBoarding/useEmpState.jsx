import { create } from "zustand";

const useEmpState = create((set) => {
  // Get decodedToken synchronously at the time of store creation

  return {
    first_name: undefined,
    last_name: undefined,
    email: undefined,
    phone_number: undefined,
    address: undefined,
    citizenship: undefined,
    adhar_card_number: undefined,
    pan_card_number: undefined,
    gender: undefined,
    bank_account_no: undefined,
    date_of_birth: undefined,
    confirmPassword: undefined,
    designation: undefined,
    worklocation: undefined,
    deptname: undefined,
    employmentType: undefined,
    empId: undefined,
    mgrempid: undefined,
    joining_date: undefined,
    salarystructure: undefined,
    dept_cost_center_no: undefined,
    companyemail: undefined,
    profile: undefined,
    shift_allocation: undefined,

    data: undefined,

    // Setter function for updating multiple properties at once
    setStep2Data: (remotePunching) => {
      set({ ...remotePunching });
    },

    setStep3Data: (data) => {
      console.log(`🚀 ~ data:`, data);
      set({ data: { ...data } });
    },
    setStep1Data: (orgName) => {
      console.log(`🚀 ~ file: Org.jsx:31 ~ orgName:`, orgName);
      set({
        ...orgName,
      });
    },
    // setStep3Data: (data) => {
    //   set({ data: data });
    // },
    // setCreator: (creator) => set({ creator: creator.user._id }),
    // logData: () => {
    //   const currentState = set(); // Access the current state
    //   console.log("store Data", currentState);
    // },
  };
});

export default useEmpState;
