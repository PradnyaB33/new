import useLocationMutation from "./mutation";

const useLocationHook = () => {
  const { getUserLocation } = useLocationMutation();
  const { data } = getUserLocation;

  return {
    data,
  };
};

export default useLocationHook;
