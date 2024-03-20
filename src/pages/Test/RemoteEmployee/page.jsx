import CheckIcon from "@mui/icons-material/Check";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";
import { usePlacesWidget } from "react-google-autocomplete";
import MappedForm from "./components/MappedForm";
import MiniForm from "./components/MiniForm";
import RightSide from "./components/rightSide";

const RemoteEmployee = () => {
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position?.coords);
      setcenter({
        lat: position?.coords?.latitude,
        lng: position?.coords?.longitude,
      });
    });
  }, []);
  const [center, setcenter] = useState({ lat: 19.076, lng: 72.8777 });
  const [array, setArray] = useState([]);
  const { isLoaded } = useJsApiLoader({
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  const { ref, autocompleteRef } = usePlacesWidget({
    apiKey: "AIzaSyDaA2q3L--j40-GgojdeFSJ4RywKGtFQ2k",
    onPlaceSelected: (place) => {
      console.log(place);
    },
  });
  return (
    <div className="w-full flex justify-between relative">
      <div className=" z-50 p-6 flex flex-col mt-7 w-[25vw] bg-white gap-4 ">
        <div className="w-full bg-white">
          <h1 className="text-slate-400 mb-1">Select Date For Application</h1>
          <div>
            <p className=" z-[99999999]  mt-4 font-semibold  mb-3">
              Total Approximate Distance : Kilometers
            </p>
            <input
              type="text"
              placeholder={"placeholder"}
              className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
              ref={ref}
            />
          </div>

          {array.map((item, index) => (
            <MappedForm {...{ item, index, setArray, setOpenModal }} />
          ))}

          <div className="absolute bottom-3 w-[21vw] flex flex-col items-end gap-10">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-[#2463ea] w-[3vw] h-[3vw] text-white text-xl rounded-full"
            >
              +
            </button>
            <button className="bg-[#2463ea] text-white pr-4 pl-4 pt-2 pb-2 text-sm">
              <span className="mr-3">
                <CheckIcon />
              </span>{" "}
              Apply for miss punch
            </button>
          </div>
        </div>
      </div>

      <Dialog
        keepMounted={false}
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogActions>
          <DialogContent>
            <MiniForm
              {...{ setArray, setOpenModal, array, center, setcenter }}
            />
          </DialogContent>
        </DialogActions>
      </Dialog>
      {isLoaded && <RightSide />}
    </div>
  );
};

export default RemoteEmployee;
