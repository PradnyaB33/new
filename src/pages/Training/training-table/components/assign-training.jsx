import { zodResolver } from "@hookform/resolvers/zod";
import { Person } from "@mui/icons-material";
import { Box, Button, Modal } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../../components/InputFileds/AuthInputFiled";

const trainingAssign = z.object({
  employeeId: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
});

const AssignTraining = ({ open, setOpen, employees }) => {
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      employeeId: [],
    },
    resolver: zodResolver(trainingAssign),
  });
  const { errors } = formState;
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      keepMounted={false}
    >
      <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white">
        <form
          onSubmit={handleSubmit((data) => console.log(data))}
          className="flex flex-col justify-end "
        >
          <AuthInputFiled
            className={""}
            name={"employeeId"}
            icon={Person}
            control={control}
            type="mutltiselect"
            placeholder={"e.g. Select Employee *"}
            label={` Select Employees *`}
            errors={errors}
            error={errors?.employeeId}
            options={employees}
          />
          <Button variant className="!w-fit" type="submit">
            Assign
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AssignTraining;
