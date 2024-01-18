import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const CreateEmpSalCalDayModel = ({ handleClose, open, id }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const queryClient = useQueryClient();
  const [selectedDay, setSelectedDay] = useState("");

  // Generate an array of options for salary calculation days
  const salaryCalculationDays = [
    { value: "first_day_of_next_month", label: "First day of next month" },
    { value: "second_day_of_next_month", label: "Second day of next month" },
    { value: "third_day_of_next_month", label: "Third day of next month" },
    { value: "fourth_day_of_next_month", label: "Fourth day of next month" },
    { value: "fifth_day_of_next_month", label: "Fifth day of next month" },
    { value: "sixth_day_of_next_month", label: "Sixth day of next month" },
    { value: "seventh_day_of_next_month", label: "Seventh day of next month" },
    { value: "eighth_day_of_next_month", label: "Eighth day of next month" },
    { value: "ninth_day_of_next_month", label: "Ninth day of next month" },
    { value: "tenth_day_of_next_month", label: "Tenth day of next month" },
    { value: "last_day_of_current_month", label: "Last day of current month" },
  ];

  const handleSelectedDay = (event) => {
    setSelectedDay(event.target.value);
  };

  const AddEmployeeSalaryData = useMutation(
    async (data) => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API}/route/employee-salary-cal-day/${id}`,
          data,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error(
          error.response.data.message ||
            "Failed to create Employee Salary Calculation Day"
        );
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["empSalary"] });
        handleClose();
        setSelectedDay("");
        handleAlert(
          true,
          "success",
          "Employee Salary Calculation Day Created Successfully.."
        );
        window.location.reload();
      },
      onError: (error) => {
        console.error("Error:", error.message);
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        selectedDay,
      };
      await AddEmployeeSalaryData.mutateAsync(data);
    } catch (error) {
      console.error(error);
      handleAlert(
        true,
        "error",
        "An error occurred while  updating Employee Salary Calculation Day"
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
      >
        <div className="flex justify-between py-4 items-center  px-4">
          <h1 id="modal-modal-title" className="text-lg pl-2 font-semibold">
            Create Employee Salary Calculation Day
          </h1>
          <IconButton onClick={handleClose}>
            <CloseIcon className="!text-[16px]" />
          </IconButton>
        </div>

        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>

        <div className="px-5 space-y-4 mt-4">
          <div className="space-y-2 ">
            <select
              value={selectedDay}
              onChange={handleSelectedDay}
              style={{
                width: "750px",
                padding: "8px",
                borderColor: "rgba(0, 0, 0, 0.3)",
              }}
            >
              {salaryCalculationDays?.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4  mt-4 justify-end">
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              {AddEmployeeSalaryData.isLoading ? (
                <CircularProgress size={20} />
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default CreateEmpSalCalDayModel;
