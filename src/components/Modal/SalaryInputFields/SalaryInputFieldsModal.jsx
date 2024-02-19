import { Add, InfoOutlined, RemoveOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Tooltip,
  createFilterOptions,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

const filter = createFilterOptions();

const SalaryInputFieldsModal = ({ handleClose, open, id, salaryId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  let salaryComponentArray = [
    { title: "Basic" },
    { title: "HRA" },
    { title: "DA" },
    { title: "Variable allowance" },
    { title: "Special allowance" },
    { title: "Travel allowance" },
    { title: "Food allowance" },
    { title: "Sales allowance" },
  ];

  const descriptionElementRef = React.useRef(null);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  // Get Query
  const { data: empTypeslist } = useQuery("empTypes", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/employment-types-organisation/${id}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  });

  const { data: salaryInput } = useQuery(
    ["empType", salaryId],
    async () => {
      if (open && salaryId !== null) {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/salary-template/${salaryId}`,
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
      enabled: open && salaryId !== null && salaryId !== undefined,
    }
  );

  const [userInput, setUserInput] = useState({
    name: "",
    desc: "",
  });
  const [empTypes, setEmpTypes] = useState("");
  const [salaryStructures, setSalaryStructures] = useState([
    {
      salaryComponent: "",
      // manuallyInput: "", calculation: ""
    },
  ]);
  const [errors, setErrors] = useState({
    name: "",
    desc: "",
    empTypes: "",
    salaryStructures: [],
    salaryLength: "",
  });

  const validateForm = (data) => {
    const newErrors = { ...errors };
    let isValid = true;

    console.log(data);

    if (!userInput.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else {
      newErrors.name = "";
    }

    const found = [];

    const isExists = data?.salaryStructure.some((item) => {
      if (found.find((salary) => salary === item.salaryComponent)) {
        return true;
      }
      found.push(item.salaryComponent);
      return false;
    });

    console.log(isExists);

    if (!empTypes) {
      newErrors.empTypes = "Employment Types is required";
      isValid = false;
    } else {
      newErrors.empTypes = "";
    }

    if (salaryStructures.length <= 0) {
      newErrors.salaryLength = "Please add at list one salary input";
      isValid = false;
    } else {
      newErrors.salaryLength = "";
    }

    if (isExists) {
      newErrors.salaryLength =
        "You can't select same salary component multiple times";
      isValid = false;
    } else {
      newErrors.salaryLength = "";
    }

    // Validate salary structures
    const structuresError = [];
    salaryStructures.forEach((structure, index) => {
      const error = {};

      if (!structure.salaryComponent.trim()) {
        error.salaryComponent = "Salary Component is required";
        isValid = false;
      }

      structuresError[index] = error;
    });

    newErrors.salaryStructures = structuresError;

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    if (!open) {
      setUserInput({
        name: "",
        desc: "",
      });
      setEmpTypes("");
      setSalaryStructures([{ salaryComponent: "" }]);
      setErrors({
        name: "",
        desc: "",
        empTypes: "",
        salaryStructures: [],
        salaryLength: "",
      });
    }
  }, [open]);

  useEffect(() => {
    if (salaryInput?.SalarTemplates) {
      const extractedSalaryStructure =
        salaryInput.SalarTemplates.salaryStructure.map((salaryComponent) => ({
          ...salaryComponent,
          manuallyInput: salaryComponent.manuallyInput ? "yes" : "no",
        }));

      setEmpTypes(salaryInput?.SalarTemplates.empType._id);
      setUserInput({
        name: salaryInput?.SalarTemplates?.name,
        desc: salaryInput?.SalarTemplates?.desc,
      });

      setSalaryStructures(extractedSalaryStructure);
    }
  }, [salaryInput]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInput((prevUserInput) => ({
      ...prevUserInput,
      [name]: value,
    }));
  };

  const handleSalaryStructureChange = (index, field, value) => {
    setSalaryStructures((prevStructures) => {
      const newStructures = [...prevStructures];
      newStructures[index][field] = value;
      return newStructures;
    });
  };

  const handleAddRow = () => {
    setSalaryStructures((prevStructures) => [
      ...prevStructures,
      { salaryComponent: "" },
    ]);
  };

  const handleRemoveRow = (index) => {
    setSalaryStructures((prevStructures) =>
      prevStructures.filter((_, i) => i !== index)
    );
  };

  const queryClient = useQueryClient();

  const AddSalaryInputs = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/salary-template-org/${id}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),

    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["salaryTemplates"] });
        setUserInput("");
        setEmpTypes("");
        setSalaryStructures("");
        handleClose();
        handleAlert(true, "success", "Salary template generated succesfully");
      },

      onError: () => {
        handleAlert(true, "error", "Something went wrong");
      },
    }
  );

  const EditSalaryTemplate = useMutation(
    (data) =>
      axios.put(
        `${process.env.REACT_APP_API}/route/salary-template/${salaryId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["salaryTemplates"] });
        handleClose();
        handleAlert(true, "success", "Salary template updated succesfully");
      },
      onError: () => {
        handleAlert(true, "error", "Something went wrong");
      },
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      salaryStructure: salaryStructures,
      ...userInput,
      empType: empTypes,
    };
    const isValid = validateForm(data);

    if (isValid) {
      try {
        if (salaryId) {
          await EditSalaryTemplate.mutateAsync(data);
        } else {
          await AddSalaryInputs.mutateAsync(data);
        }
        // Reset form state
      } catch (error) {
        console.error(error);
        handleAlert(true, "error", "Somerthing went wrong");
      }
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "800px!important",
          height: "100%",
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
          {salaryId ? "Edit Salary Template" : "Create Salary Template"}
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
          {/* {error && <p className="text-red-500">*{error}</p>} */}

          <div className="space-y-2 ">
            <FormLabel
              error={errors.name.length > 0}
              className="text-md mb-2"
              htmlFor="name"
            >
              Enter template name
            </FormLabel>
            <FormControl
              error={errors.name.length > 0}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
              <InputLabel htmlFor="name">Enter name</InputLabel>
              <OutlinedInput
                id="name"
                label="Enter name"
                name={"name"}
                value={userInput.name}
                onChange={handleInputChange}
              />
            </FormControl>
            {errors.name && <p className="text-red-500">*{errors.name}</p>}
          </div>

          <div className="space-y-2 ">
            <FormLabel className="text-md mb-2" htmlFor="name">
              Enter template desc
            </FormLabel>
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Enter description (optional)
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Enter description (optional)"
                multiline
                rows={3}
                name={"desc"}
                value={userInput.desc}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>

          <div className="space-y-2 ">
            <FormLabel
              error={errors.empTypes.length > 0}
              className="text-md mb-2"
              htmlFor="name"
            >
              Enter employment type.
            </FormLabel>
            <FormControl
              error={errors.empTypes.length > 0}
              size="small"
              fullWidth
            >
              <InputLabel id="demo-simple-select-label">
                Employment Types
              </InputLabel>
              <Select
                id="demo-simple-select"
                value={empTypes}
                onChange={(e) => setEmpTypes(e.target.value)}
                label="Select Leave Type"
              >
                {empTypeslist?.empTypes?.length > 0 ? (
                  empTypeslist?.empTypes?.map((item, id) => (
                    <MenuItem key={id} value={item?._id}>
                      {item?.title}
                    </MenuItem>
                  ))
                ) : (
                  <div className="flex w-full items-center justify-center p-2">
                    No data Found
                  </div>
                )}
              </Select>
            </FormControl>
            {errors.empTypes && (
              <p className="text-red-500">*{errors.empTypes}</p>
            )}
          </div>
          <p className="text-md">Salary Structure</p>
          {salaryStructures?.length <= 0 ? (
            <div className="flex items-center gap-4 w-full bg-red-200 p-3 rounded-md ">
              <InfoOutlined className="!text-5xl text-red-600" />
              <div className="">
                <h1 className="!text-2xl text-red-600">
                  Salary Structure not found
                </h1>
                <p>Add a new data by clicking on the plus button </p>
              </div>
            </div>
          ) : (
            <div className="overflow-auto  !p-0 bg-gray-200">
              <table className="min-w-full bg-white  text-left !text-sm font-light">
                <thead className="border-b bg-gray-100  font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="!text-left pl-8 py-3 ">
                      Salary Component
                    </th>
                    {/* <th scope="col" className="py-3 ">
                      Manual Input
                    </th>
                    <th scope="col" className="px-6 py-3 ">
                      Calculation
                    </th> */}
                    <th scope="col" className="px-6 py-3 ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salaryStructures?.map((structure, index) => (
                    <tr
                      key={index}
                      className="px-2 !border border-gray-300 !py-4 !space-x-4 gap-4 w-full"
                    >
                      <td className="w-[35%] py-4 pl-2">
                        <Autocomplete
                          id={`salaryComponent-select-${index}`}
                          value={structure.salaryComponent}
                          onChange={(event, newValue) => {
                            if (typeof newValue === "string") {
                              handleSalaryStructureChange(
                                index,
                                "salaryComponent",
                                newValue
                              );
                            } else if (newValue && newValue.inputValue) {
                              handleSalaryStructureChange(
                                index,
                                "salaryComponent",
                                newValue.inputValue
                              );
                            }
                          }}
                          filterOptions={(options, params) => {
                            const filtered = filter(options, params);
                            const { inputValue } = params;

                            const isExisting = options.some(
                              (option) => inputValue === option.title
                            );
                            if (inputValue !== "" && !isExisting) {
                              filtered.push({
                                inputValue,
                                title: `Add "${inputValue}"`,
                              });
                            }

                            return filtered;
                          }}
                          selectOnFocus
                          clearOnBlur
                          options={salaryComponentArray}
                          getOptionLabel={(option) =>
                            typeof option === "string" ? option : option.title
                          }
                          size="small"
                          renderOption={(props, option) => (
                            <li {...props}>{option.title}</li>
                          )}
                          sx={{ width: "90%" }}
                          freeSolo
                          autoSelect
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Salary Component"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: !structure.salaryComponent
                                  ? params.InputProps.endAdornment
                                  : undefined,
                              }}
                            />
                          )}
                        />

                        <p className="text-red-500 h-1">
                          {errors.salaryStructures[index]?.salaryComponent &&
                            `*${errors.salaryStructures[index].salaryComponent}`}
                        </p>
                      </td>

                      {/* <td className="w-[35%] !mx-4">
                        <FormControl size="small" className="w-[90%]">
                          <InputLabel id="demo-simple-select-label">
                            manually
                          </InputLabel>
                          <Select
                            id={`manuallyInput-select-${index}`}
                            value={structure.manuallyInput}
                            onChange={(e) =>
                              handleSalaryStructureChange(
                                index,
                                "manuallyInput",
                                e.target.value
                              )
                            }
                            label="manually"
                          >
                            <MenuItem key={id} value={"yes"}>
                              yes
                            </MenuItem>
                            <MenuItem key={id} value={"no"}>
                              No
                            </MenuItem>
                          </Select>
                        </FormControl>
                        <p className="text-red-500 h-1">
                          {errors.salaryStructures[index]?.manuallyInput &&
                            ` *${errors.salaryStructures[index].manuallyInput}`}
                        </p>
                      </td> */}

                      {/* <td className="w-[35%]">
                        <FormControl
                          size="small"
                          className="w-full"
                          variant="outlined"
                        >
                          <InputLabel htmlFor="outlined-adornment-password">
                            Calculation
                          </InputLabel>
                          <OutlinedInput
                            label="Calculation"
                            id={`calculation-select-${index}`}
                            value={structure.calculation}
                            onChange={(e) =>
                              handleSalaryStructureChange(
                                index,
                                "calculation",
                                e.target.value
                              )
                            }
                          />
                        </FormControl>
                        <p className="text-red-500 h-1">
                          {errors.salaryStructures[index]?.calculation &&
                            `*${errors.salaryStructures[index].calculation}`}
                        </p>
                      </td> */}

                      <td className="w-[10%]">
                        <Tooltip title="Remove this row">
                          <IconButton
                            className="!text-sm !text-red-500  rounded-full"
                            onClick={() => handleRemoveRow(index)}
                          >
                            <RemoveOutlined />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {errors.salaryLength && (
            <p className="text-red-500">*{errors.salaryLength}</p>
          )}

          <div>
            <Tooltip title="Add a row for salary structure">
              <IconButton
                onClick={handleAddRow}
                className="!bg-sky-100 !text-sky-500 shadow-md  rounded-full  "
              >
                <Add />
              </IconButton>
            </Tooltip>
          </div>

          <DialogActions sx={{ justifyContent: "end" }}>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            {salaryId ? (
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={EditSalaryTemplate.isLoading}
              >
                {EditSalaryTemplate.isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  "Apply"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={AddSalaryInputs.isLoading}
              >
                {AddSalaryInputs.isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  "submit"
                )}
              </Button>
            )}
          </DialogActions>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalaryInputFieldsModal;
