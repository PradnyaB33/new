import React from "react";
import useTrainingHook from "../../../hooks/QueryHook/Training/hook";
import TableRow from "./components/TableRow";
import TableHeader from "./components/header";
import TrainingTableLoading from "./components/loading-skeleton";

const TrainingTable = () => {
  const { data, isLoading } = useTrainingHook();
  console.log(`🚀 ~ file: page.jsx:8 ~ data:`, data);

  return (
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
  );
};

export default TrainingTable;
