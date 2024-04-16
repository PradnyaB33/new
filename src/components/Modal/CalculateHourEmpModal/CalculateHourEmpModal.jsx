import React, { useContext, useState } from "react";
import {
  Container,
  Dialog,
  DialogContent,
  Typography,
  Grid,
  IconButton,
  TextField,
  Popover,
  DialogActions,
  Button,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import useHourHook from "../../../hooks/useHoursHook/useHourHook";

const CalculateHourEmpModal = ({
  handleClose,
  open,
  empPunchingData ,
  organisationId
}) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [hour, setHour] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [remarks, setRemarks] = useState("");
  const { handleAlert } = useContext(TestContext);
  const {justify} = useHourHook()
  console.log("punching record emp" , empPunchingData);
  

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    handlePopoverClose();
  };
  
   // Function to extract only the date part
   const getFormattedDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : '';
  };

   let selectDate = getFormattedDate(selectedDate);
   console.log(selectDate);

  const openPopover = Boolean(anchorEl);

  const handleCalculateHours = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }
  
    const date = getFormattedDate(selectedDate);
    console.log("date" , date);
    const punchingRecords = empPunchingData?.punchingRecords || [];
    let punchInTime = null;
    let punchOutTime = null;
  
     punchingRecords.forEach((record) => {
      const recordDate = getFormattedDate(record.date);
      console.log("record date" , recordDate);
      if (recordDate === date) {
        if (record.punchingStatus === "Check In") {
          punchInTime = new Date(`1970-01-01T${record.punchingTime}`);
        } else if (record.punchingStatus === "Check Out") {
          punchOutTime = new Date(`1970-01-01T${record.punchingTime}`);
        }
      }
    });
    
    console.log("punch in time" , punchInTime);
    console.log("punch out time" , punchOutTime);
  
    const timeDiff = punchOutTime - punchInTime;
    const totalHours = timeDiff / (1000 * 60 * 60);
    const formattedTotalHours = Math.floor(totalHours);
    const formattedMinutes = Math.round((totalHours - formattedTotalHours) * 60);
  
    let totalHour = `${formattedTotalHours} hr`;
    if (formattedMinutes > 0) {
      totalHour += ` ${formattedMinutes} min `;
    } 

    console.log(totalHour);
  
    let remarks = "";
    const hoursAboveField = parseFloat(totalHours);
    console.log("hoursAboveField", hoursAboveField);
    if (hoursAboveField >= hour) {
      remarks = "Available";
    } else if (hoursAboveField > 0) {
      remarks = "Partial";
    } else {
      remarks = "Unavailable";
    }
  
    setRemarks(remarks);
  
    const postData = {
      EmployeeId: empPunchingData?.EmployeeId._id,
      organizationId: organisationId,
      recordDate: date,
      punchInTime: punchInTime,
      punchOutTime: punchOutTime,
      totalHours: totalHour,
      status: remarks,
      justify : justify
    };

    console.log(postData);
  
    try {
      
      const response = await fetch(`${process.env.REACT_APP_API}/route/organization/${organisationId}/punching-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify(postData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to calculate hours.");
      }
      const responseData = await response.json();
      console.log(responseData);
      handleAlert(true, "success", "Hours calculated successfully..");
      handleClose();
      setSelectedDate(null);
    } catch (error) {
      console.error("Error calculating hours:", error);
      handleAlert(false, "error", "Failed to calculate hours. Please try again.");
    }
  };

  console.log(remarks);
  

 
  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "1000px!important",
        },
      }}
      open={open}
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <Container maxWidth="xl" className="bg-gray-50">
          <Grid container alignItems="center" justifyContent="space-between" className="mt-5 mb-5">
            <Grid item>
              <Typography variant="h6" className="mb-6 mt-4">
              Calculate Working Hours
              </Typography>
              <Typography variant="h7" className=" mb-6 mt-4">
               Employee : Name {`${empPunchingData?.EmployeeId?.first_name}`} {`${empPunchingData?.EmployeeId?.last_name}`}
              </Typography>
              <p className="text-xs text-gray-600 ">
               Calculate the hours of employee.
          </p>
            </Grid>
            <Grid item>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container spacing={2} className="mb-5">
            <Grid item xs={6}>
              {/* Input field for total hours */}
              <TextField
                label="Number of hours company follows"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
      {/* Input field for selecting date */}
      <TextField
        label="Select date for calculate total hours"
        value={selectedDate ? new Date(selectedDate).toLocaleDateString() : ''}
        onClick={handlePopoverOpen}
        fullWidth
        variant="outlined"
        InputProps={{
          endAdornment: (
            <IconButton onClick={handlePopoverOpen}>
              <CalendarTodayIcon />
            </IconButton>
          ),
        }}
      />
      {/* Popover and calendar */}
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {/* DateCalendar component */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            date={selectedDate}
            onChange={handleDateChange} // Handle date selection
          />
        </LocalizationProvider>
      </Popover>
    </Grid>
          </Grid>
       
          <table className="min-w-full bg-white text-left text-sm font-light">
            <thead className="border-b bg-gray-300 font-medium dark:border-neutral-500 w-full">
              <tr className="font-semibold">
                <th scope="col" className="px-6 py-3">
                  Sr no
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Punching Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Punching Status
                </th>
              </tr>
            </thead>
            <tbody>
              {empPunchingData?.punchingRecords.map((record, index) => (
                <tr key={index} className="font-medium border-b">
                  <td className="px-6 py-3">{index+1}</td>
                  <td className="px-6 py-3">{new Date(record?.date).toLocaleDateString()}</td>
                  <td className="px-6 py-3">{record?.punchingTime || ""}</td>
                  <td className="px-6 py-3">{record?.punchingStatus || ""}</td>
                  <td className="px-6 py-3"></td>
                </tr>
              ))}
            </tbody>
          </table>   
        </Container>
           <DialogActions sx={{ justifyContent: "end" }}>
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>

              <Button variant="contained" color="primary" onClick={handleCalculateHours}>
                Calculate Hours
              </Button>
            </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default CalculateHourEmpModal;