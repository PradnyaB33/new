import { format } from "date-fns";
import { create } from "zustand";

console.log(
  `🚀 ~ file: zustand-store.jsx:39 ~ format(new Date(), "yyyy-MM-dd"):`,
  format(new Date(), "yyyy-MM-dd")
);
const useTrainingStore = create((set) => ({
  trainingName: undefined,
  trainingType: undefined,
  trainingDescription: undefined,
  trainingStartDate: format(new Date(), "yyyy-MM-dd"),
  trainingEndDate: format(new Date(), "yyyy-MM-dd"),
  trainingLink: undefined,
  trainingImage: undefined,
  trainingLocation: {
    address: undefined,
    position: {
      lat: 0,
      lng: 0,
    },
    placeId: undefined,
  },
  trainingPoints: "0",
  trainingDownCasted: false,

  setStep1: (data) => {
    set({
      trainingName: data.trainingName,
      trainingType: data.trainingType,
      trainingDescription: data.trainingDescription,
      trainingStartDate: data.trainingStartDate,
      trainingEndDate: data.trainingEndDate,
      trainingEndDate: data.trainingEndDate,
      trainingLink: data.trainingLink,
      trainingImage: data.trainingImage,
      trainingLocation: data.trainingLocation,
      trainingPoints: data.trainingPoints,
      trainingDownCasted: data.trainingDownCasted,
    });
  },
}));

export default useTrainingStore;
