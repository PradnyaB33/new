import { Info } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HolidayVillageOutlinedIcon from "@mui/icons-material/HolidayVillageOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import axios from "axios";
import { format } from "date-fns";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import Setup from "../Setup";

const PublicHoliday = () => {
  const id = useParams().organisationId;
  const { setAppAlert } = useContext(UseContext);
  const [openModal, setOpenModal] = useState(false);
  const [actionModal, setActionModal] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [operation, setOperation] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedHolidayId, setSelectedHolidayId] = useState(null);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [formSubmitted, setFormSubmitted] = useState(false);
  const queryClient = useQueryClient();

  const [inputdata, setInputData] = useState({
    name: "",
    date: dayjs(new Date()),
    type: "",
    region: "",
    organizationId: "",
  });

  useEffect(() => {
    (async () => {
      await axios
        .get(
          `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${id}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        )
        .then((resp) => {
          setLocations(resp.data.locationsData);
        })
        .catch((e) => console.log(e));
    })();
  }, [authToken, id]);

  const { data } = useQuery("holidays", async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/holiday/get/${id}`
      );
      return response.data.holidays;
    } catch (error) {
      console.error("Error fetching holidays:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "An Error occurred while fetching holidays",
      });
    }
  });
  const handleData = (e) => {
    const { name, value } = e.target;

    setInputData({
      ...inputdata,
      [name]: value,
    });
  };

  const handleClose = () => {
    setOpenModal(false);
    setActionModal(false);
    setOperation("");
    setSelectedHolidayId(null);
    setInputData({
      name: "",
      year: "",
      date: dayjs(),
      day: "",
      month: "",
      type: "",
      region: "",
      organizationId: "",
    });
  };
  const handleDateChange = (newDate) => {
    setInputData((prev) => ({
      ...prev,
      date: newDate.toISOString(),
    }));
  };
  const handleSubmit = async () => {
    setFormSubmitted(true);
    if (!inputdata.name && !inputdata.type && !inputdata.region) return;
    try {
      await axios.post(`${process.env.REACT_APP_API}/route/holiday/create`, {
        ...inputdata,
        organizationId: id,
      });
      setOpenModal(false);
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Holiday created successfully.",
      });
      queryClient.invalidateQueries("holidays");
    } catch (error) {
      console.error("Error:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "An Error occurred while creating holiday.",
      });
    }
  };

  const handleOperateEdit = async (id) => {
    setActionModal(true);
    setOpenModal(false);
    setOperation("edit");
    setSelectedHolidayId(id);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/holiday/getone/${id}`
      );
      const holidayData = response.data.holidays;

      setName(holidayData.name);
      setType(holidayData.type);
      setRegion(holidayData.region);
    } catch (error) {
      console.error("Error fetching holiday data for edit:", error);
    }
  };

  const handleOperateDelete = (id) => {
    setActionModal(true);
    setOperation("delete");
    setSelectedHolidayId(id);
  };

  const doTheOperation = async () => {
    const id = selectedHolidayId;

    if (operation === "edit") {
      const patchData = {
        name,
        type,
        region,
      };
      await axios
        .patch(
          `${process.env.REACT_APP_API}/route/holiday/update/${id}`,
          patchData
        )
        .then((response) => {
          console.log("Holiday  updated successfully.");
          setOpenModal(false);
          setAppAlert({
            alert: true,
            type: "success",
            msg: "Holiday  updated successfully.",
          });
          queryClient.invalidateQueries("holidays");
        })
        .catch((error) => {
          console.error("Error updating holiday:", error);
        });
    } else if (operation === "delete") {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API}/route/holiday/delete/${id}`
        );
        console.log("Holiday deleted successfully.");
        setOpenModal(false);
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Holiday deleted successfully.",
        });
        queryClient.invalidateQueries("holidays");
      } catch (error) {
        console.error("Error deleting holiday:", error);
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Error deleting holiday!",
        });
      }
    } else {
      console.log("Nothing changed");
      setAppAlert({
        alert: true,
        type: "error",
        msg: "error occured!",
      });
    }

    handleClose();
  };

  return (
    <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
      <Setup>
        <article className="SetupSection bg-white w-[80%] h-max shadow-md rounded-sm border items-center">
          <div className="p-4 border-b-[.5px] flex items-center justify-between gap-3 w-full border-gray-300">
            <div className="flex gap-3 ">
              <div className="mt-1">
                <HolidayVillageOutlinedIcon />
              </div>
              <div>
                <h1 className="!text-lg">Public Holidays</h1>
                <p className="text-xs text-gray-600">
                  Add public holidays which will applicable to all employees.
                  Ex: Independence day.
                </p>
              </div>
            </div>
            <Button
              className="!font-semibold !bg-sky-500 flex items-center gap-2"
              variant="contained"
              onClick={() => setOpenModal(true)}
            >
              Add Holiday
            </Button>
          </div>
          {data?.length > 0 ? (
            <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
              <table className="min-w-full bg-white text-left !text-sm font-light">
                <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                  <tr className="!font-semibold ">
                    <th scope="col" className="!text-left pl-8 py-3 w-1/12">
                      Sr. No
                    </th>
                    <th scope="col" className="py-3 w-2/12">
                      Holiday Name
                    </th>
                    <th scope="col" className=" py-3 w-2/12">
                      Date
                    </th>
                    <th scope="col" className=" py-3 w-2/12">
                      Type
                    </th>
                    <th scope="col" className=" py-3 w-2/12">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((data, id) => (
                    <tr className="!font-medium border-b" key={id}>
                      <td className="!text-left pl-9">{id + 1}</td>
                      <td className="py-3 text-left">{data.name}</td>
                      <td className="py-3 text-left">
                        {data && format(new Date(data?.date), "PP")}
                      </td>
                      <td className="py-3  text-left">{data.type}</td>
                      <td className=" text-left">
                        <IconButton
                          color="primary"
                          aria-label="edit"
                          onClick={() => handleOperateEdit(data._id)}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => handleOperateDelete(data._id)}
                        >
                          <DeleteOutlineIcon />
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
                <h1 className="text-lg font-semibold">Add Public Holidays</h1>
              </article>
              <p>No public holidays found. Please add the public holidays</p>
            </section>
          )}

          <Dialog
            open={openModal}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
          >
            <h1 className="text-xl pl-2 font-semibold font-sans mt-4 ml-4">
              Add Holiday
            </h1>
            <DialogContent className="flex gap-3 flex-col">
              <div className="flex gap-3 flex-col mt-3">
                <TextField
                  required
                  size="small"
                  className="w-full"
                  label="Holiday name"
                  type="text"
                  name="name"
                  value={inputdata.name}
                  onChange={handleData}
                />
                {!inputdata.name && formSubmitted && (
                  <Typography variant="body2" color="error">
                    Required.
                  </Typography>
                )}

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    className="w-full"
                    components={["DatePicker"]}
                    required
                  >
                    <DatePicker
                      label="Date"
                      value={inputdata.date}
                      onChange={(newDate) => {
                        setInputData({
                          ...inputdata,
                          date: newDate,
                        });
                        console.log(newDate);
                      }}
                      slotProps={{
                        textField: { size: "small", fullWidth: true },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                <FormControl size="small" fullWidth>
                  <InputLabel id="holiday-type-label">Holiday type</InputLabel>
                  <Select
                    labelId="holiday-type-label"
                    id="demo-simple-select"
                    label="holiday type"
                    className="mb-[8px]"
                    value={inputdata.type}
                    name="type"
                    onChange={handleData}
                  >
                    <MenuItem value="Optional">Optional</MenuItem>
                    <MenuItem value="Mandatory">Mandatory</MenuItem>
                  </Select>
                </FormControl>
                {!inputdata.type && formSubmitted && (
                  <Typography variant="body2" color="error">
                    Required.
                  </Typography>
                )}
                <FormControl size="small" fullWidth>
                  <InputLabel id="region-label">Region</InputLabel>
                  <Select
                    labelId="region-label"
                    id="demo-simple-select"
                    label="Region"
                    className="mb-[8px]"
                    onChange={handleData}
                    value={inputdata.region}
                    name="region"
                  >
                    {locations.map((location, idx) => (
                      <MenuItem key={idx} value={location.shortName}>
                        {location.shortName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {!inputdata.region && formSubmitted && (
                  <Typography variant="body2" color="error">
                    Required.
                  </Typography>
                )}
                <div className="flex gap-4  mt-4  justify-end">
                  <Button
                    onClick={handleClose}
                    color="error"
                    variant="outlined"
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog fullWidth open={actionModal} onClose={handleClose}>
            <DialogContent>
              {operation === "edit" ? (
                <>
                  <h1 className="text-xl pl-2 font-semibold font-sans">
                    Edit Holiday
                  </h1>
                  <div className="flex gap-3 flex-col mt-3">
                    <TextField
                      required
                      size="small"
                      className="w-full"
                      label="Holiday name"
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]} required>
                        <DatePicker
                          label="Holiday date"
                          slotProps={{
                            textField: {
                              size: "small",
                              fullWidth: true,
                              style: { marginBottom: "8px" },
                            },
                          }}
                          value={inputdata.date}
                          onChange={(newDate) => handleDateChange(newDate)}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                    <FormControl size="small" fullWidth>
                      <InputLabel id="holiday-type-label">
                        Holiday type
                      </InputLabel>
                      <Select
                        labelId="holiday-type-label"
                        id="demo-simple-select"
                        label="holiday type"
                        className="mb-[8px]"
                        value={type}
                        name="type"
                        onChange={(e) => setType(e.target.value)}
                      >
                        <MenuItem value="Optional">Optional</MenuItem>
                        <MenuItem value="Mandatory">Mandatory</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl size="small" fullWidth>
                      <InputLabel id="region-label">Region</InputLabel>
                      <Select
                        labelId="region-label"
                        id="demo-simple-select"
                        label="Region"
                        className="mb-[8px]"
                        onChange={(e) => setRegion(e.target.value)}
                        value={region}
                        name="region"
                      >
                        {locations.length > 0 ? (
                          locations.map((location, idx) => (
                            <MenuItem key={idx} value={location.shortName}>
                              {location.shortName}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value={""}>add location first</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="mt-5 flex gap-5 justify-end">
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={handleClose}
                    >
                      cancel
                    </Button>
                    <Button
                      onClick={doTheOperation}
                      color="primary"
                      variant="contained"
                    >
                      Apply
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogContent>
                    <p>
                      Please confirm your decision to delete this salary
                      computation day, as this action cannot be undone.
                    </p>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={handleClose}
                      variant="outlined"
                      color="primary"
                      size="small"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={doTheOperation}
                      color="error"
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </>
              )}
            </DialogContent>
          </Dialog>
        </article>
      </Setup>
    </section>
  );
};

export default PublicHoliday;
