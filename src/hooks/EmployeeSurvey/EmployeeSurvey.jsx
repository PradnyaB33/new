import { create } from "zustand";

const useSurveyState = create((set) => ({
    title: '',
    description: '',
    questions: [],
    employeeSurveyStartingDate: null,
    employeeSurveyEndDate: null,
    setSurveyDetails: (title, description, questions) => set({
        title,
        description,
        questions
    }),
    setSurveyDates: (startDate, endDate) => set({
        employeeSurveyStartingDate: startDate,
        employeeSurveyEndDate: endDate
    }),
    addQuestion: (question) => set((state) => ({
        questions: [...state.questions, question]
    })),
    updateQuestion: (index, question) => set((state) => ({
        questions: state.questions.map((q, i) => (i === index ? question : q))
    })),
    removeQuestion: (index) => set((state) => ({
        questions: state.questions.filter((_, i) => i !== index)
    })),
    resetSurvey: () => set({
        title: '',
        description: '',
        questions: [],
        employeeSurveyStartingDate: null,
        employeeSurveyEndDate: null
    }),
}));

export default useSurveyState;
