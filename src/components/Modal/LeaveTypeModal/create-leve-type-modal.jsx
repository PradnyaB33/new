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
} from "@mui/material";
import axios from "axios";
import randomColor from "randomcolor";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

const CreteLeaveTypeModal = ({ handleClose, open }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
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
      leaveName: undefined,
      color: randomColor(),
      isActive: true,
      count: undefined,
    },
    resolver: zodResolver(leaveTypeSchema),
  });

  const { handleSubmit, control, formState } = form;
  const { errors } = formState;

  const isFormClean = Object.keys(formState.dirtyFields).length === 0;

  const mainFunc = useMutation(
    async (data) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/leave-types/${param.organisationId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: (data) => {
        handleAlert(true, "success", data.message);
        // Invalidate the query to refetch the data
        queryClient.invalidateQueries("leaveTypes");
        handleClose();
      },
      onError: (data) => {
        console.log(`🚀 ~ file: create-leve-type-modal.jsx:72 ~ data:`, data);
        console.log("error");
        handleAlert(
          true,
          "error",
          data?.response?.data?.message ||
            "Failed to update leave type. Please try again."
        );
      },
    }
  );
  const onSubmit = async (data) => {
    try {
      mainFunc.mutate(data);
    } catch (error) {
      // Handle error
      console.error(error);
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
      keepMounted={true}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 shadow-md outline-none rounded-md gap-2 flex flex-col"
      >
        <h1 className="text-xl pl-2 font-semibold font-sans">Add Leave Type</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2} width={400}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Type Name</FormLabel>
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
                render={({ field }) => {
                  return (
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
                  );
                }}
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

            <div className="flex gap-4 mt-4   justify-end mr-4 mb-4">
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>
              <Button
                disabled={isFormClean}
                variant="contained"
                color="primary"
                type="submit"
              >
                Submit
              </Button>
            </div>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default CreteLeaveTypeModal;
