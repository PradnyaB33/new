import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import useEmployeeListStore from "../Mutation/employeeListStore";
import useGeoMutation from "../Mutation/useGeoCard";
import SmallInputForm from "../utils/SmallInputForm";
import TableComponent from "../utils/TableComponent";

const ViewDelete = ({ onClose, circleId }) => {
  const { handleSubmit, register, setValue, watch } = useForm();
  const { addEmployeeToCircleMutate } = useGeoMutation();

  const { incrementPage, decrementPage, employeeList, page } =
    useEmployeeListStore();

  const onSubmit = (data) => {
    const selected = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== false) {
        acc[key] = value;
      }
      return acc;
    }, {});
    const selectedId = Object.keys(selected).filter(
      (key) => key !== "selectAll"
    );
    addEmployeeToCircleMutate({ circleId, employeeId: selectedId, onClose });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 flex-col">
      <SmallInputForm circleId={circleId} />
      <div className="flex flex-col gap-4 max-h-[300px] overflow-auto h-auto">
        <TableComponent register={register} setValue={setValue} watch={watch} />
      </div>
      <div className="flex flex-row-reverse gap-4">
        <Button
          type="button"
          onClick={incrementPage}
          disabled={employeeList?.length < 10}
          variant="outlined"
          className="!py-2"
        >
          <ArrowForwardIos className="!text-lg" />
        </Button>
        <Button
          onClick={decrementPage}
          disabled={page <= 0}
          type="button"
          variant="outlined"
          className="!py-2"
        >
          <ArrowBackIos className="!text-lg" />
        </Button>
      </div>
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </form>
  );
};

export default ViewDelete;
