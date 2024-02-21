import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
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

const EditEmpCodeModel = ({ handleClose, open, organisationId, empCodeId }) => {
  const queryClient = useQueryClient();
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const [startWith, setStartWith] = useState("");
  const [numChracterInPrefix, setNumCharacterInPrefix] = useState(1);
  const [inputFields, setinputFields] = useState({
    isPrefix: true,
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setinputFields((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };
  // fetch the data of employee code
  const getEmployeeCodeData = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: authToken,
      },
    };

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/employee-code/${organisationId}`,
        config
      );

      return response.data.getEmployeeCode;
    } catch (error) {
      // Handle errors if necessary
      console.error("Error fetching employee codes:", error);
      return [];
    }
  };

  const { data: employeeCodes } = useQuery({
    queryKey: ["employee-code"],
    queryFn: getEmployeeCodeData,
  });

  useEffect(() => {
    console.log("Employee Codes updated:", employeeCodes);
    if (employeeCodes && employeeCodes.length > 0) {
      setStartWith(employeeCodes[0]?.code || "");
      setNumCharacterInPrefix(employeeCodes[0]?.numChracterInPrefix || "");
    }
  }, [employeeCodes]);

  const EditEmployeeCode = useMutation(
    async (data) => {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API}/route/update/employee-code/${organisationId}/${empCodeId}`,
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
          error.response.data.message || "Failed to update employee code."
        );
      }
    },
    {
      onSuccess: (data) => {
        // Invalidate and refetch the data after successful submission
        queryClient.invalidateQueries(["employee-code"]);
        handleClose();
        handleAlert(true, "success", "Employee code updated successfully.");
        setTimeout(() => {
          handleAlert(false, "success", "");
        }, 2000);
      },

      onError: (error) => {
        console.error("Error:", error.message);
        handleAlert(true, "error", error.message);
      },
    }
  );

  // edit the data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        startWith,
        numChracterInPrefix,
      };
      await EditEmployeeCode.mutateAsync(data);
    } catch (error) {
      console.error(error);
      handleAlert(
        true,
        "error",
        "An Error occurred while  updating employee code."
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
          <h1 className="text-xl pl-2 font-semibold font-sans">
            Edit Employee Code
          </h1>
        </div>
        <div className="overflow-auto !p-4 flex flex-col items-start gap-4">
          <div className="flex gap-4 items-center">
            <div className="space-y-2">
              <label className="text-md" htmlFor="demo-simple-select-label">
                Employee ID prefix (Yes or No)
              </label>
              <FormControl size="small" className="w-full">
                <InputLabel id="demo-simple-select-label">
                  prefix character
                </InputLabel>
                <Select
                  id={"isPrefix"}
                  name="isPrefix"
                  onChange={handleInputChange}
                  label=" prefix character"
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
            </div>

            {inputFields.isPrefix && (
              <div className="space-y-2">
                <label className="text-md" htmlFor="demo-simple-select-label">
                  Number of charater in prefix
                </label>
                <FormControl size="small" className="w-full" variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Add Charater for Employee ID
                  </InputLabel>
                  <OutlinedInput
                    type="number"
                    label="Add Character Employee id"
                    value={numChracterInPrefix}
                    onChange={(e) => setNumCharacterInPrefix(e.target.value)}
                  />
                </FormControl>
              </div>
            )}
          </div>

          <label className="text-md" htmlFor="demo-simple-select-label">
            Employee ID starts with
          </label>
          <FormControl size="small" className="w-full" variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              start with
            </InputLabel>
            <OutlinedInput
              type="text"
              label="start with"
              value={startWith}
              onChange={(e) => setStartWith(e.target.value)}
              inputProps={{
                maxLength: numChracterInPrefix,
              }}
            />
          </FormControl>
        </div>

        <div className="flex gap-4 mt-4 mr-4  mb-4 justify-end ">
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Apply
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default EditEmpCodeModel;
