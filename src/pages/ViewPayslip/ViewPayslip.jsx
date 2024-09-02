/* eslint-disable react-hooks/exhaustive-deps */
// import Alert from "@mui/material/Alert";
// import axios from "axios";
// import dayjs from "dayjs";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import React, { useContext, useEffect, useState } from "react";
// import { UseContext } from "../../State/UseState/UseContext";
// import UserProfile from "../../hooks/UserData/useUser";
// const ViewPayslip = () => {
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const employeeId = user._id;
//   const organisationId = user.organizationId;
//   const currentDate = dayjs();
//   const [selectedDate, setSelectedDate] = useState(currentDate);

//   const handleDateChange = (event) => {
//     // Convert the selected date string to a Day.js object
//     setSelectedDate(dayjs(event.target.value));
//   };
//   const monthFromSelectedDate = selectedDate.format("M");
//   const yearFromSelectedDate = selectedDate.format("YYYY");

//   //   get employee information based on organization id and employee id
//   const [employeeInfo, setEmployeeInfo] = useState("");
//   const [organisationInfo, setOrganisationInfo] = useState("");
//   const [salaryInfo, setSalaryInfo] = useState([]);
//   const fetchEmployeeData = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/employeeSalary/viewpayslip/${employeeId}/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log(response);
//       setEmployeeInfo(response.data.employeeInfo);
//       setOrganisationInfo(response.data.organizationInfo);
//       setSalaryInfo(response.data.salaryDetails);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   useEffect(() => {
//     fetchEmployeeData();
//     // eslint-disable-next-line
//   }, []);

//   // Find the salary info based on user-selected month and year
//   const filteredSalaryInfo = salaryInfo.find((info) => {
//     return (
//       info.month === parseInt(monthFromSelectedDate) &&
//       info.year === parseInt(yearFromSelectedDate)
//     );
//   });

//   console.log("filtersalaryinfo", filteredSalaryInfo);

//   // download the pdf
//   const exportPDF = async () => {
//     const input = document.getElementById("App");
//     html2canvas(input, {
//       logging: true,
//       letterRendering: 1,
//       useCORS: true,
//     }).then(async (canvas) => {
//       let img = new Image();
//       console.log(img);
//       img.src = canvas.toDataURL("image/png");
//       img.onload = function () {
//         const pdf = new jsPDF("landscape", "mm", "a4");
//         pdf.addImage(
//           img,
//           0,
//           0,
//           pdf.internal.pageSize.width,
//           pdf.internal.pageSize.height
//         );
//         pdf.save("payslip.pdf");
//       };
//     });
//   };

//   return (
//     <>
//       <div className="container mx-auto p-6 ">
//         <div className="flex items-center justify-center mb-6">
//           <div className="text-center">
//             <h3 className="text-lg font-bold text-gray-700">
//               Please select the month for which you need the Payslip Statement
//             </h3>
//             <input
//               type="month"
//               value={selectedDate.format("YYYY-MM")}
//               onChange={handleDateChange}
//               style={{ width: "500px" }}
//               className="border border-gray-300 rounded-md p-2 mt-2"
//             />
//           </div>
//         </div>
//       </div>

//       <div>
//         {employeeInfo && organisationInfo ? (
//           <>
//             <div id="App">
//               <div className="flex items-center justify-between mb-6">
//                 <img
//                   src={organisationInfo?.logo_url}
//                   alt={organisationInfo?.logo_url}
//                   className="w-20 h-20 rounded-full"
//                 />

//                 <div className="ml-4">
//                   <p className="text-lg font-semibold">
//                     Organisation Name:
//                     <span className="ml-1">
//                       {organisationInfo?.orgName || ""}
//                     </span>
//                   </p>
//                   <p className="text-lg">
//                     Location:
//                     <span className="ml-1">
//                       {organisationInfo?.location?.address || ""}
//                     </span>
//                   </p>
//                   <p className="text-lg">
//                     Contact No:
//                     <span className="ml-1">
//                       {organisationInfo?.contact_number || ""}
//                     </span>
//                   </p>
//                   <p className="text-lg">
//                     Email:
//                     <span className="ml-1">
//                       {organisationInfo?.email || ""}
//                     </span>
//                   </p>
//                 </div>
//               </div>

//               <hr className="mb-6" />
//               {/* 1st table */}
//               <div>
//                 <table class="w-full border border-collapse">
//                   <thead>
//                     <tr class="bg-blue-200">
//                       <th class="px-4 py-2 border">Salary Slip</th>
//                       <th class="border"></th>
//                       <th class="px-4 py-2 border">Month</th>
//                       <th class="px-4 py-2 border">
//                         {filteredSalaryInfo?.formattedDate || ""}
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td class="px-4 py-2 border">Employee Name:</td>
//                       <td class="px-4 py-2 border">
//                         {`${employeeInfo?.first_name} ${employeeInfo?.last_name}`}
//                       </td>
//                       <td class="px-4 py-2 border">Date Of Joining:</td>
//                       <td class="px-4 py-2 border">
//                         {employeeInfo?.joining_date
//                           ? new Date(
//                               employeeInfo.joining_date
//                             ).toLocaleDateString("en-GB")
//                           : ""}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td class="px-4 py-2 border">Designation:</td>
//                       <td class="px-4 py-2 border">
//                         {employeeInfo?.designation &&
//                         employeeInfo?.designation !== null &&
//                         employeeInfo?.designation !== undefined &&
//                         employeeInfo.designation.length > 0
//                           ? employeeInfo.designation[0].designationName
//                           : ""}
//                       </td>
//                       <td class="px-4 py-2 border">Unpaid Leaves:</td>
//                       <td class="px-4 py-2 border">
//                         {" "}
//                         {filteredSalaryInfo?.unPaidLeaveDays ?? "0"}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td class="px-4 py-2 border">Department Name:</td>
//                       <td class="px-4 py-2 border">
//                         {(employeeInfo?.deptname &&
//                           employeeInfo?.deptname !== null &&
//                           employeeInfo?.deptname !== undefined &&
//                           employeeInfo?.deptname.length > 0 &&
//                           employeeInfo?.deptname[0]?.departmentName) ||
//                           ""}
//                       </td>
//                       <td class="px-4 py-2 border">
//                         No of Working Days Attended:
//                       </td>
//                       <td class="px-4 py-2 border">
//                         {filteredSalaryInfo?.noOfDaysEmployeePresent || ""}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td class="px-4 py-2 border">PAN No:</td>
//                       <td class="px-4 py-2 border">
//                         {employeeInfo?.pan_card_number}
//                       </td>
//                       <td class="px-4 py-2 border">Paid Leaves:</td>
//                       <td class="px-4 py-2 border">
//                         {filteredSalaryInfo?.paidLeaveDays ?? "0"}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td class="px-4 py-2 border">Bank Account No:</td>
//                       <td class="px-4 py-2 border">
//                         {employeeInfo?.bank_account_no || ""}
//                       </td>
//                       <td class="px-4 py-2 border">Public Holidays:</td>
//                       <td class="px-4 py-2 border">
//                         {filteredSalaryInfo?.publicHolidaysCount ?? "0"}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td class="px-4 py-2 border"> Employee Id</td>
//                       <td class="px-4 py-2 border">
//                         {employeeInfo?.empId || ""}
//                       </td>
//                       <td class="px-4 py-2 border"> No of Days in Month:</td>
//                       <td class="px-4 py-2 border">
//                         {" "}
//                         {filteredSalaryInfo?.numDaysInMonth ?? "0"}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>

//               {/* 2nd table */}
//               <div>
//                 <table class="w-full border border-collapse">
//                   <thead>
//                     <tr class="bg-blue-200">
//                       <th class="px-4 py-2 border">Income</th>
//                       <th class="border"></th>
//                       <th class="px-4 py-2 border">Deduction</th>
//                       <th class="px-4 py-2 border"></th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td class="px-4 py-2 border">Particulars</td>
//                       <td class="py-2 border">Amount</td>
//                       <td class="py-2 border">Particulars</td>
//                       <td class="py-2 border">Amount</td>
//                     </tr>
//                     {Array.from({
//                       length: Math.max(
//                         (filteredSalaryInfo &&
//                           filteredSalaryInfo?.income?.length) ||
//                           0,
//                         (filteredSalaryInfo &&
//                           filteredSalaryInfo?.deductions?.length) ||
//                           0
//                       ),
//                     }).map((_, index) => {
//                       return (
//                         <tr key={index}>
//                           {/* Income column */}
//                           <td className="px-4 py-2 border">
//                             {filteredSalaryInfo?.income?.[index]?.name || ""}
//                           </td>
//                           <td className="px-4 py-2 border">
//                             {filteredSalaryInfo?.income?.[index]?.value || ""}
//                           </td>
//                           {/* Deduction column */}
//                           <td className="px-4 py-2 border">
//                             {filteredSalaryInfo?.deductions?.[index]?.name ||
//                               ""}
//                           </td>
//                           <td className="px-4 py-2 border">
//                             {filteredSalaryInfo?.deductions?.[index]?.value ||
//                               ""}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>

//               {/* total gross salary and deduction */}
//               <div>
//                 <table class="w-full border border-collapse">
//                   <thead class="border">
//                     <tr class="bg-blue-200 border">
//                       <th class="px-4 py-2 border">Total Gross Salary :</th>
//                       <th class="pl-24 py-2 border">
//                         {" "}
//                         {filteredSalaryInfo?.totalGrossSalary || ""}
//                       </th>
//                       <th class="px-4 py-2 border">Total Deduction :</th>
//                       <th class="px-4 py-2 border">
//                         {" "}
//                         {filteredSalaryInfo?.totalDeduction || ""}
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody class="border"></tbody>
//                 </table>
//               </div>

//               {/* total net salary */}
//               <div>
//                 <table class="w-full mt-10 border ">
//                   <thead>
//                     <tr class="bg-blue-200">
//                       <th class="px-4 py-2 ">Total Net Salary</th>
//                       <th></th>
//                       <th class="px-4 py-2">
//                         {filteredSalaryInfo?.totalNetSalary || ""}
//                       </th>
//                       <th class="px-4 py-2"></th>
//                     </tr>
//                   </thead>
//                   <tbody></tbody>
//                 </table>
//               </div>
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//               }}
//             >
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   margin: "20px",
//                 }}
//               >
//                 <button
//                   onClick={() => exportPDF()}
//                   class="px-4 py-2 rounded bg-blue-500 text-white border-none text-base cursor-pointer"
//                 >
//                   Download PDF
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="mt-1">
//             <div>
//               <img
//                 src="/payslip.svg"
//                 style={{ height: "600px", marginLeft: "25%" }}
//                 alt="none"
//               />
//             </div>
//             <div>
//               <Alert
//                 severity="error"
//                 sx={{
//                   width: "100%",
//                   maxWidth: "500px",
//                   marginLeft: "35%",
//                   display: "flex",
//                   justifyContent: "center",
//                 }}
//               >
//                 "Please select the month for which you need the payslip
//                 statement."
//               </Alert>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ViewPayslip;

// ✅

// import Alert from "@mui/material/Alert";
// import axios from "axios";
// import dayjs from "dayjs";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import React, { useContext, useEffect, useState } from "react";
// import { UseContext } from "../../State/UseState/UseContext";
// import UserProfile from "../../hooks/UserData/useUser";
// import { CircularProgress, Tooltip, Modal, Box } from "@mui/material";
// import { useMediaQuery } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faDownload } from "@fortawesome/free-solid-svg-icons";

// const formatAddress = (address) => {
//   if (!address) return "";

//   const words = address.split(" ");
//   let formattedAddress = "";
//   for (let i = 0; i < words.length; i++) {
//     formattedAddress += words[i] + " ";
//     if ((i + 1) % 6 === 0 && i !== words.length - 1) {
//       formattedAddress += "\n";
//     }
//   }

//   return formattedAddress.trim();
// };

// const ViewPayslip = () => {
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const employeeId = user._id;
//   const organisationId = user.organizationId;
//   const currentDate = dayjs();
//   const [selectedDate, setSelectedDate] = useState(currentDate);
//   const [employeeInfo, setEmployeeInfo] = useState("");
//   const [organisationInfo, setOrganisationInfo] = useState("");
//   const [salaryInfo, setSalaryInfo] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [open, setOpen] = useState(false);
//   const [modalContent, setModalContent] = useState("");

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   const handleDateChange = (event) => {
//     setSelectedDate(dayjs(event.target.value));
//   };

//   const monthFromSelectedDate = selectedDate.format("M");
//   const yearFromSelectedDate = selectedDate.format("YYYY");

//   const fetchEmployeeData = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/employeeSalary/viewpayslip/${employeeId}/${organisationId}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//         // responsivness add into Table , annual salary calculations part remaining  in Table
//       );
//       setEmployeeInfo(response.data.employeeInfo);
//       setOrganisationInfo(response.data.organizationInfo);
//       setSalaryInfo(response.data.salaryDetails);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmployeeData();
//   }, []);

//   const pulseAnimation = {
//     animation: "pulse 1.5s infinite",
//   };
//   const filteredSalaryInfo = salaryInfo.find((info) => {
//     return (
//       info.month === parseInt(monthFromSelectedDate) &&
//       info.year === parseInt(yearFromSelectedDate)
//     );
//   });
//   console.log("filtersalaryinfo", filteredSalaryInfo);

//   const exportPDF = async () => {
//     const input = document.getElementById("App");
//     html2canvas(input, {
//       logging: true,
//       letterRendering: 1,
//       useCORS: true,
//     }).then(async (canvas) => {
//       let img = new Image();
//       img.src = canvas.toDataURL("image/png");
//       img.onload = function () {
//         const pdf = new jsPDF("landscape", "mm", "a4");
//         pdf.addImage(
//           img,
//           0,
//           0,
//           pdf.internal.pageSize.width,
//           pdf.internal.pageSize.height
//         );
//         pdf.save("payslip.pdf");
//       };
//     });
//   };

//   // eslint-disable-next-line no-unused-vars
//   const handleOpenModal = (content) => {
//     setModalContent(content);
//     setOpen(true);
//   };

//   const handleCloseModal = () => setOpen(false);

//   return (
//     <>
//       {/* Upper part */}
//       <div className="container mx-auto p-6">
//         <div className="flex items-center justify-center mb-6">
//           <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 w-full max-w-md">
//             <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">
//               Select the month for your Payslip Statement
//             </h3>
//             <input
//               type="month"
//               value={selectedDate.format("YYYY-MM")}
//               onChange={handleDateChange}
//               className="border border-gray-300 rounded-lg p-3 text-gray-700 w-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
//               placeholder="Select Month"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Bottom part */}
//       <div className="container mx-auto p-4 !bg-white">
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <CircularProgress />
//           </div>
//         ) : employeeInfo && organisationInfo ? (
//           // main
//           <div className="!bg-white shadow-lg rounded-lg p-6 border border-gray-300">
//             <div id="App" className="p-7">
//               <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-6 border-b pb-4">
//                 <img
//                   src={organisationInfo?.logo_url}
//                   alt={organisationInfo?.orgName}
//                   className="w-24 h-24 rounded-full border border-gray-300 shadow-md"
//                 />
//                 {/* <div className="mt-4 md:mt-0 md:ml-4 text-center md:text-left">
//                   <p className="text-xl font-semibold text-gray-800">
//                     Organisation:{" "}
//                     <span className="font-normal">
//                       {organisationInfo?.orgName}
//                     </span>
//                   </p>
//                   <p className="text-lg text-gray-600">
//                     Address:{" "}
//                     <span className="font-normal">
//                       {organisationInfo?.location?.address}
//                     </span>
//                   </p>
//                   <p className="text-lg text-gray-600">
//                     Contact No:{" "}
//                     <span className="font-normal">
//                       {organisationInfo?.contact_number}
//                     </span>
//                   </p>
//                   <p className="text-lg text-gray-600">
//                     Email:{" "}
//                     <span className="font-normal">
//                       {organisationInfo?.email}
//                     </span>
//                   </p>
//                 </div> */}
//                 <div className="mt-4 md:mt-0 md:ml-4 text-center md:text-left">
//                   <p className="text-xl font-semibold text-gray-800">
//                     Organisation:{" "}
//                     <span className="font-normal">
//                       {organisationInfo?.orgName}
//                     </span>
//                   </p>
//                   <p className="text-lg text-gray-600 whitespace-pre-wrap">
//                     Address:{" "}
//                     <span className="font-normal">
//                       {formatAddress(organisationInfo?.location?.address)}
//                     </span>
//                   </p>
//                   <p className="text-lg text-gray-600">
//                     Contact No:{" "}
//                     <span className="font-normal">
//                       {organisationInfo?.contact_number}
//                     </span>
//                   </p>
//                   <p className="text-lg text-gray-600">
//                     Email:{" "}
//                     <span className="font-normal">
//                       {organisationInfo?.email}
//                     </span>
//                   </p>
//                 </div>
//               </div>

//               {/* First Table */}
//               <div className="mb-6 overflow-x-auto">
//                 <div className=" m-1  flex justify-center items-center h-full">
//                   <h1 className="text-center text-gray-700 font-extrabold text-2xl font-mono py-2 pb-2">
//                     Salary Slip
//                   </h1>
//                 </div>

//                 <table className="w-full border border-gray-300 border-collapse">
//                   <thead className="bg-blue-100 text-gray-800">
//                     <tr>
//                       <th colSpan={2} className="px-4 py-2 border">
//                         Employee Details
//                       </th>
//                       {/* <th className="border"></th> */}
//                       <th colSpan={2} className="px-4 py-2 border">
//                         Month:
//                         {/* <th className="px-4 py-2 border"> */}
//                         <span className="pl-1">
//                           {" "}
//                           {filteredSalaryInfo?.formattedDate || ""}
//                         </span>
//                       </th>
//                       {/* <th className="px-4 py-2 border"></th> */}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td className="px-4 py-2 border text-gray-700 font-bold ">
//                         Employee Name:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700 font-bold">
//                         {`${employeeInfo?.first_name} ${employeeInfo?.last_name}`}
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         Date Of Joining:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.joining_date
//                           ? new Date(
//                               employeeInfo.joining_date
//                             ).toLocaleDateString("en-GB")
//                           : ""}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="px-4 py-2 border text-gray-700">
//                         Employee Id:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.empId || ""}
//                       </td>
//                       {/* <td className="px-4 py-2 border text-gray-700">
//                         Designation:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.designation?.[0]?.designationName || ""}
//                       </td> */}

//                       {/* <td className="px-4 py-2 border text-gray-700">
//                         Unpaid Leaves:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.unPaidLeaveDays ?? "0"}
//                       </td> */}
//                       <td className="px-4 py-2 border text-gray-700">
//                         No of Days in Month:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.numDaysInMonth ?? "0"}
//                       </td>
//                     </tr>
//                     <tr>
//                       {/* 3 */}
//                       <td className="px-4 py-2 border text-gray-700">
//                         Designation:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.designation?.[0]?.designationName || ""}
//                       </td>

//                       <td className="px-4 py-2 border text-gray-700">
//                         Unpaid Leaves:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.unPaidLeaveDays ?? "0"}
//                       </td>
//                     </tr>

//                     <tr>
//                       {/* 4 */}
//                       <td className="px-4 py-2 border text-gray-700">
//                         Department Name:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.deptname?.[0]?.departmentName || ""}
//                       </td>
//                       {/* 5 */}
//                       {/* <td className="px-4 py-2 border text-gray-700">
//                         PAN No:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.pan_card_number}
//                       </td>
//                        */}

//                       <td className="px-4 py-2 border text-gray-700">
//                         No of Working Days Attended:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.noOfDaysEmployeePresent || ""}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="px-4 py-2 border text-gray-700">
//                         Bank Account No:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.bank_account_no || ""}
//                       </td>

//                       <td className="px-4 py-2 border text-gray-700">
//                         Paid Leaves:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.paidLeaveDays ?? "0"}
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="px-4 py-2 border text-gray-700">
//                         PAN No:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {employeeInfo?.pan_card_number}
//                       </td>

//                       <td className="px-4 py-2 border text-gray-700">
//                         Public Holidays:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.publicHolidaysCount ?? "0"}
//                       </td>

//                       {/* <td className="px-4 py-2 border text-gray-700">
//                         Unpaid Leaves:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.unPaidLeaveDays ?? "0"}
//                       </td> */}
//                     </tr>
//                     <tr>
//                       <td className="px-4 py-2 border text-gray-700">
//                         Aadhar No:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {/* {employeeInfo?.empId || ""} */} NA
//                       </td>

//                       <td className="px-4 py-2 border text-gray-700">PF No:</td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {/* {filteredSalaryInfo?.unPaidLeaveDays ?? "0"} */} NA
//                       </td>
//                     </tr>
//                     <tr>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {/* Aadhar No: */}-
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {/* {employeeInfo?.empId || ""} */} -
//                       </td>

//                       <td className="px-4 py-2 border text-gray-700">
//                         ESIC No:
//                       </td>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {/* {filteredSalaryInfo?.unPaidLeaveDays ?? "0"} */} NA
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>

//               {/* Income and Deduction Table */}
//               <div className="mb-6 overflow-x-auto">
//                 <table className="w-full border border-gray-300 border-collapse">
//                   <thead className="bg-gray-300 text-gray-800">
//                     <tr>
//                       {/* Monthly */}
//                       <th colSpan={2} className=" px-4 py-2 border">
//                         Monthly Salary
//                       </th>
//                       <th colSpan={2} className="px-4 py-2 border">
//                         Annual Salary
//                       </th>
//                       {/* Yearly */}
//                       {/* <th className=" px-4 py-2 border">Income</th>
//                       <th className="px-4 py-2 border">Deduction</th> */}
//                     </tr>
//                   </thead>
//                   <thead className="bg-gray-50 text-gray-800">
//                     <tr>
//                       {/* Monthly */}
//                       <th className=" px-4 py-2 border border-gray-300">
//                         Income
//                       </th>
//                       <th className="px-4 py-2 border border-gray-300">
//                         Deduction
//                       </th>

//                       {/* Yearly */}
//                       <th className=" px-4 py-2 border">Income</th>
//                       <th className="px-4 py-2 border">Deduction</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     <tr>
//                       <td className="px-4 py-2 border text-gray-700">
//                         {" "}
//                         Particulars{" "}
//                       </td>
//                       <td className="py-2 border text-gray-700">Amount</td>
//                       <td className="py-2 border text-gray-700">Particulars</td>
//                       <td className="py-2 border text-gray-700">Amount</td>
//                     </tr>

//                     {Array.from({
//                       length: Math.max(
//                         filteredSalaryInfo?.income?.length || 0,
//                         filteredSalaryInfo?.deductions?.length || 0
//                       ),
//                     }).map((_, index) => (
//                       <tr key={index}>
//                         <td className="px-4 py-2 border text-gray-700">
//                           {filteredSalaryInfo?.income?.[index]?.name || ""}
//                         </td>
//                         <td className="px-4 py-2 border text-gray-700">
//                           {filteredSalaryInfo?.income?.[index]?.value || ""}
//                         </td>
//                         <td className="px-4 py-2 border text-gray-700">
//                           {filteredSalaryInfo?.deductions?.[index]?.name || ""}
//                         </td>
//                         <td className="px-4 py-2 border text-gray-700">
//                           {filteredSalaryInfo?.deductions?.[index]?.value || ""}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* updated */}
//               <div className="mb-6 overflow-x-auto">
//                 <table className="w-full border border-gray-300 border-collapse">
//                   <thead className=" text-gray-800">
//                     <tr>
//                       <th
//                         colSpan="4"
//                         className="px-4 py-2 border border-gray-300 bg-blue-100  text-gray-800 p-2"
//                       >
//                         Monthly Salary
//                       </th>
//                       <th
//                         colSpan="4"
//                         className="px-4 py-2 border border-gray-300 bg-blue-100  text-gray-800 p-2"
//                       >
//                         Annual Salary
//                       </th>
//                     </tr>
//                     <tr className="bg-gray-50 text-gray-800">
//                       <th
//                         colSpan="2"
//                         className="border border-gray-300 text-gray-800  bg-gray-50 p-2"
//                       >
//                         Income
//                       </th>
//                       <th
//                         colSpan="2"
//                         className="border border-gray-300 text-gray-800  bg-gray-50 p-2"
//                       >
//                         Deduction
//                       </th>
//                       <th
//                         colSpan="2"
//                         className="border border-gray-300 text-gray-800  bg-gray-50 p-2"
//                       >
//                         Income
//                       </th>
//                       <th
//                         colSpan="2"
//                         className="border border-gray-300 text-gray-800  bg-gray-50 p-2"
//                       >
//                         Deduction
//                       </th>
//                     </tr>
//                     <tr>
//                       <th className="border border-gray-300 text-gray-900 p-2">
//                         Particular
//                       </th>
//                       <th className="border border-gray-300 text-gray-900 p-2">
//                         Amount
//                       </th>
//                       <th className="border border-gray-300 text-gray-900 p-2">
//                         Particular
//                       </th>
//                       <th className="border border-gray-300  text-gray-900 p-2">
//                         Amount
//                       </th>
//                       <th
//                         colSpan={2}
//                         className="border border-gray-300  text-gray-900 p-2"
//                       >
//                         Particular
//                       </th>
//                       <th
//                         colSpan={2}
//                         className="border border-gray-300  text-gray-900 p-2"
//                       >
//                         Amount
//                       </th>

                    
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {Array.from({
//                       length: Math.max(
//                         filteredSalaryInfo?.income?.length || 0,
//                         filteredSalaryInfo?.deductions?.length || 0,
//                         filteredSalaryInfo?.income?.length || 0,
//                         filteredSalaryInfo?.deductions?.length || 0
//                       ),
//                     }).map((_, index) => (
//                       <tr key={index}>
//                         <td className="border border-gray-300 px-4 py-2">
//                           {filteredSalaryInfo?.income?.[index]?.name || ""}
//                         </td>
//                         <td className="border border-gray-300 px-4 py-2">
//                           {filteredSalaryInfo?.income?.[index]?.value || ""}
//                         </td>
//                         <td className="border border-gray-300 px-4 py-2">
//                           {filteredSalaryInfo?.deductions?.[index]?.name || ""}
//                         </td>
//                         <td className="border border-gray-300 px-4 py-2">
//                           {filteredSalaryInfo?.deductions?.[index]?.value || ""}
//                         </td>
//                         <td
//                           colSpan={2}
//                           className="border border-gray-300 px-4 py-2"
//                         >
//                           {" "}
//                           a
//                           {/* {filteredSalaryInfo?.income?.[index]?.name || ""} */}
//                         </td>
//                         <td
//                           colSpan={2}
//                           className="border border-gray-300 px-4 py-2"
//                         >
//                           b
//                           {/* {filteredSalaryInfo?.income?.[index]?.value || ""} */}
//                         </td>
//                         {/* /if needed then add */}
//                         {/* <td className="border border-gray-300 px-4 py-2"> */}
//                         {/* {filteredSalaryInfo?.deductions?.[index]?.name || ""} */}
//                         {/* </td> */}
//                         {/* <td className="border border-gray-300 px-4 py-2"> */}
//                         {/* {filteredSalaryInfo?.deductions?.[index]?.value || ""} */}
//                         {/* </td> */}
//                       </tr>
//                     ))}

//                     <br />
//                     {/* Total */}
//                     <tr className="bg-gray-300 text-gray-800 border border-gray-700 ">
//                       <td
//                         colSpan="1"
//                         className=" px-4 py-2 border border-gray-400"
//                       >
//                         Total Gross Salary:
//                       </td>
//                       <td
//                         colSpan="1"
//                         className="px-4 py-2 border border-gray-400 text-gray-700"
//                       >
//                         {filteredSalaryInfo?.totalGrossSalary || ""}
//                       </td>
//                       <td
//                         colSpan="1"
//                         className="px-4 py-2 border border-gray-400"
//                       >
//                         Total Deduction:
//                       </td>
//                       <td
//                         colSpan="1"
//                         className="px-4 py-2 border border-gray-400 text-gray-700"
//                       >
//                         {filteredSalaryInfo?.totalDeduction || ""}
//                       </td>

//                       {/* annual ka */}

//                       <td
//                         colSpan="1"
//                         className=" px-4 py-2  border border-gray-400"
//                       >
//                         Total Earnings:
//                       </td>
//                       <td
//                         colSpan="1"
//                         className="px-4 py-2  border border-gray-400 text-gray-700 "
//                       >
//                         {/* {filteredSalaryInfo?.totalGrossSalary || ""} */}
//                       </td>
//                       <td
//                         colSpan="1"
//                         className="px-4 py-2  border border-gray-400"
//                       >
//                         Total Deduction:
//                       </td>
//                       <td
//                         colSpan="1"
//                         className="px-4 py-2  border border-gray-400 text-gray-700"
//                       >
//                         {/* {filteredSalaryInfo?.totalDeduction || ""} */}
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>

//               {/* Totals */}
//               {/* <div className="mb-6 overflow-x-auto">
//                 <table className="w-full border border-gray-300 border-collapse">
//                   <thead className="bg-blue-100 text-gray-800">
//                     <tr>
//                       <td   className=" px-4 py-2 border">Total Gross Salary:</td>
//                       <td  className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.totalGrossSalary || ""}
//                       </td>
//                       <td   className="px-4 py-2 border">Total Deduction:</td>
//                       <td   className="px-4 py-2 border text-gray-700">
//                         {filteredSalaryInfo?.totalDeduction || ""}
//                       </td>
//                     </tr>

                    
//                   </thead>
//                 </table>
//               </div> */}

//               {/* Newly added */}

//               <div className="mb-6 overflow-x-auto">
//                 <table className="w-full mt-6 border border-gray-300 border-collapse">
//                   <thead className=" text-gray-800">
//                     <tr className="bg-blue-100">
//                       <th className=" border">Day's in Months</th>
//                       <th className=" border">Arres Days</th>
//                       <th className=" border">LOPR Days</th>
//                       <th className=" border">Worked Days</th>
//                       <th className=" border">Net Day's Worked</th>
//                     </tr>
//                     <tr className="border border-gray-300">
//                       <td className="px-4 py-2  text-gray-700 text-center  border border-gray-300">
//                         {filteredSalaryInfo?.numDaysInMonth ?? "0"}
//                       </td>
//                       <td className="px-4 py-2  text-gray-700 text-center  border border-gray-300 ">
//                         -
//                       </td>
//                       <td className="px-4 py-2  text-gray-700 text-center  border border-gray-300 ">
//                         {filteredSalaryInfo?.unPaidLeaveDays ?? "0"}
//                       </td>

//                       <td className="px-4 py-2  text-gray-700 text-center  border border-gray-300 ">
//                         {filteredSalaryInfo?.noOfDaysEmployeePresent || ""}
//                       </td>
//                       <td className="px-4 py-2  text-gray-700 text-center border border-gray-300  ">
//                         -
//                       </td>
//                     </tr>
//                   </thead>
//                 </table>
//               </div>

//               <div className="mb-6 overflow-x-auto">
//                 <table className="w-full mt-6 border border-gray-300 border-collapse">
//                   <thead className="bg-gray-300 text-gray-800">
//                     <tr>
//                       <th className="  px-4 py-2 border border-gray-300">
//                         Total Net Salary
//                       </th>

//                       <th className="px-4 py-2 border border-gray-300 text-gray-700">
//                         {filteredSalaryInfo?.totalNetSalary || ""}
//                       </th>
//                     </tr>
//                   </thead>
//                 </table>

//                 <div className="p-4">
//                   <h1 className="text-lg md:text-lg lg:text-lg xl:text-lg 2xl:text-lg font-semibold leading-tight text-center">
//                     This is computer generated copy hence signature and stamp
//                     not required For   <span>
//                       {organisationInfo?.orgName}
//                     </span>
//                   </h1>
//                 </div>
//               </div>
//             </div>

//             {/* Download Button */}
//             <div className="flex justify-center mt-6">
//               <Tooltip title="Download your payslip as a PDF" arrow>
//                 <button
//                   onClick={exportPDF}
//                   className="relative px-6 py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold shadow-md hover:bg-blue-700 transition duration-200 flex items-center justify-center"
//                   // className="px-6 py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold shadow-md hover:bg-blue-700 transition duration-200"
//                 >
//                   {/* Download PDF */}

//                   <span className="mr-2">Download PDF</span>
//                   <FontAwesomeIcon
//                     icon={faDownload}
//                     style={pulseAnimation}
//                     className="w-5 h-5"
//                   />
//                 </button>
//               </Tooltip>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center mt-12">
//             <img
//               src="/payslip.svg"
//               style={{ height: "400px", marginBottom: "20px" }}
//               alt="No payslip available"
//             />
//             <Alert
//               severity="error"
//               sx={{
//                 width: "100%",
//                 maxWidth: "600px",
//                 textAlign: "center",
//               }}
//             >
//               Please select the month for which you need the payslip statement.
//             </Alert>
//           </div>
//         )}
//       </div>

//       {/* Modal for additional information */}
//       <Modal
//         open={open}
//         onClose={handleCloseModal}
//         aria-labelledby="modal-title"
//         aria-describedby="modal-description"
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             width: isMobile ? "90%" : "60%",
//             bgcolor: "background.paper",
//             border: "2px solid #000",
//             boxShadow: 24,
//             p: 4,
//             borderRadius: 2,
//           }}
//         >
//           <h2 id="modal-title" className="text-xl font-semibold mb-4">
//             {modalContent.title}
//           </h2>
//           <p id="modal-description">{modalContent.description}</p>
//         </Box>
//       </Modal>
//     </>
//   );
// };

// export default ViewPayslip;


//✔



import Alert from "@mui/material/Alert";
import axios from "axios";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import React, { useContext, useEffect, useState } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import UserProfile from "../../hooks/UserData/useUser";
import { CircularProgress, Tooltip, Modal, Box } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const formatAddress = (address) => {
  if (!address) return "";

  const words = address.split(" ");
  let formattedAddress = "";
  for (let i = 0; i < words.length; i++) {
    formattedAddress += words[i] + " ";
    if ((i + 1) % 6 === 0 && i !== words.length - 1) {
      formattedAddress += "\n";
    }
  }

  return formattedAddress.trim();
};

const ViewPayslip = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user._id;
  const organisationId = user.organizationId;
  const currentDate = dayjs();
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [employeeInfo, setEmployeeInfo] = useState("");
  const [organisationInfo, setOrganisationInfo] = useState("");
  const [salaryInfo, setSalaryInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDateChange = (event) => {
    setSelectedDate(dayjs(event.target.value));
  };

  const monthFromSelectedDate = selectedDate.format("M");
  const yearFromSelectedDate = selectedDate.format("YYYY");

  const fetchEmployeeData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employeeSalary/viewpayslip/${employeeId}/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
        // responsivness add into Table , annual salary calculations part remaining  in Table
      );
      setEmployeeInfo(response.data.employeeInfo);
      setOrganisationInfo(response.data.organizationInfo);
      setSalaryInfo(response.data.salaryDetails);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const pulseAnimation = {
    animation: "pulse 1.5s infinite",
  };
  const filteredSalaryInfo = salaryInfo.find((info) => {
    return (
      info.month === parseInt(monthFromSelectedDate) &&
      info.year === parseInt(yearFromSelectedDate)
    );
  });
  console.log("filtersalaryinfo", filteredSalaryInfo);

  const exportPDF = async () => {
    const input = document.getElementById("App");
    html2canvas(input, {
      logging: true,
      letterRendering: 1,
      useCORS: true,
    }).then(async (canvas) => {
      let img = new Image();
      img.src = canvas.toDataURL("image/png");
      img.onload = function () {
        const pdf = new jsPDF("landscape", "mm", "a4");
        pdf.addImage(
          img,
          0,
          0,
          pdf.internal.pageSize.width,
          pdf.internal.pageSize.height
        );
        pdf.save("payslip.pdf");
      };
    });
  };

  // eslint-disable-next-line no-unused-vars
  const handleOpenModal = (content) => {
    setModalContent(content);
    setOpen(true);
  };

  const handleCloseModal = () => setOpen(false);

  return (
    <>
      {/* Upper part */}
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">
              Select the month for your Payslip Statement
            </h3>
            <input
              type="month"
              value={selectedDate.format("YYYY-MM")}
              onChange={handleDateChange}
              className="border border-gray-300 rounded-lg p-3 text-gray-700 w-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              placeholder="Select Month"
            />
          </div>
        </div>
      </div>

      {/* Bottom part */} 
    {/* adding width req,then */}
      <div className="container mx-auto p-4 !bg-white  w-4/5 max-w-full">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : employeeInfo && organisationInfo ? (
          // main
          <div className="!bg-white shadow-lg rounded-lg p-6 border border-gray-300">
            <div id="App" className="p-7">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between mb-6 border-b pb-4">
                <img
                  src={organisationInfo?.logo_url}
                  alt={organisationInfo?.orgName}
                  className="w-24 h-24 rounded-full border border-gray-300 shadow-md"
                />
                {/* <div className="mt-4 md:mt-0 md:ml-4 text-center md:text-left">
                  <p className="text-xl font-semibold text-gray-800">
                    Organisation:{" "}
                    <span className="font-normal">
                      {organisationInfo?.orgName}
                    </span>
                  </p>
                  <p className="text-lg text-gray-600">
                    Address:{" "}
                    <span className="font-normal">
                      {organisationInfo?.location?.address}
                    </span>
                  </p>
                  <p className="text-lg text-gray-600">
                    Contact No:{" "}
                    <span className="font-normal">
                      {organisationInfo?.contact_number}
                    </span>
                  </p>
                  <p className="text-lg text-gray-600">
                    Email:{" "}
                    <span className="font-normal">
                      {organisationInfo?.email}
                    </span>
                  </p>
                </div> */}
                <div className="mt-4 md:mt-0 md:ml-4 text-center md:text-left">
                  <p className="text-xl font-semibold text-gray-800">
                    Organisation:{" "}
                    <span className="font-normal">
                      {organisationInfo?.orgName}
                    </span>
                  </p>
                  <p className="text-lg text-gray-600 whitespace-pre-wrap">
                    Address:{" "}
                    <span className="font-normal">
                      {formatAddress(organisationInfo?.location?.address)}
                    </span>
                  </p>
                  <p className="text-lg text-gray-600">
                    Contact No:{" "}
                    <span className="font-normal">
                      {organisationInfo?.contact_number}
                    </span>
                  </p>
                  <p className="text-lg text-gray-600">
                    Email:{" "}
                    <span className="font-normal">
                      {organisationInfo?.email}
                    </span>
                  </p>
                </div>
              </div>

              {/* First Table */}
              <div className="mb-6 overflow-x-auto">
                <div className=" m-1  flex justify-center items-center h-full">
                  <h1 className="text-center text-gray-700 font-extrabold text-2xl font-mono py-2 pb-2">
                    Salary Slip
                  </h1>
                </div>

                <table className="w-full border border-gray-300 border-collapse">
                  <thead className="bg-blue-100 text-gray-800">
                    <tr>
                      <th colSpan={2} className="px-4 py-2 border">
                        Employee Details
                      </th>
                      {/* <th className="border"></th> */}
                      <th colSpan={2} className="px-4 py-2 border">
                        Month:
                        {/* <th className="px-4 py-2 border"> */}
                        <span className="pl-1">
                          {" "}
                          {filteredSalaryInfo?.formattedDate || ""}
                        </span>
                      </th>
                      {/* <th className="px-4 py-2 border"></th> */}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border text-gray-700 font-bold ">
                        Employee Name:
                      </td>
                      <td className="px-4 py-2 border text-gray-700 font-bold">
                        {`${employeeInfo?.first_name} ${employeeInfo?.last_name}`}
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        Date Of Joining:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {employeeInfo?.joining_date
                          ? new Date(
                              employeeInfo.joining_date
                            ).toLocaleDateString("en-GB")
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-gray-700">
                        Employee Id:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {employeeInfo?.empId || ""}
                      </td>
                      {/* <td className="px-4 py-2 border text-gray-700">
                        Designation:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {employeeInfo?.designation?.[0]?.designationName || ""}
                      </td> */}

                      {/* <td className="px-4 py-2 border text-gray-700">
                        Unpaid Leaves:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.unPaidLeaveDays ?? "0"}
                      </td> */}
                      <td className="px-4 py-2 border text-gray-700">
                        No of Days in Month:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.numDaysInMonth ?? "0"}
                      </td>
                    </tr>
                    <tr>
                      {/* 3 */}
                      <td className="px-4 py-2 border text-gray-700">
                        Designation:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {employeeInfo?.designation?.[0]?.designationName || ""}
                      </td>

                      <td className="px-4 py-2 border text-gray-700">
                        Unpaid Leaves:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.unPaidLeaveDays ?? "0"}
                      </td>
                    </tr>

                    <tr>
                      {/* 4 */}
                      <td className="px-4 py-2 border text-gray-700">
                        Department Name:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {employeeInfo?.deptname?.[0]?.departmentName || ""}
                      </td>
                      {/* 5 */}
                      {/* <td className="px-4 py-2 border text-gray-700">
                        PAN No:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {employeeInfo?.pan_card_number}
                      </td>
                       */}

                      <td className="px-4 py-2 border text-gray-700">
                        No of Working Days Attended:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.noOfDaysEmployeePresent || ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-gray-700">
                        Bank Account No:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {employeeInfo?.bank_account_no || ""}
                      </td>

                      <td className="px-4 py-2 border text-gray-700">
                        Paid Leaves:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.paidLeaveDays ?? "0"}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-gray-700">
                        PAN No:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {employeeInfo?.pan_card_number}
                      </td>

                      <td className="px-4 py-2 border text-gray-700">
                        Public Holidays:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.publicHolidaysCount ?? "0"}
                      </td>

                      {/* <td className="px-4 py-2 border text-gray-700">
                        Unpaid Leaves:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.unPaidLeaveDays ?? "0"}
                      </td> */}
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-gray-700">
                        Aadhar No:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {/* {employeeInfo?.empId || ""} */} NA
                      </td>

                      <td className="px-4 py-2 border text-gray-700">PF No:</td>
                      <td className="px-4 py-2 border text-gray-700">
                        {/* {filteredSalaryInfo?.unPaidLeaveDays ?? "0"} */} NA
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border text-gray-700">
                        {/* Aadhar No: */}-
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {/* {employeeInfo?.empId || ""} */} -
                      </td>

                      <td className="px-4 py-2 border text-gray-700">
                        ESIC No:
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {/* {filteredSalaryInfo?.unPaidLeaveDays ?? "0"} */} NA
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Income and Deduction Table */}
              <div className="mb-6 overflow-x-auto">
                <table className="w-full border border-gray-300 border-collapse">
                  <thead className="bg-gray-300 text-gray-800">
                    <tr>
                      {/* Monthly */}
                      <th colSpan={2} className=" px-4 py-2 border">
                        Monthly Salary
                      </th>
                      <th colSpan={2} className="px-4 py-2 border">
                        Annual Salary
                      </th>
                      {/* Yearly */}
                      {/* <th className=" px-4 py-2 border">Income</th>
                      <th className="px-4 py-2 border">Deduction</th> */}
                    </tr>
                  </thead>
                  <thead className="bg-gray-50 text-gray-800">
                    <tr>
                      {/* Monthly */}
                      <th className=" px-4 py-2 border border-gray-300">
                        Income
                      </th>
                      <th className="px-4 py-2 border border-gray-300">
                        Deduction
                      </th>

                      {/* Yearly */}
                      <th className=" px-4 py-2 border">Income</th>
                      <th className="px-4 py-2 border">Deduction</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border text-gray-700">
                        {" "}
                        Particulars{" "}
                      </td>
                      <td className="py-2 border text-gray-700">Amount</td>
                      <td className="py-2 border text-gray-700">Particulars</td>
                      <td className="py-2 border text-gray-700">Amount</td>
                    </tr>

                    {Array.from({
                      length: Math.max(
                        filteredSalaryInfo?.income?.length || 0,
                        filteredSalaryInfo?.deductions?.length || 0
                      ),
                    }).map((_, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border text-gray-700">
                          {filteredSalaryInfo?.income?.[index]?.name || ""}
                        </td>
                        <td className="px-4 py-2 border text-gray-700">
                          {filteredSalaryInfo?.income?.[index]?.value || ""}
                        </td>
                        <td className="px-4 py-2 border text-gray-700">
                          {filteredSalaryInfo?.deductions?.[index]?.name || ""}
                        </td>
                        <td className="px-4 py-2 border text-gray-700">
                          {filteredSalaryInfo?.deductions?.[index]?.value || ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* updated */}
              <div className="mb-6 overflow-x-auto">
                <table className="w-full border border-gray-300 border-collapse">
                  <thead className=" text-gray-800">
                    <tr>
                      <th
                        colSpan="4"
                        className="px-4 py-2 border border-gray-300 bg-blue-100  text-gray-800 p-2"
                      >
                        Monthly Salary
                      </th>
                      <th
                        colSpan="4"
                        className="px-4 py-2 border border-gray-300 bg-blue-100  text-gray-800 p-2"
                      >
                        Annual Salary
                      </th>
                    </tr>
                    <tr className="bg-gray-50 text-gray-800">
                      <th
                        colSpan="2"
                        className="border border-gray-300 text-gray-800  bg-gray-50 p-2"
                      >
                        Income
                      </th>
                      <th
                        colSpan="2"
                        className="border border-gray-300 text-gray-800  bg-gray-50 p-2"
                      >
                        Deduction
                      </th>
                      <th
                        colSpan="2"
                        className="border border-gray-300 text-gray-800  bg-gray-50 p-2"
                      >
                        Income
                      </th>
                      <th
                        colSpan="2"
                        className="border border-gray-300 text-gray-800  bg-gray-50 p-2"
                      >
                        Deduction
                      </th>
                    </tr>
                    <tr>
                      <th className="border border-gray-300 text-gray-900 p-2">
                        Particular
                      </th>
                      <th className="border border-gray-300 text-gray-900 p-2">
                        Amount
                      </th>
                      <th className="border border-gray-300 text-gray-900 p-2">
                        Particular
                      </th>
                      <th className="border border-gray-300  text-gray-900 p-2">
                        Amount
                      </th>
                      <th
                        colSpan={2}
                        className="border border-gray-300  text-gray-900 p-2"
                      >
                        Particular
                      </th>
                      <th
                        colSpan={2}
                        className="border border-gray-300  text-gray-900 p-2"
                      >
                        Amount
                      </th>

                    
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({
                      length: Math.max(
                        filteredSalaryInfo?.income?.length || 0,
                        filteredSalaryInfo?.deductions?.length || 0,
                        filteredSalaryInfo?.income?.length || 0,
                        filteredSalaryInfo?.deductions?.length || 0
                      ),
                    }).map((_, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">
                          {filteredSalaryInfo?.income?.[index]?.name || ""}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {filteredSalaryInfo?.income?.[index]?.value || ""}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {filteredSalaryInfo?.deductions?.[index]?.name || ""}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {filteredSalaryInfo?.deductions?.[index]?.value || ""}
                        </td>
                        <td
                          colSpan={2}
                          className="border border-gray-300 px-4 py-2"
                        >
                          {" "}
                          a
                          {/* {filteredSalaryInfo?.income?.[index]?.name || ""} */}
                        </td>
                        <td
                          colSpan={2}
                          className="border border-gray-300 px-4 py-2"
                        >
                          b
                          {/* {filteredSalaryInfo?.income?.[index]?.value || ""} */}
                        </td>
                        {/* /if needed then add */}
                        {/* <td className="border border-gray-300 px-4 py-2"> */}
                        {/* {filteredSalaryInfo?.deductions?.[index]?.name || ""} */}
                        {/* </td> */}
                        {/* <td className="border border-gray-300 px-4 py-2"> */}
                        {/* {filteredSalaryInfo?.deductions?.[index]?.value || ""} */}
                        {/* </td> */}
                      </tr>
                    ))}

                    <br />
                    {/* Total */}
                    <tr className="bg-gray-300 text-gray-800 border border-gray-700 ">
                      <td
                        colSpan="1"
                        className=" px-4 py-2 border border-gray-400"
                      >
                        Total Gross Salary:
                      </td>
                      <td
                        colSpan="1"
                        className="px-4 py-2 border border-gray-400 text-gray-700"
                      >
                        {filteredSalaryInfo?.totalGrossSalary || ""}
                      </td>
                      <td
                        colSpan="1"
                        className="px-4 py-2 border border-gray-400"
                      >
                        Total Deduction:
                      </td>
                      <td
                        colSpan="1"
                        className="px-4 py-2 border border-gray-400 text-gray-700"
                      >
                        {filteredSalaryInfo?.totalDeduction || ""}
                      </td>

                      {/* annual ka */}

                      <td
                        colSpan="1"
                        className=" px-4 py-2  border border-gray-400"
                      >
                        Total Earnings:
                      </td>
                      <td
                        colSpan="1"
                        className="px-4 py-2  border border-gray-400 text-gray-700 "
                      >
                        {/* {filteredSalaryInfo?.totalGrossSalary || ""} */}
                      </td>
                      <td
                        colSpan="1"
                        className="px-4 py-2  border border-gray-400"
                      >
                        Total Deduction:
                      </td>
                      <td
                        colSpan="1"
                        className="px-4 py-2  border border-gray-400 text-gray-700"
                      >
                        {/* {filteredSalaryInfo?.totalDeduction || ""} */}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              {/* <div className="mb-6 overflow-x-auto">
                <table className="w-full border border-gray-300 border-collapse">
                  <thead className="bg-blue-100 text-gray-800">
                    <tr>
                      <td   className=" px-4 py-2 border">Total Gross Salary:</td>
                      <td  className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.totalGrossSalary || ""}
                      </td>
                      <td   className="px-4 py-2 border">Total Deduction:</td>
                      <td   className="px-4 py-2 border text-gray-700">
                        {filteredSalaryInfo?.totalDeduction || ""}
                      </td>
                    </tr>

                    
                  </thead>
                </table>
              </div> */}

              {/* Newly added */}

              <div className="mb-6 overflow-x-auto">
                <table className="w-full mt-6 border border-gray-300 border-collapse">
                  <thead className=" text-gray-800">
                    <tr className="bg-blue-100">
                      <th className=" border">Day's in Months</th>
                      <th className=" border">Arres Days</th>
                      <th className=" border">LOPR Days</th>
                      <th className=" border">Worked Days</th>
                      <th className=" border">Net Day's Worked</th>
                    </tr>
                    <tr className="border border-gray-300">
                      <td className="px-4 py-2  text-gray-700 text-center  border border-gray-300">
                        {filteredSalaryInfo?.numDaysInMonth ?? "0"}
                      </td>
                      <td className="px-4 py-2  text-gray-700 text-center  border border-gray-300 ">
                        -
                      </td>
                      <td className="px-4 py-2  text-gray-700 text-center  border border-gray-300 ">
                        {filteredSalaryInfo?.unPaidLeaveDays ?? "0"}
                      </td>

                      <td className="px-4 py-2  text-gray-700 text-center  border border-gray-300 ">
                        {filteredSalaryInfo?.noOfDaysEmployeePresent || ""}
                      </td>
                      <td className="px-4 py-2  text-gray-700 text-center border border-gray-300  ">
                        -
                      </td>
                    </tr>
                  </thead>
                </table>
              </div>

              <div className="mb-6 overflow-x-auto">
                <table className="w-full mt-6 border border-gray-300 border-collapse">
                  <thead className="bg-gray-300 text-gray-800">
                    <tr>
                      <th className="  px-4 py-2 border border-gray-300">
                        Total Net Salary
                      </th>

                      <th className="px-4 py-2 border border-gray-300 text-gray-700">
                        {filteredSalaryInfo?.totalNetSalary || ""}
                      </th>
                    </tr>
                  </thead>
                </table>

                <div className="p-4">
                  <h1 className="text-lg md:text-lg lg:text-lg xl:text-lg 2xl:text-lg font-semibold leading-tight text-center">
                    This is computer generated copy hence signature and stamp
                    not required For   <span>
                      {organisationInfo?.orgName}
                    </span>
                  </h1>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="flex justify-center mt-4">
              <Tooltip title="Download your payslip as a PDF" arrow>
                <button
                  onClick={exportPDF}
                  className="relative px-6 py-2 rounded-lg bg-blue-600 text-white text-lg font-semibold shadow-md hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                  // className="px-6 py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold shadow-md hover:bg-blue-700 transition duration-200"
                >
                  {/* Download PDF */}

                  <span className="mr-2">Download PDF</span>
                  <FontAwesomeIcon
                    icon={faDownload}
                    style={pulseAnimation}
                    className="w-5 h-5"
                  />
                </button>
              </Tooltip>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center mt-12">
            <img
              src="/payslip.svg"
              style={{ height: "400px", marginBottom: "20px" }}
              alt="No payslip available"
            />
            <Alert
              severity="error"
              sx={{
                width: "100%",
                maxWidth: "600px",
                textAlign: "center",
              }}
            >
              Please select the month for which you need the payslip statement.
            </Alert>
          </div>
        )}
      </div>

      {/* Modal for additional information */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90%" : "60%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2 id="modal-title" className="text-xl font-semibold mb-4">
            {modalContent.title}
          </h2>
          <p id="modal-description">{modalContent.description}</p>
        </Box>
      </Modal>
    </>
  );
};

export default ViewPayslip;

