import { Stop } from "@mui/icons-material";
import { Fab } from "@mui/material";
import React, { useEffect } from "react";
import useStartPunch from "../../../hooks/QueryHook/Location/independant-use-query";

const StopRemotePunch = ({ setStart }) => {
  const { data, refetch } = useStartPunch();
  useEffect(() => {
    refetch();
  }, []);

  return (
    <Fab
      variant="extended"
      className="!absolute bottom-12 right-12 !bg-primary !text-white"
      onClick={() => setStart(false)}
    >
      <Stop sx={{ mr: 1 }} className={`animate-pulse text-white`} />
      Stop Remote Punching
    </Fab>
  );
};

export default StopRemotePunch;
