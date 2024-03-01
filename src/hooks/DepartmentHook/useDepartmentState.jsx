import { create } from "zustand";

const useDepartmentState = create((set) => {
  return {
    dept_name: undefined,
    dept_description: undefined,
    dept_location: undefined,
    dept_cost_center_name: undefined,
    dept_cost_center_description: undefined,
    dept_id: undefined,
    dept_cost_center_id: undefined,
    dept_head_name: undefined,
    dept_delegate_head_name: undefined,
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
    emptyState: () => {
      set({
        dept_name: undefined,
        dept_description: undefined,
        dept_location: undefined,
        dept_cost_center_name: undefined,
        dept_cost_center_description: undefined,
        dept_id: undefined,
        dept_cost_center_id: undefined,
        dept_head_name: undefined,
        dept_delegate_head_name: undefined,
        data: undefined,
      });
    },
  };
});

export default useDepartmentState;
