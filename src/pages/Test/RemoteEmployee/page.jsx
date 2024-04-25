import { zodResolver } from "@hookform/resolvers/zod";
import { TodayOutlined } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
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
  const formSchema = z.object({
    today: z.string(),
  });
  const { formState, control, watch, handleSubmit, reset } = useForm({
    resolver: zodResolver(formSchema),
  });
  const { errors, isDirty } = formState;

  const applyMutation = useMutation(
    async (body) => {
      console.info(`🚀 ~ file: page.jsx:34 ~ body:`, body);

      const result = await axios.post(
        `${process.env.REACT_APP_API}/route/punch/miss-punch`,
        body,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      return result.data;
    },
    // axios.delete(`${process.env.REACT_APP_API}/route`, {
    //   headers: {
    //     Authorization: authToken,
    //   },
    // }),
    {
      onSuccess: (data) => {
        console.info(`🚀 ~ file: page.jsx:40 ~ data:`, data);
        setArray([]);
        handleAlert(
          true,
          "success",
          "Missed Punch Request Is Raised Successfully."
        );
        reset();
      },
      onError: (data) => {
        console.info(`🚀 ~ file: page.jsx:40 ~ data:`, data);
        handleAlert(true, "error", data.response.data.message);
      },
    }
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setcenter({
        lat: position?.coords?.latitude,
        lng: position?.coords?.longitude,
      });
    });
  }, []);
  const onSubmit = (optData) => {
    console.log(`🚀 ~ file: page.jsx:89 ~ optData:`, optData);
    const body = {
      today: moment(optData?.today),
      arrayOfLocations: array,
    };
    console.log(`🚀 ~ file: page.jsx:90 ~ body:`, body);
    applyMutation.mutate(body);
  };
  const [center, setcenter] = useState({ lat: 19.076, lng: 72.8777 });
  const [array, setArray] = useState([]);
  const { isLoaded } = useJsApiLoader({
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  let tag = watch("today");
  useEffect(() => {
    setArray([]);
  }, [tag]);

  return (
    <div className="w-screen flex relative">
      <div className="z-50 p-6 flex flex-col mt-7 w-[400px] sm:text-base text-sm bg-white gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-white">
          <AuthInputFiled
            name="today"
            icon={TodayOutlined}
            control={control}
            type="date"
            placeholder="Foundation Date"
            label="Select Date For Application *"
            errors={errors}
            error={errors.today}
          />
          <div>
            <p className=" z-[99999999]  mt-4 font-semibold  mb-3">
              Total Approximate Distance : Kilometers
            </p>
          </div>

          {array.map((item, index) => (
            <MappedForm {...{ item, index, setArray, setOpenModal }} />
          ))}

          <div className="md:absolute bottom-3 md:w-[400px] flex flex-col items-end gap-10">
            <button
              type="button"
              onClick={() => setOpenModal(true)}
              className="bg-[#2463ea] md:w-[3vw] md:h-[3vw] w-[40px] h-[40px] text-white text-xl rounded-full"
            >
              +
            </button>
            <Button
              type="submit"
              disabled={isDirty && array.length > 0 ? false : true}
              variant="contained"
              className="text-sm"
            >
              <span className="mr-3">
                <CheckIcon />
              </span>{" "}
              Apply for miss punch
            </Button>
          </div>
        </form>
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
              {...{
                setArray,
                setOpenModal,
                array,
                center,
                setcenter,
                today: watch("today"),
              }}
            />
          </DialogContent>
        </DialogActions>
      </Dialog>
      {isLoaded && <RightSide {...{ center }} />}
    </div>
  );
};

export default RemoteEmployee;
