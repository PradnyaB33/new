import React from "react";
import useTrainingHook from "../../../hooks/QueryHook/Training/hook";
import TableRow from "./components/TableRow";
import Bottom from "./components/bottom";
import TableHeader from "./components/header";
import TrainingTableLoading from "./components/loading-skeleton";

const TrainingTable = () => {
  const { data, isLoading } = useTrainingHook();

  return (
    <>
      <table className="min-w-full bg-white text-left text-sm font-light">
        <TableHeader />
        <tbody>
          {isLoading && <TrainingTableLoading />}
          {data?.data?.map((doc) => (
            <TableRow
              logo={doc?.trainingLogo}
              name={doc?.trainingName}
              duration={doc?.trainingDuration}
              doc={doc}
            />
          ))}
        </tbody>
      </table>
      <Bottom />
    </>
  );
};

export default TrainingTable;
