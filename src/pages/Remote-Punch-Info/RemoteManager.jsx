import { useJsApiLoader } from "@react-google-maps/api";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import MappedPunches from "../Employee-Confirm/components/mapped-punches";
import MapComponent from "./Map-Container";
import BoxComponent from "../../components/BoxComponent/BoxComponent";

const RemoteManager = () => {
  const { Id } = useParams();
  const [punchObjectId, setPunchObjectId] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  return (
    <BoxComponent>
      <div className="w-full h-[100%] flex relative">
        <div className="w-[25%]  pr-5">
          <MappedPunches
            {...{
              Id,
              setPunchObjectId,
              className: "w-full",
              punchObjectId,
            }}
          />
        </div>
        {punchObjectId && <div className="w-[75%]">
          <MapComponent {...{ isLoaded, punchObjectId }} />
        </div>}
      </div>
    </BoxComponent>
  );
};

export default RemoteManager;
