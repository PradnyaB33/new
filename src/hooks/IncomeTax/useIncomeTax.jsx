import create from "zustand";

const useIncomeTax = create((set) => ({
  editStatus: {},
  tableData: [],
  declarationData: {},
  deleteConfirmation: null,
  pdf: null,
  setTableData: (newData) => set({ tableData: newData }),
  setEditStatus: (newStatus) => set({ editStatus: newStatus }),
  handleDeleteConfirmation: (id) => set({ deleteConfirmation: id }),
  handlePDF: (id) => set({ pdf: id }),
  handleClosePDF: () => set({ pdf: null }),
  handleEditClick: (itemIndex) =>
    set((state) => ({
      editStatus: {
        ...state.editStatus,
        [itemIndex]: !state.editStatus[itemIndex],
      },
    })),
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
