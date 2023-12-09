import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { TestContext } from "../../../../State/Function/Main";
import { UseContext } from "../../../../State/UseState/UseContext";
import LeaveTypeModal from "../../../../components/Modal/LeaveTypeModal/leave-type-modal";

const LeaveTypeEditBox = ({ leaveType, index }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleEditType = () => {
    setOpen(true);
  };

  const handleDeleteTypeConfirmation = () => {
    setConfirmOpen(true);
  };

  const handleDeleteType = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/route/leave-types-details/${leaveType._id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", response.data.message);
      queryClient.invalidateQueries("leaveTypes");
      setConfirmOpen(false);
    } catch (error) {
      console.error("Failed to delete leave type:", error);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message ||
          "Failed to delete leave type. Please try again."
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <tr
      id={index}
      className={`${
        index % 2 === 0 ? "bg-gray-50" : "bg-white"
      } border-b dark:border-neutral-500`}
    >
      <td className="whitespace-nowrap px-6 py-2 font-medium">{index + 1}</td>
      <td className="whitespace-nowrap px-6 py-2">{leaveType.leaveName}</td>
      <td className="whitespace-nowrap px-6 py-2">
        <Chip
          variant="outlined"
          size="small"
          color={leaveType.isActive ? "info" : "warning"}
          label={leaveType.isActive ? "active" : "In-Active"}
        />
      </td>
      <td className="whitespace-nowrap px-6 py-2">
        <div
          className={`rounded-full overflow-hidden relative`}
          style={{
            height: "30px",
            width: "30px",
            background: leaveType.color,
          }}
        ></div>
      </td>
      <td className="whitespace-nowrap px-6 py-2">{leaveType.count}</td>
      <td className="whitespace-nowrap px-6 py-2">
        <IconButton onClick={handleDeleteTypeConfirmation}>
          <Delete className="!text-xl" color="error" />
        </IconButton>
        <IconButton onClick={handleEditType}>
          <Edit className="!text-xl" color="success" />
        </IconButton>
      </td>

      <LeaveTypeModal
        open={open}
        handleClose={handleClose}
        id={leaveType._id}
        leaveType={leaveType}
      />
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this leave type?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmOpen(false);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteType} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </tr>
  );
};

export default LeaveTypeEditBox;
