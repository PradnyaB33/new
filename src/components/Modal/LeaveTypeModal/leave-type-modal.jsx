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
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

const LeaveTypeModal = ({ handleClose, open, id, leaveType }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      leaveName: leaveType?.leaveName || "",
      color: leaveType?.color || "",
      isActive: leaveType?.isActive || false,
      count: leaveType?.count || 0,
    },
  });

  const { handleSubmit, control, formState } = form;
  const isFormClean = Object.keys(formState.dirtyFields).length === 0;
  const onSubmit = async (data) => {
    console.log(`🚀 ~ data:`, data);
    try {
      // Make the PATCH request using axios
      const response = await axios.patch(
        `${process.env.REACT_APP_API}/route/leave-types-details/${leaveType._id}`,
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
          Update Leave Type
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2} width={400}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Leave Type Name</FormLabel>
              <Controller
                name="leaveName"
                control={control}
                render={({ field }) => <TextField {...field} />}
              />
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">count</FormLabel>
              <Controller
                name="count"
                control={control}
                render={({ field }) => <TextField type="number" {...field} />}
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
                      value={field.value}
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
            <div className="flex gap-4 mt-4  justify-center mr-4">
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>
              <Button disabled={isFormClean} type="submit" variant="contained">
                Submit
              </Button>
            </div>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default LeaveTypeModal;
