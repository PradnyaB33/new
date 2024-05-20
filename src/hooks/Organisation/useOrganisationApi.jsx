import axios from "axios";
import create from "zustand";

const useOrganisationApi = create((set) => ({
  fetchData: async (authToken, organisationId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/get/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log("error from orgId", error);
    }
  },
}));

export default useOrganisationApi;
