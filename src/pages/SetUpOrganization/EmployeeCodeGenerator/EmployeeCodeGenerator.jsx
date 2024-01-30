import React from "react";
import Setup from "../Setup";
import { BadgeOutlined } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Button,
} from "@mui/material";
import { useState } from "react";

const EmployeeCodeGenerator = () => {
  const [numChracterInPrefix, setNumCharacterInPrefix] = useState(0);
  const [totalCharacter, setTotalCharacter] = useState(0);
  const [startWith, setStartWith] = useState("");
  const [inputFields, setinputFields] = useState({
    isPrefix: false,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setinputFields((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };
  console.log({ numChracterInPrefix, startWith, totalCharacter });
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted:");
  };
  return (
    <section className="bg-gray-50 min-h-screen w-full">
      <Setup>
        <article className="SetupSection bg-white w-[80%]  h-max shadow-md rounded-sm border  items-center">
          <div className="p-4  border-b-[.5px] flex items-center justify-between  gap-3 w-full border-gray-300">
            <div className="flex items-center  gap-3 ">
              <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                <BadgeOutlined className="!text-lg text-white" />
              </div>
              <h1 className="!text-lg tracking-wide">
                Create Template for Employee ID
              </h1>
            </div>
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
                  <FormControl
                    size="small"
                    className="w-full"
                    variant="outlined"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">
                      Add Charater Employee Id
                    </InputLabel>
                    <OutlinedInput
                      type="text"
                      id="outlined-adornment-password"
                      inputProps={{
                        min: 0, // Set the minimum value
                        max: 100, // Set the maximum value
                      }}
                      label="Add Employment types"
                      value={numChracterInPrefix}
                      onChange={(e) => setNumCharacterInPrefix(e.target.value)}
                    />
                  </FormControl>
                </div>
              )}
            </div>

            <div className="flex gap-4 items-center">
              <div className="space-y-2 ">
                <label className="text-md" htmlFor="demo-simple-select-label">
                  Number of charater in Employee id
                </label>
                <FormControl size="small" className="w-full" variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    total character
                  </InputLabel>
                  <OutlinedInput
                    type="number"
                    id="outlined-adornment-password"
                    inputProps={{
                      min: 0, // Set the minimum value
                      max: 100, // Set the maximum value
                    }}
                    label="total character"
                    value={totalCharacter}
                    onChange={(e) => setTotalCharacter(e.target.value)}
                  />
                </FormControl>
              </div>

              <div className="space-y-2">
                <label className="text-md" htmlFor="demo-simple-select-label">
                  Employee id starts with
                </label>
                <FormControl size="small" className="w-full" variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    start with
                  </InputLabel>
                  <OutlinedInput
                    type="text"
                    id="outlined-adornment-password"
                    label="start with"
                    value={startWith}
                    onChange={(e) => setStartWith(e.target.value)}
                  />
                </FormControl>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              variant="contained"
              size="small"
              className="!text-semibold"
              color="primary"
            >
              Submit
            </Button>
          </div>
        </article>
      </Setup>
    </section>
  );
};

export default EmployeeCodeGenerator;
