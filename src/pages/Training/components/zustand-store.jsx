import { create } from "zustand";

const useSearchTrainingZustandStore = create((set) => ({
  trainingData: [],
  trainingName: "",
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
}));

export default useSearchTrainingZustandStore;
