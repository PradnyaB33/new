import { CalendarMonth } from "@mui/icons-material";
import { Badge, Button, Skeleton } from "@mui/material";
import React, { useContext } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "tailwindcss/tailwind.css";
import AppDatePicker from "../../components/date-picker/date-picker";
import HeaderBackComponent from "../../components/header/component";
import useLeaveData from "../../hooks/Leave/useLeaveData";
import LeaveTable from "./components/LeaveTabel";
import Mapped from "./components/mapped-form";
import { useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import { useParams } from "react-router";
 
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
 
  //for  Get Query to get department
  const { data: machinePunchingRecord } = useQuery(
    ["machinePunching", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/availableRecords`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data[0].availableRecords;
    }
  );
 
  return (
    <>
      <section className="">
        <HeaderBackComponent
          heading={"Attendance & Leave Management"}
          oneLineInfo={
            "Track your attendance and submit your leave requests here for timely approval and efficient management "
          }
        />
        <div className="flex flex-col-reverse md:flex-row w-full justify-start p-6 gap-4">
          <div className="flex flex-col gap-4">
            <LeaveTable />
          </div>
 
          <article className="md:w-[100%] space-y-2">
            {isLoading ? (
              <div className="space-y-2 mb-4 w-full h-max bg-white p-4 shadow-xl rounded-lg">
                <div className="flex items-center gap-8 px-2">
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
                      <CalendarMonth className="!text-4xl text-gr" />
                    </Button>
                  </Badge>
                  <div>
                    <Skeleton variant="text" width={160} height={20} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 mb-4 w-full h-max bg-white p-4 shadow-xl rounded-lg ">
                <div className="flex items-center gap-8 px-2">
                  <Badge badgeContent={"Click"} color="primary">
                    <Button
                      disabled={isLoading}
                      onClick={handleInputChange}
                      variant="contained"
                      size="large"
                      className="!rounded-full !h-16 !w-16 group-hover:!text-white !text-black"
                      color="info"
                    >
                      <CalendarMonth className=" !text-4xl" />
                    </Button>
                  </Badge>
                  <p className="!text-gray-400 font-semibold mb-2 text-xl">
                    Select Date
                  </p>
                </div>
              </div>
            )}
 
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
 
            {newAppliedLeaveEvents.length > 0 &&
              Array.isArray(newAppliedLeaveEvents) ? (
              <>
                <form
                  onSubmit={handleSubmit}
                  className="h-max !mt-4 space-y-2 bg-white py-3 px-8 shadow-lg rounded-lg"
                >
                  <h1 className="text-gray-400 font-semibold mb-4 text-md">
                    Selected Dates
                  </h1>
                  <div className="flex flex-col gap-4">
                    {newAppliedLeaveEvents?.map((item, index) => (
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
                    <div className="w-full m-auto flex justify-center my-4">
                      <Button
                        type="submit"
                        variant="contained"
                        className="font-bold m-auto w-fit"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="w-full h-max grid justify-center relative gap-4 !mt-4 space-y-2 py-3 px-8">
                  <Button
                    disabled={isLoading}
                    onClick={() => setCalendarOpen(true)}
                    variant="contained"
                    size="large"
                    className="text-center w-fit !m-auto"
                  >
                    {" "}
                    {!isLoading ? "Apply" : "Wait Calendar is Loading"}
                  </Button>
                </div>
              </>
            )}
          </article>
        </div>
      </section>
    </>
  );
};
 
export default LeaveRequisition;



// //// ✅✅💹💹
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

//             {/* Calendar & Actions */}
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
//                 <div className="flex items-center">
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



