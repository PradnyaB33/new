import { create } from "zustand";

const useOrg = create((set) => {
  // Get decodedToken synchronously at the time of store creation

  return {
    // Organization details
    name: undefined,
    foundation_date: undefined,
    web_url: undefined,
    industry_type: undefined,
    email: undefined,
    organization_linkedin_url: undefined,
    location: undefined,
    contact_number: undefined,
    description: undefined,
    creator: undefined, // Using the obtained decoded token
    logo_url: undefined,
    remotePunching: false,
    performanceManagement: false,
    analyticsAndReporting: false,
    skillMatrices: false,
    data: undefined,

    // Setter function for updating multiple properties at once
    setStep2Data: (remotePunching) => {
      console.log(
        `🚀 ~ file: Org.jsx:30 ~ remotePunching,
      performanceManagement,
      analyticsAndReporting:`,
        remotePunching
      );
      set({ ...remotePunching });
    },
    setStep1Data: (
      name,
      foundation_date,
      web_url,
      industry_type,
      email,
      organization_linkedin_url,
      location,
      contact_number,
      description
    ) => {
      set({
        name,
        foundation_date,
        web_url,
        industry_type,
        email,
        organization_linkedin_url,
        location,
        contact_number,
        description,
      });
    },
    setStep3Data: (data) => {
      set({ data: data });
    },
    setCreator: (creator) => set({ creator: creator.user._id }),
    logData: () => {
      const currentState = set(); // Access the current state
      console.log("store Data", currentState);
    },
  };
});

export default useOrg;
