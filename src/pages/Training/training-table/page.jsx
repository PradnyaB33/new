import React from "react";
import useTrainingHook from "../../../hooks/QueryHook/Training/hook";
import TableRow from "./components/TableRow";
import Bottom from "./components/bottom";
import TrainingTableLoading from "./components/loading-skeleton";

const TrainingTable = ({ mainData }) => {
  const { data, isLoading } = useTrainingHook();
  console.log(`🚀 ~ file: page.jsx:9 ~ data:`, data);

  return (
    <>
      <div className="w-full bg-white text-left text-sm font-light">
        <h1 className="text-sm font-bold underline text-right">
          Total trainings created {data?.totalResults}
        </h1>
        <div>
          {isLoading && <TrainingTableLoading />}
          {(mainData ?? data)?.data?.map((doc) => (
            <TableRow
              logo={doc?.trainingLogo}
              name={doc?.trainingName}
              duration={doc?.trainingDuration}
              doc={doc}
            />
          ))}
        </div>
      </div>
      <Bottom />
    </>
  );
};

export default TrainingTable;
