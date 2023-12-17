import React, { useContext, useEffect, useState } from "react";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Modal,
  OutlinedInput,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

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
        <div className="flex justify-between py-6 items-center  px-6">
          <h1 id="modal-modal-title" className="text-lg pl-2 font-semibold">
            Edit Employee Data
          </h1>
          <IconButton onClick={handleClose}>
            <CloseIcon className="!text-[16px]" />
          </IconButton>
        </div>

        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>

        <div className="px-5 space-y-4 mt-4">
          <form onSubmit={handleSubmit}>
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

              {error && <p className="text-red-500">*{error}</p>}
            </div>

            <div className="flex gap-4  mt-4 justify-end">
              <Button onClick={handleClose} color="error" variant="outlined">
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={EditEmployeeData.isLoading}
              >
                {EditEmployeeData.isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  "Edit Employee Data"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default EditModelOpen;

// import React, { useContext, useEffect, useState } from "react";
// import { TestContext } from "../../../State/Function/Main";
// import { UseContext } from "../../../State/UseState/UseContext";
// import axios from "axios";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import CloseIcon from "@mui/icons-material/Close";
// import {
//   Box,
//   Button,
//   CircularProgress,
//   Divider,
//   FormControl,
//   IconButton,
//   InputLabel,
//   Modal,
//   OutlinedInput,
// } from "@mui/material";
// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   bgcolor: "background.paper",
//   p: 4,
// };

// const EditModelOpen = ({ handleClose, open, employeeId }) => {
//   const { handleAlert } = useContext(TestContext);
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aeigs"];
//   const queryClient = useQueryClient();

//   const { data } = useQuery(
//     ["empData", employeeId],
//     async () => {
//       if (open && employeeId !== null) {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API}/route/employee/get-employee-data/${employeeId}`,
//           {
//             headers: {
//               Authorization: authToken,
//             },
//           }
//         );
//         return response.data;
//       }
//     },
//     {
//       enabled: open && employeeId !== null && employeeId !== undefined,
//     }
//   );

//   const [first_name, setFirstName] = useState("");
//   const [last_name, setLastName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone_number, setPhoneNumber] = useState("");
//   const [deptname, setDeptName] = useState("");
//   const [location, setLocation] = useState("");
//   const [error, setError] = useState("");

//   const EditEmployeeData = useMutation(
//     (data) =>
//       axios.put(
//         `${process.env.REACT_APP_API}/route/employee/update/${employeeId}`,
//         data,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       ),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ["empData"] });
//         handleClose();
//         handleAlert(true, "success", "Employee  updated succesfully");
//       },
//       onError: () => {
//         setError("An error occurred while creating a employee");
//       },
//     }
//   );

//   useEffect(() => {
//     if (data?.empData) {
//       setFirstName(data?.empData?.first_name || "");
//     }
//     if (data?.empData) {
//       setLastName(data?.empData?.last_name || "");
//     }
//     if (data?.empData) {
//       setEmail(data?.empData?.email || "");
//     }
//     if (data?.empData) {
//       setPhoneNumber(data?.empData?.phone_number || "");
//     }
//     if (data?.empData) {
//       setDeptName(data?.empData?.deptname || "");
//     }
//     if (data?.empData) {
//       setLocation(data?.empData?.location || "");
//     }
//   }, [data]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const data = {
//         first_name,
//         last_name,
//         email,
//         phone_number,
//         deptname,
//         location,
//       };

//       if (employeeId) {
//         await EditEmployeeData.mutateAsync(data);
//       }
//     } catch (error) {
//       console.error(error);
//       setError("An error occurred while creating a neemppTypet");
//     }
//   };

//   return (
//     <Modal
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <Box
//         sx={style}
//         className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
//       >
//         <div className="flex justify-between py-4 items-center  px-4">
//           <h1 id="modal-modal-title" className="text-lg pl-2 font-semibold">
//             Edit Employee Data
//           </h1>
//           <IconButton onClick={handleClose}>
//             <CloseIcon className="!text-[16px]" />
//           </IconButton>
//         </div>

//         <div className="w-full">
//           <Divider variant="fullWidth" orientation="horizontal" />
//         </div>

//         <div className="px-5 space-y-4 mt-4">
//           <div className="space-y-2 ">
//             <FormControl
//               error={error}
//               size="small"
//               sx={{ width: "100%" }}
//               variant="outlined"
//             >
//               <InputLabel htmlFor="outlined-adornment-password">
//                 Enter First Name
//               </InputLabel>
//               <OutlinedInput
//                 id="outlined-adornment-password"
//                 label="Add Employee Data"
//                 value={first_name}
//                 onChange={(e) => setFirstName(e.target.value)}
//               />
//             </FormControl>
//             <FormControl
//               error={error}
//               size="small"
//               sx={{ width: "100%" }}
//               variant="outlined"
//             >
//               <InputLabel htmlFor="outlined-adornment-password">
//                 Enter last name
//               </InputLabel>
//               <OutlinedInput
//                 id="outlined-adornment-password"
//                 label="Add Employee Data"
//                 value={last_name}
//                 onChange={(e) => setLastName(e.target.value)}
//               />
//             </FormControl>

//             <FormControl
//               error={error}
//               size="small"
//               sx={{ width: "100%" }}
//               variant="outlined"
//             >
//               <InputLabel htmlFor="outlined-adornment-password">
//                 Enter Email
//               </InputLabel>
//               <OutlinedInput
//                 id="outlined-adornment-password"
//                 label="Add Employee Data"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </FormControl>

//             <FormControl
//               error={error}
//               size="small"
//               sx={{ width: "100%" }}
//               variant="outlined"
//             >
//               <InputLabel htmlFor="outlined-adornment-password">
//                 Enter Phone Number
//               </InputLabel>
//               <OutlinedInput
//                 id="outlined-adornment-password"
//                 label="Add Employee Data"
//                 value={phone_number}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//               />
//             </FormControl>

//             <FormControl
//               error={error}
//               size="small"
//               sx={{ width: "100%" }}
//               variant="outlined"
//             >
//               <InputLabel htmlFor="outlined-adornment-password">
//                 Enter Department Name
//               </InputLabel>
//               <OutlinedInput
//                 id="outlined-adornment-password"
//                 label="Add Employee Data"
//                 value={deptname}
//                 onChange={(e) => setDeptName(e.target.value)}
//               />
//             </FormControl>

//             <FormControl
//               error={error}
//               size="small"
//               sx={{ width: "100%" }}
//               variant="outlined"
//             >
//               <InputLabel htmlFor="outlined-adornment-password">
//                 Enter Location
//               </InputLabel>
//               <OutlinedInput
//                 id="outlined-adornment-password"
//                 label="Add Employee Data"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//               />
//             </FormControl>

//             {error && <p className="text-red-500">*{error}</p>}
//           </div>

//           <div className="flex gap-4  mt-4 justify-end">
//             <Button onClick={handleClose} color="error" variant="outlined">
//               Cancel
//             </Button>

//             <Button
//               onClick={handleSubmit}
//               variant="contained"
//               color="primary"
//               disabled={EditEmployeeData.isLoading}
//             >
//               {EditEmployeeData.isLoading ? (
//                 <CircularProgress size={20} />
//               ) : (
//                 "Edit Employee Data"
//               )}
//             </Button>
//           </div>
//         </div>
//       </Box>
//     </Modal>
//   );
// };

// export default EditModelOpen;
