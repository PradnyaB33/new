import { zodResolver } from "@hookform/resolvers/zod";
import { AccessTime, BarChart, ListAlt, TrendingUp } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import Setup from "../Setup";

const PerformanceSetup = () => {
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const { handleAlert } = useContext(TestContext);
  const PerformanceSchema = z.object({
    startdate: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
    enddate: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
    stages: z.array(z.string()),
    goals: z.array(z.string()),
    isDownCast: z.boolean().optional(),
    isFeedback: z.boolean().optional(),
    isNonMeasurableAllowed: z.boolean().optional(),
    isManagerApproval: z.boolean().optional(),
    isMidGoal: z.boolean().optional(),
    isSendFormInMid: z.boolean().optional(),
    deleteFormEmployeeOnBoarding: z.boolean().optional(),
    isKRA: z.boolean().optional(),
    isSelfGoal: z.boolean().optional(),
  });

  const {
    formState: { errors },
    control,
    handleSubmit,
    watch,
  } = useForm({
    resolver: zodResolver(PerformanceSchema),
    defaultValues: {
      stages: undefined,
      goals: undefined,
      isDownCast: false,
      isFeedback: false,
      isNonMeasurableAllowed: false,
      isManagerApproval: false,
      isMidGoal: false,
      isSendFormInMid: false,
      deleteFormEmployeeOnBoarding: false,
      isKRA: false,
      isSelfGoal: false,
    },
  });

  let stagesOptions = [
    {
      value: "Send form to employee",
      label: "Send form to employee",
    },
    {
      value: "Goal setting",
      label: "Goal setting",
    },
    {
      value: "Monitoring stage",
      label: "Monitoring stage",
    },
    {
      value: "KRA stage",
      label: "KRA stage",
    },
    {
      value: "Feedback collection stage",
      label: "Feedback collection stage",
    },
    {
      value: "Ratings Feedback/Manager review stage",
      label: "Ratings Feedback/Manager review stage",
    },
    {
      value: "Employee acceptance/acknowledgement stage",
      label: "Employee acceptance/acknowledgement stage",
    },
  ];
  let goalsOptions = [
    {
      value: "Organizational Goals",
      label: "Organizational Goals",
    },
    {
      value: "Departmental Goals",
      label: "Departmental Goals",
    },
    {
      value: "Development Goal",
      label: "Development Goal",
    },
    {
      value: "Carrier Goals",
      label: "Carrier Goals",
    },
    {
      value: "Self Goals",
      label: "Self Goals",
    },
    {
      value: "Managerial Goals",
      label: "Managerial Goals",
    },
    {
      value: "Training Goals",
      label: "Training Goals",
    },
    {
      value: "Behavioral Goals",
      label: "Behavioral Goals",
    },
  ];

  console.log(watch("startdate"));

  const performanceSetup = useMutation(
    async (data) => {
      const performanceSetting = {
        ...data,
        startdate: data.startdate.startDate,
        enddate: data.enddate.endDate,
      };
      await axios.post(
        `${process.env.REACT_APP_API}/route/performance/createSetup/${organisationId}`,
        { performanceSetting },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Performance setup created successfully");
      },
    }
  );

  const onSubmit = async (data) => {
    performanceSetup.mutate(data);
  };
  //  (data) =>
  //    axios.post(`${process.env.REACT_APP_API}/route/shifts/create`, data),
  //  {
  //    onSuccess: () => {
  //      queryClient.invalidateQueries({ queryKey: ["shifts"] });
  //      handleClose();
  //      handleAlert(true, "success", "Shift generated succesfully");
  //    },
  //    onError: () => {
  //      setError("An error occurred while creating a new shift");
  //    },
  //  }

  return (
    <div>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-[80%]  h-max shadow-md rounded-sm border  items-center">
            <div className="p-4  border-b-[.5px] flex  justify-between  gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <BarChart />
                </div>
                <div>
                  <h1 className="!text-lg">Performance</h1>
                  <p className="text-xs text-gray-600">
                    Create the salary template here.
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-auto h-[80vh]  border-[.5px] p-4 border-gray-200">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <AuthInputFiled
                    name="startdate"
                    icon={AccessTime}
                    control={control}
                    type="calender"
                    label="Enter Start Date *"
                    errors={errors}
                    error={errors.startdate}
                  />
                  <AuthInputFiled
                    name="enddate"
                    icon={AccessTime}
                    control={control}
                    type="calender"
                    label="Enter End Date *"
                    errors={errors}
                    error={errors.enddate}
                  />
                </div>

                <AuthInputFiled
                  name="stages"
                  icon={ListAlt}
                  control={control}
                  options={stagesOptions}
                  type="mutltiselect"
                  placeholder="Stages"
                  label="Select Stage *"
                  errors={errors}
                  error={errors.stages}
                />
                <AuthInputFiled
                  name="goals"
                  icon={TrendingUp}
                  control={control}
                  type="mutltiselect"
                  options={goalsOptions}
                  placeholder="Goals"
                  label="Select Goal Type *"
                  errors={errors}
                  error={errors.goals}
                />

                <div className="grid grid-cols-2 gap-4">
                  <AuthInputFiled
                    name="isDownCast"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="Goals downcast downword "
                    errors={errors}
                    error={errors.isDownCast}
                  />
                  <AuthInputFiled
                    name="isFeedback"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="360 feedback allowed"
                    errors={errors}
                    error={errors.isFeedback}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <AuthInputFiled
                    name="isNonMeasurableAllowed"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="Non-mesurable target can be added *"
                    errors={errors}
                    error={errors.isNonMeasurableAllowed}
                  />
                  <AuthInputFiled
                    name="isManagerApproval"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="Manager approval on self added goals"
                    errors={errors}
                    error={errors.isManagerApproval}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {" "}
                  <AuthInputFiled
                    name="isMidGoal"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="Addition of goals mid of cycle stage"
                    errors={errors}
                    error={errors.isMidGoal}
                  />
                  <AuthInputFiled
                    name="isSendFormInMid"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="Send the form to employee middle of cycle stage"
                    errors={errors}
                    error={errors.isSendFormInMid}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <AuthInputFiled
                    name="deleteFormEmployeeOnBoarding"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="Delete the form when employee offboarded"
                    errors={errors}
                    error={errors.deleteFormEmployeeOnBoarding}
                  />
                  <AuthInputFiled
                    name="isKRA"
                    icon={TrendingUp}
                    control={control}
                    type="checkbox"
                    placeholder="Goals"
                    label="Employee can add KRA"
                    errors={errors}
                    error={errors.isKRA}
                  />
                </div>
                <AuthInputFiled
                  name="isSelfGoal"
                  icon={TrendingUp}
                  control={control}
                  type="checkbox"
                  placeholder="Goals"
                  label="Employee able to add self goals"
                  errors={errors}
                  error={errors.isSelfGoal}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  // disabled={performanceSetup.isLoading}
                >
                  {performanceSetup.isLoading ? (
                    <CircularProgress size={20} />
                  ) : (
                    "submit"
                  )}
                </Button>
              </form>
            </div>
          </article>
        </Setup>
      </section>
    </div>
  );
};

export default PerformanceSetup;
