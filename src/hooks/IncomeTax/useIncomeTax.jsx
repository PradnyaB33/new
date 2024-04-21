import { create } from "zustand";

// Function to calculate the financial year
const calculateFinancialYear = () => {
  const currentDate = new Date();
  let currentYear = currentDate.getFullYear();
  let nextYear = currentYear + 1;

  // If the current month is January (0) through March (2), subtract 1 from the current year and add 1 to the next year
  if (currentDate.getMonth() < 3) {
    currentYear -= 1;
    nextYear -= 1;
  }

  return `${currentYear}-${nextYear}`;
};

const useIncomeTax = create((set) => ({
  editStatus: {},
  tableData: [],
  declarationData: {},
  deleteConfirmation: null,
  pdf: null,
  financialYear: calculateFinancialYear(),
  setTableData: (newData) => set({ tableData: newData }),
  setEditStatus: (newStatus) => set({ editStatus: newStatus }),
  handleDeleteConfirmation: (id) => set({ deleteConfirmation: id }),
  handlePDF: (id) => set({ pdf: id }),
  handleClosePDF: () => set({ pdf: null }),
  handleEditClick: (itemIndex) =>
    set((state) => {
      const newData = [...state.tableData];
      return {
        editStatus: {
          [itemIndex]: !state.editStatus[itemIndex],
        },
        declarationData: {
          ...newData[itemIndex],
        },
      };
    }),
  handleAmountChange: (e, itemIndex, handleAlert) =>
    set((state) => {
      const newData = [...state.tableData];
      const { amount, proof, ...otherData } = newData[itemIndex];
      return {
        declarationData: {
          ...state.declarationData,
          ...otherData,
          amount: e.target.value,
        },
      };
    }),
  handleProofChange: (e, itemIndex, handleAlert) =>
    set((state) => {
      const file = e.target.files[0];

      if (file?.type !== "application/pdf") {
        handleAlert(true, "error", "Only PDF format allowed");
        return state;
      }
      if (file?.size > 500 * 1024) {
        handleAlert(true, "error", "File size must be under 500kb");
        return state;
      }
      const newData = [...state.tableData];
      const { amount, proof, ...otherData } = newData[itemIndex];
      return {
        declarationData: {
          ...state.declarationData,
          ...otherData,
          proof: file,
        },
      };
    }),
  handleClose: (index) =>
    set({
      editStatus: {
        [index]: null,
      },
      declarationData: {},
    }),

  handleCloseConfirmation: () => set({ deleteConfirmation: null }),
}));

export default useIncomeTax;
