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
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
const CreateSalaryModel = ({ handleClose, open, empId }) => {
  // state
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const [incomeValues, setIncomeValues] = useState([]);
  const [deductionsValues, setDeductionsValues] = useState([]);
  const [totalValues, setTotalValues] = useState([]);

  const handleIncomeChange = (e, setState) => {
    const { name, value } = e.target;

    setState((prevState) => {
      const existingIndex = prevState.findIndex((item) => item.name === name);

      if (existingIndex !== -1) {
        const updatedState = [...prevState];
        updatedState[existingIndex] = { name, value };
        return updatedState;
      } else {
        return [...prevState, { name, value }];
      }
    });
  };

  const calTotalSalary = () => {
    const income = incomeValues.reduce((a, c) => {
      return a + parseInt(c.value);
    }, 0);
    const deductions = deductionsValues.reduce((a, c) => {
      return a + parseInt(c.value);
    }, 0);

    const total = parseInt(income) - parseInt(deductions);
    setTotalValues(total);
  };

  useEffect(() => {
    calTotalSalary();
    //eslint-disable-next-line
  }, [incomeValues, deductionsValues]);

  // to get employee salary component data
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

  const handleApply = async () => {
    try {
      const data = {
        income: incomeValues,
        deductions: deductionsValues,
        totalSalary: totalValues,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/add-salary-component/${empId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(response);
      handleAlert(true, "success", "Salary Detail added Successfully");
      handleClose();
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
                  <>
                    <h1 className="text-lg p-4 font-semibold leading-3 tracking-tight">
                      Income
                    </h1>
                    {salaryInput?.employee?.salarystructure?.income &&
                      salaryInput?.employee?.salarystructure?.income?.length >
                        0 &&
                      salaryInput?.employee?.salarystructure?.income?.map(
                        (item, id) => (
                          <tr key={id} className="space-y-4 w-full">
                            <td className="!text-left w-full pl-8 pr-8 py-3">
                              {item}
                            </td>
                            <td>
                              <input
                                type="number"
                                name={item}
                                value={
                                  incomeValues.find((ele) => ele?.name === item)
                                    ?.value
                                }
                                min={0}
                                onChange={(e) =>
                                  handleIncomeChange(e, setIncomeValues)
                                }
                                placeholder="Enter the input"
                                style={{
                                  padding: "10px",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                }}
                              />
                            </td>
                          </tr>
                        )
                      )}

                    <h1 className="text-lg p-4 font-semibold leading-3 tracking-tight">
                      Deduction
                    </h1>
                    {salaryInput?.employee?.salarystructure?.deductions &&
                      salaryInput?.employee?.salarystructure?.deductions
                        ?.length > 0 &&
                      salaryInput?.employee?.salarystructure?.deductions?.map(
                        (item, id) => (
                          <tr key={id} className="space-y-6 w-full">
                            <td className="!text-left w-full pl-8 pr-8 py-3">
                              {item}
                            </td>
                            <td>
                              <input
                                type="number"
                                name={item}
                                value={
                                  deductionsValues.find(
                                    (ele) => ele?.name === item
                                  )?.value
                                }
                                onChange={(e) =>
                                  handleIncomeChange(e, setDeductionsValues)
                                }
                                placeholder="Enter the input"
                                style={{
                                  padding: "10px",
                                  border: "1px solid #ccc",
                                  borderRadius: "4px",
                                }}
                              />
                            </td>
                          </tr>
                        )
                      )}
                  </>
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
                value={totalValues ?? 0}
                placeholder="Total Salary"
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
            <Button onClick={handleApply} variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSalaryModel;
