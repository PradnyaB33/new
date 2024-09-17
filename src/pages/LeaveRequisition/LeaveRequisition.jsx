// import { CalendarMonth } from "@mui/icons-material";
// import { Badge, Button, Skeleton } from "@mui/material";
// import React, { useContext } from "react";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "tailwindcss/tailwind.css";
// import AppDatePicker from "../../components/date-picker/date-picker";
// import HeaderBackComponent from "../../components/header/component";
// import useLeaveData from "../../hooks/Leave/useLeaveData";
// import LeaveTable from "./components/LeaveTabel";
// import Mapped from "./components/mapped-form";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { UseContext } from "../../State/UseState/UseContext";
// import { useParams } from "react-router";

// const LeaveRequisition = () => {
//   const {
//     data,
//     shiftData,
//     setCalendarOpen,
//     isLoading,
//     handleSubmit,
//     handleInputChange,
//     newAppliedLeaveEvents,
//     setNewAppliedLeaveEvents,
//     isCalendarOpen,
//     handleUpdateFunction,
//     selectEvent,
//     setSelectedLeave,
//     selectedLeave,
//     setselectEvent,
//     deleteLeaveMutation,
//     calLoader,
//     setCalLoader,
//   } = useLeaveData();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { organisationId } = useParams();

//   //for  Get Query to get department
//   const { data: machinePunchingRecord } = useQuery(
//     ["machinePunching", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/availableRecords`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data[0].availableRecords;
//     }
//   );

//   return (
//     <>
//       <section className="">
//         <HeaderBackComponent
//           heading={"Attendance & Leave Management"}
//           oneLineInfo={
//             "Track your attendance and submit your leave requests here for timely approval and efficient management "
//           }
//         />
//         <div className="flex flex-col-reverse md:flex-row w-full justify-start p-6 gap-4">
//           <div className="flex flex-col gap-4">
//             <LeaveTable />
//           </div>

//           <article className="md:w-[100%] space-y-2">
//             {isLoading ? (
//               <div className="space-y-2 mb-4 w-full h-max bg-white p-4 shadow-xl rounded-lg">
//                 <div className="flex items-center gap-8 px-2">
//                   <Badge
//                     badgeContent={"loading"}
//                     color="primary"
//                     variant="standard"
//                   >
//                     <Button
//                       disabled
//                       variant="contained"
//                       size="large"
//                       className="!rounded-full !h-16 !w-16 group-hover:!text-white !text-black"
//                       color="info"
//                     >
//                       <CalendarMonth className="!text-4xl text-gr" />
//                     </Button>
//                   </Badge>
//                   <div>
//                     <Skeleton variant="text" width={160} height={20} />
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-2 mb-4 w-full h-max bg-white p-4 shadow-xl rounded-lg ">
//                 <div className="flex items-center gap-8 px-2">
//                   <Badge badgeContent={"Click"} color="primary">
//                     <Button
//                       disabled={isLoading}
//                       onClick={handleInputChange}
//                       variant="contained"
//                       size="large"
//                       className="!rounded-full !h-16 !w-16 group-hover:!text-white !text-black"
//                       color="info"
//                     >
//                       <CalendarMonth className=" !text-4xl" />
//                     </Button>
//                   </Badge>
//                   <p className="!text-gray-400 font-semibold mb-2 text-xl">
//                     Select Date
//                   </p>
//                 </div>
//               </div>
//             )}

//             <AppDatePicker
//               data={data}
//               shiftData={shiftData}
//               machinePunchingRecord={machinePunchingRecord}
//               handleUpdateFunction={handleUpdateFunction}
//               selectEvent={selectEvent}
//               setselectEvent={setselectEvent}
//               setCalendarOpen={setCalendarOpen}
//               setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//               selectedLeave={selectedLeave}
//               setSelectedLeave={setSelectedLeave}
//               newAppliedLeaveEvents={newAppliedLeaveEvents}
//               isCalendarOpen={isCalendarOpen}
//               deleteLeaveMutation={deleteLeaveMutation}
//               calLoader={calLoader}
//               setCalLoader={setCalLoader}
//             />

//             {newAppliedLeaveEvents.length > 0 &&
//               Array.isArray(newAppliedLeaveEvents) ? (
//               <>
//                 <form
//                   onSubmit={handleSubmit}
//                   className="h-max !mt-4 space-y-2 bg-white py-3 px-8 shadow-lg rounded-lg"
//                 >
//                   <h1 className="text-gray-400 font-semibold mb-4 text-md">
//                     Selected Dates
//                   </h1>
//                   <div className="flex flex-col gap-4">
//                     {newAppliedLeaveEvents?.map((item, index) => (
//                       <Mapped
//                         key={index}
//                         setCalendarOpen={setCalendarOpen}
//                         subtractedLeaves={data?.LeaveTypedEdited}
//                         item={item}
//                         index={index}
//                         newAppliedLeaveEvents={newAppliedLeaveEvents}
//                         setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//                       />
//                     ))}
//                     <div className="w-full m-auto flex justify-center my-4">
//                       <Button
//                         type="submit"
//                         variant="contained"
//                         className="font-bold m-auto w-fit"
//                       >
//                         Apply
//                       </Button>
//                     </div>
//                   </div>
//                 </form>
//               </>
//             ) : (
//               <>
//                 <div className="w-full h-max grid justify-center relative gap-4 !mt-4 space-y-2 py-3 px-8">
//                   <Button
//                     disabled={isLoading}
//                     onClick={() => setCalendarOpen(true)}
//                     variant="contained"
//                     size="large"
//                     className="text-center w-fit !m-auto"
//                   >
//                     {" "}
//                     {!isLoading ? "Apply" : "Wait Calendar is Loading"}
//                   </Button>
//                 </div>
//               </>
//             )}
//           </article>
//         </div>
//       </section>
//     </>
//   );
// };

// export default LeaveRequisition;

//// ✅✅💹💹
// import { CalendarMonth } from "@mui/icons-material";
// import { Badge, Button, Skeleton } from "@mui/material";
// import React, { useContext } from "react";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "tailwindcss/tailwind.css";
// import AppDatePicker from "../../components/date-picker/date-picker";
// import HeaderBackComponent from "../../components/header/component";
// import useLeaveData from "../../hooks/Leave/useLeaveData";
// import LeaveTable from "./components/LeaveTabel";
// import Mapped from "./components/mapped-form";
// import { useQuery } rom "react-query";
// import axios from "axios";
// import { UseContext } from "../../State/UseState/UseContext";
// import { useParams } from "react-router";
// import CalenderAnimation from "../../assets/CalenderAnimation.gif";

// const LeaveRequisition = () => {
//   const {
//     data,
//     shiftData,
//     setCalendarOpen,
//     isLoading,
//     handleSubmit,
//     handleInputChange,
//     newAppliedLeaveEvents,
//     setNewAppliedLeaveEvents,
//     isCalendarOpen,
//     handleUpdateFunction,
//     selectEvent,
//     setSelectedLeave,
//     selectedLeave,
//     setselectEvent,
//     deleteLeaveMutation,
//     calLoader,
//     setCalLoader,
//   } = useLeaveData();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { organisationId } = useParams();

//   // For Get Query to get department
//   const { data: machinePunchingRecord } = useQuery(
//     ["machinePunching", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/availableRecords`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data[0].availableRecords;
//     }
//   );

//   return (
//     <>
//       <section className="p-4 sm:p-6">
//         <HeaderBackComponent
//           heading={"Attendance & Leave Management"}
//           oneLineInfo={
//             "Track your attendance and submit your leave requests here for timely approval and efficient management"
//           }

//         />

//         <div className="mt-4 grid grid-cols-12 gap-4">
//           {/* Left side - Leave Table */}
//           <div className="col-span-12 lg:col-span-3 grid grid-cols-12 gap-4">

//             {/* Calendar & Actions  Select Date*/}
//             <div className="col-span-12 grid grid-rows-2 gap-4 w-full h-max py-4 bg-white p-4 shadow-xl rounded-lg space-y-4" style={{backgroundColor: "yellow"}}>
//               {isLoading ? (
//                 <div className="flex items-center">
//                   <Badge badgeContent={"loading"} color="primary" variant="standard">
//                     <Button
//                       disabled
//                       variant="contained"
//                       size="large"
//                       className="!rounded-full !h-16 !w-16 group-hover:!text-white !text-black"
//                       color="info"
//                     >
//                       <CalendarMonth className="!text-4xl text-gr" />
//                     </Button>
//                   </Badge>
//                   <div className="ml-2">
//                     <Skeleton variant="text" width={160} height={20} />
//                   </div>
//                 </div>
//               ) : (
//                 // <div className="flex justify-center  justify-items-center items-center">
//        <div className="flex  items-center justify-center  ">
//                   <Badge badgeContent={"Click"} color="warning">
//                     <Button
//                       disabled={isLoading}
//                       onClick={handleInputChange}
//                       size="large"
//                       className="!rounded-full !h-16 !w-20 group-hover:!text-white !text-black"
//                       color="info"
//                     >
//                       <img
//                         src={CalenderAnimation}
//                         alt="Calendar Animation"
//                         className="!w-16 !h-24 object-cover"
//                       />
//                     </Button>
//                   </Badge>
//                   <p className="ml-6 pl-5 text-gray-800 font-semibold mb-2 text-lg">
//                     Select Date
//                     <div className="h-max grid gap-4 space-y-2 py-3">
//                       <Button
//                         disabled={isLoading}
//                         onClick={() => setCalendarOpen(true)}
//                         variant="contained"
//                         size="small"
//                         className="text-center w-fit"
//                       >
//                         {!isLoading ? "Apply" : "Wait Calendar is Loading"}
//                       </Button>
//                     </div>
//                   </p>
//                 </div>
//               )}
//             </div>

//               {/* Leave Table Colourful */}
//             <div className="col-span-12 bg-blue-100 p-4 rounded-lg" style={{ backgroundColor: "blue" }}>
//               <LeaveTable />
//             </div>
//           </div>

//           {/* Right side - Date Picker & Selected Dates */}
//           <div className="col-span-12 lg:col-span-9 bg-pink-200 p-4 rounded-lg" style={{ backgroundColor: "pink" }}>
//             <AppDatePicker
//               data={data}
//               shiftData={shiftData}
//               machinePunchingRecord={machinePunchingRecord}
//               handleUpdateFunction={handleUpdateFunction}
//               selectEvent={selectEvent}
//               setselectEvent={setselectEvent}
//               setCalendarOpen={setCalendarOpen}
//               setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//               selectedLeave={selectedLeave}
//               setSelectedLeave={setSelectedLeave}
//               newAppliedLeaveEvents={newAppliedLeaveEvents}
//               isCalendarOpen={isCalendarOpen}
//               deleteLeaveMutation={deleteLeaveMutation}
//               calLoader={calLoader}
//               setCalLoader={setCalLoader}
//             />

//             {newAppliedLeaveEvents.length > 0 && Array.isArray(newAppliedLeaveEvents) ? (
//               <form
//                 onSubmit={handleSubmit}
//                 className="h-max mt-4 space-y-2 bg-white py-3 px-8 shadow-lg rounded-lg"
//               >
//                 <h1 className="text-gray-400 font-semibold mb-4 text-md">Selected Dates</h1>
//                 <div className="space-y-4">
//                   {newAppliedLeaveEvents.map((item, index) => (
//                     <Mapped
//                       key={index}
//                       setCalendarOpen={setCalendarOpen}
//                       subtractedLeaves={data?.LeaveTypedEdited}
//                       item={item}
//                       index={index}
//                       newAppliedLeaveEvents={newAppliedLeaveEvents}
//                       setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//                     />
//                   ))}
//                   <div className="w-full flex justify-center my-4">
//                     <Button type="submit" variant="contained" className="font-bold">
//                       Apply
//                     </Button>
//                   </div>
//                 </div>
//               </form>
//             ) : null}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default LeaveRequisition;

//✅done one

// import { CalendarMonth } from "@mui/icons-material";
// import { Badge, Button, Skeleton } from "@mui/material";
// import React, { useContext, useState ,useEffect } from "react";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "tailwindcss/tailwind.css";
// import AppDatePicker from "../../components/date-picker/date-picker";
// import HeaderBackComponent from "../../components/header/component";
// import useLeaveData from "../../hooks/Leave/useLeaveData";
// import LeaveTable from "./components/LeaveTabel";
// import Mapped from "./components/mapped-form";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { UseContext } from "../../State/UseState/UseContext";
// import { useParams } from "react-router";
// import CalenderAnimation from "../../assets/CalenderAnimation.gif";
// import CAppDatePicker from "../../components/date-picker/Cdate-picker";
// // import LottieAnimatedCalender from "./components/LottieAnimatedCalender";

// const LeaveRequisition = () => {
//   const {
//     data,
//     shiftData,
//     setCalendarOpen,
//     isLoading,
//     handleSubmit,
//     handleInputChange,
//     newAppliedLeaveEvents,
//     setNewAppliedLeaveEvents,
//     isCalendarOpen,
//     handleUpdateFunction,
//     selectEvent,
//     setSelectedLeave,
//     selectedLeave,
//     setselectEvent,
//     deleteLeaveMutation,
//     calLoader,
//     setCalLoader,
//   } = useLeaveData();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { organisationId } = useParams();

//   // For Get Query to get department
//   const { data: machinePunchingRecord, isLoading: isMachineLoading } = useQuery(
//     ["machinePunching", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/availableRecords`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data[0].availableRecords;
//     }
//   );

//   // Loading state for selected dates section
//   const [isDataLoading, setIsDataLoading] = useState(true);

//   // Set loading state to false when data is ready
//   useEffect(() => {
//    if (newAppliedLeaveEvents.length > 0 || !isMachineLoading) {
//       setIsDataLoading(false);
//     }
//   }, [newAppliedLeaveEvents ,isMachineLoading]);

//   return (
//     <>
//       <section className="p-4 sm:p-6">
//         <HeaderBackComponent
//           heading={"Attendance & Leave Management"}
//           oneLineInfo={
//             "Track your attendance and submit your leave requests here for timely approval and efficient management"
//           }
//         />

//         <div className="mt-4 grid grid-cols-12 gap-4">
//           {/* Left side - Leave Table */}
//           <div className="col-span-12 lg:col-span-3 grid grid-cols-12 gap-4">
//             {/* Calendar & Actions  Select Date*/}
//             {/* <div className="col-span-12 grid grid-rows-2 gap-4 w-full h-max py-4 bg-white p-4 shadow-xl rounded-lg space-y-4" style={{backgroundColor: "yellow"}}> */}
//             {/* target */}
//             <div className="col-span-12 grid grid-rows-1 gap-4 w-full h-max py-1  bg-gray-50  shadow-md rounded-lg " >
//               {isLoading ? (
//                 <div className="flex items-center">
//                   <Badge badgeContent={"loading"} color="primary" variant="standard">
//                     <Button
//                       disabled
//                       variant="contained"
//                       size="large"
//                       className="!rounded-full !h-16 !w-16 group-hover:!text-white !text-black"
//                       color="info"
//                     >
//                       <CalendarMonth className="!text-4xl text-gr" />
//                     </Button>
//                   </Badge>
//                   <div className="ml-2">
//                     <Skeleton variant="text" width={150} height={20} />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center">
//                   <Badge badgeContent={"Click"} color="warning">
//                     <Button
//                       disabled={isLoading}
//                       onClick={handleInputChange}
//                       size="large"
//                       className="!rounded-full !h-16 !w-20 group-hover:!text-white !text-black"
//                       color="info"
//                     >
//                       <img
//                         src={CalenderAnimation}
//                         alt="Calendar Animation"
//                         className="!w-16 !h-20 object-cover"
//                       />
//                     </Button>
//                   </Badge>
//                   <p className="ml-6 pl-5 text-gray-600 font-semibold mb-2 text-lg">
//                     Select Date
//                     <div className="h-max grid gap-4 space-y-2 py-3">
//                       <Button
//                         disabled={isLoading}
//                         onClick={() => setCalendarOpen(true)}
//                         variant="contained"
//                         size="small"
//                         className="text-center w-fit"
//                       >
//                         {!isLoading ? "Apply" : "Wait Calendar is Loading"}
//                       </Button>
//                     </div>
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Leave Table Colourful */}
//             {/* <div className="col-span-12 bg-blue-100 p-4 rounded-lg" style={{ backgroundColor: "blue" }}> */}
//             <div className="col-span-12 bg-gray-100  rounded-lg" >
//               <LeaveTable />
//             </div>
//           </div>

//           {/* Right side - Date Picker & Selected Dates */}
//           {/* <div className="col-span-12 lg:col-span-9 bg-pink-200 p-4 rounded-lg" style={{ backgroundColor: "pink" }}> */}
//           <div className="col-span-12 lg:col-span-9  bg-gray-50  rounded-md">
//             {/* Loader or Data */}
//             {isDataLoading || isMachineLoading ? (
//               <div className="flex items-center justify-center h-full">

//                 {/* <LottieAnimatedCalender /> */}
//               {/* <CAppDatePicker
//                  data={data}
//                  shiftData={shiftData}
//                  machinePunchingRecord={machinePunchingRecord}
//                  handleUpdateFunction={handleUpdateFunction}
//                  selectEvent={selectEvent}
//                  setselectEvent={setselectEvent}
//                  setCalendarOpen={setCalendarOpen}
//                  setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//                  selectedLeave={selectedLeave}
//                  setSelectedLeave={setSelectedLeave}
//                  newAppliedLeaveEvents={newAppliedLeaveEvents}
//                  isCalendarOpen={isCalendarOpen}
//                  deleteLeaveMutation={deleteLeaveMutation}
//                  calLoader={calLoader}
//                  setCalLoader={setCalLoader}
//               /> */}

//               </div>
//             ) : (
//               <>
//                  <CAppDatePicker
//                  data={data}
//                  shiftData={shiftData}
//                  machinePunchingRecord={machinePunchingRecord}
//                  handleUpdateFunction={handleUpdateFunction}
//                  selectEvent={selectEvent}
//                  setselectEvent={setselectEvent}
//                  setCalendarOpen={setCalendarOpen}
//                  setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//                  selectedLeave={selectedLeave}
//                  setSelectedLeave={setSelectedLeave}
//                  newAppliedLeaveEvents={newAppliedLeaveEvents}
//                  isCalendarOpen={isCalendarOpen}
//                  deleteLeaveMutation={deleteLeaveMutation}
//                  calLoader={calLoader}
//                  setCalLoader={setCalLoader}
//               />
//                 <AppDatePicker
//                   data={data}
//                   shiftData={shiftData}
//                   machinePunchingRecord={machinePunchingRecord}
//                   handleUpdateFunction={handleUpdateFunction}
//                   selectEvent={selectEvent}
//                   setselectEvent={setselectEvent}
//                   setCalendarOpen={setCalendarOpen}
//                   setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//                   selectedLeave={selectedLeave}
//                   setSelectedLeave={setSelectedLeave}
//                   newAppliedLeaveEvents={newAppliedLeaveEvents}
//                   isCalendarOpen={isCalendarOpen}
//                   deleteLeaveMutation={deleteLeaveMutation}
//                   calLoader={calLoader}
//                   setCalLoader={setCalLoader}
//                 />

//                 {newAppliedLeaveEvents.length > 0 && Array.isArray(newAppliedLeaveEvents) ? (
//                   <form
//                     onSubmit={handleSubmit}
//                     className="h-max mt-0 space-y-2 bg-white py-3 px-8 shadow-lg rounded-lg"
//                   >
//                     <h1 className="text-gray-400 font-semibold  text-md">Selected Dates</h1>
//                     <div className="space-y-4">
//                       {newAppliedLeaveEvents.map((item, index) => (
//                         <Mapped
//                           key={index}
//                           setCalendarOpen={setCalendarOpen}
//                           subtractedLeaves={data?.LeaveTypedEdited}
//                           item={item}
//                           index={index}
//                           newAppliedLeaveEvents={newAppliedLeaveEvents}
//                           setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//                         />
//                       ))}
//                       <div className="w-full flex justify-center my-1">
//                         <Button type="submit" variant="contained" className="font-bold">
//                           Apply
//                         </Button>
//                       </div>
//                     </div>
//                   </form>
//                 ) : null}
//               </>
//             )}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default LeaveRequisition;

// //bot
// import { CalendarMonth } from "@mui/icons-material";
// import { Badge, Button, Skeleton } from "@mui/material";
// import React, { useContext, useState, useEffect } from "react";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "tailwindcss/tailwind.css";
// import AppDatePicker from "../../components/date-picker/date-picker";
// import HeaderBackComponent from "../../components/header/component";
// import useLeaveData from "../../hooks/Leave/useLeaveData";
// import LeaveTable from "./components/LeaveTabel";
// import Mapped from "./components/mapped-form";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { UseContext } from "../../State/UseState/UseContext";
// import { useParams } from "react-router";
// import CalenderAnimation from "../../assets/CalenderAnimation.gif";
// import CAppDatePicker from "../../components/date-picker/Cdate-picker";
// // import LottieAnimatedCalender from "./components/LottieAnimatedCalender";

// const LeaveRequisition = () => {
//   const {
//     data,
//     shiftData,
//     setCalendarOpen,
//     isLoading,
//     handleSubmit,
//     handleInputChange,
//     newAppliedLeaveEvents,
//     setNewAppliedLeaveEvents,
//     isCalendarOpen,
//     handleUpdateFunction,
//     selectEvent,
//     setSelectedLeave,
//     selectedLeave,
//     setselectEvent,
//     deleteLeaveMutation,
//     calLoader,
//     setCalLoader,
//   } = useLeaveData();
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { organisationId } = useParams();

//   // For Get Query to get department
//   const { data: machinePunchingRecord, isLoading: isMachineLoading } = useQuery(
//     ["machinePunching", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/availableRecords`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data.data[0].availableRecords;
//     }
//   );

//   // Loading state for selected dates section
//   const [isDataLoading, setIsDataLoading] = useState(true);

//   // State to manage visibility of CAppDatePicker
//   const [isCAppDatePickerVisible, setIsCAppDatePickerVisible] = useState(true);

//   // Set loading state to false when data is ready
//   useEffect(() => {
//     if (newAppliedLeaveEvents.length > 0 || !isMachineLoading) {
//       setIsDataLoading(false);
//     }
//   }, [newAppliedLeaveEvents, isMachineLoading]);

//   // Hide CAppDatePicker when the selected dates form is visible
//   useEffect(() => {
//     if (newAppliedLeaveEvents.length <= 0 && Array.isArray(newAppliedLeaveEvents)) {
//        setIsCAppDatePickerVisible(true);
//     }
//   }, [newAppliedLeaveEvents]);

//   return (
//     <>
//       <section className="p-4 sm:p-6">
//         <HeaderBackComponent
//           heading={"Attendance & Leave Management"}
//           oneLineInfo={
//             "Track your attendance and submit your leave requests here for timely approval and efficient management"
//           }
//         />

//         <div className="mt-4 grid grid-cols-12 gap-4">
//           {/* Left side - Leave Table */}
//           <div className="col-span-12 lg:col-span-3 grid grid-cols-12 gap-4">
//             {/* Calendar & Actions  Select Date*/}
//             <div className="col-span-12 grid grid-rows-1 gap-4 w-full h-max py-1  bg-gray-50  shadow-md rounded-lg " >
//               {isLoading ? (
//                 <div className="flex items-center">
//                   <Badge badgeContent={"loading"} color="primary" variant="standard">
//                     <Button
//                       disabled
//                       variant="contained"
//                       size="large"
//                       className="!rounded-full !h-16 !w-16 group-hover:!text-white !text-black"
//                       color="info"
//                     >
//                       <CalendarMonth className="!text-4xl text-gr" />
//                     </Button>
//                   </Badge>
//                   <div className="ml-2">
//                     <Skeleton variant="text" width={150} height={20} />
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center">
//                   <Badge badgeContent={"Click"} color="warning">
//                     <Button
//                       disabled={isLoading}
//                       onClick={handleInputChange}
//                       size="large"
//                       className="!rounded-full !h-16 !w-20 group-hover:!text-white !text-black"
//                       color="info"
//                     >
//                       <img
//                         src={CalenderAnimation}
//                         alt="Calendar Animation"
//                         className="!w-16 !h-20 object-cover"
//                       />
//                     </Button>
//                   </Badge>
//                   <p className="ml-6 pl-5 text-gray-600 font-semibold mb-2 text-lg">
//                     Select Date
//                     <div className="h-max grid gap-4 space-y-2 py-3">
//                       <Button
//                         // disabled={isLoading && isCAppDatePickerVisible }
//                         disabled={isLoading || isCAppDatePickerVisible }
//                         onClick={() => setCalendarOpen(true)}
//                         variant="contained"
//                         size="small"
//                         className="text-center w-fit"
//                       >
//                         {!isLoading ? "Apply" : "Wait Calendar is Loading"}
//                       </Button>
//                     </div>
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Leave Table Colourful */}
//             <div className="col-span-12 bg-gray-100  rounded-lg" >
//               <LeaveTable />
//             </div>
//           </div>

//           {/* Right side - Date Picker & Selected Dates */}
//           <div className="col-span-12 lg:col-span-9  bg-gray-50  rounded-md">
//             {/* Render Date Picker */}
//             {isCAppDatePickerVisible ? (
//               <>
//                 <CAppDatePicker
//                   data={data}
//                   shiftData={shiftData}
//                   machinePunchingRecord={machinePunchingRecord}
//                   handleUpdateFunction={handleUpdateFunction}
//                   selectEvent={selectEvent}
//                   setselectEvent={setselectEvent}
//                   setCalendarOpen={setCalendarOpen}
//                   setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//                   selectedLeave={selectedLeave}
//                   setSelectedLeave={setSelectedLeave}
//                   newAppliedLeaveEvents={newAppliedLeaveEvents}
//                   isCalendarOpen={isCalendarOpen}
//                   deleteLeaveMutation={deleteLeaveMutation}
//                   calLoader={calLoader}
//                   setCalLoader={setCalLoader}
//                   setIsCAppDatePickerVisible={setIsCAppDatePickerVisible}
//                 />

//               </>
//             ):
//             <>
//             <form
//                 onSubmit={handleSubmit}
//                 className="h-max mt-0 space-y-2 bg-white py-3 px-8 shadow-lg rounded-lg"
//               >
//                 <h1 className="text-gray-400 font-semibold text-md">Selected Dates</h1>
//                 <div className="space-y-4">
//                   {newAppliedLeaveEvents.map((item, index) => (
//                     <Mapped
//                       key={index}
//                       setCalendarOpen={setCalendarOpen}
//                       subtractedLeaves={data?.LeaveTypedEdited}
//                       item={item}
//                       index={index}
//                       newAppliedLeaveEvents={newAppliedLeaveEvents}
//                       setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//                     />
//                   ))}
//                   <div className="w-full flex justify-center my-1">
//                     <Button type="submit" variant="contained" className="font-bold">
//                       Apply
//                     </Button>
//                   </div>
//                 </div>
//               </form>

//               <AppDatePicker
//                   data={data}
//                   shiftData={shiftData}
//                   machinePunchingRecord={machinePunchingRecord}
//                   handleUpdateFunction={handleUpdateFunction}
//                   selectEvent={selectEvent}
//                   setselectEvent={setselectEvent}
//                   setCalendarOpen={setCalendarOpen}
//                   setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//                   selectedLeave={selectedLeave}
//                   setSelectedLeave={setSelectedLeave}
//                   newAppliedLeaveEvents={newAppliedLeaveEvents}
//                   isCalendarOpen={isCalendarOpen}
//                   deleteLeaveMutation={deleteLeaveMutation}
//                   calLoader={calLoader}
//                   setCalLoader={setCalLoader}
//                 />
//             </>

//         }
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default LeaveRequisition;

// //updated 30/8/24
// import { CalendarMonth } from "@mui/icons-material";
// import { Badge, Button, Skeleton } from "@mui/material";
// import React, { useContext, useState, useEffect } from "react";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "tailwindcss/tailwind.css";
// import AppDatePicker from "../../components/date-picker/date-picker";
// import HeaderBackComponent2 from "../../components/header/HeaderBackComponent2";
// import useLeaveData from "../../hooks/Leave/useLeaveData";
// import LeaveTable from "./components/LeaveTabel";
// import Mapped from "./components/mapped-form";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { UseContext } from "../../State/UseState/UseContext";
// import { useParams } from "react-router";
// import CalenderAnimation from "../../assets/CalenderAnimation.gif";
// import CAppDatePicker from "../../components/date-picker/Cdate-picker";
// import UserProfile from "../../hooks/UserData/useUser";

// const LeaveRequisition = () => {
//   const {
//     data,
//     shiftData,
//     setCalendarOpen,
//     isLoading,
//     handleSubmit,
//     handleInputChange,
//     newAppliedLeaveEvents,
//     setNewAppliedLeaveEvents,
//     isCalendarOpen,
//     handleUpdateFunction,
//     selectEvent,
//     setSelectedLeave,
//     selectedLeave,
//     setselectEvent,
//     deleteLeaveMutation,
//     calLoader,
//     setCalLoader,
//   } = useLeaveData();

//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { organisationId } = useParams();

//   const user = UserProfile().getCurrentUser()
//   console.log("Thsii is user" , user);

//   // Fetch department data
//   const { data: machinePunchingRecord, isLoading: isMachineLoading } = useQuery(
//     ["machinePunching", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/availableRecords`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       return response.data.data[0].availableRecords;
//     }
//   );

//   // Manage loading state for selected dates
//   const [isDataLoading, setIsDataLoading] = useState(true);

//   // Manage visibility of CAppDatePicker
//   const [isCAppDatePickerVisible, setIsCAppDatePickerVisible] = useState(true);

//   // Update loading state when data is ready
//   useEffect(() => {
//     if (newAppliedLeaveEvents.length > 0 || !isMachineLoading) {
//       setIsDataLoading(false);
//     }
//   }, [newAppliedLeaveEvents, isMachineLoading]);

//   // Show CAppDatePicker if there are no new applied leave events
//   useEffect(() => {
//     if (newAppliedLeaveEvents.length <= 0 && Array.isArray(newAppliedLeaveEvents)) {
//       setIsCAppDatePickerVisible(true);
//     }
//   }, [newAppliedLeaveEvents]);

//   return (
//     <section className="">
//       <HeaderBackComponent2
//         heading={"Attendance & Leave Management"}
//         oneLineInfo={
//           "Track your attendance and submit your leave requests here for timely approval and efficient management"
//         }
//         />

//       <div className="mt-4 grid grid-cols-12 gap-4">
//         {/* Left side - Leave Table */}
//         <div className="col-span-12 lg:col-span-3 grid grid-cols-12 gap-4">
//           {/* Calendar & Actions - Select Date */}
//           <div className="col-span-12 grid grid-rows-1 gap-4 w-full h-max py-1 bg-gray-50 shadow-md rounded-lg">
//             {isLoading ? (
//               <div className="flex items-center">
//                 <Badge badgeContent={"loading"} color="primary" variant="standard">
//                   <Button
//                     disabled
//                     variant="contained"
//                     size="large"
//                     className="!rounded-full !h-16 !w-16 group-hover:!text-white !text-black"
//                     color="info"
//                   >
//                     <CalendarMonth className="!text-4xl text-gray-600" />
//                   </Button>
//                 </Badge>
//                 <div className="ml-2">
//                   <Skeleton variant="text" width={150} height={20} />
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center justify-center">
//                 <Badge badgeContent={"Click"} color="warning">
//                   <Button
//                     disabled={isLoading}
//                     onClick={handleInputChange}
//                     size="large"
//                     className="!rounded-full !h-16 !w-20 group-hover:!text-white !text-black"
//                     color="info"
//                   >
//                     <img
//                       src={CalenderAnimation}
//                       alt="Calendar Animation"
//                       className="!w-16 !h-20 object-cover"
//                     />
//                   </Button>
//                 </Badge>
//                 <p className="ml-6 pl-5 text-gray-600 font-semibold mb-2 text-lg">
//                   Select Date
//                   <div className="h-max grid gap-4 space-y-2 py-3">
//                     <Button
//                       disabled={isLoading || isCAppDatePickerVisible}
//                       onClick={() => setCalendarOpen(true)}
//                       variant="contained"
//                       size="small"
//                       className="text-center w-fit"
//                     >
//                       {!isLoading ? "Apply" : "Wait Calendar is Loading"}
//                     </Button>
//                   </div>
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Leave Table */}
//           <div className=" col-span-12  bg-gray-100 rounded-lg">
//             <LeaveTable />
//           </div>
//         </div>

//         {/* Right side - Date Picker & Selected Dates */}
//         <div className="col-span-12 lg:col-span-9 bg-gray-50 rounded-md">
//           {/* Render Date Picker */}
//           {isCAppDatePickerVisible ? (
//             <CAppDatePicker
//               data={data}
//               shiftData={shiftData}
//               machinePunchingRecord={machinePunchingRecord}
//               handleUpdateFunction={handleUpdateFunction}
//               selectEvent={selectEvent}
//               setselectEvent={setselectEvent}
//               setCalendarOpen={setCalendarOpen}
//               setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//               selectedLeave={selectedLeave}
//               setSelectedLeave={setSelectedLeave}
//               newAppliedLeaveEvents={newAppliedLeaveEvents}
//               isCalendarOpen={isCalendarOpen}
//               deleteLeaveMutation={deleteLeaveMutation}
//               calLoader={calLoader}
//               setCalLoader={setCalLoader}
//               setIsCAppDatePickerVisible={setIsCAppDatePickerVisible}
//             />
//           ) : (
//             <>
//               <form
//                 onSubmit={handleSubmit}
//                 className="h-max mt-0 space-y-2 bg-white py-3 px-8 shadow-lg rounded-lg"
//               >
//                 <h1 className="text-gray-400 font-semibold text-md">Selected Dates</h1>
//                 <div className="space-y-4">
//                   {newAppliedLeaveEvents.map((item, index) => (
//                     <Mapped
//                       key={index}
//                       setCalendarOpen={setCalendarOpen}
//                       subtractedLeaves={data?.LeaveTypedEdited}
//                       item={item}
//                       index={index}
//                       newAppliedLeaveEvents={newAppliedLeaveEvents}
//                       setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//                     />
//                   ))}
//                   <div className="w-full flex justify-center my-1">
//                     <Button type="submit" variant="contained" className="font-bold">
//                       Apply
//                     </Button>
//                   </div>
//                 </div>
//               </form>

//               <AppDatePicker
//                 data={data}
//                 shiftData={shiftData}
//                 machinePunchingRecord={machinePunchingRecord}
//                 handleUpdateFunction={handleUpdateFunction}
//                 selectEvent={selectEvent}
//                 setselectEvent={setselectEvent}
//                 setCalendarOpen={setCalendarOpen}
//                 setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//                 selectedLeave={selectedLeave}
//                 setSelectedLeave={setSelectedLeave}
//                 newAppliedLeaveEvents={newAppliedLeaveEvents}
//                 isCalendarOpen={isCalendarOpen}
//                 deleteLeaveMutation={deleteLeaveMutation}
//                 calLoader={calLoader}
//                 setCalLoader={setCalLoader}
//               />
//             </>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LeaveRequisition;

import { CalendarMonth } from "@mui/icons-material";
import { Badge, Button, Skeleton } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "tailwindcss/tailwind.css";
import AppDatePicker from "../../components/date-picker/date-picker";
import HeaderBackComponent2 from "../../components/header/HeaderBackComponent2";
import useLeaveData from "../../hooks/Leave/useLeaveData";
import LeaveTable from "./components/LeaveTabel";
import Mapped from "./components/mapped-form";
import { useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { useParams } from "react-router";
import CalenderAnimation from "../../assets/CalenderAnimation.gif";
import CAppDatePicker from "../../components/date-picker/Cdate-picker";
import UserProfile from "../../hooks/UserData/useUser";

const LeaveRequisition = () => {
  const {
    data,
    shiftData,
    setCalendarOpen,
    isLoading,
    handleSubmit,
    handleInputChange,
    newAppliedLeaveEvents,
    setNewAppliedLeaveEvents,
    isCalendarOpen,
    handleUpdateFunction,
    selectEvent,
    setSelectedLeave,
    selectedLeave,
    setselectEvent,
    deleteLeaveMutation,
    calLoader,
    setCalLoader,
  } = useLeaveData();

  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { organisationId } = useParams();

  const user = UserProfile().getCurrentUser();
  console.log("Thsii is user", user);

  // Fetch department data
  const { data: machinePunchingRecord, isLoading: isMachineLoading } = useQuery(
    ["machinePunching", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/availableRecords`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.data[0].availableRecords;
    }
  );

  // Manage loading state for selected dates
  const [isDataLoading, setIsDataLoading] = useState(true);
  console.log(isDataLoading);

  // Manage visibility of CAppDatePicker
  const [isCAppDatePickerVisible, setIsCAppDatePickerVisible] = useState(true);
  // Update loading state when data is ready
  useEffect(() => {
    if (newAppliedLeaveEvents.length > 0 || !isMachineLoading) {
      setIsDataLoading(false);
    }
  }, [newAppliedLeaveEvents, isMachineLoading]);

  useEffect(() => {
    if (
      newAppliedLeaveEvents.length <= 0 &&
      Array.isArray(newAppliedLeaveEvents)
    ) {
      setIsCAppDatePickerVisible(true);
    }
  }, [newAppliedLeaveEvents]);

  return (
    <section className="">
      <HeaderBackComponent2
        heading={"Attendance & Leave Management"}
        oneLineInfo={
          "Track your attendance and submit your leave requests here for timely approval and efficient management"
        }
      />

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        {/* Left side - Leave Table */}
        <div className="flex flex-col lg:w-[20%] gap-4">
          {/* Calendar & Actions - Select Date */}
          <div className="flex flex-col bg-gray-50 shadow-md rounded-lg p-2">
            {isLoading ? (
              <div className="flex items-center">
                <Badge
                  badgeContent={"loading"}
                  color="primary"
                  variant="standard"
                >
                  <Button
                    disabled
                    variant="contained"
                    size="large"
                    className="!rounded-full !h-16 !w-16 group-hover:!text-white !text-black"
                    color="info"
                  >
                    <CalendarMonth className="!text-4xl text-gray-600" />
                  </Button>
                </Badge>
                <div className="ml-2">
                  <Skeleton variant="text" width={150} height={20} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Badge badgeContent={"Click"} color="warning">
                  <Button
                    disabled={isLoading}
                    onClick={handleInputChange}
                    size="large"
                    className="!rounded-full !h-16 !w-20 group-hover:!text-white !text-black"
                    color="info"
                  >
                    <img
                      src={CalenderAnimation}
                      alt="Calendar Animation"
                      className="!w-16 !h-20 object-cover"
                    />
                  </Button>
                </Badge>
                <p className="ml-6 pl-5 text-gray-600 font-semibold mb-2 text-lg">
                  Select Date
                  <div className="h-max grid gap-4 space-y-2 py-3">
                    <Button
                      //  disabled={isLoading && isCAppDatePickerVisible }
                      disabled={isLoading || isCAppDatePickerVisible}
                      onClick={() => setCalendarOpen(true)}
                      variant="contained"
                      size="small"
                      className="text-center w-fit"
                    >
                      {!isLoading ? "Apply" : "Wait Calendar is Loading"}
                    </Button>
                  </div>
                </p>
              </div>
            )}
          </div>

          {/* Leave Table */}
          <div className="bg-gray-100 shadow-md rounded-md p-2 pb-7">
            <LeaveTable />
          </div>
        </div>

        {/* Right side - Date Picker & Selected Dates */}
        <div className="flex flex-col lg:w-[80%] bg-gray-50  rounded-md ">
          {/* Render Date Picker */}
          {isCAppDatePickerVisible ? (
            <CAppDatePicker
              data={data}
              shiftData={shiftData}
              machinePunchingRecord={machinePunchingRecord}
              handleUpdateFunction={handleUpdateFunction}
              selectEvent={selectEvent}
              setselectEvent={setselectEvent}
              setCalendarOpen={setCalendarOpen}
              setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
              selectedLeave={selectedLeave}
              setSelectedLeave={setSelectedLeave}
              newAppliedLeaveEvents={newAppliedLeaveEvents}
              isCalendarOpen={isCalendarOpen}
              deleteLeaveMutation={deleteLeaveMutation}
              calLoader={calLoader}
              setCalLoader={setCalLoader}
              setIsCAppDatePickerVisible={setIsCAppDatePickerVisible}
            />
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="space-y-2 bg-white py-3 px-8 shadow-lg rounded-lg"
              >
                <h1 className="text-gray-400 font-semibold text-md">
                  Selected Dates
                </h1>
                <div className="space-y-4">
                  {newAppliedLeaveEvents.map((item, index) => (
                    <Mapped
                      key={index}
                      setCalendarOpen={setCalendarOpen}
                      subtractedLeaves={data?.LeaveTypedEdited}
                      item={item}
                      index={index}
                      newAppliedLeaveEvents={newAppliedLeaveEvents}
                      setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
                    />
                  ))}
                  <div className="w-full flex justify-center my-1">
                    <Button
                      type="submit"
                      variant="contained"
                      className="font-bold"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </form>

              <AppDatePicker
                data={data}
                shiftData={shiftData}
                machinePunchingRecord={machinePunchingRecord}
                handleUpdateFunction={handleUpdateFunction}
                selectEvent={selectEvent}
                setselectEvent={setselectEvent}
                setCalendarOpen={setCalendarOpen}
                setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
                selectedLeave={selectedLeave}
                setSelectedLeave={setSelectedLeave}
                newAppliedLeaveEvents={newAppliedLeaveEvents}
                isCalendarOpen={isCalendarOpen}
                deleteLeaveMutation={deleteLeaveMutation}
                calLoader={calLoader}
                setCalLoader={setCalLoader}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default LeaveRequisition;

//resizing add ki hai v1
// import { CalendarMonth } from "@mui/icons-material";
// import { Badge, Button, Skeleton } from "@mui/material";
// import React, { useContext, useState, useEffect } from "react";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "tailwindcss/tailwind.css";
// import AppDatePicker from "../../components/date-picker/date-picker";
// import HeaderBackComponent2 from "../../components/header/HeaderBackComponent2";
// import useLeaveData from "../../hooks/Leave/useLeaveData";
// import LeaveTable from "./components/LeaveTabel";
// import Mapped from "./components/mapped-form";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { UseContext } from "../../State/UseState/UseContext";
// import { useParams } from "react-router";
// import CalenderAnimation from "../../assets/CalenderAnimation.gif";
// import CAppDatePicker from "../../components/date-picker/Cdate-picker";
// import UserProfile from "../../hooks/UserData/useUser";

// const LeaveRequisition = () => {
//   const {
//     data,
//     shiftData,
//     setCalendarOpen,
//     isLoading,
//     handleSubmit,
//     handleInputChange,
//     newAppliedLeaveEvents,
//     setNewAppliedLeaveEvents,
//     isCalendarOpen,
//     handleUpdateFunction,
//     selectEvent,
//     setSelectedLeave,
//     selectedLeave,
//     setselectEvent,
//     deleteLeaveMutation,
//     calLoader,
//     setCalLoader,
//   } = useLeaveData();

//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { organisationId } = useParams();

//   const user = UserProfile().getCurrentUser();
//   console.log("This is user", user);

//   // Fetch department data
//   const { data: machinePunchingRecord, isLoading: isMachineLoading } = useQuery(
//     ["machinePunching", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/availableRecords`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       return response.data.data[0].availableRecords;
//     }
//   );

//   // Manage loading state for selected dates
//   const [isDataLoading, setIsDataLoading] = useState(true);

//   // Manage visibility of CAppDatePicker
//   const [isCAppDatePickerVisible, setIsCAppDatePickerVisible] = useState(true);

//   // Update loading state when data is ready
//   useEffect(() => {
//     if (newAppliedLeaveEvents.length > 0 || !isMachineLoading) {
//       setIsDataLoading(false);
//     }
//   }, [newAppliedLeaveEvents, isMachineLoading]);

//   // Show CAppDatePicker if there are no new applied leave events
//   useEffect(() => {
//     if (newAppliedLeaveEvents.length <= 0 && Array.isArray(newAppliedLeaveEvents)) {
//       setIsCAppDatePickerVisible(true);
//     }
//   }, [newAppliedLeaveEvents]);

//   // Determine the className for LeaveTable based on CAppDatePicker visibility
//   const leaveTableClassName = isCAppDatePickerVisible
//     ? "col-span-12 bg-gray-100 rounded-lg -mt-16"
//     : "col-span-12 bg-gray-100 rounded-lg";

//   return (
//     <section className="">
//       <HeaderBackComponent2
//         heading={"Attendance & Leave Management"}
//         oneLineInfo={
//           "Track your attendance and submit your leave requests here for timely approval and efficient management"
//         }
//       />

//       <div className="mt-4 grid grid-cols-12 gap-4">
//         {/* Left side - Leave Table */}
//         <div className="col-span-12 lg:col-span-3 grid grid-cols-12 gap-4">
//           {/* Calendar & Actions - Select Date */}
//           <div className="col-span-12 grid grid-rows-1 gap-4 w-full h-max py-1 bg-gray-50 shadow-md rounded-lg">
//             {isLoading ? (
//               <div className="flex items-center">
//                 <Badge badgeContent={"loading"} color="primary" variant="standard">
//                   <Button
//                     disabled
//                     variant="contained"
//                     size="large"
//                     className="!rounded-full !h-16 !w-16 group-hover:!text-white !text-black"
//                     color="info"
//                   >
//                     <CalendarMonth className="!text-4xl text-gray-600" />
//                   </Button>
//                 </Badge>
//                 <div className="ml-2">
//                   <Skeleton variant="text" width={150} height={20} />
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center justify-center">
//                 <Badge badgeContent={"Click"} color="warning">
//                   <Button
//                     disabled={isLoading}
//                     onClick={handleInputChange}
//                     size="large"
//                     className="!rounded-full !h-16 !w-20 group-hover:!text-white !text-black"
//                     color="info"
//                   >
//                     <img
//                       src={CalenderAnimation}
//                       alt="Calendar Animation"
//                       className="!w-16 !h-20 object-cover"
//                     />
//                   </Button>
//                 </Badge>
//                 <p className="ml-6 pl-5 text-gray-600 font-semibold mb-2 text-lg">
//                   Select Date
//                   <div className="h-max grid gap-4 space-y-2 py-3">
//                     <Button
//                       disabled={isLoading || isCAppDatePickerVisible}
//                       onClick={() => setCalendarOpen(true)}
//                       variant="contained"
//                       size="small"
//                       className="text-center w-fit"
//                     >
//                       {!isLoading ? "Apply" : "Wait Calendar is Loading"}
//                     </Button>
//                   </div>
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Leave Table */}
//           <div className={leaveTableClassName}>
//             <LeaveTable />
//           </div>
//         </div>

//         {/* Right side - Date Picker & Selected Dates */}
//         <div className="col-span-12 lg:col-span-9 bg-gray-50 rounded-md">
//           {/* Render Date Picker */}
//           {isCAppDatePickerVisible ? (
//             <CAppDatePicker
//               data={data}
//               shiftData={shiftData}
//               machinePunchingRecord={machinePunchingRecord}
//               handleUpdateFunction={handleUpdateFunction}
//               selectEvent={selectEvent}
//               setselectEvent={setselectEvent}
//               setCalendarOpen={setCalendarOpen}
//               setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//               selectedLeave={selectedLeave}
//               setSelectedLeave={setSelectedLeave}
//               newAppliedLeaveEvents={newAppliedLeaveEvents}
//               isCalendarOpen={isCalendarOpen}
//               deleteLeaveMutation={deleteLeaveMutation}
//               calLoader={calLoader}
//               setCalLoader={setCalLoader}
//               setIsCAppDatePickerVisible={setIsCAppDatePickerVisible}
//             />
//           ) : (
//             <>
//               <form
//                 onSubmit={handleSubmit}
//                 className="h-max mt-0 space-y-2 bg-white py-3 px-8 shadow-lg rounded-lg"
//               >
//                 <h1 className="text-gray-400 font-semibold text-md">Selected Dates</h1>
//                 <div className="space-y-4">
//                   {newAppliedLeaveEvents.map((item, index) => (
//                     <Mapped
//                       key={index}
//                       setCalendarOpen={setCalendarOpen}
//                       subtractedLeaves={data?.LeaveTypedEdited}
//                       item={item}
//                       index={index}
//                       newAppliedLeaveEvents={newAppliedLeaveEvents}
//                       setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//                     />
//                   ))}
//                   <div className="w-full flex justify-center my-1">
//                     <Button type="submit" variant="contained" className="font-bold">
//                       Apply
//                     </Button>
//                   </div>
//                 </div>
//               </form>

//               <AppDatePicker
//                 data={data}
//                 shiftData={shiftData}
//                 machinePunchingRecord={machinePunchingRecord}
//                 handleUpdateFunction={handleUpdateFunction}
//                 selectEvent={selectEvent}
//                 setselectEvent={setselectEvent}
//                 setCalendarOpen={setCalendarOpen}
//                 setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//                 selectedLeave={selectedLeave}
//                 setSelectedLeave={setSelectedLeave}
//                 newAppliedLeaveEvents={newAppliedLeaveEvents}
//                 isCalendarOpen={isCalendarOpen}
//                 deleteLeaveMutation={deleteLeaveMutation}
//                 calLoader={calLoader}
//                 setCalLoader={setCalLoader}
//               />
//             </>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LeaveRequisition;

// // resizing add ki hai v2
// import { CalendarMonth } from "@mui/icons-material";
// import { Badge, Button, Skeleton } from "@mui/material";
// import React, { useContext, useState, useEffect } from "react";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import "tailwindcss/tailwind.css";
// import AppDatePicker from "../../components/date-picker/date-picker";
// import HeaderBackComponent2 from "../../components/header/HeaderBackComponent2";
// import useLeaveData from "../../hooks/Leave/useLeaveData";
// import LeaveTable from "./components/LeaveTabel";
// import Mapped from "./components/mapped-form";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { UseContext } from "../../State/UseState/UseContext";
// import { useParams } from "react-router";
// import CalenderAnimation from "../../assets/CalenderAnimation.gif";
// import CAppDatePicker from "../../components/date-picker/Cdate-picker";
// import UserProfile from "../../hooks/UserData/useUser";

// const LeaveRequisition = () => {
//   const {
//     data,
//     shiftData,
//     setCalendarOpen,
//     isLoading,
//     handleSubmit,
//     handleInputChange,
//     newAppliedLeaveEvents,
//     setNewAppliedLeaveEvents,
//     isCalendarOpen,
//     handleUpdateFunction,
//     selectEvent,
//     setSelectedLeave,
//     selectedLeave,
//     setselectEvent,
//     deleteLeaveMutation,
//     calLoader,
//     setCalLoader,
//   } = useLeaveData();

//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { organisationId } = useParams();

//   const user = UserProfile().getCurrentUser();
//   console.log("This is user", user);

//   // Fetch department data
//   const { data: machinePunchingRecord, isLoading: isMachineLoading } = useQuery(
//     ["machinePunching", organisationId],
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/availableRecords`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       return response.data.data[0].availableRecords;
//     }
//   );

//   // Manage loading state for selected dates
//   const [isDataLoading, setIsDataLoading] = useState(true);

//   // Manage visibility of CAppDatePicker
//   const [isCAppDatePickerVisible, setIsCAppDatePickerVisible] = useState(true);

//   // Update loading state when data is ready
//   useEffect(() => {
//     if (newAppliedLeaveEvents.length > 0 || !isMachineLoading) {
//       setIsDataLoading(false);
//     }
//   }, [newAppliedLeaveEvents, isMachineLoading]);

//   // Show CAppDatePicker if there are no new applied leave events
//   useEffect(() => {
//     if (newAppliedLeaveEvents.length <= 0 && Array.isArray(newAppliedLeaveEvents)) {
//       setIsCAppDatePickerVisible(true);
//     }
//   }, [newAppliedLeaveEvents]);

//   // Determine the className for LeaveTable based on CAppDatePicker visibility and loading state
//   const leaveTableClassName = `col-span-12 bg-gray-100 rounded-lg ${
//     isCAppDatePickerVisible ? '-mt-16' : ''
//   } ${calLoader ? 'bg-gray-200' : ''}`;

//   return (
//     <section className="">
//       <HeaderBackComponent2
//         heading={"Attendance & Leave Management"}
//         oneLineInfo={
//           "Track your attendance and submit your leave requests here for timely approval and efficient management"
//         }
//       />

//       <div className="mt-4 grid grid-cols-12 gap-4">
//         {/* Left side - Leave Table */}
//         <div className="col-span-12 lg:col-span-3 grid grid-cols-12 gap-4">
//           {/* Calendar & Actions - Select Date */}
//           <div className="col-span-12 grid grid-rows-1 gap-4 w-full h-max py-1 bg-gray-50 shadow-md rounded-lg">
//             {isLoading ? (
//               <div className="flex items-center">
//                 <Badge badgeContent={"loading"} color="primary" variant="standard">
//                   <Button
//                     disabled
//                     variant="contained"
//                     size="large"
//                     className="!rounded-full !h-16 !w-16 group-hover:!text-white !text-black"
//                     color="info"
//                   >
//                     <CalendarMonth className="!text-4xl text-gray-600" />
//                   </Button>
//                 </Badge>
//                 <div className="ml-2">
//                   <Skeleton variant="text" width={150} height={20} />
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center justify-center">
//                 <Badge badgeContent={"Click"} color="warning">
//                   <Button
//                     disabled={isLoading}
//                     onClick={handleInputChange}
//                     size="large"
//                     className="!rounded-full !h-16 !w-20 group-hover:!text-white !text-black"
//                     color="info"
//                   >
//                     <img
//                       src={CalenderAnimation}
//                       alt="Calendar Animation"
//                       className="!w-16 !h-20 object-cover"
//                     />
//                   </Button>
//                 </Badge>
//                 <p className="ml-6 pl-5 text-gray-600 font-semibold mb-2 text-lg">
//                   Select Date
//                   <div className="h-max grid gap-4 space-y-2 py-3">
//                     <Button
//                       disabled={isLoading || isCAppDatePickerVisible}
//                       onClick={() => setCalendarOpen(true)}
//                       variant="contained"
//                       size="small"
//                       className="text-center w-fit"
//                     >
//                       {!isLoading ? "Apply" : "Wait Calendar is Loading"}
//                     </Button>
//                   </div>
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Leave Table */}
//           <div className={leaveTableClassName}>
//             <LeaveTable />
//           </div>
//         </div>

//         {/* Right side - Date Picker & Selected Dates */}
//         <div className="col-span-12 lg:col-span-9 bg-gray-50 rounded-md">
//           {/* Render Date Picker */}
//           {isCAppDatePickerVisible ? (
//             <CAppDatePicker
//               data={data}
//               shiftData={shiftData}
//               machinePunchingRecord={machinePunchingRecord}
//               handleUpdateFunction={handleUpdateFunction}
//               selectEvent={selectEvent}
//               setselectEvent={setselectEvent}
//               setCalendarOpen={setCalendarOpen}
//               setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//               selectedLeave={selectedLeave}
//               setSelectedLeave={setSelectedLeave}
//               newAppliedLeaveEvents={newAppliedLeaveEvents}
//               isCalendarOpen={isCalendarOpen}
//               deleteLeaveMutation={deleteLeaveMutation}
//               calLoader={calLoader}
//               setCalLoader={setCalLoader}
//               setIsCAppDatePickerVisible={setIsCAppDatePickerVisible}
//             />
//           ) : (
//             <>
//               <form
//                 onSubmit={handleSubmit}
//                 className="h-max mt-0 space-y-2 bg-white py-3 px-8 shadow-lg rounded-lg"
//               >
//                 <h1 className="text-gray-400 font-semibold text-md">Selected Dates</h1>
//                 <div className="space-y-4">
//                   {newAppliedLeaveEvents.map((item, index) => (
//                     <Mapped
//                       key={index}
//                       setCalendarOpen={setCalendarOpen}
//                       subtractedLeaves={data?.LeaveTypedEdited}
//                       item={item}
//                       index={index}
//                       newAppliedLeaveEvents={newAppliedLeaveEvents}
//                       setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//                     />
//                   ))}
//                   <div className="w-full flex justify-center my-1">
//                     <Button type="submit" variant="contained" className="font-bold">
//                       Apply
//                     </Button>
//                   </div>
//                 </div>
//               </form>

//               <AppDatePicker
//                 data={data}
//                 shiftData={shiftData}
//                 machinePunchingRecord={machinePunchingRecord}
//                 handleUpdateFunction={handleUpdateFunction}
//                 selectEvent={selectEvent}
//                 setselectEvent={setselectEvent}
//                 setCalendarOpen={setCalendarOpen}
//                 setNewAppliedLeaveEvents={setNewAppliedLeaveEvents}
//                 selectedLeave={selectedLeave}
//                 setSelectedLeave={setSelectedLeave}
//                 newAppliedLeaveEvents={newAppliedLeaveEvents}
//                 isCalendarOpen={isCalendarOpen}
//                 deleteLeaveMutation={deleteLeaveMutation}
//                 calLoader={calLoader}
//                 setCalLoader={setCalLoader}
//               />
//             </>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default LeaveRequisition;
