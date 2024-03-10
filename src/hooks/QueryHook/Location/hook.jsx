import { useEffect } from "react";
import useLocationMutation from "./mutation";

const useLocationHook = () => {
  const { getUserLocation } = useLocationMutation();
  const { data, mutate } = getUserLocation;

  useEffect(() => {
    mutate();
  }, [mutate]);

  return {
    data,
  };
};

export default useLocationHook;
