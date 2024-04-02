import { format } from "date-fns";
import { create } from "zustand";

const useTrainingStore = create((set) => ({
  trainingName: undefined,
  trainingType: undefined,
  trainingDescription: undefined,
  trainingStartDate: format(new Date(), "yyyy-MM-dd"),
  trainingDuration: undefined,
  trainingLink: undefined,
  trainingImage: undefined,
  trainingLocation: {
    description: undefined,
    position: {
      lat: 0,
      lng: 0,
    },
    placeId: undefined,
  },

  setStep1: (data) => {
    set({
      trainingName: data.trainingName,
      trainingType: data.trainingType,
      trainingDescription: data.trainingDescription,
      trainingStartDate: data.trainingStartDate,
      trainingEndDate: data.trainingEndDate,
      trainingDuration: data.trainingDuration,
      trainingLink: data.trainingLink,
      trainingImage: data.trainingImage,
      trainingLocation: data.trainingLocation,
    });
  },
}));

export default useTrainingStore;
