import { zodResolver } from "@hookform/resolvers/zod";
import { LocationOn } from "@mui/icons-material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useGetCurrentLocation from "../../../hooks/Location/useGetCurrentLocation";
import LocationRelated from "./LocationRelated";

const AddGeoFencing = ({ onClose }) => {
  const { data } = useGetCurrentLocation();

  const formSchema = z.object({
    location: z
      .any({
        address: z.string(),
        position: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
      })
      .refine(
        (val) => {
          return (
            val.address !== ("" || undefined) &&
            val.position.lat !== 0 &&
            val.position.lng !== 0
          );
        },
        { message: "Location is required" }
      ),
  });

  const { control, formState, handleSubmit, watch } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: {
        address: "",
        position: data,
      },
    },
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-4"
      >
        <div className="">
          <AuthInputFiled
            className="w-full"
            name="location"
            icon={LocationOn}
            control={control}
            placeholder="eg. Kathmandu, Nepal"
            type="location-picker"
            label="Location *"
            errors={errors}
            error={errors.location}
            value={watch("location")}
          />
        </div>
        <LocationRelated watch={watch} data={data} onClose={onClose} />
      </form>
    </>
  );
};

export default AddGeoFencing;
