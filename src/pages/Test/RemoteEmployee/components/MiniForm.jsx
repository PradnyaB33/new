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

const MiniForm = ({ setArray, setOpenModal, center, setCenter, today }) => {
  const [map, setMap] = useState(null);
  const options = {
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  };

  const { isLoaded } = useJsApiLoader(options);

  const formSchema = z.object({
    startLocation: z.any({
      address: z.string(),
      position: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
    endLocation: z.any({
      address: z.string(),
      position: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
    start: z.string(),
    end: z.string(),
  });

  const { control, formState, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      startLocation: {
        address: "",
        position: {
          lat: center?.lat,
          lng: center?.lng,
        },
      },
      endLocation: {
        address: "",
        position: {
          lat: center?.lat,
          lng: center?.lng,
        },
      },
      start: undefined,
      end: undefined,
    },
    resolver: zodResolver(formSchema),
  });

  const { errors } = formState;

  const onSubmit = (data) => {
    const startDateTime = moment(`${today} ${data?.start}`, "YYYY-MM-DD HH:mm");
    const endDateTime = data.end
      ? moment(`${today} ${data?.end}`, "YYYY-MM-DD HH:mm")
      : null;

    const formattedData = {
      ...data,
      start: startDateTime,
      end: endDateTime,
    };

    setArray((prev) => [...prev, formattedData]);
    reset();
    setOpenModal(false);
  };

  useEffect(() => {
    let position = {
      lat: watch("startLocation.position.lat"),
      lng: watch("startLocation.position.lng"),
    };
    map && map.setCenter(position);
    // eslint-disable-next-line
  }, [watch("startLocation.address"), watch("startLocation.address")]);

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
          name="startLocation"
          icon={FactoryOutlined}
          control={control}
          type="location-picker"
          label="Start Location *"
          errors={errors}
          error={errors.startLocation}
          center={center}
        />
        <AuthInputFiled
          className="w-full"
          name="endLocation"
          icon={FactoryOutlined}
          control={control}
          type="location-picker"
          label="End Location *"
          errors={errors}
          error={errors.endLocation}
          center={center}
        />
        <AuthInputFiled
          className="w-full"
          name="start"
          control={control}
          type="time"
          placeholder="Choose start time"
          label="Start Time *"
          errors={errors}
          wrapperMessage={"Note: Start time for missed punch"}
        />
        <AuthInputFiled
          className="w-full"
          name="end"
          control={control}
          type="time"
          placeholder="Choose end time"
          label="End Time *"
          errors={errors}
          wrapperMessage={"Note: End time for missed punch"}
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
              lat: watch("startLocation.position.lat"),
              lng: watch("startLocation.position.lng"),
            }}
            onLoad={(map) => {
              setMap(map);
            }}
            zoom={18}
          >
            {center && (
              <>
                <Marker
                  icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
                  position={{
                    lat: watch("startLocation.position.lat"),
                    lng: watch("startLocation.position.lng"),
                  }}
                  label={"Start Position"}
                />
                <Marker
                  icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"}
                  position={{
                    lat: watch("endLocation.position.lat"),
                    lng: watch("endLocation.position.lng"),
                  }}
                  label={"End Position"}
                />
              </>
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
