import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";

const DesignationRow = ({ data, id }) => {
  const [showConfirmationDialog, setShowConfirmationDialog] =
    React.useState(false);
  const [showEditDesignationModal, setShowEditDesignationModal] =
    React.useState(false);

  const handleUpdateConfirmation = () => {
    console.log("update");
  };
  const handleConfirmDelete = () => {
    console.log("delete");
  };

  return (
    <tr className="!font-medium border-b" key={id}>
      <td className="!text-left pl-9">{id + 1}</td>
      <td className=" py-3">{data?.designationName}</td>
      <td className="px-2">
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={() => setShowEditDesignationModal(true)}
        >
          <EditOutlined />
        </IconButton>
        <IconButton
          color="error"
          aria-label="delete"
          onClick={() => setShowConfirmationDialog(true)}
        >
          <DeleteOutline />
        </IconButton>
        <Dialog
          open={showConfirmationDialog}
          onClose={() => setShowConfirmationDialog(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <p>
              Please confirm your decision to delete this designation, as this
              action cannot be undone.
            </p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowConfirmationDialog(false)}
              variant="outlined"
              color="primary"
              size="small"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleConfirmDelete}
              color="error"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={showEditDesignationModal}
          onClose={() => setShowEditDesignationModal(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to update this designation?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              variant="outlined"
              onClick={() => setShowEditDesignationModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleUpdateConfirmation}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </td>
    </tr>
  );
};

export default DesignationRow;
