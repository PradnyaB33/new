import { zodResolver } from "@hookform/resolvers/zod";
import { Abc, AccessTime, Work } from "@mui/icons-material";
import { Box, Button, CircularProgress, Modal } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";

const ShiftModal = ({ handleClose, open, id, shiftId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [error, setError] = useState("");
  const ShiftSchema = z.object({
    startDateTime: z.string(),
    endDateTime: z.string(),
    shiftName: z.string(),
    workingFrom: z.object({
      label: z.string(),
      value: z.string(),
    }),
  });

  console.log(error);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ShiftSchema),
  });

  const { data, isLoading } = useQuery(
    ["shift", shiftId],
    async () => {
      if (open && shiftId !== null) {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/getSingleshifts/${shiftId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data;
      }
    },
    {
      enabled: open && shiftId !== null,
    }
  );

  const changeTimeFormatForEdit = (timeString, setState) => {
    const [hours, minutes] = timeString?.split(":");

    // Get the current date
    const currentDate = dayjs();
    // Set the hours and minutes to create a new date
    const newDate = currentDate
      .set("hour", parseInt(hours))
      .set("minute", parseInt(minutes));
    // Set other state values accordingly
    setState(newDate);
  };

  useEffect(() => {
    if (data && data.shifts) {
      const shiftData = data.shifts;
      console.log(shiftData);
      setWorkingFrom(shiftData.workingFrom || "");
      setShiftName(shiftData.shiftName || "");
      setSelectedDays(shiftData.selectedDays || "");

      changeTimeFormatForEdit(shiftData?.startTime, setStartDateTime);
      changeTimeFormatForEdit(shiftData?.endTime, setEndDateTime);
    }
  }, [data]);

  useEffect(() => {
    if (!open) {
      setWorkingFrom("");
      setShiftName("");
    }
  }, [open]);

  const daysOfWeek = [
    { label: "Mon", value: "Monday" },
    { label: "Tus", value: "Tuesday" },
    { label: "Wed", value: "Wednesday" },
    { label: "Thur", value: "Thursday" },
    { label: "Fri", value: "Friday" },
    { label: "Sat", value: "Saturday" },
    { label: "Sun", value: "Sunday" },
  ];
  const [startDateTime, setStartDateTime] = useState(dayjs(new Date()));
  const [endDateTime, setEndDateTime] = useState(() =>
    startDateTime.add(9, "hour")
  );
  const [validationError, setValidationError] = useState(false);
  const [workingFrom, setWorkingFrom] = useState(
    data ? data?.shifts?.workingFrom : ""
  );
  const [shiftName, setShiftName] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);

  const queryClient = useQueryClient();

  const handleStartDateTimeChange = (newDateTime) => {
    setStartDateTime(newDateTime);
    setEndDateTime(newDateTime.add(9, "hour"));
    setValidationError(false);
  };

  const AddShift = useMutation(
    (data) =>
      axios.post(`${process.env.REACT_APP_API}/route/shifts/create`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["shifts"] });
        handleClose();
        handleAlert(true, "success", "Shift generated succesfully");
      },
      onError: () => {
        setError("An error occurred while creating a new shift");
      },
    }
  );

  const EditShift = useMutation(
    (data) =>
      axios.patch(
        `${process.env.REACT_APP_API}/route/shifts/${shiftId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["shifts"] });
        handleClose();
        handleAlert(true, "success", "Shift updated succesfully");
      },
      onError: () => {
        setError("An error occurred while creating a new shift");
      },
    }
  );

  const handleError = (error) => {
    setError(error);
    return false;
  };

  const onSubmit = async (data) => {
    // if (workingFrom === "") return handleError("Shift type field is mandatory");
    // else if (shiftName === "")
    //   return handleError("Shift name field is mandatory");
    // else if (startDateTime === null)
    //   return handleError("Start time is mandatory");
    // else if (endDateTime === null)
    //   return handleError("end time field is mandatory");
    // else if (selectedDays.length <= 0)
    //   return handleError("Please select Week Days");

    if (selectedDays.length <= 0) {
      setError("Please select the week days to create a shift");
      return false;
    }

    try {
      const requestData = {
        startTime: dayjs(data.startDateTime).format("HH:mm"),
        endTime: dayjs(data.endDateTime).format("HH:mm"),
        selectedDays,
        workingFrom: data.workingFrom,
        shiftName: data.shiftName,
        organizationId: id,
      };

      if (shiftId) {
        await EditShift.mutateAsync(requestData);
      } else {
        // Use the AddShift function from React Query
        await AddShift.mutateAsync(requestData);
      }
      // Reset form state
      setError("");
      // setStartDateTime("");
      // setEndDateTime("");
      setWorkingFrom("");
      setShiftName("");
    } catch (error) {
      console.error(error);
      setError("An error occurred while creating a new shift");
    }
  };

  const isSelected = (day) => {
    return selectedDays.includes(day);
  };

  const handleChange = (event) => {
    setWorkingFrom(event.target.value);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    p: 4,
  };

  const handleEndDateTimeChange = (newDateTime) => {
    // Check if the time difference is at least 9 hours
    const timeDifferenceInMilliseconds = newDateTime.diff(startDateTime);
    const timeDifferenceInHours = Math.abs(
      timeDifferenceInMilliseconds / (1000 * 60 * 60)
    );
    // Check if AM/PM changes
    const amPmChange = startDateTime.format("A") !== newDateTime.format("A");

    // Calculate the adjusted difference in 12-hour format
    const adjustedDifferenceInHours = amPmChange
      ? timeDifferenceInHours
      : timeDifferenceInHours % 12 || 12;

    if (adjustedDifferenceInHours >= 9) {
      setEndDateTime(newDateTime);
      // Reset validation error
      setValidationError(false);
    } else {
      // Set validation error
      setValidationError(true);
    }
  };

  const handleDaySelection = (event, newSelectedDays) => {
    setSelectedDays(newSelectedDays);
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
        className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
      >
        <div className="flex justify-between py-4 items-center  px-4">
          <h1 className="text-xl pl-2 font-semibold font-sans">
            {shiftId ? "Edit Shift" : "Add Shift"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-5 space-y-4 mt-4">
          {/* <div className="space-y-2 ">
            <label className="text-md" htmlFor="demo-simple-select-label">
              {shiftId && isLoading ? "loading" : "Select shift type"}
            </label>
            <FormControl size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">
                Select shift Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={workingFrom}
                onChange={handleChange}
                label="Select Leave Type"
              >
                <MenuItem value={"remote"}>Remote</MenuItem>
                <MenuItem value={"office"}>Office</MenuItem>
              </Select>
            </FormControl>
          </div> */}

          <AuthInputFiled
            name="workingFrom"
            control={control}
            type="select"
            icon={Work}
            placeholder="test temp"
            label="Enter Template Name *"
            readOnly={false}
            maxLimit={15}
            options={[
              {
                label: "Remote",
                value: "Remote",
              },
              {
                label: "Office",
                value: "Office",
              },
            ]}
            errors={errors}
            error={errors.workingFrom}
          />
          <AuthInputFiled
            name="shiftName"
            icon={Abc}
            control={control}
            type="text"
            placeholder="Shift"
            label="Enter shift name *"
            readOnly={false}
            maxLimit={15}
            errors={errors}
            error={errors.shiftName}
          />

          <div className="grid gap-2 grid-cols-2">
            <AuthInputFiled
              name="startDateTime"
              icon={AccessTime}
              control={control}
              type="time"
              placeholder="Start Time"
              label="Enter Start Time *"
              readOnly={false}
              maxLimit={15}
              errors={errors}
              error={errors.startDateTime}
            />
            <AuthInputFiled
              name="endDateTime"
              icon={AccessTime}
              control={control}
              type="time"
              placeholder="End Time"
              label="Enter End Time *"
              readOnly={false}
              maxLimit={15}
              errors={errors}
              error={errors.endDateTime}
            />
          </div>

          {/* <div className="space-y-2 ">
            <label className="text-md" htmlFor="demo-simple-select-label">
              Enter shift name
            </label>
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-name">
                Shift name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-name"
                label="Shift type"
                value={shiftName}
                onChange={(e) => setShiftName(e.target.value)}
              />
            </FormControl>
          </div> */}

          {/* <div className="flex justify-between">
            <div className="space-y-2 w-[45%] ">
              <label className="text-md" htmlFor="demo-simple-select-label">
                Start time
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker"]}>
                  <MobileTimePicker
                    className="w-full"
                    label=" Select Start Time of Shift"
                    value={startDateTime}
                    onChange={handleStartDateTimeChange}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>

            <div className="space-y-2 w-[45%]">
              <label className="text-md" htmlFor="demo-simple-select-label">
                End time
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker"]}>
                  <MobileTimePicker
                    label=" Select End Time of Shift"
                    value={endDateTime}
                    className="w-full"
                    onChange={handleEndDateTimeChange}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                  />
                </DemoContainer>
                {validationError && (
                  <div className="text-red-500">
                    Minimum time difference of 9 hours required
                  </div>
                )}
              </LocalizationProvider>
            </div>
          </div> */}

          <div
            className="w-full"
            style={{ width: "100%", justifyContent: "center", gap: "2px" }}
          >
            <label
              className="font-semibold text-gray-500 text-md"
              htmlFor="demo-simple-select-label"
            >
              Select Week Days
            </label>
            <ToggleButtonGroup
              value={selectedDays}
              onChange={handleDaySelection}
              aria-label="selectedDays"
              className="mt-2 w-max !space-x-5 "
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {daysOfWeek.map((day) => (
                <ToggleButton
                  key={day.label}
                  value={day.value}
                  className="!rounded-full !border-[2px] !border-gray-200 !text-xs font-semibold"
                  style={{
                    width: "40px",
                    height: "40px",
                    padding: "2px",
                    backgroundColor: isSelected(day.value)
                      ? "#1976d2"
                      : "transparent",
                    color: isSelected(day.value) ? "white" : "black",
                  }}
                >
                  {day.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <div className="h-4 !my-1">
              {error && <p className="text-red-500">*{error}</p>}
            </div>
          </div>
          <div className="flex gap-4  mt-4  justify-end">
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            {shiftId ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={EditShift.isLoading}
              >
                {EditShift.isLoading ? <CircularProgress size={20} /> : "Apply"}
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={AddShift.isLoading}
              >
                {AddShift.isLoading ? <CircularProgress size={20} /> : "submit"}
              </Button>
            )}
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ShiftModal;
