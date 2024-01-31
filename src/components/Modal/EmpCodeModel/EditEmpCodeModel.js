import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Divider, IconButton, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { UseContext } from "../../../State/UseState/UseContext";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import { TestContext } from "../../../State/Function/Main";

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
  const authToken = cookies["aeigs"];
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
    if (employeeCodes) {
      setStartWith(employeeCodes[0]?.code || "");
      setNumCharacterInPrefix(employeeCodes[0]?.numChracterInPrefix);
    }
  }, [employeeCodes]);

  console.log(employeeCodes);

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
        console.log(response);
        return response;
      } catch (error) {
        throw new Error(
          error.response.data.message || "Failed to Update Employee Code"
        );
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["empCode"] });
        handleClose();
        handleAlert(true, "success", "Employee Code Updated Successfully..");
        window.location.reload();
      },
      onError: (error) => {
        console.error("Error:", error.message);
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
        "An error occurred while  updating Employee Code"
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
            Edit Employee Code
          </h1>
          <IconButton onClick={handleClose}>
            <CloseIcon className="!text-[16px]" />
          </IconButton>
        </div>
        <div className="overflow-auto !p-4 flex flex-col items-start gap-4 border-[.5px] border-gray-200">
          <div className="flex gap-4 items-center">
            <div className="space-y-2">
              <label className="text-md" htmlFor="demo-simple-select-label">
                Employee id prefix (yes or no)
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
                  <MenuItem value={true}>yes</MenuItem>
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
                    Add Charater Employee Id
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
            Employee id starts with
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

        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>
        <div className="flex gap-4 mt-4 justify-end mr-4">
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
