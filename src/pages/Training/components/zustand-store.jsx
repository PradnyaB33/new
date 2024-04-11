import { create } from "zustand";

const useSearchTrainingZustandStore = create((set) => ({
  page: 1,
  trainingData: [],
  trainingName: "",
  totalResult: 0,
  setTrainingData: (data) => {
    set({
      trainingData: data,
    });
  },
  setTrainingName: (data) => {
    set({
      trainingName: data,
    });
  },
  setPage: (data) => {
    set({
      page: data,
    });
  },
  setTotalResult: (data) => {
    set({
      totalResult: data,
    });
  },
}));

export default useSearchTrainingZustandStore;
