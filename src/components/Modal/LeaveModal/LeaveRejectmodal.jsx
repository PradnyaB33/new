import EventBusyIcon from "@mui/icons-material/EventBusy";
import { Box, Button, Modal, TextField } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { UseContext } from "../../../State/UseState/UseContext";

// import AddIcon from "@mui/icons-material/Add";
// import axios from "axios";

const LeaveRejectmodal = ({ open, handleClose, id }) => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const [message, setMessage] = useState("");
  console.log(`🚀 ~ message:`, message);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "rgba(255, 255, 255, 0.9)",
    p: 4,
  };

  // console.log(id, "id");
  const RejectRequest = async (e) => {
    e.preventDefault();
    console.log("messaeg", message);

    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/leave/reject/${id}`,
        { message },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.log(error, "err");
    }
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        keepMounted
      >
        <Box
          sx={style}
          className="border-none md:w-[40%] w-[40%] shadow-md outline-none rounded-md"
        >
          <header className="flex items-center mb-4 gap-2">
            <EventBusyIcon className="h-4 w-4 text-gray-700 !text-[1.7rem]" />
            <h1
              id="modal-modal-title"
              className="text-xl font-semibold leading-relaxed "
            >
              Reject leave request
            </h1>
          </header>
          <form onSubmit={RejectRequest}>
            <div className="w-full space-y-2 flex flex-col">
              <TextField
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                size="small"
                id="outlined-basic"
                label="Enter desc for rejecting the leave request"
                variant="outlined"
              />
            </div>
            <div className="flex gap-4 mt-4 justify-end">
              <Button
                type="button"
                size="small"
                onClick={handleClose}
                color="error"
                variant="contained"
              >
                cancal
              </Button>
              <Button
                type="submit"
                size="small"
                variant="contained"
                color="primary"
              >
                submit
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default LeaveRejectmodal;
