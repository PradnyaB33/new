import CheckIcon from "@mui/icons-material/Check";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useMutation } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import MappedForm from "./components/MappedForm";
import MiniForm from "./components/MiniForm";
import RightSide from "./components/rightSide";

const RemoteEmployee = () => {
  const [openModal, setOpenModal] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const applyMutation = useMutation(
    (id) =>
      axios.delete(`${process.env.REACT_APP_API}/route`, {
        headers: {
          Authorization: authToken,
        },
      }),
    {
      onSuccess: () => {
        handleAlert(
          true,
          "success",
          "Missed Punch Request Is Raised Successfully."
        );
      },
    }
  );

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
  console.log(`🚀 ~ file: page.jsx:23 ~ array:`, array);
  const { isLoaded } = useJsApiLoader({
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  return (
    <div className="w-full flex justify-between relative">
      <div className=" z-50 p-6 flex flex-col mt-7 w-[50vw] sm:w-[25vw] sm:text-base text-sm bg-white gap-4 ">
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
            <button className="bg-[#2463ea] text-white pr-2 pl-2 pt-1 pb-1 sm:pr-4 sm:pl-4 sm:pt-2 sm:text-sm sm:pb-2 text-xs flex">
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
        maxWidth="xl"
        maxHeight="sm"
        className="!p-0"
        fullScreen={fullScreen}
      >
        <DialogActions>
          <DialogContent>
            <MiniForm
              {...{ setArray, setOpenModal, array, center, setcenter }}
            />
          </DialogContent>
        </DialogActions>
      </Dialog>
      {isLoaded && <RightSide {...{ center }} />}
    </div>
  );
};

export default RemoteEmployee;
