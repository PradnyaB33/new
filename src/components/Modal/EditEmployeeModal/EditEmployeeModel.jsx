import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const EditModelOpen = ({ handleClose, open, employeeId, organisationId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const queryClient = useQueryClient();
  // define the state for storing the employee data
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    companyemail: "",
    address: "",
    citizenship: "",
    date_of_birth: "",
    joining_date: "",
    bank_account_no: "",
    profile: "",
  });
  // define the state for store additional info data of employee
  const [additionalInfo, setAdditionalInfo] = useState({
    "Adhar Card Number": "",
    "Department cost center no": "",
    "Emergency contact": "",
    "Middle Name": "",
    "Pan Card Number": "",
    "Permanent Address": "",
    "Primary nationality": "",
    "Relative Information": "",
    "Shifts allocation": "",
    "Martial status": "",
    Education: "",
  });
  // define the state for stored worklocation
  const [selectedWorkLocation, setSelectedWorkLocation] = useState("");
  // define the state for stored deptname
  const [deptname, setDepartment] = useState([]);
  // define the state for stored designation
  const [designation, setDesignation] = useState([]);
  const [employmentType, setEmployementType] = useState("");

  // pull the employee data
  const [employeeData, setEmployeeData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (open && employeeId !== null && employeeId !== undefined) {
          const response = await axios.get(
            `${process.env.REACT_APP_API}/route/employee/get/profile/${employeeId}`,
            {
              headers: {
                Authorization: authToken,
              },
            }
          );
          setEmployeeData(response.data.employee);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchData();
    return () => {};
  }, [open, employeeId, authToken]);

  // pull the worklocation of organization
  const [availabelLocation, setAvailableLocation] = useState([]);
  const fetchAvailableLocation = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAvailableLocation(response.data.locationsData);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Available Work Location");
    }
  };
  useEffect(() => {
    fetchAvailableLocation();
    // eslint-disable-next-line
  }, []);
  console.log(availabelLocation);

  // pull the department data
  const [availabelDepartment, setAvailableDepartment] = useState([]);
  const fetchAvailableDepartment = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/get/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setAvailableDepartment(response.data.department);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Available Work Location");
    }
  };
  useEffect(() => {
    fetchAvailableDepartment();
    // eslint-disable-next-line
  }, []);

  // pull the data of designation
  const [availabelDesignation, setAvailableDesignation] = useState([]);
  const fetchAvailableDesignation = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/designation/create/${organisationId}`
      );

      setAvailableDesignation(response.data.designations);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Available Designation");
    }
  };

  useEffect(() => {
    fetchAvailableDesignation();
    // eslint-disable-next-line
  }, []);

  // pull the data of employement type
  const [availabelEmpTypes, setAvailableEmpTypes] = useState([]);
  const fetchAvailabeEmpTypes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/employment-types-organisation/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      setAvailableEmpTypes(response.data.empTypes);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Available Employement Type");
    }
  };
  useEffect(() => {
    fetchAvailabeEmpTypes();
    // eslint-disable-next-line
  }, []);

  // function for changing the data by user
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleLocationChange = (event) => {
    const selectedLocation = availabelLocation.find(
      (location) => location.city === event.target.value
    );

    if (selectedLocation) {
      setSelectedWorkLocation(selectedLocation._id);
      console.log(selectedLocation._id);
    }
  };

  // function for change department
  const handleDepartmnetChange = (event) => {
    setDepartment(event.target.value);
    console.log(event.target.value);
  };
  // function for chnage designation
  const handleDesignationChange = (event) => {
    setDesignation(event.target.value);
    console.log(event.target.value);
  };
  // function for chnage employement type
  const handleEmployeMentType = (event) => {
    setEmployementType(event.target.value);
    console.log(event.target.value);
  };

  // fetch the data in input field which is already stored
  useEffect(() => {
    if (employeeData) {
      const formattedDateOfBirth = employeeData.date_of_birth
        ? new Date(employeeData.date_of_birth).toLocaleDateString("en-US")
        : "";
      const formattedJoiningDate = employeeData.joining_date
        ? new Date(employeeData.joining_date).toLocaleDateString("en-US")
        : "";

      setFormData({
        first_name: employeeData?.first_name || "",
        last_name: employeeData?.last_name || "",
        email: employeeData?.email || "",
        phone_number: employeeData?.phone_number || "",
        companyemail: employeeData?.companyemail || "",
        address: employeeData?.address || "",
        citizenship: employeeData?.citizenship || "",
        date_of_birth: formattedDateOfBirth,
        joining_date: formattedJoiningDate,
        bank_account_no: employeeData?.bank_account_no || "",
        profile: employeeData?.profile || "",
      });

      setAdditionalInfo({
        "Adhar Card Number":
          employeeData?.additionalInfo?.["Adhar Card Number"] || "",
        "Department cost center no":
          employeeData?.additionalInfo?.["Department cost center no"] || "",
        Education: employeeData?.additionalInfo?.Education || "",
        "Emergency contact":
          employeeData?.additionalInfo?.["Emergency contact"] || "",
        "Martial status":
          employeeData?.additionalInfo?.["Martial status"] || "",
        "Middle Name": employeeData?.additionalInfo?.["Middle Name"] || "",
        "Pan Card Number":
          employeeData?.additionalInfo?.["Pan Card Number"] || "",
        "Permanent Address":
          employeeData?.additionalInfo?.["Permanent Address"] || "",
        "Primary nationality":
          employeeData?.additionalInfo?.["Primary nationality"] || "",
        "Relative Information":
          employeeData?.additionalInfo?.["Relative Information"] || "",
        "Shifts allocation":
          employeeData?.additionalInfo?.["Shifts allocation"] || "",
      });
      const employeeWorkLocations = employeeData.worklocation;

      if (employeeWorkLocations && employeeWorkLocations.length > 0) {
        const workLocation = employeeWorkLocations[0]?.city || "";
        setSelectedWorkLocation(workLocation);
      }
    }
  }, [employeeData]);

  // update the data of employee
  const EditEmployeeData = useMutation(
    (data) =>
      axios.put(
        `${process.env.REACT_APP_API}/route/employee/update/${employeeId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: (updatedData) => {
        queryClient.invalidateQueries(["empData", employeeId]);
        handleClose();
        handleAlert(true, "success", "Employee updated successfully");
        // Reload the window to reflect the updated data
        window.location.reload();
        // Update the local state with the updated data
        //console.log(updatedData);
        // console.log(updatedData.data.updatedEmployee.first_name);
        setFormData((prevData) => ({
          ...prevData,
          first_name: updatedData.data.updatedEmployee.first_name || "",
          last_name: updatedData.data.updatedEmployee.last_name || "",
          email: updatedData.data.updatedEmployee.email || "",
          phone_number: updatedData.data.updatedEmployee.phone_number || "",
          companyemail: updatedData.data.updatedEmployee.companyemail || "",
          address: updatedData.data.updatedEmployee.address || "",
          citizenship: updatedData.data.updatedEmployee.citizenship || "",
          date_of_birth: updatedData.data.updatedEmployee.date_of_birth || "",
          joining_date: updatedData.data.updatedEmployee.joining_date || "",
          profile: updatedData.data.updatedEmployee.profile || "",
          bank_account_no:
            updatedData.data.updatedEmployee.bank_account_no || "",
        }));
        // console.log(formData);

        // Update additionalInfo in local state
        setAdditionalInfo((prevData) => ({
          ...prevData,
          "Adhar Card Number":
            updatedData.data.updatedEmployee.additionalInfo?.[
              "Adhar Card Number"
            ] || "",
          "Department cost center no":
            updatedData.data.updatedEmployee.additionalInfo?.[
              "Department cost center no"
            ] || "",
          Education:
            updatedData.data.updatedEmployee.additionalInfo?.Education || "",
          "Emergency contact":
            updatedData.data.updatedEmployee.additionalInfo?.[
              "Emergency contact"
            ] || "",
          "Martial status":
            updatedData.data.updatedEmployee.additionalInfo?.[
              "Martial status"
            ] || "",
          "Middle Name":
            updatedData.data.updatedEmployee.additionalInfo?.["Middle Name"] ||
            "",
          "Pan Card Number":
            updatedData.data.updatedEmployee.additionalInfo?.[
              "Pan Card Number"
            ] || "",
          "Permanent Address":
            updatedData.data.updatedEmployee.additionalInfo?.[
              "Permanent Address"
            ] || "",
          "Primary nationality":
            updatedData.data.updatedEmployee.additionalInfo?.[
              "Primary nationality"
            ] || "",
          "Relative Information":
            updatedData.data.updatedEmployee.additionalInfo?.[
              "Relative Information"
            ] || "",
          "Shifts allocation":
            updatedData.data.updatedEmployee.additionalInfo?.[
              "Shifts allocation"
            ] || "",
        }));
        setSelectedWorkLocation({
          selectedWorkLocation:
            updatedData.data.updatedEmployee.worklocation || "",
        });
        setDepartment({
          deptname: updatedData.data.updatedEmployee.deptname || "",
        });
        setDesignation({
          designation: updatedData.data.updatedEmployee.designation || "",
        });
        setEmployementType({
          employmentType: updatedData.data.updatedEmployee.employmentType || "",
        });
        // console.log(worklocation);
      },

      onError: () => {
        handleAlert("Failed to update employee. Please try again.");
      },
    }
  );

  // when user click on edit employee data button that time invoke this function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (employeeId) {
        const updatedData = {
          ...formData,
          additionalInfo,
          worklocation: [selectedWorkLocation],
          deptname,
          designation,
          employmentType,
        };
        await EditEmployeeData.mutateAsync(updatedData);
      }
    } catch (error) {
      console.error(error);
      handleAlert("Failed to update employee. Please try again.");
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
          Edit Employee Data
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
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Enter First Name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>

          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Last Name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Email
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Phone Number
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Bank Account Number
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="bank_account_no"
                value={formData.bank_account_no}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Comapany Email
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="companyemail"
                value={formData.companyemail}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>

          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Address
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Citizenship
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="citizenship"
                value={formData.citizenship}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Date Of Birth
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>

          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Joining Date
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="joining_date"
                value={formData.joining_date}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>

          <div className="space-y-2 ">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Profile
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Profile"
                name="profile"
                value={formData.profile}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>

          {/* AdditionalInfo fields */}
          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Adhar Card Number
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Adhar Card Number"
                name="Adhar Card Number"
                value={additionalInfo["Adhar Card Number"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Adhar Card Number": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Department cost center no
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Department cost center no"
                name="Department cost center no"
                value={additionalInfo["Department cost center no"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Department cost center no": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>
          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Education
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Education"
                name="Education"
                value={additionalInfo.Education}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    Education: e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>
          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Emergency contact
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Emergency contact"
                name="Emergency contact"
                value={additionalInfo["Emergency contact"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Emergency contact": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>
          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Martial status
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Martial status"
                name="Martial status"
                value={additionalInfo["Martial status"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Martial status": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>

          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Middle Name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Middle Name"
                name="Middle Name"
                value={additionalInfo["Middle Name"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Middle Name": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>
          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Pan Card Number
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Pan Card Number"
                name="Pan Card Number"
                value={additionalInfo["Pan Card Number"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Pan Card Number": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>
          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Permanent Address
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Permanent Address"
                name="Permanent Address"
                value={additionalInfo["Permanent Address"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Permanent Address": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>
          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Primary nationality
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Primary nationality"
                name="Primary nationality"
                value={additionalInfo["Primary nationality"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Primary nationality": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>
          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Relative Information
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Relative Information"
                name="Relative Information"
                value={additionalInfo["Relative Information"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Relative Information": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>
          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Shifts allocation
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Shifts Allocation"
                name="Shifts allocation"
                value={additionalInfo["Shifts allocation"]}
                onChange={(e) =>
                  setAdditionalInfo((prevData) => ({
                    ...prevData,
                    "Shifts allocation": e.target.value,
                  }))
                }
              />
            </FormControl>
          </div>
          <div className="space-y-2">
            <select
              value={selectedWorkLocation}
              onChange={handleLocationChange}
            >
              {availabelLocation.map((location) => (
                <option key={location._id} value={location.city}>
                  {location.city}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="work-location-select">
                Select Department
              </InputLabel>
              <Select
                id="work-location-select"
                value={deptname}
                onChange={handleDepartmnetChange}
                displayEmpty
                inputProps={{ "aria-label": "Work Location" }}
                label="Work Location"
              >
                <MenuItem value="" disabled>
                  Select Department
                </MenuItem>
                {availabelDepartment?.map((department) => (
                  <MenuItem key={department._id} value={department._id}>
                    {department.departmentName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="work-location-select">
                Select Designation
              </InputLabel>
              <Select
                id="work-location-select"
                value={designation}
                onChange={handleDesignationChange}
                displayEmpty
                inputProps={{ "aria-label": "Work Location" }}
                label="Work Location"
              >
                <MenuItem value="" disabled>
                  Select Designation
                </MenuItem>
                {availabelDesignation?.map((designation) => (
                  <MenuItem key={designation._id} value={designation._id}>
                    {designation.designationName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="space-y-2">
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
              <InputLabel htmlFor="work-location-select">
                Select Employement Type
              </InputLabel>
              <Select
                id="work-location-select"
                value={employmentType}
                onChange={handleEmployeMentType}
                displayEmpty
                inputProps={{ "aria-label": "Work Location" }}
                label="Work Location"
              >
                <MenuItem value="" disabled>
                  Select Employement Type
                </MenuItem>
                {availabelEmpTypes?.map((emptypes) => (
                  <MenuItem key={emptypes._id} value={emptypes._id}>
                    {emptypes.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <DialogActions>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={EditEmployeeData.isLoading}
            >
              {EditEmployeeData.isLoading ? (
                <CircularProgress size={20} />
              ) : (
                "Edit Employee Data"
              )}
            </Button>
          </DialogActions>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditModelOpen;
