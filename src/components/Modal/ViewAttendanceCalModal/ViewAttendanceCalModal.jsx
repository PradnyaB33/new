import React, { useState } from "react";
import {
  Container,
  Dialog,
  DialogContent,
  Typography,
  Grid,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const ViewAttendanceCallModal = ({
  handleClose,
  open,
  employee
}) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const localizer = momentLocalizer(moment);

  const events = employee?.punchingData.map((data) => ({
    ...data,
    title: data.status,
    start: new Date(data.recordDate),
    end: new Date(data.recordDate),
  }));

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
   
  };

  return (
    <Dialog
      PaperProps={{ 
        sx: {
          width: "100%",
          maxWidth: "1000px!important",
          height: "100%",
          maxHeight: "80vh!important",
        },
      }}
      open={open}
      onClose={handleCloseModal}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <Container maxWidth="xl" className="bg-gray-50 ">
          <Grid container alignItems="center" justifyContent="space-between" className="mt-5 mb-5">
            <Grid item>
              <Typography variant="h6" className="text-center  mb-6 mt-4">
                Here View The Attendance of {employee?.EmployeeId?.first_name} {employee?.EmployeeId?.last_name}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>

          <div style={{ height: 500 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ margin: "50px auto", width: "80%" }}
              onSelectEvent={handleEventClick} 
            />
          </div>
        </Container>
      </DialogContent>

      {/* Modal to display event details */}
      <Dialog
        open={selectedEvent !== null}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <DialogContent>
          <Typography variant="h6">
             Details
          </Typography>
          {selectedEvent && (
            <div>
              <Typography>
                Punch In Time: {moment(selectedEvent.punchInTime).format("HH:mm:ss")}
              </Typography>
              <Typography>
                Punch Out Time: {moment(selectedEvent.punchOutTime).format(" HH:mm:ss")}
              </Typography>
              <Typography>
                Record Date: {moment(selectedEvent.recordDate).format("YYYY-MM-DD")}
              </Typography>
              <Typography>
                Status: {selectedEvent.status}
              </Typography>
              <Typography>
                Total Hours: {selectedEvent.totalHours}
              </Typography>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default ViewAttendanceCallModal;