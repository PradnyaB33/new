import CheckIcon from "@mui/icons-material/Check";
import { Button } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useNotificationRemotePunching from "../../hooks/QueryHook/Remote-Punch/components/mutation";
import MappedPunches from "../Employee-Confirm/components/mapped-punches";
import MapComponent from "./Map-Container";

const RemoteManager = () => {
  const { notifyManagerMutation } = useNotificationRemotePunching();
  const { id } = useParams();
  const [punchObjectId, setPunchObjectId] = useState(null);
  const { isLoaded } = useJsApiLoader({
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  return (
    <div className="w-full h-[100%] flex justify-between relative">
      <div className="z-50 p-6 flex flex-col mt-7 w-[30vw] bg-white gap-4">
        <div className="w-full flex flex-col bg-white h-full justify-between">
          <MappedPunches
            {...{
              Id: id,
              setPunchObjectId,
              className: "w-full",
              punchObjectId,
            }}
          />
          <div className=" mt-5 flex justify-end">
            <Button
              onClick={() => notifyManagerMutation.mutate(id)}
              variant="contained"
              className=""
            >
              <CheckIcon />
              Apply for remote punching
            </Button>
          </div>
        </div>
      </div>
      {punchObjectId && <MapComponent {...{ isLoaded, punchObjectId }} />}
    </div>
  );
};

export default RemoteManager;
