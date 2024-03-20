import CheckIcon from "@mui/icons-material/Check";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { useJsApiLoader } from "@react-google-maps/api";
import React, { useState } from "react";
import MappedForm from "./components/MappedForm";
import MiniForm from "./components/MiniForm";
import RightSide from "./components/rightSide";

const RemoteEmployee = () => {
  const [openModal, setOpenModal] = useState(false);
  const [array, setArray] = useState([]);
  const { isLoaded } = useJsApiLoader({
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
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
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogActions>
          <DialogContent>
            <MiniForm {...{ setArray, setOpenModal, array }} />
          </DialogContent>
        </DialogActions>
      </Dialog>
      {isLoaded && <RightSide />}
    </div>
  );
};

export default RemoteEmployee;
