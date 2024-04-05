import React, { useContext, useState, useEffect } from "react";
import { UseContext } from "../../../State/UseState/UseContext";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { TestContext } from "../../../State/Function/Main";
import { useQuery } from "react-query";
import EmployeeTypeSkeleton from "../../../pages/SetUpOrganization/components/EmployeeTypeSkeleton";
import { Info } from "@mui/icons-material";


const CalculateHourEmpModal = ({
  handleClose,
  open,
  organisationId,
  attendanceId
}) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);

  console.log("id"  , attendanceId);


  const [attendanceData, setAttendanceData] = useState([]);

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
    setAttendanceData(response.data); // Corrected the typo here
  } catch (error) {
    console.error(error);
  }
};

   console.log(attendanceData);
 
 
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
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <Container maxWidth="xl" className="bg-gray-50 ">
           <div>
           <Typography variant="h6" className=" text-center pl-10  mb-6 mt-4">
            View Attendance of Megha Dumbre
          </Typography>
           </div>

          

           
          
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default CalculateHourEmpModal;
