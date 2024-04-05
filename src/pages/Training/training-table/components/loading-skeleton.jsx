import { Skeleton } from "@mui/material";
import React from "react";

const TrainingTableLoading = () => {
  return (
    <tr
      className={`bg-white
       border-b dark:border-neutral-500`}
    >
      <td className="whitespace-nowrap px-6 py-2 grid place-items-center font-medium m-auto">
        <Skeleton variant="circular" width={40} height={40} />
      </td>
      <td className="whitespace-nowrap px-6 py-2 text-center">
        <Skeleton width={150} height={20} />
      </td>
      <td className="whitespace-nowrap px-6 py-2 text-center">
        <Skeleton width={50} height={20} />
      </td>

      <td className="whitespace-nowrap px-6 py-2 text-center">
        <Skeleton width={50} height={20} />
      </td>
    </tr>
  );
};

export default TrainingTableLoading;
