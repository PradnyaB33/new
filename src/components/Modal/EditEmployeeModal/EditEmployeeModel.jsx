import React, { useContext, useEffect, useState } from "react";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";

const EditModelOpen = ({ handleClose, open, employeeId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const queryClient = useQueryClient();

  const { data: employeeData } = useQuery(
    ["empData", employeeId],
    async () => {
      if (open && employeeId !== null) {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employee/get-employee-data/${employeeId}`,
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
      enabled: open && employeeId !== null && employeeId !== undefined,
    }
  );

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    deptname: "",
    location: "",
    companyemail: "",
    address: "",
    citizenship: "",
    mgrempid: "",
    employmentType: "",
    date_of_birth: "",
    joining_date: "",
    designation: "",
    profile: "",
  });
  const [error, setError] = useState("");

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
        setFormData((prevData) => ({
          ...prevData,
          first_name: updatedData.data.first_name || "",
          last_name: updatedData.data.last_name || "",
          email: updatedData.data.email || "",
          phone_number: updatedData.data.phone_number || "",
          deptname: updatedData.data.deptname || "",
          location: updatedData.data.location || "",
          companyemail: updatedData.data.companyemail || "",
          address: updatedData.data.address || "",
          citizenship: updatedData.data.citizenship || "",
          mgrempid: updatedData.data.mgrempid || "",
          employmentType: updatedData.data.employmentType || "",
          date_of_birth: updatedData.data.date_of_birth || "",
          joining_date: updatedData.data.joining_date || "",
          designation: updatedData.data.designation || "",
          profile: updatedData.data.profile || "",
        }));
      },
      onError: () => {
        setError("An error occurred while updating the employee");
      },
    }
  );

  useEffect(() => {
    if (employeeData?.empData) {
      setFormData({
        first_name: employeeData?.empData?.first_name || "",
        last_name: employeeData?.empData?.last_name || "",
        email: employeeData?.empData?.email || "",
        phone_number: employeeData?.empData?.phone_number || "",
        deptname: employeeData?.empData?.deptname || "",
        location: employeeData?.empData?.location || "",
        companyemail: employeeData?.empData?.companyemail || "",
        address: employeeData?.empData?.address || "",
        citizenship: employeeData?.empData?.citizenship || "",
        mgrempid: employeeData?.empData?.mgrempid || "",
        employmentType: employeeData?.empData?.location || "",
        date_of_birth: employeeData?.empData?.date_of_birth || "",
        joining_date: employeeData?.empData?.joining_date || "",
        designation: employeeData?.empData?.designation || "",
        profile: employeeData?.empData?.profile || "",
      });
    }
  }, [employeeData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (employeeId) {
        await EditEmployeeData.mutateAsync(formData);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while updating the employee");
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
          {/* <form onSubmit={handleSubmit}> */}
          <div className="space-y-2 ">
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
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
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
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
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
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
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
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
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Location
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Department Name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="deptname"
                value={formData.deptname}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
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
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
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
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
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
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Manager Name
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="mgrempid"
                value={formData.mgrempid}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Employement Type
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="employmentType"
                value={formData.employmentType}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Date of Birth
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
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
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
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Designation
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
              />
            </FormControl>
          </div>
          <div className="space-y-2 ">
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Enter Profile
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employee Data"
                name="profile"
                value={formData.profile}
                onChange={handleInputChange}
              />
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
          {/* </form> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditModelOpen;
