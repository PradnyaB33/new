import React, { useState } from "react";
import { CalendarMonth, Delete, Edit, InfoOutlined } from "@mui/icons-material";
import {
  Badge,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Modal,
  Box,
} from "@mui/material";
import { differenceInDays, format, parseISO } from "date-fns";
import moment from "moment";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useLeaveRequesationHook from "../../../hooks/QueryHook/Leave-Requsation/hook";
import { useParams } from "react-router-dom";

const localizer = momentLocalizer(moment);

const Mapped = ({
  item,
  index,
  subtractedLeaves,
  newAppliedLeaveEvents,
  setNewAppliedLeaveEvents,
  setCalendarOpen,
}) => {
  const {  organisationId } = useParams()
  const { data, compOff } = useLeaveRequesationHook(organisationId);
  const [leavesTypes, setLeavesTypes] = useState(item?.leaveTypeDetailsId);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  const handleChange = async (event) => {
    const selectedType = event.target.value;
    newAppliedLeaveEvents[index].leaveTypeDetailsId = selectedType;

    if (selectedType === "compOff") {
      setLeavesTypes(selectedType);
      newAppliedLeaveEvents[index].leaveTypeDetailsId = selectedType;
      setNewAppliedLeaveEvents(newAppliedLeaveEvents);
      setShowCalendarModal(true); // Open the modal for Comp Off selection
    } else {
      setLeavesTypes(selectedType);
      newAppliedLeaveEvents[index].leaveTypeDetailsId = selectedType;
      setNewAppliedLeaveEvents(newAppliedLeaveEvents);
    }
  };

  const removeItem = (idToRemove) => {
    const updatedAppliedLeaveEvents = newAppliedLeaveEvents.filter(
      (_, i) => i !== idToRemove
    );
    setNewAppliedLeaveEvents(updatedAppliedLeaveEvents);
  };

  let array = [];
  if (data?.leaveTypes) {
    array = [
      ...subtractedLeaves.filter((item) => item.count < 0),
      ...data?.leaveTypes.filter((item) => item.count > 0),
    ];

    if (compOff) {
      array.push({
        _id: "compOff",
        leaveName: "Comp Off",
        isActive: true,
      });
    }
  }

  return (
    <div className="border bg-gray-50 border-gray-200 flex-col lg:flex-row group flex gap-4 lg:items-center justify-between items-start rounded-lg hover:bg-gray-100 border-b cursor-pointer">
      <div className="flex items-center gap-4 pt-3">
        <Badge
          badgeContent={
            <span>
              {differenceInDays(parseISO(item.end), parseISO(item.start))} day
            </span>
          }
          color="primary"
          variant="standard"
        >
          <Button
            variant="text"
            size="large"
            className="!rounded-full !h-15 !w-15 border-[2px] border-gray-700 !border-solid"
            color="info"
          >
            <CalendarMonth className=" !text-3xl" />
          </Button>
        </Badge>
        <div className="inline-grid m-auto items-center gap-2 text-gray-700 font-bold">
          <p className="text-md truncate">
            {differenceInDays(parseISO(item.end), parseISO(item.start)) !== 1
              ? `Selected dates from ${format(
                  new Date(item.start),
                  "do 'of' MMMM"
                )} to  ${moment(item.end)
                  .subtract(1, "days")
                  .format("Do of MMMM")}`
              : `Your selected date is ${format(
                  new Date(item.start),
                  "do 'of' MMMM"
                )}`}
          </p>
        </div>
      </div>
      <div className="flex lg:w-fit lg:justify-end justify-between w-full items-center gap-2">
        <FormControl sx={{ width: 180 }} size="small" fullWidth>
          <InputLabel id="demo-simple-select-label">Select Type</InputLabel>
          <Select
            required
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={leavesTypes}
            label="Select Type"
            onChange={handleChange}
          >
            {array?.map(
              (item, index) =>
                item.isActive &&
                item.count !== 0 && (
                  <MenuItem
                    selected={leavesTypes === item.leaveTypeDetailsId}
                    id={index}
                    key={index}
                    value={item._id}
                  >
                    <div className="flex justify-between w-full">
                      <div>{item.leaveName}</div>
                      {item.leaveName === "Comp Off" && (
                        <Tooltip
                          title="Compensatory leave is a leave granted as compensation for hours of overtime or for working on holidays or weekends"
                          arrow
                        >
                          <InfoOutlined className="text-gray-500 ml-2" />
                        </Tooltip>
                      )}
                    </div>
                  </MenuItem>
                )
            )}
          </Select>
        </FormControl>
        <Button
          type="button"
          onClick={() => setCalendarOpen(true)}
          variant="outlined"
          className="!border-gray-300 group-hover:!border-gray-400"
        >
          <Edit className="text-gray-500" />
        </Button>
        <Button
          type="button"
          className="!border-gray-300"
          onClick={() => removeItem(index)}
          variant="outlined"
        >
          <Delete className="text-red-500" />
        </Button>
      </div>

      {/* Modal for selecting Comp Off date */}
      <Modal
        open={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Select Comp Off Date</h2>
          <Calendar
            localizer={localizer}
            selectable
            defaultView="month"
            views={["month"]}
            style={{ height: 400, width: "100%" }}
          />
          <Button
            variant="outlined"
            onClick={() => setShowCalendarModal(false)}
            style={{ marginTop: "10px" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Mapped;

// import { CalendarMonth, Delete, Edit, InfoOutlined } from "@mui/icons-material";
// import {
//   Badge,
//   Button,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Tooltip,
// } from "@mui/material";
// import { differenceInDays, format, parseISO } from "date-fns";
// import moment from "moment";
// import React, { useState } from "react";
// import useLeaveRequesationHook from "../../../hooks/QueryHook/Leave-Requsation/hook";
// import useLeaveRequisitionMutation from "../../../hooks/QueryHook/Leave-Requsation/mutaion";
// import axios from "axios";
// import { useQuery } from "react-query";
// import useAuthToken from "../../../hooks/Token/useAuth";

// const badgeStyle = {
//   "& .MuiBadge-badge": {
//     color: "black",
//     backgroundColor: "white",
//     border: "2px solid #d1d5db",
//     transition: "color 0.3s, background-color 0.3s, border-color 0.3s",
//   },
// };

// const Mapped = ({
//   item,
//   index,
//   subtractedLeaves,
//   newAppliedLeaveEvents,
//   setNewAppliedLeaveEvents,
//   setCalendarOpen,
// }) => {
//   // hooks, token, and other
//   const authToken = useAuthToken();
//   const { data } = useLeaveRequesationHook();
//   const { calculateDays, checkLeaveProblem } = useLeaveRequisitionMutation();
//   let array = [];
//   const [leavesTypes, setLeavesTypes] = useState(item?.leaveTypeDetailsId);

//   // to get the comp of leave from the organization
//   const { data: compOff } = useQuery("comp-off", async () => {
//     const response = await axios.get(
//       `${process.env.REACT_APP_API}/route/get/comp-off`,
//       {
//         headers: { Authorization: authToken },
//       }
//     );
//     return response.data.compOff.compOff;
//   });

//   // to define the function for changing the leave type
//   const handleChange = async (event) => {
//     newAppliedLeaveEvents[index].leaveTypeDetailsId = event.target.value;
//     let temp = newAppliedLeaveEvents;
//     let result = await checkLeaveProblem(
//       data?.leaveTypes,
//       event.target.value,
//       item,
//       temp,
//       calculateDays(item?.start, item?.end)
//     );
//     if (result === true) {
//       setLeavesTypes(event.target.value);
//       newAppliedLeaveEvents[index].leaveTypeDetailsId = event.target.value;
//       setNewAppliedLeaveEvents(newAppliedLeaveEvents);
//     }
//   };

//   // to remove the item
//   const removeItem = (idToRemove) => {
//     const updatedAppliedLeaveEvents = newAppliedLeaveEvents.filter(
//       (_, i) => i !== idToRemove
//     );
//     setNewAppliedLeaveEvents(updatedAppliedLeaveEvents);
//   };

//   // add leave types from organization to the array
//   if (data?.leaveTypes) {
//     array = [
//       ...subtractedLeaves.filter((item) => item.count < 0),
//       ...data?.leaveTypes.filter((item) => item.count > 0),
//     ];

//     // Check if compOff is truthy and push it into the array
//     if (compOff) {
//       array.push({
//         _id: "compOff", // Set a unique ID for compOff
//         leaveName: "Comp Off", // Name for compOff
//         // Example color for compOff
//         isActive: true, // Ensure compOff is marked as active
//       });
//     }
//   }

//   return (
//     <div
//       key={index}
//       className="border bg-gray-50 border-gray-200 flex-col lg:flex-row group flex gap-4 lg:items-center justify-between items-start rounded-lg hover:bg-gray-100 border-b cursor-pointer"
//     >
//       <div className="flex items-center gap-4 pt-3">
//         <Badge
//           badgeContent={
//             <span>
//               {differenceInDays(parseISO(item.end), parseISO(item.start))} day
//             </span>
//           }
//           sx={badgeStyle}
//           color="primary"
//           variant="standard"
//         >
//           <Button
//             variant="text"
//             size="large"
//             className="!rounded-full !h-15 !w-15 border-[2px] border-gray-700 !border-solid"
//             color="info"
//           >
//             <CalendarMonth className=" !text-3xl" />
//           </Button>
//         </Badge>

//         <div className="inline-grid m-auto items-center gap-2 text-gray-700 font-bold">
//           <p className="text-md truncate">
//             {differenceInDays(parseISO(item.end), parseISO(item.start)) !== 1
//               ? `Selected dates from ${format(
//                   new Date(item.start),
//                   "do 'of' MMMM"
//                 )} to  ${moment(item.end)
//                   .subtract(1, "days")
//                   .format("Do of MMMM")}`
//               : `Your selected date is ${format(
//                   new Date(item.start),
//                   "do 'of' MMMM"
//                 )}`}
//           </p>
//         </div>
//       </div>
//       <div className="flex lg:w-fit lg:justify-end justify-between w-full items-center gap-2">
//         <FormControl sx={{ width: 180 }} size="small" fullWidth>
//           <InputLabel id="demo-simple-select-label">Select Type</InputLabel>
//           {/* <Select
//             defaultValue={leavesTypes}
//             required
//             labelId="demo-simple-select-label"
//             id="demo-simple-select"
//             value={leavesTypes}
//             label="Select Type"
//             onChange={handleChange}
//           >
//             {array?.map((item, index) => {
//               return (
//                 item.isActive &&
//                 item.count !== 0 && (
//                   <MenuItem
//                     selected={leavesTypes === item.leaveTypeDetailsId}
//                     id={index}
//                     key={index}
//                     value={item._id}
//                   >
//                     <div className="flex justify-between w-full">
//                       <div>{item.leaveName} </div>
//                       <div
//                         style={{ background: item.color }}
//                         className={`w-4 h-4 rounded-full my-auto`}
//                       ></div>
//                       {item.leaveName === "Comp Off" && (
//                         <Tooltip
//                           title="Compensatory leave is a leave granted as compensation for hours of overtime or for working on holidays or weekends"
//                           arrow
//                         >
//                           <InfoOutlined className="text-gray-500 ml-2" />
//                         </Tooltip>
//                       )}
//                     </div>
//                   </MenuItem>
//                 )
//               );
//             })}
//           </Select> */}
//           <Select
//             defaultValue={leavesTypes}
//             required
//             labelId="demo-simple-select-label"
//             id="demo-simple-select"
//             value={leavesTypes}
//             label="Select Type"
//             onChange={handleChange}
//           >
//             {array?.map((item, index) => {
//               return (
//                 item.isActive &&
//                 item.count !== 0 && (
//                   <MenuItem
//                     selected={leavesTypes === item.leaveTypeDetailsId}
//                     id={index}
//                     key={index}
//                     value={item._id}
//                   >
//                     <div className="flex justify-between w-full">
//                       <div>{item.leaveName} </div>
//                       <div
//                         style={{ background: item.color }}
//                         className={`w-4 h-4 rounded-full my-auto`}
//                       ></div>
//                       {item.leaveName === "Comp Off" && (
//                         <Tooltip
//                           title="Compensatory leave is a leave granted as compensation for hours of overtime or for working on holidays or weekends"
//                           arrow
//                         >
//                           <InfoOutlined className="text-gray-500 ml-2" />
//                         </Tooltip>
//                       )}
//                     </div>
//                   </MenuItem>
//                 )
//               );
//             })}
//           </Select>
//         </FormControl>
//         <Button
//           type="button"
//           onClick={() => setCalendarOpen(true)}
//           variant="outlined"
//           className="!border-gray-300 group-hover:!border-gray-400"
//         >
//           <Edit className="text-gray-500" />
//         </Button>
//         <Button
//           type="button"
//           className="!border-gray-300"
//           onClick={() => removeItem(index)}
//           variant="outlined"
//         >
//           <Delete className="text-red-500" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Mapped;
