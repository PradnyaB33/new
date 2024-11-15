import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import useEmployeeListStore from "../Mutation/employeeListStore";
import useGeoMutation from "../Mutation/useGeoCard";
import SmallInputForm from "../utils/SmallInputForm";
import TableComponent from "../utils/TableComponent";

// Fetch added employee in geofence area
const fetchAddedEmployee = async (zoneId) => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API}/route/fullskape/zones/${zoneId}/students`
  );
  return data?.data;
};

const FullskapeViewDelete = ({ onClose, zoneId }) => {
    const { handleSubmit, register, setValue, watch } = useForm();
    const { addEmployeeToCircleMutate } = useGeoMutation();
    const { incrementPage, decrementPage, employeeList, page } = useEmployeeListStore();
  
    const [openStudentModal, setOpenStudentModal] = useState(false);
    const { handleSubmit: handleStudentSubmit, register: registerStudent, reset } = useForm();
  
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
  
    // Add new student to the Fullskape zone
    const handleAddStudent = async (studentData) => {
        try {
          await axios.post(
            `${process.env.REACT_APP_API}/route/fullskape/${zoneId}/add-student`,
            studentData
          );
          alert("Student added successfully!");
      
          // Optional: Update the UI or fetch updated data
          reset(); // Reset form fields
          setOpenStudentModal(false); // Close the modal
        } catch (error) {
          console.error("Failed to add student:", error.response?.data?.message || error.message);
          alert("Failed to add student. Please try again.");
        }
      };
      
  
    const { data: addedEmployee } = useQuery(
      ["geoFencingAddedEmployee", zoneId],
      () => fetchAddedEmployee(zoneId),
      {
        enabled: !!zoneId,
      }
    );
  
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-4 flex-col overflow-scroll"
      >
        <SmallInputForm zoneId={zoneId} />
        <div className="flex flex-col gap-4 max-h-[300px] overflow-auto h-auto">
          <TableComponent
            register={register}
            setValue={setValue}
            watch={watch}
            addedEmployee={addedEmployee}
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
        <Button
          type="submit"
          variant="contained"
        >
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
