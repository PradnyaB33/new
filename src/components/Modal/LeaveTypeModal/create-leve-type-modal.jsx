import { zodResolver } from "@hookform/resolvers/zod";
import { Add, ToggleOn, WorkOffOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Modal,
  Stack,
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
import AuthInputFiled from "../../InputFileds/AuthInputFiled";

const CreteLeaveTypeModal = ({ handleClose, open }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const queryClient = useQueryClient();
  const param = useParams();
  const leaveTypeSchema = z.object({
    leaveName: z.string(),
    count: z
      .string()
      .refine((doc) => Number(doc) > 0, { message: "Count is greater than 0" }),
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

  const { mutate, isLoading } = useMutation(
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
        form.reset();
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
      mutate(data);
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
      keepMounted={false}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 shadow-md outline-none rounded-md gap-2 flex flex-col"
      >
        <h1 className="text-xl pl-2 font-semibold font-sans">Add leave type</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2} width={400}>
            <AuthInputFiled
              name="leaveName"
              icon={WorkOffOutlined}
              control={control}
              type="text"
              placeholder="eg. Sick leave"
              label="Leave Type Name *"
              errors={errors}
              error={errors.leaveName}
            />
            <AuthInputFiled
              name="count"
              icon={Add}
              control={control}
              type="number"
              placeholder="eg. 4"
              label="Enter Count *"
              errors={errors}
              error={errors.count}
            />
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
            <AuthInputFiled
              name="isActive"
              icon={ToggleOn}
              control={control}
              type="checkbox"
              placeholder="eg. 4"
              label="Is Active *"
              errors={errors}
              error={errors.count}
            />
            <Button
              disabled={isFormClean || isLoading}
              type="submit"
              variant="contained"
            >
              <div className="w-6 h-6">
                {isLoading && <CircularProgress size={20} />}
              </div>
              Submit
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default CreteLeaveTypeModal;
