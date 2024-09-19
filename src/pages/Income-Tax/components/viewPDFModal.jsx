import React from "react";
import ReusableModal from "../../../components/Modal/component";

const viewPDFModal = () => {
  return (
    <ReusableModal
      open={open}
      onClose={() => setOpen(false)}
      heading={
        typeof open !== "object"
          ? "Create Tax Declaration"
          : "Edit Tax Declaration"
      }
    >
      <div className="p-4"></div>
    </ReusableModal>
  );
};

export default viewPDFModal;
