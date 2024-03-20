import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import UserProfile from "../../hooks/UserData/useUser";
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
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const organisationId = user.organizationId;
  const { handleAlert } = useContext(TestContext);

  //for get loan data
  const { data: getEmployeeLoanInfo } = useQuery(
    ["empLoanInfo", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/loans/${loanId}`,
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
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/accept/reject/loans/${loanId}`,
        {
          action: status === "accept" ? "accept" : "reject",
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      handleAlert(true, "success", "Approved the Request");
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
                Rate Of Interest
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
                totalDeduction
              </Typography>
              <Typography gutterBottom component="div">
                {getEmployeeLoanInfo?.totalDeduction || ""}
              </Typography>
            </Stack>

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
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <div className="flex justify-center gap-10">
              {/* Accept button */}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleApproval("accept")}
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
