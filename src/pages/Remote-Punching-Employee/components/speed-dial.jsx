import { PlayArrow } from "@mui/icons-material";
import { Button, Dialog, DialogContent, Fab } from "@mui/material";
import * as React from "react";
import { useState } from "react";
import useSelfieFaceDetect from "../../../components/Modal/Selfi-Image/useSelfieFaceDetect";
import useLocationMutation from "../../../hooks/QueryHook/Location/mutation";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import StopRemotePunch from "./stop-remote-punching";

export default function FabIcons() {
  const { start, setStart, setStartTime } = useSelfieStore();
  const [open, setOpen] = useState(false);
  const { getUserImage } = useLocationMutation();
  const handleOperate = () => {
    setOpen(false);
    getUserImage.mutate();
    setStartTime();
  };
  const { faceDetectedData } = useSelfieFaceDetect();

  return (
    <>
      {!start ? (
        <Fab
          disabled={faceDetectedData === undefined}
          onClick={() => setOpen(true)}
          color="primary"
          variant="extended"
          className="!absolute bottom-12 right-12 !text-white"
        >
          <PlayArrow sx={{ mr: 1 }} className={`animate-pulse text-white`} />
          Start Remote Punching
        </Fab>
      ) : (
        <StopRemotePunch {...{ setStart }} />
      )}

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <div className="w-full text-center text-red-500">
            <h1 className="font-semibold text-3xl">Confirm Action</h1>
          </div>
          <h1 className="text-lg mt-2">
            Are you sure you want to start remote access?
          </h1>
          <div className="flex gap-4 mt-4">
            <Button onClick={handleOperate} size="small" variant="contained">
              Yes
            </Button>
            <Button
              onClick={() => setOpen(false)}
              variant="contained"
              color="error"
              size="small"
            >
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
