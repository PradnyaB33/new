// import { CalendarMonth, Delete, Edit } from "@mui/icons-material";
// import {
//   Badge,
//   Button,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
// } from "@mui/material";
// import { differenceInDays, format, parseISO } from "date-fns";
// import moment from "moment";
// import React, { useState } from "react";
// import useLeaveRequesationHook from "../../../hooks/QueryHook/Leave-Requsation/hook";
// import useLeaveRequisitionMutation from "../../../hooks/QueryHook/Leave-Requsation/mutaion";
 
// const Mapped = ({ 
//   item,
//   index,
//   subtractedLeaves,
//   newAppliedLeaveEvents,
//   setNewAppliedLeaveEvents,
//   setCalendarOpen,
// }) => {
//   console.log(
//     `🚀 ~ file: mapped-form.jsx:24 ~ subtractedLeaves:`,
//     subtractedLeaves
//   );
//   const { data } = useLeaveRequesationHook();
//   const { calculateDays, checkLeaveProblem } = useLeaveRequisitionMutation();
//   let array = [];
 
//   const [leavesTypes, setLeavesTypes] = useState(item?.leaveTypeDetailsId);
//   const badgeStyle = {
//     "& .MuiBadge-badge": {
//       color: "#d1d5db",
//       backgroundColor: "white",
//       border: "2px solid #d1d5db",
//       transition: "color 0.3s, background-color 0.3s, border-color 0.3s",
//     },
//   };
 
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
//   console.log(
//     `🚀 ~ file: mapped-form.jsx:51 ~ newAppliedLeaveEvents:`,
//     newAppliedLeaveEvents
//   );
//   const removeItem = (idToRemove) => {
//     const updatedAppliedLeaveEvents = newAppliedLeaveEvents.filter(
//       (_, i) => i !== idToRemove
//     );
//     setNewAppliedLeaveEvents(updatedAppliedLeaveEvents);
//   };
//   if (data?.leaveTypes) {
//     array = [
//       ...subtractedLeaves.filter((item) => item.count < 0),
//       ...data?.leaveTypes.filter((item) => item.count > 0),
//     ];
//   }
 
//   return (
//     <div
//       key={index}
//       className=" border border-gray-200 flex-col lg:flex-row group  flex gap-4 lg:items-center justify-between items-start rounded-lg hover:bg-gray-100 border-b p-2 cursor-pointer"
//     >
//       <div className="flex items-center gap-4 pt-4">
//         <Badge
//           slotProps={{
//             badge: {
//               className:
//                 "group-hover:bg-gray-50 group-hover:text-gray-600 group-hover:border-gray-600 ",
//             },
//           }}
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
//             className="!rounded-full !h-16 !w-16 group-hover:!text-gray-500 !text-gray-300 !border-[2px] !border-gray-300 group-hover:!border-gray-500 !border-solid"
//             color="info"
//           >
//             <CalendarMonth className=" !text-4xl" />
//           </Button>
//         </Badge>
 
//         <div className="inline-grid m-auto items-center gap-2 group-hover:text-gray-500 text-gray-300 font-bold">
//           <p className="text-md truncate ">
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
//           <Edit className="text-gray-300 group-hover:text-gray-500" />
//         </Button>
//         <Button
//           type="button"
//           className="!border-gray-300 group-hover:!border-gray-400"
//           onClick={() => removeItem(index)}
//           variant="outlined"
//         >
//           <Delete className="text-gray-300 group-hover:text-red-500" />
//         </Button>
//       </div>
//     </div>
//   );
// };
 
// export default Mapped;
// // ✅
import { CalendarMonth, Delete, Edit } from "@mui/icons-material";
import {
  Badge,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { differenceInDays, format, parseISO } from "date-fns";
import moment from "moment";
import React, { useState } from "react";
import useLeaveRequesationHook from "../../../hooks/QueryHook/Leave-Requsation/hook";
import useLeaveRequisitionMutation from "../../../hooks/QueryHook/Leave-Requsation/mutaion";

const Mapped = ({
  item,
  index,
  subtractedLeaves,
  newAppliedLeaveEvents,
  setNewAppliedLeaveEvents,
  setCalendarOpen,
}) => {
  console.log(
    `🚀 ~ file: mapped-form.jsx:24 ~ subtractedLeaves:`,
    subtractedLeaves
  );
  const { data } = useLeaveRequesationHook();
  const { calculateDays, checkLeaveProblem } = useLeaveRequisitionMutation();
  let array = [];

  const [leavesTypes, setLeavesTypes] = useState(item?.leaveTypeDetailsId);
  const badgeStyle = {
    "& .MuiBadge-badge": {
      color: "black",
      backgroundColor: "white",
      border: "2px solid #d1d5db",
      transition: "color 0.3s, background-color 0.3s, border-color 0.3s",
      
    },
  };

  const handleChange = async (event) => {
    newAppliedLeaveEvents[index].leaveTypeDetailsId = event.target.value;
    let temp = newAppliedLeaveEvents;
    let result = await checkLeaveProblem(
      data?.leaveTypes,
      event.target.value,
      item,
      temp,
      calculateDays(item?.start, item?.end)
    );
    if (result === true) {
      setLeavesTypes(event.target.value);
      newAppliedLeaveEvents[index].leaveTypeDetailsId = event.target.value;
      setNewAppliedLeaveEvents(newAppliedLeaveEvents);
    }
  };
  console.log(
    `🚀 ~ file: mapped-form.jsx:51 ~ newAppliedLeaveEvents:`,
    newAppliedLeaveEvents
  );
  const removeItem = (idToRemove) => {
    const updatedAppliedLeaveEvents = newAppliedLeaveEvents.filter(
      (_, i) => i !== idToRemove
    );
    setNewAppliedLeaveEvents(updatedAppliedLeaveEvents);
  };
  if (data?.leaveTypes) {
    array = [
      ...subtractedLeaves.filter((item) => item.count < 0),
      ...data?.leaveTypes.filter((item) => item.count > 0),
    ];
  }

  return (
    <div
      key={index}
      className=" border bg-gray-50 border-gray-200 flex-col lg:flex-row group  flex gap-4 lg:items-center justify-between items-start rounded-lg hover:bg-gray-100 border-b  cursor-pointer"
    >
      <div className="flex items-center gap-4 pt-3">
        <Badge
          slotProps={{
            badge: {
              className:
                "bg-gray-600 border-gray-700  text-gray-700",
            },
          }}
          badgeContent={
            <span>
              {differenceInDays(parseISO(item.end), parseISO(item.start))} day
            </span>
          }
          sx={badgeStyle}
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
          <p className="text-md truncate  ">
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
            defaultValue={leavesTypes}
            required
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={leavesTypes}
            label="Select Type"
            onChange={handleChange}
          >
            {array?.map((item, index) => {
              return (
                item.isActive &&
                item.count !== 0 && (
                  <MenuItem
                    selected={leavesTypes === item.leaveTypeDetailsId}
                    id={index}
                    key={index}
                    value={item._id}
                  >
                    <div className="flex justify-between w-full">
                      <div>{item.leaveName} </div>
                      <div
                        style={{ background: item.color }}
                        className={`w-4 h-4 rounded-full my-auto`}
                      ></div>
                    </div>
                  </MenuItem>
                )
              );
            })}
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
    </div>
  );
};

export default Mapped;
