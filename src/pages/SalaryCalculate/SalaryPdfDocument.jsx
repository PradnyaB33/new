// PDFDocument.js
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const PDFDocument = ({ employeeData, formattedDate }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>{`${employeeData?.first_name} ${employeeData?.last_name}`}</Text>
          <Text>{`Month: ${formattedDate}`}</Text>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Employee Name:</Text>
            <Text
              style={styles.tableCell}
            >{`${employeeData?.first_name} ${employeeData?.last_name}`}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Employee Name:</Text>
            <Text
              style={styles.tableCell}
            >{`${employeeData?.first_name} ${employeeData?.last_name}`}</Text>
          </View>
          {/* Other details in a similar format */}
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
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    alignItems: "center",
    padding: 5,
  },
  tableCell: {
    margin: "5px",
    fontSize: "12px",
  },
});

export default PDFDocument;
