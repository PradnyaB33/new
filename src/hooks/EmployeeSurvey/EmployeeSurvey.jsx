import { create } from "zustand";

const useCreateEmployeeSurveyState = create((set) => {
    return {
        title: undefined,
        description: undefined,
        employeeSurveyStartingDate: undefined,
        employeeSurveyEndDate: undefined,
        to: undefined
}});

export default useCreateEmployeeSurveyState;
