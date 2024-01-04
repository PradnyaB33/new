import React, { useContext } from "react";
import UserProfile from "../../hooks/UserData/useUser";
import { useState, useEffect } from "react";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PaySlipPdf from "./PaySlipPdf";
const ViewPayslip = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user._id;
  const organisationId = user.organizationId;
  const [employeeInfo, setEmployeeInfo] = useState("");
  const [organisationInfo, setOrganisationInfo] = useState("");
  const [salaryInfo, setSalaryInfo] = useState([]);
  const [generatePdf, setGeneratePdf] = useState(false);

  //   get employee information based on organization id and employee id
  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employeeSalary/viewpayslip/${employeeId}/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setEmployeeInfo(response.data.employeeInfo);
      setOrganisationInfo(response.data.organizationInfo);
      setSalaryInfo(response.data.salaryDetails);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Employee Data");
    }
  };
  useEffect(() => {
    fetchEmployeeData();
    // eslint-disable-next-line
  }, []);
  console.log(employeeInfo);
  const handleGeneratePDF = () => {
    setGeneratePdf(true);
  };

  console.log(organisationInfo);

  return (
    <>
      <section className="min-h-screen flex w-full">
        <div className="!w-[30%]  lg:flex hidden text-white flex-col items-center justify-center h-screen relative">
          <div className="bg__gradient  absolute inset-0 "></div>
          <ul class="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>

        <div style={{ marginTop: "20%", marginLeft: "20%" }}>
          <button
            onClick={handleGeneratePDF}
            style={{
              padding: "10px 20px",
              borderRadius: "5px",
              backgroundColor: "#008CBA",
              color: "#fff",
              border: "none",
              fontSize: "1em",
              cursor: "pointer",
            }}
          >
            Generate PDF
          </button>
          {/* Conditionally render the PDFDownloadLink */}
          {generatePdf && employeeInfo && (
            <PDFDownloadLink
              document={
                <PaySlipPdf
                  employeeInfo={employeeInfo}
                  organisationInfo={organisationInfo}
                  salaryInfo={salaryInfo}
                />
              }
              fileName="payslip.pdf"
            >
              {({ loading }) =>
                loading ? "Generating PDF..." : "Download PDF"
              }
            </PDFDownloadLink>
          )}
        </div>
      </section>
    </>
  );
};

export default ViewPayslip;
