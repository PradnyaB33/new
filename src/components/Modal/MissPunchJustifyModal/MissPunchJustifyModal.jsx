import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
} from "@mui/material";
import React, { useContext } from "react";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import useMissedJustifyState from "./useMissedJustifyState";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Person } from "@mui/icons-material";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AddBusiness } from "@mui/icons-material";

const MissPunchJustifyModal = ({
  handleClose,
  open,
  unavailableRecords,
  organisationId,
}) => {
  const navigate = useNavigate();
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const unavailableRecordId = unavailableRecords?._id;
  const { justify, leave, shift } = useMissedJustifyState();

  //for  Get Query
  const { data: shiftData } = useQuery(
    ["shiftData", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/shifts/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.shifts;
    }
  );
  console.log("shift data", shiftData);
  const Shiftoptions = shiftData?.map((item) => {
    return {
      value: item?._id,
      label: item?.shiftName,
    };
  });
  console.log("Shiftoptions", Shiftoptions);

  // get query for leave
  const { data } = useQuery(
    "leaveTypes",
    async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/leave-types-details/get`,
        { organisationId: organisationId },
        config
      );
      return response.data.data;
    },
    {
      onSuccess: (newData) => {
        // Update the query cache with the new data
        queryClient.setQueryData("leaveTypes", newData);
      },
    }
  );
  console.log("data", data);

  const Leavetoptions = data?.map((item) => {
    return {
      value: item?._id,
      label: item?.leaveName,
    };
  });
  console.log("Leavetoptions", Leavetoptions);

  const MissPunchSchema = z.object({
    justify: z.string().optional(),
    leave: z
      .object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
      .optional(),
    shift: z
      .object({
        label: z.string().optional(),
        value: z.string().optional(),
      })
      .optional(),
  });

  const { control, formState, handleSubmit, reset } = useForm({
    defaultValues: {
      justify: justify,
      leave: leave?.label,
      shift: shift?.label,
    },
    resolver: zodResolver(MissPunchSchema),
  });

  const { errors } = formState;

  const queryClient = useQueryClient();

  const AddMissJustifyData = useMutation(
    (data) => {
      axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/update-punching-data/${unavailableRecordId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["missedJustifyData"] });
        handleClose();
        handleAlert(true, "success", "Request has been sent to manager.");
      },

      onError: () => {
        handleAlert(true, "error", "Something went wrong");
      },
    }
  );

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      leave: data.leave?.label || "",
      shift: data.shift?.label || "",
    };
    console.log(data);
    AddMissJustifyData.mutate(formattedData);
    reset();
  };

  const handleRedirect = async (actionType) => {
    if (actionType === "leave") {
      navigate(`/organisation/${organisationId}/leave`);
    } else if (actionType === "shift") {
      navigate(`/shift-management`);
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "800px!important",
          height: "100%",
          maxHeight: "65vh!important",
        },
      }}
      open={open}
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="flex w-full justify-between py-4 items-center  px-4">
        <h1 id="modal-modal-title" className="text-lg  font-semibold">
          Justify For Missed Data
        </h1>
        <IconButton onClick={handleClose}>
          <CloseIcon className="!text-[16px]" />
        </IconButton>
      </div>

      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className=" ml-2 mr-2 mt-2">
          <AuthInputFiled
            name="justify"
            icon={Person}
            control={control}
            type="text"
            placeholder="Forgot..."
            label="Enter your justification"
            errors={errors}
            error={errors.justify}
          />

          <AuthInputFiled
            name="leave"
            value={leave}
            icon={AddBusiness}
            control={control}
            type="select"
            placeholder="Select Leave"
            label="Leave"
            errors={errors}
            error={errors.leave}
            options={Leavetoptions}
          />

          <AuthInputFiled
            name="shift"
            value={shift}
            icon={AddBusiness}
            control={control}
            type="select"
            placeholder=" Select Shift"
            label="Select Shift"
            errors={errors}
            error={errors.shift}
            options={Shiftoptions}
          />

          <DialogActions
            sx={{
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={() => handleRedirect("leave")}
            >
              Apply for Leave
            </Button>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={() => handleRedirect("shift")}
            >
              Apply for Shift
            </Button>
            <Button type="submit" variant="contained" color="success">
              Submit
            </Button>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MissPunchJustifyModal;
