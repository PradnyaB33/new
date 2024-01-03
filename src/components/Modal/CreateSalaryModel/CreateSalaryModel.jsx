import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { UseContext } from "../../../State/UseState/UseContext";
import axios from "axios";
import { useQuery } from "react-query";
import { TestContext } from "../../../State/Function/Main";
const CreateSalaryModel = ({ handleClose, open, empId }) => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aeigs"];
  const [errorMessage, setErrorMessage] = useState("");
  const [deduction, setDeduction] = useState("");
  const [employee_pf, setEmployeePf] = useState("");
  const [esic, setEsic] = useState("");
  const [inputValue, setInputValue] = useState({
    Basic: "",
    HRA: "",
    DA: "",
    "Food allowance": "",
    "Varialble allowance": "",
    "Special allowance": "",
    "Travel allowance": "",
    "Sales allowance": "",
  });

  const {
    data: salaryInput,
    isLoading,
    isError,
  } = useQuery(
    ["empData", empId],
    async () => {
      if (open && empId !== null) {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get/profile/${empId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data;
      }
    },
    {
      enabled: open && empId !== null && empId !== undefined,
    }
  );

  const handleInputChange = (name, value) => {
    const enteredValue = parseFloat(value);

    if (!isNaN(enteredValue) && enteredValue > 10000000) {
      // Set an error message when the entered value exceeds a crore
      setErrorMessage("Please enter a number less than 1 crore");
      return;
    }

    // Clear the error message if the entered value is valid
    setErrorMessage("");
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  // Function to calculate total salary
  const calculateTotalSalary = () => {
    const {
      Basic,
      HRA,
      DA,
      "Food allowance": foodAllowance,
      "Varialble allowance": variableAllowance,
      "Special allowance": specialAllowance,
      "Travel allowance": travelAllowance,
      "Sales allowance": salesAllowance,
    } = inputValue;

    const basicValue = parseFloat(Basic) || 0;
    const hraValue = parseFloat(HRA) || 0;
    const daValue = parseFloat(DA) || 0;
    const foodAllowanceValue = parseFloat(foodAllowance) || 0;
    const variableAllowanceValue = parseFloat(variableAllowance) || 0;
    const specialAllowanceValue = parseFloat(specialAllowance) || 0;
    const travelAllowanceValue = parseFloat(travelAllowance) || 0;
    const salesAllowanceValue = parseFloat(salesAllowance) || 0;
    const deductionValue = parseFloat(deduction) || 0;
    const employeePfValue = parseFloat(employee_pf) || 0;
    const esicValue = parseFloat(esic) || 0;

    const total =
      basicValue +
      hraValue +
      daValue +
      foodAllowanceValue +
      variableAllowanceValue +
      specialAllowanceValue +
      travelAllowanceValue +
      salesAllowanceValue -
      deductionValue -
      employeePfValue -
      esicValue;

    return total.toFixed(2);
  };
  let totalSalary = calculateTotalSalary();

  const handleApply = async () => {
    try {
      const data = {
        inputValue,
        deduction,
        employee_pf,
        esic,
        totalSalary,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/salary/add/${empId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log("response ", response);
      if (response.data.success) {
        handleAlert(true, "error", "Invalid authorization");
      } else {
        handleAlert(true, "success", "Salary Detail added Successfully");
        // Clear input values and deduction after successful submission
        setInputValue({
          Basic: "",
          HRA: "",
          DA: "",
          "Food allowance": "",
          "Varialble allowance": "",
          "Special allowance": "",
          "Travel allowance": "",
          "Sales allowance": "",
        });
        setDeduction("");
        setEmployeePf("");
        setEsic("");
        totalSalary = ""; //  totalSalary is a variable
        handleClose();
      }
    } catch (error) {
      console.error("Error adding salary data:", error);
      handleAlert(true, "error", "Something went wrong");
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "900px!important",
          height: "70%",
          maxHeight: "85vh!important",
        },
      }}
      open={open}
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="flex w-full justify-between py-4 items-center  px-4">
        <h1 id="modal-modal-title" className="text-lg pl-2 font-semibold">
          Create Salary
        </h1>
        <IconButton onClick={handleClose}>
          <CloseIcon className="!text-[16px]" />
        </IconButton>
      </div>

      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>

        <div className="px-5 space-y-4 mt-4">
          <p className="text-md">
            Create Salary For{" "}
            <span className="text-lg  font-semibold">{`${salaryInput?.employee?.first_name} ${salaryInput?.employee?.last_name}`}</span>
          </p>
          <p className="text-md">Salary Component</p>
          <div className="overflow-auto  !p-0 bg-gray-200">
            <table className="min-w-full bg-white  text-left !text-sm font-light">
              <thead className="border-b bg-gray-100  font-medium dark:border-neutral-500">
                <tr>
                  <th scope="col" className="!text-left pl-8 py-3 ">
                    Salary Component
                  </th>
                  <th scope="col" className="py-3 pl-8">
                    Enter The Input
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={2}>
                      <CircularProgress />
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={2}>Error fetching data</td>
                  </tr>
                ) : !salaryInput ? (
                  <tr>
                    <td colSpan={2}>No data available</td>
                  </tr>
                ) : (
                  <tr>
                    {salaryInput?.employee?.salarystructure?.salaryStructure.map(
                      (item, id) => (
                        <tr key={id}>
                          <td className="!text-left pl-8 pr-8 py-3">
                            {item.salaryComponent}
                          </td>
                          <td className="py-3 pl-40 pr-8">
                            <input
                              type="number"
                              placeholder="Enter the input"
                              style={{
                                padding: "10px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                marginLeft: "200%",
                              }}
                              value={inputValue[item.salaryComponent] || ""} // Set value from state
                              onChange={(e) => {
                                handleInputChange(
                                  item.salaryComponent,
                                  e.target.value
                                );
                              }}
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tr>
                )}
                <tr>
                  <td className="!text-left pl-8 pr-8 py-3">
                    Professinal Tax (Deduction)
                  </td>
                  <td className="py-3 ">
                    <input
                      type="number"
                      placeholder="Enter the input"
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                      value={deduction}
                      onChange={(e) => setDeduction(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="!text-left pl-8 pr-8 py-3">Employee PF</td>
                  <td className="py-3 ">
                    <input
                      type="number"
                      placeholder="Enter the input"
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                      value={employee_pf}
                      onChange={(e) => setEmployeePf(e.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="!text-left pl-8 pr-8 py-3">ESIC</td>
                  <td className="py-3 ">
                    <input
                      type="number"
                      placeholder="Enter the input"
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                      value={esic}
                      onChange={(e) => setEsic(e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-full">
            <Divider variant="fullWidth" orientation="horizontal" />
          </div>
          <div style={{ height: "5px", width: "280px" }}>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between py-3 px-4">
              <span className="font-semibold">Total Salary</span>
              <input
                type="number"
                placeholder="Total Salary"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                  fontWeight: "bold",
                }}
                value={totalSalary}
                readOnly // This prevents the input from being edited directly
              />
            </div>
          </div>

          <DialogActions>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleApply} variant="contained" color="primary">
              Apply
            </Button>
          </DialogActions>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSalaryModel;
