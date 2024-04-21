import { create } from "zustand";

const useOrg = create((set) => {
  // Get decodedToken synchronously at the time of store creation

  return {
    // Organization details
    orgName: undefined,
    foundation_date: undefined,
    web_url: undefined,
    industry_type: undefined,
    email: undefined,
    organization_linkedin_url: undefined,
    location: {
      address: undefined,
      position: {
        lat: undefined,
        lng: undefined,
      },
    },
    contact_number: undefined,
    description: undefined,
    creator: undefined, // Using the obtained decoded token
    logo_url: undefined,
    isTrial: false,
    packageInfo: undefined,
    count: undefined,
    cycleCount: "1",
    paymentType: undefined,

    // Setter function for updating multiple properties at once
    setStep2Data: (packageInfo) => {
      set({ packageInfo });
    },
    setStep1Data: async (orgName) => {
      await set({
        ...orgName,
      });
    },
    setStep3Data: (data) => {
      set({
        count: data.count,
        cycleCount: data.cycleCount,
        paymentType: data?.paymentType,
      });
    },
    setCreator: (creator) => set({ creator: creator.user._id }),
    logData: () => {
      const currentState = set(); // Access the current state
      console.log("store Data", currentState);
    },
  };
});

export default useOrg;
