import React, { useContext, useState } from "react";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { TestContext } from "../../State/Function/Main";
import { useQuery, useQueryClient } from "react-query";
import ViewDocumentModal from "./ViewDocumentModal";
import Button from "@mui/material/Button";
import useJobPositionNotification from "../../../hooks/QueryHook/notification/job-position-notification/useJobPositionNotification";
const JobPositionApproval = ({ employee }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const queryClient = useQueryClient();
  let jobPositionId = employee?._id;
  const { getJobPostionRequest } = useJobPositionNotification();

  const handleApproval = async (status) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/organization/accept/reject/loans/${jobPositionId}`,
        {
          action: status === "Approved" ? "Approved" : "Rejected",
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      // Invalidate the query to force refetch
      queryClient.invalidateQueries(["empLoanInfo", loanId]);
      // Display appropriate alert message based on action
      if (status === "Approved") {
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
      window.location.reload();
    } catch (error) {
      console.error("Error adding salary data:", error);
      handleAlert(true, "error", "Something went wrong");
    }
  };

  return (
    <>
      <div>
        <Card
          variant="outlined"
          sx={{ width: "100%", maxWidth: "95%", marginTop: "50px" }}
        >
          <Box sx={{ p: 2 }}>
            <Typography gutterBottom variant="h4" component="div">
              {getEmployeeLoanInfo?.userId?.first_name || ""}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {getEmployeeLoanInfo?.userId?.first_name || ""} has raised a
              request for loan application
            </Typography>
          </Box>
          <Divider />

          <Box sx={{ p: 2 }}>
            <div className="flex justify-center gap-10">
              {/* Accept button */}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleApproval("Approved")}
              >
                Accept
              </button>
              {/* Reject button */}
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleApproval("rejected")}
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

export default JobPositionApproval;
