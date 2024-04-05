import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarMonthOutlined,
  CalendarTodayOutlined,
  CategoryOutlined,
  LocationOnOutlined,
  MeetingRoomOutlined,
  PowerInputOutlined,
  TrendingDownOutlined,
} from "@mui/icons-material";
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

const Step2 = () => {
  const {
    trainingType,
    trainingStartDate,
    trainingLink,
    trainingLocation,
    trainingEndDate,
    trainingPoints,
    trainingDownCasted,
  } = useTrainingStore();
  console.log(`🚀 ~ file: page.jsx:37 ~ trainingEndDate:`, trainingEndDate);

  const trainingDetailSchema = z.object({
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
    trainingType: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
  });
  const { control, formState, handleSubmit, watch, getValues } = useForm({
    defaultValues: {
      trainingType,
      trainingStartDate,
      trainingLocation,
      trainingLink,
      trainingEndDate,
      trainingPoints,
      trainingDownCasted,
    },
    resolver: zodResolver(trainingDetailSchema),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-8 items-start w-full"
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
            // min={new Date().toISOString().split("T")[0]}
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
            // min={watch("trainingStartDate").toISOString().split("T")[0]}
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
      </form>
    </>
  );
};

export default Step2;
