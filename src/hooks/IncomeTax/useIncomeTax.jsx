import create from "zustand";

const useIncomeTax = create((set) => ({
  editStatus: {},
  tableData: [],
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
      console.log(`🚀 ~ state:`, state);

      const newData = [...state.tableData];
      return {
        declarationData: {
          ...newData[itemIndex],
          amount: e.target.value,
        },
      };
    }),
  handleProofChange: (e, itemIndex, handleAlert) =>
    set((state) => {
      const file = e.target.files[0];

      if (file?.type !== "application/pdf") {
        handleAlert(true, "error", "Only PDF format allowed");
        return { declarationData: {} };
      }
      if (file?.size > 500 * 1024) {
        handleAlert(true, "error", "File size must be under 500kb");
        return { declarationData: {} };
      }
      const newData = [...state.tableData];
      return {
        declarationData: {
          ...newData[itemIndex],
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
