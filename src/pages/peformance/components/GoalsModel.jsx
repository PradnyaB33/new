import { zodResolver } from "@hookform/resolvers/zod";
import {
  AttachFile,
  Close,
  DateRange,
  Paid,
  PersonOutline,
  TrendingUp,
} from "@mui/icons-material";
import { Box, Button, IconButton, Modal } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";

const GoalsModel = ({ handleClose, open, options }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    overflow: "scroll",
    maxHeigh: "80vh",
    p: 4,
  };

  const zodSchema = z.object({});

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      declaration: undefined,
      message: undefined,
    },
    resolver: zodResolver(zodSchema),
  });

  const onSubmit = async (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
        >
          <div className="flex justify-between py-4 items-center  px-4">
            <h1 id="modal-modal-title" className="text-xl pl-2">
              Goal Settings
            </h1>
            <IconButton onClick={handleClose}>
              <Close className="!text-[16px]" />
            </IconButton>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 max-h-[80vh] overflow-auto "
          >
            <AuthInputFiled
              name="Goal"
              icon={TrendingUp}
              control={control}
              type="text"
              placeholder="goal"
              label="Enter Goal Name"
              errors={errors}
              error={errors.declaration}
            />
            <AuthInputFiled
              name="description"
              icon={Paid}
              control={control}
              type="texteditor"
              placeholder="100"
              label="Enter goal name"
              errors={errors}
              error={errors.declaration}
            />
            <AuthInputFiled
              name="measurement"
              icon={Paid}
              control={control}
              type="texteditor"
              placeholder="100"
              label="Enter measurements name"
              errors={errors}
              error={errors.declaration}
            />
            <AuthInputFiled
              name="assignee"
              icon={PersonOutline}
              control={control}
              type="select"
              options={options}
              placeholder="Assignee name"
              label="Select assignee name"
              errors={errors}
              error={errors.declaration}
            />
            <AuthInputFiled
              name="Goal"
              icon={AttachFile}
              control={control}
              type="file"
              placeholder="100"
              label="Add Attachments"
              errors={errors}
              error={errors.declaration}
            />

            <div className="grid grid-cols-2 gap-2">
              <AuthInputFiled
                name="startDate"
                icon={DateRange}
                control={control}
                type="calender"
                options={options}
                placeholder="Assignee name"
                label="Enter start date"
                errors={errors}
                error={errors.declaration}
              />
              <AuthInputFiled
                name="endDate"
                icon={DateRange}
                control={control}
                type="calender"
                placeholder="100"
                label="Enter end date"
                errors={errors}
                error={errors.declaration}
              />
            </div>

            <AuthInputFiled
              name="assignee"
              icon={PersonOutline}
              control={control}
              type="select"
              options={options}
              placeholder="goal type"
              label="Select goal type"
              errors={errors}
              error={errors.declaration}
            />
            <AuthInputFiled
              name="assignee"
              icon={PersonOutline}
              control={control}
              type="text"
              options={options}
              placeholder="goal type"
              label="Select status"
              errors={errors}
              error={errors.declaration}
            />

            <div className="flex gap-4  mt-4 mr-4 justify-end">
              <Button
                type="button"
                onClick={handleClose}
                color="error"
                variant="outlined"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Create Goal
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default GoalsModel;
