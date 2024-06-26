import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import SmallInputForm from "../utils/SmallInputForm";
import TableComponent from "../utils/TableComponent";

const ViewDelete = ({ open, setOpen, circleId }) => {
  const { handleSubmit, register, setValue, watch } = useForm();

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
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 flex-col">
      <SmallInputForm circleId={circleId} />
      <div className="flex flex-col">
        <TableComponent register={register} setValue={setValue} watch={watch} />
      </div>
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </form>
  );
};

export default ViewDelete;
