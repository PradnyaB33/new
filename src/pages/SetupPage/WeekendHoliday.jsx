import React, { useState, useContext } from "react";
import Setup from "../SetUpOrganization/Setup";
import WeekendOutlinedIcon from "@mui/icons-material/WeekendOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router";
import axios from "axios";
import { useQuery, useQueryClient } from "react-query";
import { UseContext } from "../../State/UseState/UseContext";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Skeleton from "@mui/material/Skeleton";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SkeletonRow = () => (
  <tr className="!font-medium border-b !space-y-3">
    <td className="!text-left !pl-9 !mr-5 w-1/12">
      <Skeleton variant="text" width={30} height={20} />
    </td>
    <td className="w-2/12 pt-2 pb-2">
      <div className="flex gap-1">
        <Skeleton
          variant="circle"
          width={50}
          height={50}
          style={{ borderRadius: "50%" }}
        />
        <Skeleton
          variant="circle"
          width={50}
          height={50}
          style={{ borderRadius: "50%" }}
        />
      </div>
    </td>
    <td className="px-6 w-2/12">
      <Skeleton variant="circle" width={30} height={30} />
    </td>
  </tr>
);

const WeekdaySelector = ({ selectedDays, handleDayToggle, getColor }) => {
  return (
    <Grid spacing={1} className="!flex !justify-around">
      {daysOfWeek.map((day, index) => (
        <Grid item key={day} xs={6} sm={4} md={3} lg={2}>
          <Chip
            label={day}
            onClick={() => handleDayToggle(day, index)}
            className="text-2xl"
            style={{
              backgroundColor: selectedDays.includes(day) ? getColor(day) : '#dbdbdb',
              borderRadius: "50%",
              width: "55px",
              height: "55px",
              cursor: "pointer",
              color: "black",
              fontWeight: "bold",
              border: "1px solid gray",
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

const WeekendHoliday = () => {
  const organizationId = useParams().organisationId;
  const [selectedDays, setSelectedDays] = useState([]);
  const [openModel, setOpenModel] = useState(false);
  const { setAppAlert } = useContext(UseContext);
  const [editItem, setEditItem] = useState(null);
  const [deleteModel, setDeleteModel] = useState(false);
  const [ID, setID] = useState("");
  const queryClient = useQueryClient();

  const handleDayToggle = (day, index) => {
    const updatedDays = selectedDays.includes(day)
      ? selectedDays.filter((selected) => selected !== day)
      : [...selectedDays, day];

    setSelectedDays(updatedDays);
    console.log(`Toggled day: ${day} at index: ${index}`);
  };

  const getColor = (day) => {
    const index = daysOfWeek.indexOf(day);
    const hue = (index * 50) % 360;
    return `hsl(${hue}, 80%, 60%)`;
  };

  const handleSubmit = async () => {
    try {
      const daysArray = selectedDays.map(day => ({ day }));

      if (editItem) {
        await axios.patch(
          `${process.env.REACT_APP_API}/route/weekend/update/${editItem._id}`,
          { days: daysArray }
        );

        console.log("Successfully updated");
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Days Updated Successfully!",
        });
      } else {
        const existingWeekend = await axios.get(
          `${process.env.REACT_APP_API}/route/weekend/get/${organizationId}`
        );

        if (existingWeekend.data.days.length > 0) {
          handleOpenClose();
          throw new Error("Weekend already exists for this organization.");
        }

        console.log(daysArray);

        if (daysArray.length > 3) {
          throw new Error("Weekend cannot have more than 3 days");
        }


        await axios.post(
          `${process.env.REACT_APP_API}/route/weekend/create`,
          { days: daysArray, organizationId }
        );
        console.log("Successfully created");
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Days Created Successfully!",
        });
      }

      handleOpenClose();
      setEditItem(null);
      setSelectedDays([]);

      queryClient.invalidateQueries("days");
    } catch (error) {
      console.error(error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: error.message,
      });
    }
  };

  const handleDelete = async () => {
    try {
      console.log(ID);
      await axios.delete(
        `${process.env.REACT_APP_API}/route/weekend/delete/${ID}`
      );
      console.log("Successfully deleted");
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Weekend Deleted Successfully!",
      });
      handleOpenClose();
      queryClient.invalidateQueries("days");
    } catch (error) {
      console.error(error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: error.message,
      });
      handleOpenClose();
    } finally {
      handleOpenClose();
    }
  };

  const handleOpenClose = () => {
    setOpenModel((prevstate) => !prevstate);
    setSelectedDays([]);
    setDeleteModel(false);
    setEditItem(null);
  };

  const fetchDays = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/weekend/get/${organizationId}`
      );
      return response.data.days || [];
    } catch (error) {
      console.error("Error fetching days:", error);
      throw error;
    }
  };

  const { data, isLoading } = useQuery("days", fetchDays);

  return (
    <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
      <Setup>
        <article className="SetupSection bg-white w-[80%] h-max shadow-md rounded-sm border items-center">
          <div className="p-4 border-b-[.5px] flex items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex items-center gap-3 ">
              <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                <WeekendOutlinedIcon className="!text-lg text-white" />
              </div>
              <h1 className="!text-lg tracking-wide">Weekly off</h1>
            </div>
            <Button
              className="!font-semibold !bg-sky-500 flex items-center gap-2"
              variant="contained"
              onClick={handleOpenClose}
            >
              Add Days
            </Button>
          </div>

          <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
            <table className="min-w-full bg-white text-left !text-sm font-light">
              <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                <tr className="!font-semibold ">
                  <th scope="col" className="!text-left pl-8 py-3 w-1/12">
                    SR NO
                  </th>
                  <th scope="col" className="py-3 w-2/12 !mr-6">
                    Days
                  </th>
                  <th scope="col" className="px-6 py-3 w-2/12">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {!data?.length ? (
                  <>
                    <tr>
                      <td className="font-bold p-3">No holidays found</td>
                    </tr>
                  </>
                ) : (
                  data && data?.map((item, idx) => (
                    <tr className="!font-medium border-b !space-y-3" key={idx}>
                      <td className="!text-left !pl-9 !mr-5 w-1/12 ">{idx + 1}</td>
                      <td style={{ marginRight: "1rem" }} className="w-2/12 pt-2 pb-2">
                        <div className="flex gap-1">
                          {item.days.map((day, dayIdx) => (
                            <Chip
                              key={dayIdx}
                              label={day.day}
                              className="text-sm"
                              style={{
                                backgroundColor: getColor(day.day),
                                borderRadius: "50%",
                                width: "50px",
                                height: "50px",
                                cursor: "pointer",
                                border: "1px solid gray",
                                color: "black",
                                fontWeight: "bolder",
                                fontSize: "12.5px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 w-2/12">
                        <IconButton
                          color="error"
                          aria-label="delete"
                          style={{ paddingTop: "0.8rem" }}
                          onClick={() => {
                            setID(item._id);
                            setDeleteModel(true);
                            console.log(ID);
                          }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <Dialog
              open={deleteModel}
              onClose={() => setDeleteModel(false)}
              fullWidth
            >
              <DialogActions>
                <DialogContent>
                  <div className="flex flex-col gap-5">
                    <h1 className="text-center text-2xl">Are you sure !</h1>
                    <div className="flex gap-5">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                      >
                        Yes
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setDeleteModel(false)}
                      >
                        No
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </DialogActions>
            </Dialog>
            <Dialog open={openModel} onClose={handleOpenClose} fullWidth>
              <DialogActions>
                <DialogContent>
                  <h1 className="!text-3xl text-center mb-8">Select days</h1>
                  <div className="mb-6">
                    <WeekdaySelector
                      selectedDays={selectedDays}
                      handleDayToggle={handleDayToggle}
                      getColor={getColor}
                    />
                  </div>
                  <div className="flex gap-5 !pt-5">
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      color="secondary"
                    >
                      {editItem ? "Update" : "Set"}
                    </Button>
                    <Button
                      onClick={handleOpenClose}
                      variant="contained"
                      color="error"
                    >
                      Cancel
                    </Button>
                  </div>
                </DialogContent>
              </DialogActions>
            </Dialog>
          </div>
        </article>
      </Setup>
    </section>
  );
};

export default WeekendHoliday;
