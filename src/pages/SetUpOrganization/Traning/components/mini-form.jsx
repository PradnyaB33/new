import { Button } from "@mui/material";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AssignmentTurnedIn,
  AssignmentTurnedInOutlined,
  LoyaltyOutlined,
  PeopleOutlined,
  ShareOutlined,
  SupervisorAccountOutlined,
  TuneOutlined,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";
import useSubscriptionGet from "../../../../hooks/QueryHook/Subscription/hook";
const organizationSchema = z.object({
  canManagerAssign: z.boolean(),
  canDeptHeadAssign: z.boolean(),
  canHRAssign: z.boolean(),
  collectPoints: z.boolean(),
  canHRDefinePoints: z.boolean(),
  usePointsForExternal: z.boolean(),
  trainingType: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
});

const MiniForm = ({ data, mutate, organisationId }) => {
  console.log(`🚀 ~ file: mini-form.jsx:26 ~ data:`, data);
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      canManagerAssign: data?.canManagerAssign ? data?.canManagerAssign : false,
      canDeptHeadAssign: data?.canDeptHeadAssign
        ? data?.canDeptHeadAssign
        : false,
      canHRAssign: data?.canHRAssign ? data?.canHRAssign : false,
      collectPoints: data?.collectPoints ? data?.collectPoints : false,
      canHRDefinePoints: data?.canHRDefinePoints
        ? data?.canHRDefinePoints
        : false,
      usePointsForExternal: data?.usePointsForExternal
        ? data?.usePointsForExternal
        : false,
      trainingType: data?.trainingType ? data?.trainingType : [],
    },
    resolver: zodResolver(organizationSchema),
  });
  const { data: newMan } = useSubscriptionGet({
    organisationId: organisationId,
  });

  console.log(`🚀 ~ file: mini-form.jsx:53 ~ newMan:`, newMan);
  const { errors, isDirty } = formState;
  const onSubmit = (data) => {
    mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full p-4 flex flex-wrap">
        <AuthInputFiled
          name="canManagerAssign"
          icon={AssignmentTurnedInOutlined}
          control={control}
          type="checkbox"
          label="Manager can assign trainings to their reportees"
          errors={errors}
          error={errors.canManagerAssign}
        />
        <AuthInputFiled
          name={"canDeptHeadAssign"}
          icon={SupervisorAccountOutlined}
          control={control}
          type="checkbox"
          label="Department Head can assign trainings to their employees"
          errors={errors}
          error={errors.canDeptHeadAssign}
        />
        <AuthInputFiled
          name={"canHRAssign"}
          icon={PeopleOutlined}
          control={control}
          type="checkbox"
          label="HR can assign trainings to their employees."
          errors={errors}
          error={errors.canHRAssign}
        />
        {newMan?.plan?.item?.name === "Aegis Intermediate Plan" && (
          <>
            <AuthInputFiled
              name={"collectPoints"}
              icon={LoyaltyOutlined}
              control={control}
              type="checkbox"
              label="Here you can allow employees to collect points for completed trainings"
              errors={errors}
              error={errors.collectPoints}
            />
            <AuthInputFiled
              name={"canHRDefinePoints"}
              icon={TuneOutlined}
              control={control}
              type="checkbox"
              label="HR can define points to specific trainings"
              errors={errors}
              error={errors.canHRDefinePoints}
            />
            <AuthInputFiled
              name={"usePointsForExternal"}
              icon={ShareOutlined}
              control={control}
              type="checkbox"
              label="Here earned points can be used for external trainings"
              errors={errors}
              error={errors.usePointsForExternal}
            />
          </>
        )}
        <AuthInputFiled
          name="trainingType"
          icon={AssignmentTurnedIn}
          control={control}
          type="autocomplete"
          placeholder="Add Salary Type"
          label="Add Salary Type"
          readOnly={false}
          maxLimit={15}
          errors={errors}
          error={errors.trainingType}
          autocompleteOption={data?.trainingType ? data?.trainingType : []}
        />
      </div>
      <div className="w-full flex justify-center mb-4 mt-2">
        <Button disabled={!isDirty} variant="contained" type="submit">
          Apply For Changes
        </Button>
      </div>
    </form>
  );
};

export default MiniForm;
