// import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
// import axios from "axios";
// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useQuery } from "react-query";
// import useGeoMutation from "../Mutation/useGeoCard";
// import SmallInputForm from "../utils/SmallInputForm";
// import FullskapeTableComponent from "./FullskapeTable";
// import useStudentListStore from "./useStudentListStore";


// // Fetch added employee in geofence area
// const fetchAddedStudents = async (zoneId) => {
//   const { data } = await axios.get(
//     `${process.env.REACT_APP_API}/route/fullskape/zones/${zoneId}/students`
//   );
//   console.log("fetchAddedEmployee", data);
  
//   return data?.data;
// };

// const FullskapeViewDelete = ({ onClose, zoneId }) => {
//     const { handleSubmit, register, setValue, watch } = useForm();
//     const { addEmployeeToCircleMutate } = useGeoMutation();
//     const { incrementPage, decrementPage, employeeList, page } = useStudentListStore();
  
//     const [openStudentModal, setOpenStudentModal] = useState(false);
//     const { handleSubmit: handleStudentSubmit, register: registerStudent, reset } = useForm();
  
//     const onSubmit = (data) => {
//       const selected = Object.entries(data).reduce((acc, [key, value]) => {
//         if (value !== false) {
//           acc[key] = value;
//         }
//         return acc;
//       }, {});
//       const selectedId = Object.keys(selected).filter((key) => key !== "selectAll");
//       addEmployeeToCircleMutate({ zoneId, employeeId: selectedId, onClose });
//     };
  
//     // Add new student to the Fullskape zone
//     const handleAddStudent = async (studentData) => {
//         try {
//           await axios.post(
//             `${process.env.REACT_APP_API}/route/fullskape/${zoneId}/add-student`,
//             studentData
//           );   
//           // Optional: Update the UI or fetch updated data
//           reset(); // Reset form fields
//           setOpenStudentModal(false); // Close the modal
//         } catch (error) {
//           console.error("Failed to add student:", error.response?.data?.message || error.message);
//           alert("Failed to add student. Please try again.");
//         }
//       };
      
  
//       const { data: addedEmployee } = useQuery(
//         ["addedStudents", zoneId],
//         () => fetchAddedStudents(zoneId),
//         {
//           enabled: !!zoneId,
//           onSuccess: (data) => console.log("Fetched addedStudents:", data),
//         }
//       );
      
  
//     return (
//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="flex gap-4 flex-col overflow-scroll"
//       >
//         <SmallInputForm zoneId={zoneId} />
//         <div className="flex flex-col gap-4 max-h-[300px] overflow-auto h-auto">
//           <FullskapeTableComponent
//             register={register}
//             setValue={setValue}
//             watch={watch}
//             addedEmployee={addedEmployee}
//             zoneId={zoneId}
//           />
//         </div>
//         <div className="flex justify-between items-center">
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={() => setOpenStudentModal(true)}
//           >
//             Add Student
//           </Button>
//           <div className="flex flex-row-reverse gap-4">
//             <Button
//               type="button"
//               onClick={incrementPage}
//               disabled={employeeList?.length < 10}
//               variant="outlined"
//               className="!py-1 !w-[20px]"
//             >
//               Next
//             </Button>
//             <Button
//               onClick={decrementPage}
//               disabled={page <= 0}
//               type="button"
//               variant="outlined"
//               className="!py-1 !w-[20px]"
//             >
//               Pre
//             </Button>
//           </div>
//         </div>
//         <Button
//           type="submit"
//           variant="contained"
//         >
//           Save
//         </Button>
  
//         {/* Add Student Modal */}
//         <Dialog
//           open={openStudentModal}
//           onClose={() => setOpenStudentModal(false)}
//         >
//           <DialogTitle>Add Student</DialogTitle>
//           <form onSubmit={handleStudentSubmit(handleAddStudent)}>
//             <DialogContent>
//               <TextField
//                 label="Student Name"
//                 fullWidth
//                 margin="dense"
//                 {...registerStudent("name", { required: true })}
//               />
//               <TextField
//                 label="Parent's Contact Number"
//                 fullWidth
//                 margin="dense"
//                 {...registerStudent("parentPhoneNumber", { required: true })}
//               />
//               <TextField
//                 label="Parent's Email"
//                 fullWidth
//                 margin="dense"
//                 {...registerStudent("parentEmail", { required: true })}
//               />
//               <TextField
//                 label="Student's Contact Number"
//                 fullWidth
//                 margin="dense"
//                 {...registerStudent("studentPhoneNumber", { required: true })}
//               />
//               <TextField
//                 label="Class"
//                 fullWidth
//                 margin="dense"
//                 {...registerStudent("class", { required: true })}
//               />
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setOpenStudentModal(false)}>Cancel</Button>
//               <Button type="submit" variant="contained">
//                 Add
//               </Button>
//             </DialogActions>
//           </form>
//         </Dialog>
//       </form>
//     );
//   };
  

// export default FullskapeViewDelete;

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
  } from "@mui/material";
  import axios from "axios";
  import React, { useState } from "react";
  import { useForm } from "react-hook-form";
  import { useQuery } from "react-query";
  import useGeoMutation from "../Mutation/useGeoCard";
  import SmallInputForm from "../utils/SmallInputForm";
  import FullskapeTableComponent from "./FullskapeTable";
  import useStudentListStore from "./useStudentListStore";
import useAuthToken from "../../../hooks/Token/useAuth";
  
  // Fetch added employee in geofence area
  const fetchAddedStudents = async (zoneId) => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/fullskape/zones/${zoneId}/students`
    );
    console.log("fetchAddedEmployee", data);
    return data?.data;
  };
  
  const FullskapeViewDelete = ({ onClose, zoneId }) => {
    const { handleSubmit, register, setValue, watch } = useForm();
    const { addEmployeeToCircleMutate } = useGeoMutation();
    const { incrementPage, decrementPage, employeeList, page } = useStudentListStore();
  
    const [openStudentModal, setOpenStudentModal] = useState(false);
    const { handleSubmit: handleStudentSubmit, register: registerStudent, reset } = useForm();
    const [selectedImage, setSelectedImage] = useState(null);
  
    const onSubmit = (data) => {
      const selected = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== false) {
          acc[key] = value;
        }
        return acc;
      }, {});
      const selectedId = Object.keys(selected).filter((key) => key !== "selectAll");
      addEmployeeToCircleMutate({ zoneId, employeeId: selectedId, onClose });
    };
  
    // Handle file change for image upload
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setSelectedImage(URL.createObjectURL(file)); // Create a preview URL for the uploaded image
      }
    };

    const authToken = useAuthToken();

    const uploadStudentImage = async (file) => {
        if (!file) {
          throw new Error("No file provided for upload.");
        }
      
        try {
          // Step 1: Fetch signed URL from the backend
          const { data: { url } } = await axios.get(
            `${process.env.REACT_APP_API}/route/s3createFile/StudentImage`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: authToken,
              },
            }
          );
      
          // Step 2: Upload file to S3 using the signed URL
          await axios.put(url, file, {
            headers: {
              "Content-Type": file.type,
            },
          });
      
          // Step 3: Extract and return the image URL (without query parameters)
          return url.split("?")[0];
        } catch (error) {
          console.error("Image upload failed:", error.message);
          throw new Error("Failed to upload the image.");
        }
      };
      
      
      const handleAddStudent = async (studentData) => {
        try {
          let imageUrl = null;
      
          // Upload the image if available
          if (selectedImage) {
            const file = document.querySelector('input[type="file"]').files[0];
            console.log("File to upload:", file); // Add this log
            if (file.size > 1 * 1024 * 1024) {
              alert("Image size must not exceed 1MB.");
              return;
            }
            imageUrl = await uploadStudentImage(file);
          }
          
      
          // Prepare the final student data payload
          const updatedData = {
            ...studentData,
            imageUrl, // Add the uploaded image URL (if exists)
          };
          console.log("Student data payload:", updatedData);


          console.log("Making API call to add student...");

      
          // Submit student data to the backend
          const response = await axios.post(
            `${process.env.REACT_APP_API}/route/fullskape/${zoneId}/add-student`,
            updatedData,
            {
              headers: {
                Authorization: authToken,
              },
            }
          );
      
          if (response.data.success) {
            
            reset(); // Reset form fields
            setSelectedImage(null); // Clear the selected image
            setOpenStudentModal(false); // Close the modal
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          console.error("Failed to add student:", error.message);
          
        }
      };
      
      
  
    const { data: addedEmployee } = useQuery(
      ["addedStudents", zoneId],
      () => fetchAddedStudents(zoneId),
      {
        enabled: !!zoneId,
        onSuccess: (data) => console.log("Fetched addedStudents:", data),
      }
    );
  
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-4 flex-col overflow-scroll"
      >
        <SmallInputForm zoneId={zoneId} />
        <div className="flex flex-col gap-4 max-h-[300px] overflow-auto h-auto">
          <FullskapeTableComponent
            register={register}
            setValue={setValue}
            watch={watch}
            addedEmployee={addedEmployee}
            zoneId={zoneId}
          />
        </div>
        <div className="flex justify-between items-center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenStudentModal(true)}
          >
            Add Student
          </Button>
          <div className="flex flex-row-reverse gap-4">
            <Button
              type="button"
              onClick={incrementPage}
              disabled={employeeList?.length < 10}
              variant="outlined"
              className="!py-1 !w-[20px]"
            >
              Next
            </Button>
            <Button
              onClick={decrementPage}
              disabled={page <= 0}
              type="button"
              variant="outlined"
              className="!py-1 !w-[20px]"
            >
              Pre
            </Button>
          </div>
        </div>
        <Button type="submit" variant="contained">
          Save
        </Button>
  
        {/* Add Student Modal */}
        <Dialog
          open={openStudentModal}
          onClose={() => setOpenStudentModal(false)}
        >
          <DialogTitle>Add Student</DialogTitle>
          <form onSubmit={handleStudentSubmit(handleAddStudent)}>
            <DialogContent>
              <TextField
                label="Student Name"
                fullWidth
                margin="dense"
                {...registerStudent("name", { required: true })}
              />
              <TextField
                label="Parent's Contact Number"
                fullWidth
                margin="dense"
                {...registerStudent("parentPhoneNumber", { required: true })}
              />
              <TextField
                label="Parent's Email"
                fullWidth
                margin="dense"
                {...registerStudent("parentEmail", { required: true })}
              />
              <TextField
                label="Student's Contact Number"
                fullWidth
                margin="dense"
                {...registerStudent("studentPhoneNumber", { required: true })}
              />
              <TextField
                label="Class"
                fullWidth
                margin="dense"
                {...registerStudent("class", { required: true })}
              />
              <div>
                <label>Upload Student Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {selectedImage && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={selectedImage}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "150px" }}
                    />
                  </div>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenStudentModal(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                Add
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </form>
    );
  };
  
  export default FullskapeViewDelete;
