import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Divider, IconButton, Modal } from "@mui/material";
import React, { useContext } from "react";
import { useQueryClient } from "react-query";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};

const EditEmpProfileModal = () => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const queryClient = useQueryClient();

  return (
    <Modal
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
      >
        <div className="flex justify-between py-4 items-center  px-4">
          <h1
            id="modal-modal-title"
            className="text-lg pl-2 font-semibold"
          ></h1>
          <IconButton>
            <CloseIcon className="!text-[16px]" />
          </IconButton>
        </div>

        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>

        <div className="px-5 space-y-4 mt-4">
          <div className="space-y-2 "></div>

          <div className="flex gap-4  mt-4 justify-end">
            <Button color="error" variant="outlined">
              Cancel
            </Button>

            <Button variant="contained" color="primary">
              Update
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default EditEmpProfileModal;
