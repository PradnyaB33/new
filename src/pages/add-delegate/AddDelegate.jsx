import { Box } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import ReusableModal from "../../components/Modal/component";
import useGetDelegateSuperAdmin from "../../hooks/QueryHook/Delegate-Super-Admin/hook";
import MiniForm from "./components/form";

const AddDelegate = () => {
  const navigate = useNavigate();
  const { data, isLoading, isFetching } = useGetDelegateSuperAdmin();
  const handleClose = () => {
    navigate(-1);
  };
  if (isLoading) {
    return (
      <ReusableModal
        heading={"Add Delegate Super Admin"}
        open={true}
        onClose={handleClose}
      >
        <Box className="border-none !z-10 shadow-md outline-none rounded-md gap-2 flex flex-col absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-white p-4 overflow-auto w-fit items-center h-min">
          Loading
        </Box>
      </ReusableModal>
    );
  }
  if (isFetching) {
    return (
      <ReusableModal
        heading={"Add Delegate Super Admin"}
        open={true}
        onClose={handleClose}
      >
        <Box className="border-none !z-10 shadow-md outline-none rounded-md gap-2 flex flex-col absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] bg-white p-4 overflow-auto w-fit items-center h-min">
          Loading
        </Box>
      </ReusableModal>
    );
  }

  return (
    <ReusableModal
      heading={"Add Delegate Super Admin"}
      open={true}
      onClose={handleClose}
    >
      {isLoading || isFetching ? "Loading" : <MiniForm data={data} />}
    </ReusableModal>
  );
};

export default AddDelegate;
