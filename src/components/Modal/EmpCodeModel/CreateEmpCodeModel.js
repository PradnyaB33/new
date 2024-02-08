import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQueryClient } from "react-query";
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

const CreateEmpCodeModel = ({ handleClose, open, organisationId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [numChracterInPrefix, setNumCharacterInPrefix] = useState(1);
  const [startWith, setStartWith] = useState("");
  const [inputFields, setinputFields] = useState({
    isPrefix: false,
  });
  const queryClient = useQueryClient();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setinputFields((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/create/employee-code-generator/${organisationId}`,
        {
          startWith,
          numChracterInPrefix,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      handleAlert(true, "success", response.data.message);
      setTimeout(() => {
        handleAlert(false, "success", "");
      }, 2000);
      setStartWith("");
      setinputFields({ isPrefix: false });
      handleClose();

      // Invalidate and refetch the data after successful submission
      queryClient.invalidateQueries(["employee-code"]);
    } catch (error) {
      handleAlert(
        true,
        "error",
        error.response ? error.response.data.message : error.message
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
            Employee Code Generate
          </h1>
          <IconButton onClick={handleClose}>
            <CloseIcon className="!text-[16px]" />
          </IconButton>
        </div>

        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
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
              <div className="space-y-2 ">
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

export default CreateEmpCodeModel;
