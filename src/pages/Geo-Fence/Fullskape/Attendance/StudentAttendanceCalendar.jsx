
// import React, { useState } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import CircularProgress from "@mui/material/CircularProgress";
// import Backdrop from "@mui/material/Backdrop";
// import ReusableModal from "../../../../components/Modal/component";
// import * as XLSX from "xlsx"; // Import xlsx library

// const localizer = momentLocalizer(moment);

// const StudentAttendanceCalendar = ({ studentData, punches }) => {
//   const [selectedPunch, setSelectedPunch] = useState(null);
//   const [loading] = useState(false);

//   // Group punches into pairs (in and out)
//   const groupedPunches = [];
//   for (let i = 0; i < punches.length; i += 2) {
//     if (i + 1 < punches.length) {
//       groupedPunches.push({
//         title: `Punch ${groupedPunches.length + 1}`,
//         start: new Date(punches[i].timestamp),
//         end: new Date(punches[i + 1].timestamp),
//         punchIn: punches[i],
//         punchOut: punches[i + 1],
//       });
//     } else {
//       groupedPunches.push({
//         title: `Punch ${groupedPunches.length + 1}`,
//         start: new Date(punches[i].timestamp),
//         end: new Date(punches[i].timestamp), // Use the same time for lack of Punch Out
//         punchIn: punches[i],
//         punchOut: null, // No Punch Out available
//       });
//     }
//   }

//   // Custom Event Renderer
//   const CustomEvent = ({ event }) => {
//     return (
//       <div className="flex space-x-2">
//         <div
//           style={{
//             width: "20px",
//             height: "20px",
//             borderRadius: "50%",
//             backgroundColor: "#4caf50",
//             color: "white",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             fontSize: "12px",
//             cursor: "pointer",
//           }}
//           title={`Punch In: ${moment(event.punchIn.timestamp).format("hh:mm A")}`}
//         >
//           P
//         </div>
//         {event.punchOut && (
//           <div
//             style={{
//               width: "20px",
//               height: "20px",
//               borderRadius: "50%",
//               backgroundColor: "#f44336",
//               color: "white",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               fontSize: "12px",
//               cursor: "pointer",
//             }}
//             title={`Punch Out: ${moment(event.punchOut.timestamp).format("hh:mm A")}`}
//           >
//             O
//           </div>
//         )}
//       </div>
//     );
//   };

//   const handleSelectEvent = (event) => {
//     setSelectedPunch(event);
//   };

//   const handleCloseModal = () => {
//     setSelectedPunch(null);
//   };

//   const exportToExcel = () => {
//     // Get the current month
//     const currentMonth = moment().month();
  
//     // Filter punches for the current month
//     const monthlyPunches = groupedPunches.filter((punch) =>
//       moment(punch.start).month() === currentMonth
//     );
  
//     // Prepare the data for Excel
//     const excelData = [];
  
//     // Add Student Details at the top
//     excelData.push(
//       ["Student Name", studentData.name],
//       ["Class", studentData.class],
//       ["Division", studentData.division],
//       ["PRN", studentData.id],
//       [],
//       ["Sr. No", "Date", "Punch In", "Punch Out"]
//     );
  
//     // Add Grouped Punches
//     monthlyPunches.forEach((punch, index) => {
//       excelData.push([
//         index + 1,
//         moment(punch.start).format("YYYY-MM-DD"),
//         moment(punch.punchIn.timestamp).format("hh:mm A"),
//         punch.punchOut
//           ? moment(punch.punchOut.timestamp).format("hh:mm A")
//           : "Unavailable",
//       ]);
//     });
  
//     // Create a worksheet and workbook
//     const worksheet = XLSX.utils.aoa_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Attendance");
  
//     // Export the file
//     XLSX.writeFile(workbook, `Attendance_${moment().format("MMMM_YYYY")}.xlsx`);
//   };
  
//   return (
//     <div className="relative">
//       {loading && (
//         <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center z-50 bg-opacity-50 bg-gray-800">
//           <Backdrop open={true}>
//             <CircularProgress />
//           </Backdrop>
//         </div>
//       )}

//       <div className="z-10">
//         <Calendar
//           localizer={localizer}
//           events={groupedPunches}
//           startAccessor="start"
//           endAccessor="end"
//           className="rbc-calendar"
//           style={{
//             height: "500px",
//             maxHeight: "480px",
//             overflowY: "hidden",
//             width: "100%",
//           }}
//           views={["month"]}
//           defaultDate={new Date()}
//           onSelectEvent={handleSelectEvent}
//           toolbar
//           components={{
//             event: CustomEvent,
//           }}
//         />
//         <div className="mt-4">
//           <button
//             className="px-4 py-2 bg-green-500 text-white rounded"
//             onClick={exportToExcel}
//           >
//             Export This Month's Data to Excel
//           </button>
//         </div>
//       </div>

//       {/* Modal for Punch Details */}
//       {selectedPunch && (
//         <ReusableModal
//           open={!!selectedPunch}
//           onClose={handleCloseModal}
//           heading={`Punch Details for ${moment(selectedPunch.start).format("MMMM Do YYYY")}`}
//         >
//           <div className="space-y-4">
//             <h2 className="text-lg font-bold">
//               {studentData.name} ({studentData.class})
//             </h2>
//             <p>
//               <strong>Punch In:</strong>{" "}
//               {moment(selectedPunch.punchIn.timestamp).format("hh:mm A")}
//             </p>
//             <p>
//               <strong>Punch Out:</strong>{" "}
//               {selectedPunch.punchOut
//                 ? moment(selectedPunch.punchOut.timestamp).format("hh:mm A")
//                 : "Unavailable"}
//             </p>
//           </div>
//           <button
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
//             onClick={handleCloseModal}
//           >
//             Close
//           </button>
//         </ReusableModal>
//       )}
//     </div>
//   );
// };

// export default StudentAttendanceCalendar;

import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import ReusableModal from "../../../../components/Modal/component";
import * as XLSX from "xlsx"; // Import xlsx library

const localizer = momentLocalizer(moment);

const StudentAttendanceCalendar = ({ studentData, punches }) => {
  const [selectedPunch, setSelectedPunch] = useState(null);
  const [loading] = useState(false);
  const [activeMonth, setActiveMonth] = useState(new Date()); // Tracks the selected month

  // Group punches into pairs (in and out)
  const groupedPunches = [];
  for (let i = 0; i < punches.length; i += 2) {
    if (i + 1 < punches.length) {
      groupedPunches.push({
        title: `Punch ${groupedPunches.length + 1}`,
        start: new Date(punches[i].timestamp),
        end: new Date(punches[i + 1].timestamp),
        punchIn: punches[i],
        punchOut: punches[i + 1],
      });
    } else {
      groupedPunches.push({
        title: `Punch ${groupedPunches.length + 1}`,
        start: new Date(punches[i].timestamp),
        end: new Date(punches[i].timestamp), // Use the same time for lack of Punch Out
        punchIn: punches[i],
        punchOut: null, // No Punch Out available
      });
    }
  }

  // Custom Event Renderer
  const CustomEvent = ({ event }) => {
    return (
      <div className="flex space-x-2">
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "#4caf50",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "12px",
            cursor: "pointer",
          }}
          title={`Punch In: ${moment(event.punchIn.timestamp).format("hh:mm A")}`}
        >
          P
        </div>
        {event.punchOut && (
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#f44336",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "12px",
              cursor: "pointer",
            }}
            title={`Punch Out: ${moment(event.punchOut.timestamp).format("hh:mm A")}`}
          >
            O
          </div>
        )}
      </div>
    );
  };

  const handleSelectEvent = (event) => {
    setSelectedPunch(event);
  };

  const handleCloseModal = () => {
    setSelectedPunch(null);
  };

  const exportToExcel = () => {
    // Get the active month
    const activeMonthStart = moment(activeMonth).startOf("month");
    const activeMonthEnd = moment(activeMonth).endOf("month");

    // Filter punches for the active month
    const monthlyPunches = groupedPunches.filter((punch) =>
      moment(punch.start).isBetween(activeMonthStart, activeMonthEnd, null, "[]")
    );

    // Prepare the data for Excel
    const excelData = [];

    // Add Student Details at the top
    excelData.push(
      ["Student Name", studentData.name],
      ["Class", studentData.class],
      ["Division", studentData.division],
      ["PRN", studentData.id],
      [],
      ["Sr. No", "Date", "Punch In", "Punch Out"]
    );

    // Add Grouped Punches
    monthlyPunches.forEach((punch, index) => {
      excelData.push([
        index + 1,
        moment(punch.start).format("YYYY-MM-DD"),
        moment(punch.punchIn.timestamp).format("hh:mm A"),
        punch.punchOut
          ? moment(punch.punchOut.timestamp).format("hh:mm A")
          : "Unavailable",
      ]);
    });

    // Create a worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Attendance");

    // Export the file
    XLSX.writeFile(
      workbook,
      `Attendance_${moment(activeMonth).format("MMMM_YYYY")}.xlsx`
    );
  };

  return (
    <div className="relative">
      {loading && (
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center z-50 bg-opacity-50 bg-gray-800">
          <Backdrop open={true}>
            <CircularProgress />
          </Backdrop>
        </div>
      )}

      <div className="z-10">
        <Calendar
          localizer={localizer}
          events={groupedPunches}
          startAccessor="start"
          endAccessor="end"
          className="rbc-calendar"
          style={{
            height: "500px",
            maxHeight: "480px",
            overflowY: "hidden",
            width: "100%",
          }}
          views={["month"]}
          defaultDate={new Date()}
          onNavigate={(date) => setActiveMonth(date)} // Update the active month on navigation
          onSelectEvent={handleSelectEvent}
          toolbar
          components={{
            event: CustomEvent,
          }}
        />
        <div className="mt-4 flex justify-end">
        <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={exportToExcel}
        >
            Export This Month's Data to Excel
        </button>
        
        </div>
      </div>

      {/* Modal for Punch Details */}
      {selectedPunch && (
        <ReusableModal
          open={!!selectedPunch}
          onClose={handleCloseModal}
          heading={`Punch Details for ${moment(selectedPunch.start).format("MMMM Do YYYY")}`}
        >
          <div className="space-y-4">
            <h2 className="text-lg font-bold">
              {studentData.name} ({studentData.class})
            </h2>
            <p>
              <strong>Punch In:</strong>{" "}
              {moment(selectedPunch.punchIn.timestamp).format("hh:mm A")}
            </p>
            <p>
              <strong>Punch Out:</strong>{" "}
              {selectedPunch.punchOut
                ? moment(selectedPunch.punchOut.timestamp).format("hh:mm A")
                : "Unavailable"}
            </p>
          </div>
          
        </ReusableModal>
      )}
    </div>
  );
};

export default StudentAttendanceCalendar;
