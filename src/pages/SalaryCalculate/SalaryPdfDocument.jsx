// PDFDocument.js
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Image } from "@react-pdf/renderer";
const PDFDocument = ({
  employeeData,
  formattedDate,
  noOfDaysInMonth,
  totalDeduction,
  totalGrossSalary,
  totalNetSalary,
  basicSalary,
  hraSalary,
  daSalary,
  foodAllowance,
  salesAllowance,
  specialAllowance,
  travelAllowance,
  variableAllowance,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View style={styles.header}>
            {/* Left side for organization logo */}
            <View style={styles.logo}>
              <Image
                src={employeeData?.organizationId?.logo_url || ""}
                style={styles.roundedImage}
              />
            </View>

            {/* Right side for organization details */}
            <View style={styles.organizationDetails}>
              {/* Display organization details with labels */}
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, styles.redText]}>
                  Organization Name:
                </Text>
                <Text style={[styles.detailLabel, styles.redText]}>
                  {employeeData?.organizationId?.name || ""}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location:</Text>
                <Text style={styles.textLabel}>
                  {employeeData?.organizationId?.location || ""}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Contact Number:</Text>
                <Text style={styles.textLabel}>
                  {employeeData?.organizationId?.contact_number || ""}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.textLabel}>
                  {employeeData?.organizationId?.email || ""}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.netSalarytable}>
            <View style={styles.netTableRow}>
              <Text style={styles.netcell}>Salary Slip</Text>
              <Text style={styles.netcell}>{formattedDate}</Text>
            </View>
          </View>

          {/* first container for table */}
          <View style={styles.tablesContainer}>
            {/* First Table */}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.cell}>Employee Name:</Text>
                <Text style={styles.cell}>
                  {`${employeeData?.first_name} ${employeeData?.last_name}`}
                </Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.cell}>Designation:</Text>
                <Text style={styles.cell}>
                  {employeeData?.designation[0]?.designationName || ""}
                </Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.cell}>Pan No:</Text>
                <Text style={styles.cell}>
                  {employeeData?.additionalInfo?.["Pan Card Number"] || ""}
                </Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.cell}>Bank Account No :</Text>
                <Text style={styles.cell}>{}</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.cell}>No of Days in Month:</Text>
                <Text style={styles.cell}>{noOfDaysInMonth}</Text>
              </View>
            </View>

            {/* Second Table */}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.cell}>Date Of Joining:</Text>
                <Text style={styles.cell}>
                  {employeeData?.joining_date
                    ? new Date(employeeData.joining_date).toLocaleDateString(
                        "en-GB"
                      )
                    : ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.cell}>Unpaid Leaves:</Text>
                <Text style={styles.cell}>{}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.cell}>Paid Leaves:</Text>
                <Text style={styles.cell}>{}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.cell}> Working Days Attended:</Text>
                <Text style={styles.cell}>{}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.cell}>Public Holidays:</Text>
                <Text style={styles.cell}>{}</Text>
              </View>
            </View>
          </View>

          {/* second container for second table */}
          <View style={styles.tablesContainer}>
            {/* First Table */}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.cell, styles.titleCell]} colSpan={2}>
                  Income
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.cell}>Particulars:</Text>
                <Text style={styles.cell}>Amount</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.cell}>Basic:</Text>
                <Text style={styles.cell}>{basicSalary}</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.cell}>DA:</Text>
                <Text style={styles.cell}>{daSalary}</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.cell}>HRA:</Text>
                <Text style={styles.cell}>{hraSalary}</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.cell}>Food Allowance :</Text>
                <Text style={styles.cell}>{foodAllowance}</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.cell}>Sales Allowance:</Text>
                <Text style={styles.cell}>{salesAllowance}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.cell}>Special Allowance:</Text>
                <Text style={styles.cell}>{specialAllowance}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.cell}>Travel Allowance:</Text>
                <Text style={styles.cell}>{travelAllowance}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.cell}>Variable Pay Allowance:</Text>
                <Text style={styles.cell}>{variableAllowance}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.cell, styles.highlightedCell]}>
                  Total Gross Salary:
                </Text>
                <Text style={[styles.cell, styles.highlightedCell]}>
                  {totalGrossSalary}
                </Text>
              </View>
            </View>

            {/* Second Table */}
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.cell, styles.titleCell]} colSpan={2}>
                  Deductions
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.secondTableCell}>Particulars:</Text>
                <Text style={styles.secondTableCell}>Amount</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.secondTableCell}>Professional Tax:</Text>
                <Text style={styles.secondTableCell}>
                  {employeeData?.deduction || ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.secondTableCell}>Employee PF:</Text>
                <Text style={styles.secondTableCell}>
                  {employeeData?.employee_pf || ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.secondTableCell}>ESIC:</Text>
                <Text style={styles.secondTableCell}>
                  {employeeData?.esic || ""}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.cell, styles.highlightedCell]}>
                  Total Deduction:
                </Text>
                <Text style={[styles.cell, styles.highlightedCell]}>
                  {totalDeduction}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.netSalarytable}>
            <View style={styles.netTableRow}>
              <Text style={[styles.netcell, styles.highlightedCell]}>
                Total Net Salary :
              </Text>
              <Text style={[styles.netcell, styles.highlightedCell]}>
                {totalNetSalary}
              </Text>
            </View>
          </View>

          {/* footer */}
          <View style={styles.header}>
            {/* Left side (blank) */}
            <View style={styles.logo}></View>

            {/* Right side for organization disclaimer */}
            <View style={styles.footerDetails}>
              <Text style={styles.disclaimerText}>
                This is a computer-generated copy; therefore, signature and
                stamp are not required.
                {"\n"}
                For {employeeData?.organizationId?.name || ""}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
    padding: "40px",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  tablesContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Distribute space between tables
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "calc(50% - 5px)", // Adjusted width to accommodate margin
    borderWidth: 1,
    borderColor: "#999", // Adjusted color to be fainter
    borderStyle: "solid",
    borderCollapse: "collapse", // Improved border rendering
    marginRight: 10, // Added margin to create space between tables
  },
  tableRow: {
    flexDirection: "row",
    display: "table-row",
    borderBottomWidth: 0.5, // Adjusted bottom border width
    borderStyle: "solid",
    borderColor: "#999", // Adjusted color to be fainter
  },

  cell: {
    flex: 0.5,
    padding: 4,
    fontSize: 9, // Adjusted font size for the cells
  },
  highlightedCell: {
    backgroundColor: "#FFFF00", // Standard yellow color
  },
  secondTableCell: {
    flex: 0.5,
    padding: 11,
    fontSize: 9,
  },

  netSalarytable: {
    display: "table",
    width: "100%",
    borderWidth: 1,
    borderColor: "#999", // Adjusted color to be fainter
    borderStyle: "solid",
    borderCollapse: "collapse", // Improved border rendering
    marginRight: 10, // Added margin to create space between tables
    marginBottom: 15,
  },
  netTableRow: {
    flexDirection: "row",
    display: "table-row",
    borderBottomWidth: 0.5, // Adjusted bottom border width
    borderStyle: "solid",
    borderColor: "#999", // Adjusted color to be fainter
  },

  netcell: {
    flex: 0.5,
    padding: 4,
    fontSize: 9, // Adjusted font size for the cells
    textAlign: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between", // Align items horizontally
    marginBottom: 20,
  },
  logo: {
    width: 100, // Set the width of the logo
    height: 70, // Set the height of the logo
  },
  roundedImage: {
    width: "100%",
    height: "100%",
    borderRadius: "200%", // Set the border radius for the image
    overflow: "hidden", // Ensure the image stays within the container
  },
  organizationDetails: {
    flex: 1,
    marginLeft: 50,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 5, // Add spacing between each detail row
    alignItems: "center", // Align items vertically in the row
  },
  detailLabel: {
    fontWeight: "bold",
    fontSize: 11,
    marginRight: 5, // Add spacing between label and value
  },
  textLabel: {
    fontSize: 9,
  },
  redText: {
    color: "red",
  },
  disclaimerText: {
    fontSize: 10,
    textAlign: "right",
    fontStyle: "italic",
    color: "#555", // Adjust the color as needed
  },
  footerDetails: {
    flex: 1,
  },
  titleCell: {
    flex: 1,
    padding: 8,
    fontSize: 11,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0", // Adjust background color as desired
  },
});

export default PDFDocument;
