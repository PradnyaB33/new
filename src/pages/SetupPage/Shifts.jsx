import {
  AccessTimeFilled,
  EventAvailableOutlined,
  Info,
  MoreTime,
} from "@mui/icons-material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Avatar,
  AvatarGroup,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import randomColor from "randomcolor";
import React, { useContext, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import ShiftModal from "../../components/Modal/shift/ShiftModal";
import Setup from "../SetUpOrganization/Setup";

const Shifts = () => {
  const { organisationId } = useParams("");
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const [error, setError] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const [open, setOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [ShiftId, setShiftId] = useState(null);
  const handleOpen = () => {
    setOpen(true);
    setShiftId(null);
  };

  const handleClose = () => {
    setError("");
    setOpen(false);
    setShiftId(null);
    setEditModalOpen(false);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleEditModalOpen = (shiftId) => {
    setEditModalOpen(true);
    console.log(shiftId);
    queryClient.invalidateQueries(["shift", ShiftId]);
    setShiftId(shiftId); // Set the shiftId for editing
  };

  const { data, isLoading } = useQuery("shifts", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/shifts/${organisationId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  });

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(`${process.env.REACT_APP_API}/route/shifts/${id}`, {
        headers: {
          Authorization: authToken,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("shifts");
        handleAlert(true, "success", "Shift deleted succesfully");
      },
    }
  );

  const handleDelete = (id) => {
    // Call the deleteMutation function with the id of the item to delete
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };

  const convertTo12HourFormat = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const newDate = dayjs().hour(parseInt(hours)).minute(parseInt(minutes));
    return newDate.format("h:mm A");
  };

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-[80%]  h-max shadow-md rounded-sm border  items-center">
            <div className="p-4  border-b-[.5px] flex items-center justify-between  gap-3 w-full border-gray-300">
              <div className="flex items-center  gap-3 ">
                <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                  <EventAvailableOutlined className="!text-lg text-white" />
                </div>
                <h1 className="!text-lg tracking-wide">
                  Create shifts for organization
                </h1>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                onClick={handleOpen}
                variant="contained"
              >
                <MoreTime className="!text-md" />
                Create Shift
              </Button>
            </div>

            <article className="h-max">
              <div className="flex h-full flex-col">
                <div className=" h-full">
                  <div className="min-w-full">
                    {isLoading ? (
                      <div className="space-y-2">
                        <Skeleton
                          variant="rounded"
                          className="!w-full !h-[5vh]"
                        />
                        <Skeleton
                          variant="rounded"
                          className="!w-full !h-[5vh]"
                        />
                      </div>
                    ) : data?.shifts?.length > 0 ? (
                      <div className="overflow-auto !p-0  border-[.5px] border-gray-200">
                        <table className="min-w-full bg-white  text-left text-sm font-light">
                          <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                            <tr className="!font-medium shadow-lg">
                              <th scope="col" className="px-6 py-3 ">
                                SR NO
                              </th>
                              <th scope="col" className="px-6 py-3 ">
                                Shift Name
                              </th>
                              <th scope="col" className="px-6 py-3 ">
                                Working From
                              </th>
                              <th scope="col" className="px-6 py-3 ">
                                Shift start time
                              </th>
                              <th scope="col" className="px-6 py-3 ">
                                Shift ends time
                              </th>
                              <th scope="col" className="px-6 py-3 ">
                                Week days
                              </th>
                              <th scope="col" className="px-6 py-3 ">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {data?.shifts &&
                              data?.shifts?.map((items, index) => (
                                <tr
                                  id={index}
                                  key={index}
                                  className={`${
                                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                  } border-b dark:border-neutral-500`}
                                >
                                  <td className="whitespace-nowrap px-6 py-2 font-medium">
                                    {index + 1}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-2">
                                    {items.shiftName}
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-2">
                                    {items.workingFrom}
                                  </td>
                                  <td className="whitespace-nowrap font-semibold px-6 py-2">
                                    <Chip
                                      icon={<AccessTimeFilled />}
                                      size="small"
                                      variant="outlined"
                                      color="success"
                                      label={convertTo12HourFormat(
                                        items.startTime
                                      )}
                                    />
                                  </td>
                                  <td className="whitespace-nowrap font-semibold px-6 py-2">
                                    <Chip
                                      icon={<AccessTimeFilled />}
                                      variant="outlined"
                                      size="small"
                                      color="success"
                                      label={convertTo12HourFormat(
                                        items.endTime
                                      )}
                                    />
                                  </td>

                                  <td className="whitespace-nowrap text-left px-6 py-2">
                                    <AvatarGroup max={6}>
                                      {items?.selectedDays.map((item) => (
                                        <Avatar
                                          src="dsadsa"
                                          key={item}
                                          className="!text-xs "
                                          sx={{
                                            width: 35,
                                            height: 35,
                                            backgroundColor: randomColor({
                                              seed: item,
                                              luminosity: "dark",
                                            }),
                                          }}
                                        >
                                          {item.slice(0, 3)}
                                        </Avatar>
                                      ))}
                                    </AvatarGroup>
                                  </td>
                                  {/* <td className=" px-6  flex gap-6 flex-wrap  py-2">
                              {items?.selectedDays.map((item) => (
                                <Badge badgeContent={item} color="primary" />
                              ))}
                            </td> */}
                                  <td className="whitespace-nowrap px-6 py-2">
                                    <IconButton
                                      onClick={() =>
                                        handleDeleteConfirmation(items._id)
                                      }
                                    >
                                      <DeleteIcon
                                        className="!text-xl"
                                        color="error"
                                      />
                                    </IconButton>
                                    <IconButton
                                      onClick={() =>
                                        handleEditModalOpen(items._id)
                                      }
                                    >
                                      <BorderColorIcon
                                        className="!text-xl"
                                        color="success"
                                      />
                                    </IconButton>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                        <article className="flex items-center mb-1 text-red-500 gap-2">
                          <Info className="!text-2xl" />
                          <h1 className="text-xl font-semibold">
                            Shift Not found
                          </h1>
                        </article>
                        <p>
                          There are no shifts for the organization. Please
                          create a shift to view the preview.
                        </p>
                      </section>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </article>
        </Setup>
      </section>

      <ShiftModal id={organisationId} open={open} handleClose={handleClose} />

      <ShiftModal
        handleClose={handleClose}
        id={organisationId}
        open={editModalOpen}
        shiftId={ShiftId}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle color={error}>
          <WarningIcon color="error" /> Are you sure to delete the shift?
        </DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete the shift, as this action
            cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(deleteConfirmation)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* <form style={{ width: "100%", display: "flex" }} action="">
        <Container
          style={{
            display: "flex",
            paddingTop: "5px",
            backgroundColor: "#fefdff",
            padding: "10px",
            paddingBottom: "30px",
            borderRadius: "5px",
            alignItems: "center",
            flexDirection: "column",
            gap: "2rem",
            height: "75vh",
            border: "1.5px solid rgb(177, 177, 177)",
            marginLeft: "5rem",
            position: "relative",
            top: "20px",
          }}
          maxWidth="sm"
        >
          <Typography
            style={{
              color: "#1D6EB7",
              fontWeight: "600",
              position: "relative",
              top: "20px",
              fontSize: "1.5rem",
              width: "80%",
            }}
            variant="h4"
          >
            Set Shifts
          </Typography>
          <FormControl
            required
            style={{ marginTop: "20px", width: "80%", height: "10px" }}
            size="small"
          >
            <InputLabel id="industry-type-label">working from</InputLabel>
            <Select
              labelId="industry-type-label"
              id="industry-type"
              value={workingFrom || ""}
              onChange={(e) => setWorkingFrom(e.target.value)}
            >
              <MenuItem value="Remote">Remote</MenuItem>
              <MenuItem value="Office">Office</MenuItem>
            </Select>
          </FormControl>
          <TextField
            required
            style={{ marginTop: "20px", height: "10px" }}
            name="name"
            size="small"
            className="w-[80%]"
            label="what is your shift name"
            type="text"
            value={shiftName || ""}
            onChange={(e) => setShiftName(e.target.value)}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "80%",
            }}
          >
            <div style={{ border: "1px solid #c4c3c5", marginTop: "19px" }}>
              <h5
                style={{ position: "relative", left: "6px", color: "#817a8b" }}
              >
                starting time
              </h5>
              <DatePicker
                selected={selectedStartTime}
                onChange={handleStartTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="p-1"
              />
            </div>
            <div style={{ border: "1px solid #c4c3c5", marginTop: "19px" }}>
              <h5
                style={{ position: "relative", left: "6px", color: "#817a8b" }}
              >
                ending time
              </h5>
              <DatePicker
                selected={selectedEndTime}
                onChange={handleEndTimeChange}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
                className="p-1"
              />
            </div>
          </div>
          <h5
            style={{ color: "#817a8b" }}
            className="w-[80%] relative top-[-20px]"
          >
            select days
          </h5>
          <div style={{ width: "80%", justifyContent: "space-between" }}>
            <ToggleButtonGroup
              value={selectedDays}
              onChange={handleDaySelection}
              aria-label="selectedDays"
              style={{
                display: "flex",
                justifyContent: "space-between",
                position: "relative",
                top: "-40px",
              }}
            >
              {daysOfWeek.map((day) => (
                <ToggleButton
                  key={day}
                  value={day}
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "1px solid #c5c4c6",
                    backgroundColor: isSelected(day)
                      ? "rgb(189 50 214)"
                      : "transparent",
                    color: isSelected(day) ? "white" : "#737d90",
                  }}
                >
                  {day}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "80%",
            }}
          >
            <Button
              className="relative top-[-30px]"
              name="submit"
              onClick={handleSubmit}
              variant="contained"
              style={{ background: "#1D6EB7", color: "white" }}
            >
              Submit
            </Button>
          </div>
          {error && (
            <Typography
              style={{ color: "red", position: "absolute", fontSize: "0.8rem" }}
            >
              {error}
            </Typography>
          )}
        </Container>
        <Container>
          <ShiftDisplay />
        </Container>{" "}
        * */}
      {/* </form> */}
    </>
  );
};

export default Shifts;
