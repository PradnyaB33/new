import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Modal } from "@mui/material";
import React from "react";

export const DocPreviewModal = ({ fileData, setOpenState, openState }) => {
  const closeModal = () => {
    setOpenState(false);
  };

  const isImage = (fileData) => {
    return fileData && fileData.type && fileData.type.startsWith("image/");
  };

  return (
    <Modal
      open={openState}
      onClose={closeModal}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="bg-white p-[30px] w-[40%] h-[80%] rounded-lg relative flex justify-center flex-col">
        {fileData && (
          <>
            <IconButton
              aria-label="close"
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                backgroundColor: "red",
              }}
            >
              <CloseIcon style={{ color: "white" }} />
            </IconButton>
            <div
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isImage(fileData) ? (
                <img
                  className="w-[400px]"
                  src={URL.createObjectURL(fileData)}
                  alt=""
                />
              ) : (
                <iframe
                  title="Document Preview"
                  src={URL.createObjectURL(fileData)}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DocPreviewModal;
