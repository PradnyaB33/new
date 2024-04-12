import React from "react";
import TrainingCard from "../../components/card";
import CardLoader from "../../components/card-loader";
import useGetUpcomingTrainings from "./use-query";

const Modal1 = () => {
  const { data, isLoading } = useGetUpcomingTrainings();
  if (isLoading)
    return (
      <div className="flex flex-col gap-4 ">
        <h2 className="text-2xl font-bold">Upcoming Trainings</h2>
        {[1, 2, 3].map((item) => (
          <CardLoader key={item} />
        ))}
      </div>
    );
  return (
    <div className="flex flex-col gap-4 ">
      <h2 className="text-2xl font-bold">Upcoming Trainings</h2>
      {data?.data?.map((item) => (
        <TrainingCard key={item.id} doc={item?.trainingId} />
      ))}
    </div>
  );
};

export default Modal1;
