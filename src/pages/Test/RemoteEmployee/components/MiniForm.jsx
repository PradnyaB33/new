import { zodResolver } from "@hookform/resolvers/zod";
import { FactoryOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import moment from "moment";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";

const MiniForm = ({
  setArray,
  setOpenModal,
  center,
  setCenter,
  today,
  array,
  index,
}) => {
  console.log(`🚀 ~ file: MiniForm.jsx:20 ~ index:`, index);
  console.log(`🚀 ~ file: MiniForm.jsx:20 ~ array[index]:`, array[index]);
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
    distance: z.string(),
  });

  const { control, formState, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      startLocation: {
        address: index ? array[index]?.address : "",
        position: {
          lat: index ? array[index]?.position?.lat : center?.lat,
          lng: index ? array[index]?.position?.lng : center?.lng,
        },
      },
      endLocation: {
        address: index ? array[index]?.address : "",
        position: {
          lat: index ? array[index]?.position?.lat : center?.lat,
          lng: index ? array[index]?.position?.lng : center?.lng,
        },
      },
      start: index ? array[index]?.start : undefined,
      end: index ? array[index]?.end : undefined,
      distance: index ? array[index]?.distance : undefined,
    },
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    console.log(
      `🚀 ~ file: MiniForm.jsx:79 ~ array[index]?.endLocation?.address:`,
      array[index]?.endLocation?.address
    );
    setValue("startLocation", {
      address: array[index]?.startLocation?.address,
      position: {
        lat: array[index]?.startLocation?.position?.lat,
        lng: array[index]?.startLocation?.position?.lng,
      },
    });
    setValue("endLocation", {
      address: array[index]?.endLocation?.address,
      position: {
        lat: array[index]?.endLocation?.position?.lat,
        lng: array[index]?.endLocation?.position?.lng,
      },
    });

    setValue("start", array[index]?.start?.format("HH:mm:ss"));
    setValue("end", array[index]?.end?.format("HH:mm:ss"));
    setValue("distance", array[index]?.distance);
  }, [index]);

  console.log("all startLocation", watch("startLocation")?.address?.length);

  const { errors } = formState;

  const onSubmit = (data) => {
    const startDateTime = moment(`${today} ${data?.start}`, "YYYY-MM-DD HH:mm");
    const endDateTime = data.end
      ? moment(`${today} ${data?.end}`, "YYYY-MM-DD HH:mm")
      : null;

    console.log("this is  my data for misspunch", data);

    const formattedData = {
      ...data,
      start: startDateTime,
      end: endDateTime,
    };

    setArray((prev) => [...prev, formattedData]);
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
          descriptionText={
            watch("startLocation")?.address?.length > 0
              ? `You have selected ${
                  watch("startLocation")?.address
                } as start location`
              : ""
          }
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
          descriptionText={
            watch("startLocation")?.address?.length > 0
              ? `You have selected ${
                  watch("endLocation")?.address
                } as end location`
              : ""
          }
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
        <AuthInputFiled
          className="w-full"
          name="distance"
          control={control}
          type="number"
          placeholder="Enter the distance"
          label="Total Distance *"
          errors={errors}
          wrapperMessage={"Note: Total distance for missed punch"}
        />
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
