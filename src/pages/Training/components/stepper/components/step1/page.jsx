import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOutlined,
  CalendarToday,
  CategoryOutlined,
  DescriptionOutlined,
  LocationOn,
  MeetingRoomOutlined,
  TimerOutlined,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../../../components/InputFileds/AuthInputFiled";
import useGetUser from "../../../../../../hooks/Token/useUser";
import ImageInput from "../../../../../AddOrganisation/components/image-input";
import useTrainingStore from "../zustand-store";

const Step1 = ({ nextStep }) => {
  const { decodedToken } = useGetUser();

  const {
    trainingName,
    trainingType,
    trainingDescription,
    trainingStartDate,
    trainingDuration,
    trainingLink,
    trainingImage,
    trainingLocation,
    setStep1,
  } = useTrainingStore();

  const trainingForm = z.object({
    trainingImage: z.any().refine(
      (file) => {
        return !!file && file.size >= 5 * 1024 && file.size <= 50 * 1024;
      },
      { message: "Image size maximum 50kb" }
    ),
    trainingName: z.string(),
    trainingType: z.enum(["Individual", "Organizational", "Departmental"]),
    trainingDescription: z.string(),
    trainingStartDate: z.string(),
    trainingDuration: z.string(),
    trainingLocation: z.any({
      address: z.string(),
      position: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      placeId: z.string(),
    }),
    trainingLink: z.string().url(),
  });
  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      trainingImage,
      trainingName,
      trainingType,
      trainingDescription,
      trainingStartDate,
      trainingDuration,
      trainingLocation,
      trainingLink,
    },
    resolver: zodResolver(trainingForm),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(`🚀 ~ file: page.jsx:73 ~ data:`, data);
    setStep1(data);
    nextStep();
  };

  let center = {
    lat: 0,
    lng: 0,
  };
  return (
    <div>
      <form
        className=" items-center flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-1 w-full items-center flex flex-col ">
          <Controller
            control={control}
            name={"trainingImage"}
            render={({ field }) => {
              return <ImageInput field={field} />;
            }}
          />
          <div className="h-4 !mb-1">
            <ErrorMessage
              errors={errors}
              name={"trainingImage"}
              render={({ message }) => {
                return <p className="text-sm text-red-500">{message}</p>;
              }}
            />
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-4">
          <AuthInputFiled
            name="trainingName"
            icon={BookOutlined}
            label={"Training Name *"}
            type="text"
            placeholder="Training Name"
            className="items-center"
            control={control}
            error={errors.trainingName}
            errors={errors}
          />

          <AuthInputFiled
            name="trainingDescription"
            icon={DescriptionOutlined}
            label={"Training Description *"}
            type="text"
            placeholder="Training Description"
            className="items-center"
            control={control}
            error={errors.trainingDescription}
            errors={errors}
          />
          <AuthInputFiled
            name="trainingStartDate"
            icon={CalendarToday}
            label={"Training Start Date *"}
            type="date"
            placeholder="Training Start Date"
            className="items-center"
            control={control}
            error={errors.trainingStartDate}
            errors={errors}
            min={new Date().toISOString().split("T")[0]}
          />

          <AuthInputFiled
            name="trainingDuration"
            icon={TimerOutlined}
            label={"Training Duration *"}
            type="number"
            placeholder="eg. 7 days"
            className="items-center"
            control={control}
            error={errors.trainingDuration}
            errors={errors}
          />
          <AuthInputFiled
            name="trainingLink"
            icon={MeetingRoomOutlined}
            label={"Training Link *"}
            type="text"
            placeholder="eg. https://zoom.com/1234"
            className="items-center"
            control={control}
            error={errors.trainingLink}
            errors={errors}
          />
          <AuthInputFiled
            name="trainingType"
            icon={CategoryOutlined}
            label={"Training Type *"}
            type="naresh-select"
            placeholder="Training Type"
            className="w-fit items-center"
            control={control}
            error={errors.trainingType}
            errors={errors}
            options={[
              { value: "Individual", label: "Individual", isDisabled: false },
              {
                value: "Organizational",
                label: "Organizational",
                isDisabled:
                  decodedToken?.user?.profile?.includes("Super-Admin") ||
                  decodedToken?.user?.profile?.includes("Delegate-Super-Admin")
                    ? false
                    : true,
              },
              {
                value: "Departmental",
                label: "Departmental",
                isDisabled: decodedToken?.user?.profile?.includes("HR")
                  ? false
                  : true,
              },
            ]}
          />
          <AuthInputFiled
            className="w-full"
            name="trainingLocation"
            icon={LocationOn}
            control={control}
            placeholder="eg. Kathmandu, Nepal"
            type="location-picker"
            label="Location *"
            errors={errors}
            error={errors.trainingLocation}
            center={center}
            value={watch("trainingLocation")}
          />
        </div>
        <Button
          type="submit"
          size="large"
          className="!h-[40px] !w-[40px]"
          variant="contained"
        >
          Next
        </Button>
      </form>
    </div>
  );
};

export default Step1;
