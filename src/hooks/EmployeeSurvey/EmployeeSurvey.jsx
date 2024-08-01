import { create } from "zustand";

const useCreateEmployeeSurveyState = create((set) => {
    return {
        title: undefined,
        description: undefined,
        employeeSurveyStartingDate: undefined,
        employeeSurveyEndDate: undefined,
        to: undefined,
        from: undefined,
        subject: undefined,
        body: undefined,
}});

export default useCreateEmployeeSurveyState;