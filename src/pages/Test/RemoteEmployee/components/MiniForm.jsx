import { zodResolver } from "@hookform/resolvers/zod";
import { EmailOutlined, FactoryOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
const MiniForm = ({ setArray, setOpenModal, center, setCenter }) => {
  const options = {
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  };

  const { isLoaded } = useJsApiLoader(options);

  const formSchema = z.object({
    location: z.object({
      address: z.string,
      position: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
    start: z.string(),
    end: z.string(),
  });

  const { control, formState, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      location: {
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
    console.log(data);
    setArray((prev) => [...prev, data]);
    reset();
    setOpenModal(false);
  };

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
      <div className="flex w-full justify-between mt-4">
        <AuthInputFiled
          name="location"
          icon={FactoryOutlined}
          className="w-[11rem] sm:w-[20rem]"
          control={control}
          type="location-picker"
          label="Location *"
          errors={errors}
          error={errors.location}
          options={[
            { value: "Technology", label: "Technology" },
            { value: "Finance", label: "Finance" },
            { value: "Healthcare", label: "Healthcare" },
            { value: "Education", label: "Education" },
          ]}
        />
        <AuthInputFiled
          className="w-[20vw]"
          name="start"
          icon={EmailOutlined}
          control={control}
          type="time"
          placeholder="Choose starting time"
          label="Start *"
          errors={errors}
          wrapperMessage={"Note this email is used for login credentails"}
        />

        <AuthInputFiled
          className="w-[20vw]"
          name="end"
          icon={EmailOutlined}
          control={control}
          type="time"
          placeholder="Choose ending time"
          label="End *"
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
              height: "55vh",
            }}
            center={center}
            zoom={18}
          >
            <>
              <Marker
                position={{
                  lat: watch("location.position.lat"),
                  lng: watch("location.position.lng"),
                }}
                label={"Current Position"}
              />
            </>
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
