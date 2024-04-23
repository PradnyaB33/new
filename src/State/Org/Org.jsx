import { create } from "zustand";

const useOrg = create((set) => {
  // Get decodedToken synchronously at the time of store creation

  return {
    // Organization details
    // orgName: undefined,
    // foundation_date: undefined,
    // web_url: undefined,
    // industry_type: undefined,
    // email: undefined,
    // organization_linkedin_url: undefined,
    // location: {
    //   address: undefined,
    //   position: {
    //     lat: undefined,
    //     lng: undefined,
    //   },
    // },
    // contact_number: undefined,
    // description: undefined,
    // creator: undefined, // Using the obtained decoded token
    // isTrial: false,
    // packageInfo: undefined,
    // count: undefined,
    // cycleCount: "1",
    // paymentType: undefined,
    orgName: "org-one",
    foundation_date: "2002-04-06",
    web_url: "web.url.com",
    industry_type: "Technology",
    email: "org1232@email.com",
    organization_linkedin_url: "linkdin.com",
    location: {
      address: "Kathmandu, Nepal",
      position: { lat: 27.7172453, lng: 85.3239605 },
    },
    contact_number: "9370928324",
    description: "org description one",
    creator: "65ebefb05352c801e7d62485",
    isTrial: false,
    packageInfo: "Intermediate Plan",
    count: "4",
    cycleCount: "1",
    paymentType: "Phone_Pay",
    totalPrice: 340,

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
