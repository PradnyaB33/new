import { format } from "date-fns";
import { create } from "zustand";

console.log(
  `🚀 ~ file: zustand-store.jsx:39 ~ format(new Date(), "yyyy-MM-dd"):`,
  format(new Date(), "yyyy-MM-dd")
);
const useTrainingStore = create((set) => ({
  trainingId: undefined,
  trainingName: undefined,
  trainingType: undefined,
  trainingDescription: undefined,
  trainingStartDate: undefined,
  trainingEndDate: undefined,
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
  trainingDuration: undefined,
  open: false,

  setStep1: (data) => {
    set({
      trainingName: data.trainingName,
      trainingDescription: data.trainingDescription,
      trainingImage: data.trainingImage,
    });
  },
  setStep2: (data) => {
    set({
      trainingStartDate: data.trainingStartDate,
      trainingEndDate: data.trainingEndDate,
      trainingLocation: data.trainingLocation,
      trainingLink: data.trainingLink,
      trainingPoints: data.trainingPoints,
      trainingDownCasted: data.trainingDownCasted,
      trainingType: data.trainingType,
      trainingDuration: data.trainingDuration,
    });
  },
  setOpen: (data) => {
    set({
      open: data,
    });
  },
  setTrainingData: (data) => {
    set({
      trainingName: data.trainingName,
      trainingDescription: data.trainingDescription,
      trainingImage: data.trainingLogo,
      trainingStartDate: format(new Date(data.trainingStartDate), "yyyy-MM-dd"),
      trainingEndDate: format(new Date(data.trainingEndDate), "yyyy-MM-dd"),
      trainingLocation: data.trainingLocation,
      trainingLink: data.trainingLink,
      trainingPoints: `${data.trainingPoints}`,
      trainingDownCasted: data.trainingDownCasted,
      trainingType: data.trainingType,
      trainingDuration: data.trainingDuration,
      trainingId: data._id,
    });
  },
}));

export default useTrainingStore;
