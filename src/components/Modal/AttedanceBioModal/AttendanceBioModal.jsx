import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  FormLabel,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
} from "@mui/material";
import React from "react";

const AttendanceBioModal = ({
  handleClose,
  open,
  organisationId,
  selectedEmployees,
}) => {
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
        <h1 className="text-xl pl-2 font-semibold font-sans">Employee</h1>
      </div>

      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <DialogActions sx={{ justifyContent: "end" }}>
          <Button color="error" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>

          <Button variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceBioModal;
