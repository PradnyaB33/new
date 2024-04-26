import { Stop } from "@mui/icons-material";
import { Fab } from "@mui/material";
import React, { useEffect } from "react";
import useStartPunch from "../../../hooks/QueryHook/Location/independant-use-query";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";

const StopRemotePunch = ({ setStart }) => {
  const { refetch } = useStartPunch();
  const { id } = useSelfieStore();
  useEffect(() => {
    refetch();
  }, [refetch]);
  const stopRemotePunching = () => {
    setStart(false);
    navigator.geolocation.clearWatch(id);
    window.location.reload();
  };

  return (
    <Fab
      variant="extended"
      className="!absolute bottom-12 right-12 !bg-primary !text-white"
      onClick={stopRemotePunching}
    >
      <Stop sx={{ mr: 1 }} className={`animate-pulse text-white`} />
      Stop Remote Punching
    </Fab>
  );
};

export default StopRemotePunch;
