import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import randomColor from "randomcolor";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

const CreteLeaveTypeModal = ({ handleClose, open }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const queryClient = useQueryClient();
  const param = useParams();
  const leaveTypeSchema = z.object({
    leaveName: z.string(),
    count: z.number({ required_error: "Count is required" }),
    color: z.string(),
    isActive: z.boolean(),
  });
  const form = useForm({
    defaultValues: {
      leaveName: "",
      color: randomColor(),
      isActive: true,
      count: "",
    },
    resolver: zodResolver(leaveTypeSchema),
  });

  const { handleSubmit, control, formState } = form;
  const { errors } = formState;
  const isFormClean = Object.keys(formState.dirtyFields).length === 0;

  const onSubmit = async (data) => {
    try {
      // Make the PATCH request using axios
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/leave-types/${param.organisationId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      // Handle success
      console.log(`🚀 ~ response:`, response);
      handleAlert(true, "success", response.data.message);
      // Invalidate the query to refetch the data
      queryClient.invalidateQueries("leaveTypes");
      // Close the modal

      handleClose();
      form.reset();
    } catch (error) {
      // Handle error
      console.error(error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message ||
          "Failed to update leave type. Please try again."
      );
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    p: 4,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 shadow-md outline-none rounded-md gap-2 flex flex-col"
      >
        <Typography variant="h3" className="!font-bold !text-lg border-b ">
          Create Leave Type
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2} width={400}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Leave Type Name</FormLabel>
              <Controller
                name="leaveName"
                control={control}
                render={({ field }) => <TextField size="small" {...field} />}
              />
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">count</FormLabel>
              <Controller
                name="count"
                control={control}
                render={({ field }) => {
                  return (
                    <TextField
                      disabled={field.disabled}
                      error={errors?.count ? true : false}
                      helperText={errors?.count?.message}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(parseInt(e.target.value));
                      }}
                      size="small"
                      type="number"
                      // {...field}
                    />
                  );
                }}
              />
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">Color</FormLabel>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <div
                    className="rounded-full overflow-hidden relative"
                    style={{
                      height: "40px",
                      width: "40px",
                    }}
                  >
                    <input
                      value={field.value}
                      required
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        height: "60px",
                        width: "60px",
                        padding: "0",
                        border: "none",
                      }}
                      type="color"
                      id="favcolor"
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </div>
                )}
              />
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">Is Active</FormLabel>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    }
                    label="is Active"
                  />
                  // <Checkbox className="w-fit" {...field} />
                )}
              />
            </FormControl>
            <Button disabled={isFormClean} type="submit" variant="contained">
              Apply for changes
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default CreteLeaveTypeModal;
