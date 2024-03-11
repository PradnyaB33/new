import axios from "axios";
import { useQuery } from "react-query";
import useGetUser from "../../Token/useUser";
import useLocationMutation from "./mutation";
import useSelfieStore from "./zustand-store";

const useStartPunch = () => {
  const { authToken } = useGetUser();
  const { punchObjectId, start, setLocation } = useSelfieStore();
  const { getUserLocation } = useLocationMutation();
  const { data: objectData, mutate } = getUserLocation;
  const fetchLocationData = async () => {
    mutate();
    const { latitude, longitude } = objectData;
    setLocation({ lat: latitude, lng: longitude });
    const payload = {
      lat: latitude,
      lng: longitude,
      punchObjectId,
    };
    const response = await axios.patch(
      `${process.env.REACT_APP_API}/route/punch`,
      payload,
      {
        headers: { Authorization: authToken },
      }
    );

    return response.data;
  };

  const { data, refetch } = useQuery("location-push", fetchLocationData, {
    refetchInterval: 10000,
    enabled: start,
    refetchIntervalInBackground: true,
    onSuccess: (data) => {},
  });
  return { data, refetch };
};

export default useStartPunch;
