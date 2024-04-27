import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { TestContext } from "../../State/Function/Main";
const LoanMgtApproval = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { loanId } = useParams();
  const { handleAlert } = useContext(TestContext);
  const navigate = useNavigate();

  //for get loan data
  const { data: getEmployeeLoanInfo } = useQuery(
    ["empLoanInfo", loanId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/loans/${loanId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );

  console.log(getEmployeeLoanInfo);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };

  const handleApproval = async (status) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/accept/reject/loans/${loanId}`,
        {
          action: status === "ongoing" ? "ongoing" : "reject",
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);

      // Display appropriate alert message based on action
      if (status === "ongoing") {
        handleAlert(
          true,
          "success",
          `Approved the request for loan application of ${getEmployeeLoanInfo?.userId?.first_name}`
        );
      } else {
        handleAlert(
          true,
          "error",
          `Rejected the request for loan application of ${getEmployeeLoanInfo?.userId?.first_name}`
        );
      }
      navigate("/pendingLoan");
    } catch (error) {
      console.error("Error adding salary data:", error);
      handleAlert(true, "error", "Something went wrong");
    }
  };
  return (
    <>
      <div className="mx-auto mt-20">
        <Card
          variant="outlined"
          sx={{ width: "100%", maxWidth: "50%", marginLeft: "25%" }}
        >
          <Box sx={{ p: 2 }}>
            <Typography gutterBottom variant="h5" component="div">
              {getEmployeeLoanInfo?.userId?.first_name || ""}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {getEmployeeLoanInfo?.userId?.first_name || ""} has raised a
              request for loan application
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
          <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Loan Type
              </Typography>
              <Typography gutterBottom component="div">
                {getEmployeeLoanInfo?.loanType?.loanName || ""}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Loan Amount
              </Typography>
              <Typography gutterBottom component="div">
                {getEmployeeLoanInfo?.loanAmount || ""}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Rate Of Interest (%)
              </Typography>
              <Typography gutterBottom component="div">
                {getEmployeeLoanInfo?.rateOfIntereset || ""}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Loan Disbursement Date
              </Typography>
              <Typography gutterBottom component="div">
                {formatDate(getEmployeeLoanInfo?.loanDisbursementDate) || ""}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                Loan Completed Date
              </Typography>
              <Typography gutterBottom component="div">
                {formatDate(getEmployeeLoanInfo?.loanCompletedDate) || ""}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
                No Of EMI
              </Typography>
              <Typography gutterBottom component="div">
                {getEmployeeLoanInfo?.noOfEmi || ""}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography gutterBottom variant="h6" component="div">
              Total Deduction
              </Typography>
              <Typography gutterBottom component="div">
                {getEmployeeLoanInfo?.totalDeduction || ""}
              </Typography>
            </Stack>

          
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <div className="flex justify-center gap-10">
              {/* Accept button */}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleApproval("ongoing")}
              >
                Accept
              </button>
              {/* Reject button */}
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleApproval("reject")}
              >
                Reject
              </button>
            </div>
          </Box>
        </Card>
      </div>
    </>
  );
};

export default LoanMgtApproval;
