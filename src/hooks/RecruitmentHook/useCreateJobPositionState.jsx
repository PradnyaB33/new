import { create } from "zustand";

const useCreateJobPositionState = create((set) => ({
  jobPosition: undefined,
  department: undefined,
  jobDescription: undefined,
  experienceRequired: undefined,
  vacancies: 1,
  hrAssigned: undefined,
  createdBy: undefined,
  location: undefined,
  date: undefined,
  modeOfWorking: undefined,
  jobType: undefined,
  requiredSkill: undefined,
  education: undefined,
  additionalCertificate: undefined,
  age: undefined,
  workingTime: undefined,

  setStep1Data: (data) => {
    console.log("asasddcc", data);

    set((state) => ({
      ...state,
      jobPosition: data.jobPosition,
      department: data.department.value,
      experienceRequired: data.experienceRequired.value,
      vacancies: data.vacancies,
      createdBy: data.createdBy.value,
      jobDescription: data.jobDescription,
    }));
  },

  setStep2Data: (data) => {
    console.log("data", data);

    set((state) => ({
      ...state,
      location: data.location,
      date: data.date,
      modeOfWorking: data.modeOfWorking,
      jobType: data.jobType,
      requiredSkill: data.requiredSkill,
      education: data.education,
      workingTime: data.workingTime,
      age: data.age,
      additionalCertificate: data.additionalCertificate
    }));
  },

  emptyState: () => {
    set({
      jobPosition: undefined,
      department: undefined,
      jobDescription: undefined,
      experienceRequired: undefined,
      vacancies: undefined,
      hrAssigned: undefined,
      createdBy: undefined,
      location: undefined,
      date: undefined,
      modeOfWorking: undefined,
      jobType: undefined,
      requiredSkill: undefined,
      education: undefined,
      additionalCertificate: undefined,
    });
  },
}));

export default useCreateJobPositionState;
