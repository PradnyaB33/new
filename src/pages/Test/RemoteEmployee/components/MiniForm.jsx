import { zodResolver } from "@hookform/resolvers/zod";
import { EmailOutlined } from "@mui/icons-material";
import { Button } from "@mui/material";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
const MiniForm = ({ setArray, setOpenModal }) => {
  const { isLoaded } = useJsApiLoader({
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const formSchema = z.object({
    location: z.string(),
    start: z.string(),
    end: z.string(),
  });

  const { control, formState, handleSubmit, reset } = useForm({
    defaultValues: {
      location: undefined,
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h1 className="text-center text-[2vw]">Apply For Miss Punch</h1>
      </div>
      <div className="flex w-full justify-between mt-4">
        <AuthInputFiled
          className="w-[20vw]"
          name="location"
          icon={EmailOutlined}
          control={control}
          type="text"
          placeholder="Email"
          label="Location *"
          errors={errors}
          wrapperMessage={"Note this email is used for login credentails"}
        />
        <AuthInputFiled
          className="w-[20vw]"
          name="start"
          icon={EmailOutlined}
          control={control}
          type="time"
          placeholder="Choose starting time"
          label="Start Time *"
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
          label="End Time *"
          errors={errors}
          wrapperMessage={"Note this email is used for login credentails"}
        />
      </div>
      <div>
        <GoogleMap
          key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          mapContainerStyle={{
            width: "100%",
            height: "50vh",
          }}
          center={{
            lat: 18.6229332,
            lng: 73.7360171,
          }}
          zoom={18}
        ></GoogleMap>
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
