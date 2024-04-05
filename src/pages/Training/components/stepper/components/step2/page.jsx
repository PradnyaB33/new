import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarMonthOutlined,
  CalendarTodayOutlined,
  CalendarViewDayOutlined,
  CategoryOutlined,
  LocationOnOutlined,
  MeetingRoomOutlined,
  PowerInputOutlined,
  TrendingDownOutlined,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../../../components/InputFileds/AuthInputFiled";
import useTrainingStore from "../zustand-store";
const skills = [
  { value: "communication", label: "Communication" },
  { value: "leadership", label: "Leadership" },
  { value: "problemSolving", label: "Problem Solving" },
  { value: "timeManagement", label: "Time Management" },
  { value: "teamwork", label: "Teamwork" },
];
let center = {
  lat: 0,
  lng: 0,
};

const Step2 = ({ nextStep }) => {
  const {
    trainingType,
    trainingStartDate,
    trainingLocation,
    trainingLink,
    trainingEndDate,
    trainingPoints,
    trainingDuration,
    trainingDownCasted,
    setStep2,
  } = useTrainingStore();

  const trainingDetailSchema = z.object({
    trainingStartDate: z.string().optional(),
    trainingEndDate: z.string().optional(),
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
    trainingType: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
    trainingDuration: z.string(),
  });
  const { control, formState, handleSubmit, watch, getValues } = useForm({
    defaultValues: {
      trainingType,
      trainingStartDate: trainingStartDate ?? format(new Date(), "yyyy-MM-dd"),
      trainingLocation,
      trainingLink,
      trainingEndDate: trainingEndDate ?? format(new Date(), "yyyy-MM-dd"),
      trainingPoints,
      trainingDownCasted,
      trainingDuration,
    },
    resolver: zodResolver(trainingDetailSchema),
  });
  const { errors } = formState;
  console.log(`🚀 ~ file: page.jsx:79 ~ errors:`, errors);
  const onSubmit = (data) => {
    console.log(data);
    setStep2(data);
    nextStep();
  };
  console.log(`🚀 ~ file: page.jsx:81 ~ getValues:`, getValues());

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 items-center w-full"
      >
        <div className="w-full grid grid-cols-2 gap-4">
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
            name="trainingDuration"
            icon={CalendarViewDayOutlined}
            label={"Training Duration"}
            type="text"
            placeholder="Training Duration"
            className="items-center"
            control={control}
            error={errors.trainingDuration}
            errors={errors}
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
    </>
  );
};

export default Step2;
