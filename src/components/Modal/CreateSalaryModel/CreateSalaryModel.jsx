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
const CreateSalaryModel = ({ handleClose, open, empId }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const [basic, setBasic] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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

  const handleInputChange = (e) => {
    const enteredValue = e.target.value;
    if (enteredValue && parseInt(enteredValue) > 10000000) {
      setErrorMessage("Maximum Number limit is 7");
      return;
    }
    setErrorMessage("");
    setBasic(enteredValue);
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "800px!important",
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
                              value={basic}
                              onChange={handleInputChange}
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
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
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
