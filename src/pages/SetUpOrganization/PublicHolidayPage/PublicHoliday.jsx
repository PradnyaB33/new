import React, { useEffect, useState } from "react";
import Setup from "../Setup";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from 'axios';
import { useParams } from "react-router-dom";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button, Dialog, DialogContent, DialogTitle, TextField, FormControl, Select, InputLabel, MenuItem, IconButton
} from "@mui/material";

const PublicHoliday = () => {
  const id = useParams().organisationId;
  const [openModal, setOpenModal] = useState(false);
  const [actionModal, setActionModal] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [region, setRegion] = useState("")
  const [operation, setOperation] = useState("");
  const [selectedHolidayId, setSelectedHolidayId] = useState(null);
  const [inputdata, setInputData] = useState({
    name: "",
    year: "",
    date: dayjs(),
    day: "",
    month: "",
    type: "",
    region: "",
    organizationId: "",
  });

  const fetchHolidays = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/route/holiday/get/${id}`);
      setHolidays(response.data.holidays);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [id]);

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
    setInputData({
      ...inputdata,
      year: newDate.format("YYYY"),
      date: newDate.format("DD-MM-YYYY"),
      day: newDate.format("ddd"),
      month: newDate.format("MM"),
    });
  };

  const handleSubmit = async () => {
    try {
      const sanitizedData = JSON.parse(JSON.stringify(inputdata));
      await axios.post(`${process.env.REACT_APP_API}/route/holiday/create`, { ...sanitizedData, organizationId: id });
      setOpenModal(false);
      fetchHolidays(); // Refresh holidays after create
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleOperateEdit = async (id) => {
    setActionModal(true);
    setOperation("edit");
    setSelectedHolidayId(id);
  
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/route/holiday/getone/${id}`);
      const holidayData = response.data.holidays;
  
      console.log(holidayData);
  
     setName(holidayData.name)
     setType(holidayData.type)
     setRegion(holidayData.region)
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
        name, type, region
      }
        await axios.patch(`${process.env.REACT_APP_API}/route/holiday/update/${id}`, patchData).then((response) =>{
          console.log("Successfully updated");
          setOpenModal(false);
          fetchHolidays(); 

        }).catch((error) => {
        console.error("Error updating holiday:", error);
      })


    } else if (operation === "delete") {
      try {
        await axios.delete(`${process.env.REACT_APP_API}/route/holiday/delete/${id}`);
        console.log("Successfully deleted");
        setOpenModal(false);
        fetchHolidays(); // Refresh holidays after delete
      } catch (error) {
        console.error("Error deleting holiday:", error);
      }
    } else {
      console.log("Nothing changed");
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
              <tbody >
                {holidays.length === 0 ? (
                  <tr className="w-full !font-medium border-b text relative text-center">
                    No holidays found !
                  </tr>
                ) : (
                  holidays.map((data, id) => (
                    <tr className="!font-medium border-b" key={id}>
                      <td className="!text-left pl-9">{id + 1}</td>
                      <td className=" py-3">{data.name}</td>
                      <td className="py-3">{data.date}</td>
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
            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
              <DialogTitle>
                Add holiday
              </DialogTitle>
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
                        value={dayjs(inputdata.date)}
                        onChange={handleDateChange}
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

                  <Button color="primary" variant="contained" onClick={handleSubmit}>
                    Add
                  </Button>
                  <Button onClick={handleClose} color="error" variant="contained">
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>


            <Dialog fullWidth open={actionModal} onClose={handleClose}>
              <DialogTitle>
                Are you sure about this ?
              </DialogTitle>
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
                        value={dayjs(inputdata.date)}
                        onChange={handleDateChange}
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
                      value={type}
                      name="type"
                      onChange={(e) => setType(e.target.value) }
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
                    <Button onClick={doTheOperation} color="warning" variant="contained">{operation}</Button>
                    <Button variant="contained" color= "primary">cancel</Button>
                    </div>
                    </>
                )

                  : (
                    <>
                      <div>
                      <Button onClick={doTheOperation}>{operation}</Button>
                    <Button>cancel</Button>
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
