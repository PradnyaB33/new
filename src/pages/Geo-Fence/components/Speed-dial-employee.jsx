import { PlayArrow } from "@mui/icons-material";
import { Button, Dialog, DialogContent, Fab } from "@mui/material";
import * as React from "react";
import { useState } from "react";
// import useSelfieFaceDetect from "../../../components/Modal/Selfi-Image/useSelfieFaceDetect";
import useLocationMutation from "../../../hooks/QueryHook/Location/mutation";
import useSelfieStore from "../../../hooks/QueryHook/Location/zustand-store";
import StopRemotePunch from "../../Remote-Punching-Employee/components/stop-remote-punching";
// import useOrgGeo from "../../Geo-Fence/useOrgGeo";
// import UserProfile from "../../../hooks/UserData/useUser";

export default function SpeedDialEmployee() {
  //hooks
  const { start, setStart, setStartTime } = useSelfieStore();
  const { getUserImage } = useLocationMutation();
  // const { getCurrentUser } = UserProfile();

  //state
  const [open, setOpen] = useState(false);

  //get current user login id
  // const user = getCurrentUser();
  // const userMatch = user?._id;

  //handle operrate function for face capture
  const handleOperate = () => {
    setOpen(false);
    getUserImage.mutate();
    setStartTime();
  };

  //get all allowance data of dualWorkflow, geoFencing,faceRecognition, extra allowance
  // const { employeeOrgId } = useSelfieFaceDetect();

  //selected employee list for geofencing
  // const { data } = useOrgGeo();

  //match currect user and selcted employee in list
  // const isUserMatchInEmployeeList = data?.area?.some(area =>
  //   area.employee.includes(userMatch)
  // );

  return (
    <>
      {!start ? (
        <Fab
          // disabled={
          //   employeeOrgId?.employee?.faceRecognition === true
          //     ? faceDetectedData === undefined
          //     : false
          // }
          // disabled={
          //   employeeOrgId?.employee?.geoFencing === true && isUserMatchInEmployeeList === true
          // }
          onClick={() => setOpen(true)}
          color="primary"
          variant="extended"
          className="!absolute bottom-12 right-12 !text-white"
        >
          <PlayArrow sx={{ mr: 1 }} className={`animate-pulse text-white`} />
          Start
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