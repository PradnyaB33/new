// // PDFDocument.js
// import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
// import React from "react";
// // import { Image } from "@react-pdf/renderer";
// const PaySlipPdf = ({ employeeInfo, organisationInfo, salaryInfo }) => {
//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.section}>
//           <View style={styles.header}>
//             {/* Left side for organization logo */}
//             <View style={styles.logo}>
//               {/* <Image
//                 src={organisationInfo?.logo_url || ""}
//                 style={styles.roundedImage}
//               /> */}
//             </View>

//             {/* Right side for organization details */}
//             <View style={styles.organizationDetails}>
//               {/* Display organization details with labels */}
//               <View style={styles.detailRow}>
//                 <Text style={[styles.detailLabel, styles.redText]}>
//                   Organization Name:
//                 </Text>
//                 <Text style={[styles.detailLabel, styles.redText]}>
//                   {organisationInfo?.name || ""}
//                 </Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Location:</Text>
//                 <Text style={styles.textLabel}>
//                   {organisationInfo?.location || ""}
//                 </Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Contact Number:</Text>
//                 <Text style={styles.textLabel}>
//                   {organisationInfo?.contact_number || ""}
//                 </Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={styles.detailLabel}>Email:</Text>
//                 <Text style={styles.textLabel}>
//                   {organisationInfo?.email || ""}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           <View style={styles.netSalarytable}>
//             <View style={styles.netTableRow}>
//               <Text style={styles.netcell}>Salary Slip</Text>
//               <Text style={styles.netcell}>
//                 {salaryInfo?.formattedDate || ""}
//               </Text>
//             </View>
//           </View>

//           {/* first container for table */}
//           <View style={styles.tablesContainer}>
//             {/* First Table */}
//             <View style={styles.table}>
//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Employee Name:</Text>
//                 <Text style={styles.cell}>
//                   {`${employeeInfo?.first_name} ${employeeInfo?.last_name}`}
//                 </Text>
//               </View>

//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Designation:</Text>
//                 <Text style={styles.cell}>
//                   {employeeInfo?.designation[0]?.designationName || ""}
//                 </Text>
//               </View>

//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Department Name:</Text>
//                 <Text style={styles.cell}>
//                   {employeeInfo?.deptname[0]?.departmentName || ""}
//                 </Text>
//               </View>

//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Pan No:</Text>
//                 <Text style={styles.cell}>
//                   {employeeInfo?.additionalInfo?.["Pan Card Number"] || ""}
//                 </Text>
//               </View>

//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Bank Account No :</Text>
//                 <Text style={styles.cell}>
//                   {employeeInfo?.bank_account_no || ""}
//                 </Text>
//               </View>

//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>No of Days in Month:</Text>
//                 <Text style={styles.cell}>
//                   {salaryInfo?.numDaysInMonth || ""}
//                 </Text>
//               </View>
//             </View>

//             {/* Second Table */}
//             <View style={styles.table}>
//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Date Of Joining:</Text>
//                 <Text style={styles.cell}>
//                   {employeeInfo?.joining_date
//                     ? new Date(employeeInfo.joining_date).toLocaleDateString(
//                         "en-GB"
//                       )
//                     : ""}
//                 </Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Unpaid Leaves:</Text>
//                 <Text style={styles.cell}>{salaryInfo?.unPaidLeaveDays}</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Paid Leaves:</Text>
//                 <Text style={styles.cell}>{salaryInfo?.paidLeaveDays}</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}> Working Days Attended:</Text>
//                 <Text style={styles.cell}>
//                   {salaryInfo?.noOfDaysEmployeePresent || ""}
//                 </Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Public Holidays:</Text>
//                 <Text style={styles.cell}>
//                   {salaryInfo?.publicHolidaysCount || ""}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* second container for second table */}
//           <View style={styles.tablesContainer}>
//             {/* First Table */}
//             <View style={styles.table}>
//               <View style={styles.tableRow}>
//                 <Text style={[styles.cell, styles.titleCell]} colSpan={2}>
//                   Income
//                 </Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Particulars:</Text>
//                 <Text style={styles.cell}>Amount</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Basic:</Text>
//                 <Text style={styles.cell}>{salaryInfo?.basicSalary || ""}</Text>
//               </View>

//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>DA:</Text>
//                 <Text style={styles.cell}>{salaryInfo?.daSalary || ""}</Text>
//               </View>

//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>HRA:</Text>
//                 <Text style={styles.cell}>{salaryInfo?.hraSalary || ""}</Text>
//               </View>

//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Food Allowance :</Text>
//                 <Text style={styles.cell}>
//                   {salaryInfo?.foodAllowance || ""}
//                 </Text>
//               </View>

//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Sales Allowance:</Text>
//                 <Text style={styles.cell}>
//                   {salaryInfo?.salesAllowance || ""}
//                 </Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Special Allowance:</Text>
//                 <Text style={styles.cell}>
//                   {salaryInfo?.specialAllowance || ""}
//                 </Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Travel Allowance:</Text>
//                 <Text style={styles.cell}>
//                   {salaryInfo?.travelAllowance || ""}
//                 </Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.cell}>Variable Pay Allowance:</Text>
//                 <Text style={styles.cell}>
//                   {salaryInfo?.variableAllowance || ""}
//                 </Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.netcell}>Total Gross Salary:</Text>
//                 <Text style={styles.netcell}>
//                   {salaryInfo?.totalGrossSalary || ""}
//                 </Text>
//               </View>
//             </View>

//             {/* Second Table */}
//             <View style={styles.table}>
//               <View style={styles.tableRow}>
//                 <Text style={[styles.cell, styles.titleCell]} colSpan={2}>
//                   Deductions
//                 </Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.secondTableCell}>Particulars:</Text>
//                 <Text style={styles.secondTableCell}>Amount</Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.secondTableCell}>Professional Tax:</Text>
//                 <Text style={styles.secondTableCell}>
//                   {employeeInfo?.deduction || ""}
//                 </Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.secondTableCell}>Employee PF:</Text>
//                 <Text style={styles.secondTableCell}>
//                   {employeeInfo?.employee_pf || ""}
//                 </Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.secondTableCell}>ESIC:</Text>
//                 <Text style={styles.secondTableCell}>
//                   {employeeInfo?.esic || ""}
//                 </Text>
//               </View>
//               <View style={styles.tableRow}>
//                 <Text style={styles.netcell}>Total Deduction:</Text>
//                 <Text style={styles.netcell}>
//                   {salaryInfo?.totalDeduction || ""}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           <View style={styles.netSalarytable}>
//             <View style={styles.netTableRow}>
//               <Text style={styles.netcell}>Total Net Salary :</Text>
//               <Text style={styles.netcell}>
//                 {salaryInfo?.totalNetSalary || ""}
//               </Text>
//             </View>
//           </View>

//           {/* footer */}
//           <View style={styles.header}>
//             {/* Left side (blank) */}
//             <View style={styles.logo}></View>

//             {/* Right side for organization disclaimer */}
//             <View style={styles.footerDetails}>
//               <Text style={styles.disclaimerText}>
//                 This is a computer-generated copy; therefore, signature and
//                 stamp are not required.
//                 {"\n"}
//                 For {organisationInfo?.name || ""}
//               </Text>
//             </View>
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// };

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: "row",
//     backgroundColor: "#E4E4E4",
//     padding: "40px",
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1,
//   },
//   tablesContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   table: {
//     display: "table",
//     width: "calc(50% - 5px)",
//     borderWidth: 1,
//     borderColor: "#999",
//     borderStyle: "solid",
//     borderCollapse: "collapse",
//     marginRight: 10,
//   },
//   tableRow: {
//     flexDirection: "row",
//     display: "table-row",
//     borderBottomWidth: 0.5,
//     borderStyle: "solid",
//     borderColor: "#999",
//   },

//   cell: {
//     flex: 0.5,
//     padding: 4,
//     fontSize: 9,
//   },

//   secondTableCell: {
//     flex: 0.5,
//     padding: 11,
//     fontSize: 9,
//   },

//   netSalarytable: {
//     display: "table",
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#999",
//     borderStyle: "solid",
//     borderCollapse: "collapse",
//     marginRight: 10,
//     marginBottom: 15,
//   },
//   netTableRow: {
//     flexDirection: "row",
//     display: "table-row",
//     borderBottomWidth: 0.5,
//     borderStyle: "solid",
//     borderColor: "#999",
//   },

//   netcell: {
//     flex: 0.5,
//     padding: 4,
//     fontSize: 9,
//     textAlign: "center",
//   },

//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   logo: {
//     width: 100,
//     height: 70,
//   },
//   roundedImage: {
//     width: "100%",
//     height: "100%",
//     // borderRadius: "200%",
//     overflow: "hidden",
//   },
//   organizationDetails: {
//     flex: 1,
//     marginLeft: 50,
//   },
//   detailRow: {
//     flexDirection: "row",
//     marginBottom: 5,
//     alignItems: "center",
//   },
//   detailLabel: {
//     fontWeight: "bold",
//     fontSize: 11,
//     marginRight: 5,
//   },
//   textLabel: {
//     fontSize: 9,
//   },
//   redText: {
//     color: "red",
//   },
//   disclaimerText: {
//     fontSize: 10,
//     textAlign: "right",
//     fontStyle: "italic",
//     color: "#555",
//   },
//   footerDetails: {
//     flex: 1,
//   },
//   titleCell: {
//     flex: 1,
//     padding: 8,
//     fontSize: 11,
//     fontWeight: "bold",
//     backgroundColor: "#f0f0f0",
//   },
// });

// export default PaySlipPdf;
