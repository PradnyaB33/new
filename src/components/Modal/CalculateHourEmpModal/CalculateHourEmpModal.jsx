import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Dialog,
  DialogContent,
  Typography,
  Grid,
  IconButton,
  DialogActions,
  Button,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import useHourHook from "../../../hooks/useHoursHook/useHourHook";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const CalculateHourEmpModal = ({
  handleClose,
  open,
  empPunchingData,
  organisationId,
}) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [remarks, setRemarks] = useState("");
  const { handleAlert } = useContext(TestContext);
  const { justify } = useHourHook();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  console.log({ setTotalPages });

  // Schema for calculate hour
  const CalculateHourSchemas = z.object({
    hour: z.string(),
    timeRange: z
      .object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
      .optional(),
  });

  const { control, formState, getValues } = useForm({
    defaultValues: {},
    resolver: zodResolver(CalculateHourSchemas),
  });
  const { errors } = formState;

  useEffect(() => {
    const data = getValues();
    console.log("form data", data);
  }, [getValues]);

  const handleCalculateHours = async () => {
    const data = getValues();
    const { hour, timeRange } = data;

    if (!timeRange?.startDate || !timeRange?.endDate) {
      alert("Please select a valid date range.");
      return;
    }

    const startDate = new Date(timeRange.startDate);
    const endDate = new Date(timeRange.endDate);
    const punchingRecords = empPunchingData?.punchingRecords || [];
    let totalHours = 0;

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const formattedDate = date.toISOString().split("T")[0];
      let punchInTime = null;
      let punchOutTime = null;

      punchingRecords.forEach((record) => {
        const recordDate = new Date(record.date).toISOString().split("T")[0];
        if (recordDate === formattedDate) {
          if (record.punchingStatus === "Check In") {
            if (!punchInTime) {
              punchInTime = new Date(`1970-01-01T${record.punchingTime}`);
            }
          } else if (record.punchingStatus === "Check Out") {
            punchOutTime = new Date(`1970-01-01T${record.punchingTime}`);
          }
        }
      });

      if (punchInTime && punchOutTime) {
        const timeDiff = punchOutTime - punchInTime;
        totalHours += Math.max(0, timeDiff / (1000 * 60 * 60));
      }

      const formattedTotalHours = Math.floor(totalHours);
      const formattedMinutes = Math.round(
        (totalHours - formattedTotalHours) * 60
      );

      let totalHour = `${formattedTotalHours} hr`;
      if (formattedMinutes > 0) {
        totalHour += ` ${formattedMinutes} min`;
      }

      let remarks = "";
      if (totalHours >= hour) {
        remarks = "Available";
      } else if (totalHours > 0) {
        remarks = "Partial";
      } else {
        remarks = "Unavailable";
      }

      setRemarks(remarks);

      const postData = {
        EmployeeId: empPunchingData?.EmployeeId._id,
        organizationId: organisationId,
        recordDate: date,
        punchInTime: punchInTime,
        punchOutTime: punchOutTime,
        totalHours: totalHour,
        status: remarks,
        justify: justify,
      };

      console.log(postData);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}/route/organization/${organisationId}/punching-data`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
            },
            body: JSON.stringify(postData),
          }
        );
    
        if (!response.ok) {
          throw new Error("Failed to calculate hours.");
        }
    
        const responseData = await response.json();
        console.log(responseData);
        handleClose();
        handleAlert(true, "success", "Hours calculated successfully.");
      } catch (error) {
        console.error("Error calculating hours:", error);
        handleAlert(false, "error", "Failed to calculate hours. Please try again.");
      }
    }
  };

  console.log(remarks);

  // pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  const prePage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "1000px!important",
        },
      }}
      open={open}
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <Container maxWidth="xl" className="bg-gray-50">
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            className="mt-5 mb-5"
          >
            <Grid item>
              <Typography variant="h6" className="mb-6 mt-4">
                Calculating working hours:
              </Typography>
              <Typography variant="h7" className="mb-6 mt-4">
                Employee Name: {`${empPunchingData?.EmployeeId?.first_name}`}{" "}
                {`${empPunchingData?.EmployeeId?.last_name}`}
              </Typography>
              <br></br>
              <Typography variant="h7" className="mb-6 mt-4">
                Employee Id: {`${empPunchingData?.EmployeeId?.empId}`}
              </Typography>
              <p className="text-xs text-gray-600">
                Calculate the working hours of employee.
              </p>
            </Grid>
            <Grid item>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Grid>
          </Grid>
          <Grid container spacing={2} className="mb-5">
            <Grid item xs={6}>
              <AuthInputFiled
                name="hour"
                icon={AccessTimeIcon}
                control={control}
                type="number"
                placeholder="Hour"
                label="Hour *"
                errors={errors}
                error={errors.hour}
              />
            </Grid>
            <Grid item xs={6}>
              <AuthInputFiled
                name="timeRange"
                control={control}
                type="calender"
                asSingle={false}
                placeholder="Select Time Range"
                label="Select Time Range *"
                readOnly={false}
                maxLimit={15}
                useRange={true}
                errors={errors}
                error={errors.timeRange}
              />
            </Grid>
          </Grid>
          <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
            <table className="min-w-full bg-white text-left !text-sm font-light">
              <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                <tr className="!font-semibold">
                  <th scope="col" className="px-6 py-3">
                    Sr No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Punching Time
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Punching Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {empPunchingData?.punchingRecords
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((record, index) => (
                    <tr
                      key={index}
                      className={`border-b border-neutral-200 bg-neutral-100 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="whitespace-nowrap px-6 py-2 font-medium">
                        {index + 1 + (currentPage - 1) * itemsPerPage}
                      </td>
                      <td className="whitespace-nowrap px-6 py-2">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-6 py-2">
                        {record.punchingTime}
                      </td>
                      <td className="whitespace-nowrap px-6 py-2">
                        {record.punchingStatus}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Container>

        {/* Pagination */}
        <nav
          className="pagination"
          style={{
            textAlign: "center",
            marginTop: "20px",
            marginBottom: "20px",
          }}
        >
          <Button
            onClick={prePage}
            disabled={currentPage === 1}
            variant="outlined"
            style={{ marginRight: "10px" }}
          >
            Prev
          </Button>
          {currentPage === 1 && (
            <Button
              onClick={() => paginate(2)}
              variant="outlined"
              style={{ marginRight: "10px" }}
            >
              Next
            </Button>
          )}
          {currentPage === 2 && (
            <Button
              onClick={() => paginate(1)}
              variant="outlined"
              style={{ marginRight: "10px" }}
            >
              1
            </Button>
          )}
          <Button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            variant="outlined"
          >
            Next
          </Button>
        </nav>
      </DialogContent>
      <DialogActions className="px-4 !py-3 shadow-md outline-none rounded-md bg-gray-50">
        <Button
          onClick={handleCalculateHours}
          variant="contained"
          className="bg-blue-800 hover:bg-blue-800"
        >
          Calculate Hours
        </Button>
        <Button
          onClick={handleClose}
          variant="contained"
          className="bg-blue-800 hover:bg-blue-800"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalculateHourEmpModal;
