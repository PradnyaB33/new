import { Box, Modal } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import useGetDelegateSuperAdmin from "../../hooks/QueryHook/Delegate-Super-Admin/hook";
import MiniForm from "./components/form";

const AddDelegate = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetDelegateSuperAdmin();
  console.log(`🚀 ~ file: AddDelegate.jsx:38 ~ data:`, data);

  return (
    <Modal
      keepMounted={false}
      open={true}
      onClose={() => {
        navigate(-1);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="border-none !z-10 shadow-md outline-none rounded-md gap-2 flex flex-col absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-white p-4 overflow-auto w-fit items-center h-min">
        {!isLoading && <MiniForm data={data} />}
      </Box>
    </Modal>
  );
};

export default AddDelegate;
