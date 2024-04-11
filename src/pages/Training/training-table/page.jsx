import React from "react";
import useTrainingHook from "../../../hooks/QueryHook/Training/hook";
import TableRow from "./components/TableRow";
import Bottom from "./components/bottom";
import TrainingTableLoading from "./components/loading-skeleton";

const TrainingTable = ({ mainData }) => {
  const { data, isLoading } = useTrainingHook();

  return (
    <>
      <div className="w-full bg-white text-left text-sm font-light">
        {/* <TableHeader /> */}
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
