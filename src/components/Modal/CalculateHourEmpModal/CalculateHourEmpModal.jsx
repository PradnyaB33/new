import React, { useContext, useState, useEffect } from "react";
import { UseContext } from "../../../State/UseState/UseContext";
import {
  Container,
  Dialog,
  DialogContent,
  Typography,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import axios from "axios";
import {  Close } from "@mui/icons-material";

const CalculateHourEmpModal = ({
  handleClose,
  open,
  organisationId,
  attendanceId
}) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [totalHours, setTotalHours] = useState("");
  const [attendanceData, setAttendanceData] = useState();
  console.log(attendanceId);

const fetchAttendanceData = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/${organisationId}/attendance-data/${attendanceId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    console.log(response);
    setAttendanceData(response.data); 
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
    fetchAttendanceData();
    // eslint-disable-next-line
  }, []);

   console.log(attendanceData);
 
 
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
              <Typography variant="h6" className="text-center pl-10 mb-6 mt-4">
                View Attendance of {attendanceData?.EmployeeId?.first_name} {attendanceData?.EmployeeId?.last_name}
              </Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>
            {/* Input field for total hours */}
            <div className=" mb-5 ml-5">
            <TextField
          label="Number Of Hours Company Follows"
          value={totalHours}
          onChange={(e) => setTotalHours(e.target.value)}
          fullWidth
          variant="outlined"
          sx={{ width: '300px' }} 
           />
            </div>
           

          
      <table className="min-w-full bg-white text-left text-sm font-light">
      <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
        <tr className="font-semibold">
         <th scope="col" className="px-6 py-3">
          Date
        </th>
        <th scope="col" className="px-6 py-3">
          Punching Time
        </th>
        <th scope="col" className="px-6 py-3">
          Punching Status
        </th>
       <th scope="col" className="px-6 py-3">
         Total Hours
         </th>
         <th scope="col" className="px-6 py-3">
         Remark
        </th>
      </tr>
        </thead>
        <tbody>
             {attendanceData?.punchingRecords.map((record, index) => (
            <tr key={index} className="font-medium border-b">
           <td className="px-6 py-3">{new Date(record.date).toLocaleDateString()}</td>
            <td className="px-6 py-3">{record.punchingTime}</td>
            <td className="px-6 py-3">{record.punchingStatus}</td>
            <td className="px-6 py-3"></td>
           </tr>
         ))}
      </tbody>
     </table>   
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default CalculateHourEmpModal;
