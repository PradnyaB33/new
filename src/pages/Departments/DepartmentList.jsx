import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import axios from "axios";
import { Delete, Edit, Warning } from "@mui/icons-material";
import { useMutation, useQueryClient } from "react-query";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

const DepartmentList = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { organisationId } = useParams();
  const queryClient = useQueryClient();
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  //pull the department list
  const [departmentList, setDepartmentList] = useState([]);
  const fetchDepartmentList = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/department/get/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      setDepartmentList(response.data.department);
    } catch (error) {
      console.error(error);
      handleAlert(true, "error", "Failed to fetch Department");
    }
  };
  useEffect(() => {
    fetchDepartmentList();
    // eslint-disable-next-line
  }, []);

  console.log(departmentList);

  // Delete Query for deleting Single Department
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    setDepartmentList((department) =>
      department.filter((department) => department._id !== id)
    );
    setDeleteConfirmation(null);
  };

  const deleteMutation = useMutation(
    (id) =>
      axios.delete(
        `${process.env.REACT_APP_API}/route/department/delete/${organisationId}/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("department");
        handleAlert(true, "success", "Department deleted succesfully");
      },
    }
  );

  return (
    <>
      {departmentList?.length === 0 ? (
        <Typography variant="h5" className="text-center mb-2 text-red-600">
          <Warning /> No departments added, please add department first.
        </Typography>
      ) : (
        <div className="p-4">
          <Typography variant="h4" className="text-center mb-6">
            Department List
          </Typography>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-left text-sm font-light">
              <thead className="border-b bg-gray-300 font-medium dark:border-neutral-500">
                <tr className="!font-medium">
                  <th scope="col" className="px-3 py-3 whitespace-nowrap">
                    Sr. No
                  </th>
                  <th scope="col" className="px-3 py-3 ">
                    Department Name
                  </th>
                  <th scope="col" className="px-3 py-3 ">
                    Department Head
                  </th>
                  <th scope="col" className="px-3 py-3 ">
                    Department Head Delegate
                  </th>
                  <th scope="col" className="px-3 py-3 ">
                    Department Location
                  </th>
                  <th scope="col" className="px-3 py-3 ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {departmentList?.map((department, id) => (
                  <tr
                    key={id}
                    className={`${
                      id % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } border-b dark:border-neutral-500 !font-medium`}
                  >
                    <td className="py-2 px-3">{id + 1}</td>
                    <td className="py-2 px-3">{department?.departmentName}</td>
                    <td className="py-2 px-3">
                      {department?.departmentHeadName}
                    </td>
                    <td className="py-2 px-3">
                      {department?.departmentHeadDelegateName}
                    </td>
                    <td className="py-2 px-3">
                      {department?.departmentLocation?.city || ""}
                    </td>

                    <td className="whitespace-nowrap px-3 py-2">
                      <IconButton aria-label="edit">
                        <Edit className="!text-xl" color="success" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteConfirmation(department._id)}
                        aria-label="delete"
                      >
                        <Delete className="!text-xl" color="error" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* this dialogue for deleting single department*/}
      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle color={"error"}>
          <Warning color="error" /> All information of Department will be
          deleted. Are you sure you want to delete it?
        </DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this department, as this
            action cannot be retrived
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(deleteConfirmation)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DepartmentList;
