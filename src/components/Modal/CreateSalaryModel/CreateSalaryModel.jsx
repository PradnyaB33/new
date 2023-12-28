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
import { useQuery, useQueryClient, useMutation } from "react-query";
import { TestContext } from "../../../State/Function/Main";
const CreateSalaryModel = ({ handleClose, open, empId }) => {
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aeigs"];
  const [deduction, setDeduction] = useState("");
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
    console.log("name, value", name, value);
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
    const deductionValue = parseFloat(deduction) || 0;
    const foodAllowanceValue = parseFloat(foodAllowance) || 0;
    const variableAllowanceValue = parseFloat(variableAllowance) || 0;
    const specialAllowanceValue = parseFloat(specialAllowance) || 0;
    const travelAllowanceValue = parseFloat(travelAllowance) || 0;
    const salesAllowanceValue = parseFloat(salesAllowance) || 0;

    const total =
      basicValue +
      hraValue +
      daValue +
      foodAllowanceValue +
      variableAllowanceValue +
      specialAllowanceValue +
      travelAllowanceValue +
      salesAllowanceValue -
      deductionValue;

    return total.toFixed(2);
  };
  const totalSalary = calculateTotalSalary();

  // add salary data
  const queryClient = useQueryClient();
  const AddSalaryData = useMutation(
    async (data) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/salary/add/${empId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data; // Return the response data from the API
    },

    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["salaryTemplates"] });
        setInputValue({
          Basic: "",
          HRA: "",
          DA: "",
          "Food allowance": "",
          "Varialble allowance": "",
          "Special allowance": "",
          "Travel allowance": "",
          "Sales allowance": "",
        }); // Clear input values
        setDeduction(""); // Clear deduction value
        handleClose();
        handleAlert(true, "success", "Salary Created successfully");
      },

      onError: () => {
        handleAlert(true, "error", "Something went wrong");
      },
    }
  );

  const handleApply = async () => {
    try {
      const data = {
        inputValue,
        deduction,
        totalSalary,
      };
      await AddSalaryData.mutateAsync(data);
    } catch (error) {
      console.error("Error adding salary data:", error);
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "900px!important",
          height: "50%",
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
                <tr>
                  <td className="!text-left pl-8 pr-8 py-3">Deduction</td>
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
                              }} // Update state on change
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="w-full">
            <Divider variant="fullWidth" orientation="horizontal" />
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
            <div className="flex items-center justify-between py-3 px-4">
              <span className="font-semibold">Per Day Salary</span>
              <input
                type="number"
                placeholder="Per Day Salary"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#f9f9f9",
                  fontWeight: "bold",
                }}
                readOnly
              />
            </div>
          </div>

          <DialogActions>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button variant="contained" color="primary">
              Apply
            </Button>
          </DialogActions>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSalaryModel;
