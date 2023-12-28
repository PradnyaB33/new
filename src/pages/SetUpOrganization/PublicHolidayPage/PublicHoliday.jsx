import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import axios from "axios";
import { format } from "date-fns";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UseContext } from "../../../State/UseState/UseContext";
import Setup from "../Setup";

const PublicHoliday = () => {
  const id = useParams().organisationId;
  const { setAppAlert } = useContext(UseContext);
  const [openModal, setOpenModal] = useState(false);
  const [actionModal, setActionModal] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");
  const [operation, setOperation] = useState("");
  const [selectedHolidayId, setSelectedHolidayId] = useState(null);

  // todo - data to post

  const [inputdata, setInputData] = useState({
    name: "",
    date: dayjs(new Date()),
    type: "",
    region: "",
    organizationId: "",
  });

  const fetchHolidays = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/holiday/get/${id}`
      );
      setHolidays(response.data.holidays);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "An error occurred while fetching holidays",
      });
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

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
    try {
      await axios.post(`${process.env.REACT_APP_API}/route/holiday/create`, {
        ...inputdata,
        organizationId: id,
      });
      setOpenModal(false);
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Holiday created successfully!",
      });
      fetchHolidays();
    } catch (error) {
      console.error("Error:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "An error occurred while creating holiday",
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
          console.log("Successfully updated");
          setOpenModal(false);
          setAppAlert({
            alert: true,
            type: "success",
            msg: "updated successfully!",
          });
          fetchHolidays();
        })
        .catch((error) => {
          console.error("Error updating holiday:", error);
        });
    } else if (operation === "delete") {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API}/route/holiday/delete/${id}`
        );
        console.log("Successfully deleted");
        setOpenModal(false);
        setAppAlert({
          alert: true,
          type: "success",
          msg: "deleted successfully!",
        });
        fetchHolidays(); // Refresh holidays after delete
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
            <div className="flex items-center gap-3 ">
              <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                <BadgeOutlinedIcon className="!text-lg text-white" />
              </div>
              <h1 className="!text-lg tracking-wide">Public Holidays</h1>
            </div>
            <Button
              className="!font-semibold !bg-sky-500 flex items-center gap-2"
              variant="contained"
              onClick={() => setOpenModal(true)}
            >
              Create Holiday
            </Button>
          </div>

          <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
            <table className="min-w-full bg-white text-left !text-sm font-light">
              <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                <tr className="!font-semibold ">
                  <th scope="col" className="!text-left pl-8 py-3 w-1/12">
                    SR NO
                  </th>
                  <th scope="col" className="py-3 w-2/12">
                    Holiday Name
                  </th>
                  <th scope="col" className="px-6 py-3 w-2/12">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 w-2/12">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 w-2/12">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {holidays?.length === 0 ? (
                  <tr className="w-full !font-medium border-b text relative text-center">
                    No holidays found !
                  </tr>
                ) : (
                  holidays?.map((data, id) => (
                    <tr className="!font-medium border-b" key={id}>
                      <td className="!text-left pl-9">{id + 1}</td>
                      <td className=" py-3">{data.name}</td>
                      <td className="py-3">
                        {data && format(new Date(data?.date), "PP")}
                      </td>
                      <td className="py-3">{data.type}</td>
                      <td className="px-2">
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
                  ))
                )}
              </tbody>
            </table>
            <Dialog
              open={openModal}
              onClose={handleClose}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Add holiday</DialogTitle>
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
                    <InputLabel id="holiday-type-label">
                      Holiday type
                    </InputLabel>
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
                      <MenuItem value="India">India</MenuItem>
                      <MenuItem value="USA">USA</MenuItem>
                    </Select>
                  </FormControl>

                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleSubmit}
                  >
                    Add
                  </Button>
                  <Button
                    onClick={handleClose}
                    color="error"
                    variant="contained"
                  >
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog fullWidth open={actionModal} onClose={handleClose}>
              <DialogTitle>Are you sure about this ?</DialogTitle>
              <DialogContent>
                {operation === "edit" ? (
                  <>
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
                          <MenuItem value="India">India</MenuItem>
                          <MenuItem value="USA">USA</MenuItem>
                        </Select>
                      </FormControl>
                    </div>

                    <div className="mt-5 flex gap-5">
                      <Button
                        onClick={doTheOperation}
                        color="warning"
                        variant="contained"
                      >
                        {operation}
                      </Button>
                      <Button variant="contained" color="primary">
                        cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-5 py-5">
                      <Button
                        onClick={doTheOperation}
                        variant="contained"
                        color="secondary"
                      >
                        {operation}
                      </Button>
                      <Button
                        onClick={handleClose}
                        color="error"
                        variant="contained"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </article>
      </Setup>
    </section>
  );
};

export default PublicHoliday;

//todo this is select field of organization
//  <FormControl
//               required
//               style={{ marginTop: "20px", width: "80%", height: "10px" }}
//               size="small"
//             >
//               <InputLabel id="demo-simple-select-label">Industry Type</InputLabel>
//               <Select
//                 labelId="demo-simple-select-label"
//                 id="demo-simple-select"
//                 name="industry_type"
//                 value={inputdata.industry_type}
//                 onChange={handleData}
//                 inputRef={
//                   firstEmptyField === "industry_type" ? firstEmptyFieldRef : null
//                 }
//               >
//                 <MenuItem value="IT">IT</MenuItem>
//                 <MenuItem value="MECH">MECH</MenuItem>
//                 <MenuItem value="ACCOUNTS">ACCOUNTS</MenuItem>
//               </Select>
//             </FormControl>
