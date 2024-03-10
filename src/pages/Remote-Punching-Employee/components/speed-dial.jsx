import { PlayArrow } from "@mui/icons-material";
import { Fab } from "@mui/material";
import * as React from "react";
import useLocationMutation from "../../../hooks/QueryHook/Location/mutation";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import StopRemotePunch from "./stop-remote-punching";

export default function FabIcons() {
  const { start, setStart } = useSelfieStore();
  const { getUserImage } = useLocationMutation();

  return (
    <>
      {!start ? (
        <Fab
          onClick={() => getUserImage.mutate()}
          variant="extended"
          className="!absolute bottom-12 right-12 !bg-primary !text-white"
        >
          <PlayArrow sx={{ mr: 1 }} className={`animate-pulse text-white`} />
          Start Remote Punching
        </Fab>
      ) : (
        <StopRemotePunch {...{ setStart }} />
      )}
    </>
  );
}
