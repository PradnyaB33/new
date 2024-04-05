import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOutlined,
  CalendarMonthOutlined,
  CalendarTodayOutlined,
  CategoryOutlined,
  DescriptionOutlined,
  LocationOnOutlined,
  MeetingRoomOutlined,
  PowerInputOutlined,
  TrendingDownOutlined,
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
    trainingLink,
    trainingImage,
    trainingLocation,
    trainingEndDate,
    setStep1,
    trainingPoints,
    trainingDownCasted,
  } = useTrainingStore();
  const skills = [
    { value: "communication", label: "Communication" },
    { value: "leadership", label: "Leadership" },
    { value: "problemSolving", label: "Problem Solving" },
    { value: "timeManagement", label: "Time Management" },
    { value: "teamwork", label: "Teamwork" },
  ];

  const trainingForm = z.object({
    trainingImage: z.any().refine(
      (file) => {
        return !!file && file.size >= 5 * 1024 && file.size <= 50 * 1024;
      },
      { message: "Image size maximum 50kb" }
    ),
    trainingName: z.string(),
    trainingType: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    trainingDescription: z.string(),
    trainingStartDate: z.string(),
    trainingEndDate: z.string(),
    trainingLocation: z.any({
      address: z.string(),
      position: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      placeId: z.string(),
    }),
    trainingLink: z.string().url(),
    trainingDownCasted: z.boolean(),
    trainingPoints: z.string().optional(),
  });
  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      trainingImage,
      trainingName,
      trainingType,
      trainingDescription,
      trainingStartDate,
      trainingLocation,
      trainingLink,
      trainingEndDate,
      trainingPoints,
      trainingDownCasted,
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
            icon={CalendarTodayOutlined}
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
            name="trainingEndDate"
            icon={CalendarMonthOutlined}
            label={"Training End Date *"}
            type="date"
            placeholder="Training End Date"
            className="items-center"
            control={control}
            error={errors.trainingEndDate}
            errors={errors}
            min={
              new Date(watch("trainingStartDate")).toISOString().split("T")[0]
            }
          />
          <AuthInputFiled
            name="trainingPoints"
            icon={PowerInputOutlined}
            label={"Training Points"}
            type="number"
            placeholder="Training Points"
            className="items-center"
            control={control}
            error={errors.trainingPoints}
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
            control={control}
            type="autocomplete"
            placeholder="Training Type"
            label="Training Type *"
            readOnly={false}
            maxLimit={15}
            errors={errors}
            autocompleteOption={skills}
            error={errors.trainingType}
            isMulti={false}
          />
          <AuthInputFiled
            className="w-full"
            name="trainingLocation"
            icon={LocationOnOutlined}
            control={control}
            placeholder="eg. Kathmandu, Nepal"
            type="location-picker"
            label="Location *"
            errors={errors}
            error={errors.trainingLocation}
            center={center}
            value={watch("trainingLocation")}
          />
          <AuthInputFiled
            className={"w-full flex items-start justify-center flex-col"}
            name={"trainingDownCasted"}
            control={control}
            type="checkbox"
            placeholder="Downcasted"
            label="Downcasted"
            errors={errors}
            error={errors.trainingDownCasted}
            icon={TrendingDownOutlined}
            descriptionText={
              "Down-Casted Training will be automatically assigned to organization employees."
            }
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
