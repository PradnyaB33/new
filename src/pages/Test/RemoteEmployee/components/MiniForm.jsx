import { zodResolver } from "@hookform/resolvers/zod";
import { FactoryOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
const MiniForm = ({ setArray, setOpenModal, center, setCenter }) => {
  const [map, setMap] = useState(null);
  const options = {
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  };

  const { isLoaded } = useJsApiLoader(options);

  const formSchema = z.object({
    location: z.any({
      address: z.string(),
      position: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
    start: z.string(),
  });

  const { control, formState, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      location: {
        address: "",
        position: {
          lat: center?.lat,
          lng: center?.lng,
        },
      },
      start: undefined,
    },
    resolver: zodResolver(formSchema),
  });

  const { errors } = formState;
  console.log(`🚀 ~ file: MiniForm.jsx:54 ~ errors:`, errors);

  const onSubmit = (data) => {
    console.log(`🚀 ~ file: MiniForm.jsx:56 ~ data:`, data.start);
    const currentDate = moment();
    const timeString = data.start.toLowerCase().replace(/\s/g, "");
    const [hours, minutes] = timeString.split(":").map(Number);
    currentDate.set("hour", hours);
    currentDate.set("minute", minutes);
    console.log(
      `🚀 ~ file: MiniForm.jsx:68 ~ currentDate:`,
      currentDate.toString()
    );
    data.start = currentDate;
    console.log(`🚀 ~ file: MiniForm.jsx:56 ~ data:`, data);
    setArray((prev) => [...prev, data]);
    reset();
    setOpenModal(false);
  };

  useEffect(() => {
    let position = {
      lat: watch("location.position.lat"),
      lng: watch("location.position.lng"),
    };
    map && map.setCenter(position);
    // eslint-disable-next-line
  }, [watch("location.address"), watch("location.address")]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative">
      <div
        onClick={() => setOpenModal(false)}
        className="absolute top-0 right-0 w-[30px] h-[30px] flex justify-center items-center bg-red-600 text-white rounded-full"
      >
        <CloseIcon />
      </div>
      <div>
        <h1 className="text-center sm:text-[2vw] text-[6vw]">
          Apply For Miss Punch
        </h1>
      </div>
      <div className="flex w-full justify-between mt-4 items-center flex-wrap gap-4">
        <AuthInputFiled
          className="w-full"
          name="location"
          icon={FactoryOutlined}
          control={control}
          type="location-picker"
          label="Location *"
          errors={errors}
          error={errors.location}
          center={center}
        />
        <AuthInputFiled
          className="w-full"
          name="start"
          control={control}
          type="time"
          placeholder="Choose starting time"
          label="Start *"
          errors={errors}
          wrapperMessage={"Note this email is used for login credentails"}
        />
      </div>
      <div>
        {isLoaded && center && (
          <GoogleMap
            key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            mapContainerStyle={{
              width: "100%",
              height: "300px",
            }}
            center={{
              lat: watch("location.position.lat"),
              lng: watch("location.position.lng"),
            }}
            onLoad={(map) => {
              setMap(map);
            }}
            zoom={18}
          >
            {center && (
              <Marker
                icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
                position={{
                  lat: watch("location.position.lat"),
                  lng: watch("location.position.lng"),
                }}
                label={"Current Position"}
              />
            )}
          </GoogleMap>
        )}
      </div>

      <div className="w-full flex justify-center mt-4">
        <Button type="submit" variant="contained" fullWidth>
          Apply
        </Button>
      </div>
    </form>
  );
};

export default MiniForm;
