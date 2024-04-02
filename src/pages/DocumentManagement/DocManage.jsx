import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import { getSignedUrlForDocs, uploadFile } from "../../services/docManageS3";
import DocPreviewModal from "./components/Modal";

const DocManage = () => {
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];
  const options = [
    "Aadhar Card",
    "Pan Card",
    "SSC Certificate",
    "HSC Certificate",
    "Passport",
    "Voter Id Card",
  ];
  const { setAppAlert } = useContext(UseContext);
  const [documentFields, setDocumentFields] = useState([
    { selectedValue: "", uploadedFile: null, fileName: "no file selected" },
  ]);

  useEffect(() => {
    console.log(documentFields);
  }, [documentFields]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);

  const handleSelect = (index, value) => {
    const updatedDocumentFields = [...documentFields];
    updatedDocumentFields[index].selectedValue = value;
    setDocumentFields(updatedDocumentFields);
  };

  const handleFileUpload = (index, event) => {
    const files = event.target.files;
    const file = files[0];
    const updatedDocumentFields = [...documentFields];
    updatedDocumentFields[index].uploadedFile = file;
    updatedDocumentFields[index].fileName = file
      ? file.name
      : "No file selected";
    setDocumentFields(updatedDocumentFields);
  };

  const handleSubmit = async () => {
    try {
      const isDocumentSelected = documentFields.some(
        (field) => field.uploadedFile
      );

      if (!isDocumentSelected) {
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Select documents first",
        });
        return;
      }
      const formData = {};

      for (let i = 0; i < documentFields.length; i++) {
        const { selectedValue, uploadedFile } = documentFields[i];
        if (uploadedFile) {
          const signedUrlResponse = await getSignedUrlForDocs(token);
          const signedUrl = signedUrlResponse.url;

          await uploadFile(signedUrl, uploadedFile);

          const fileUrl = signedUrl.split("?")[0];

          const key = selectedValue.toLowerCase().split(" ")[0];
          formData[key] = fileUrl;
        }
      }

      await axios.post(
        "http://localhost:4000/route/emp/adddocuments",
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setAppAlert({
        alert: true,
        type: "success",
        msg: "All documents are uploaded successfully",
      });

      console.log("All files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleAddMore = () => {
    setDocumentFields((prevState) => [
      ...prevState,
      { selectedValue: "", uploadedFile: null, fileName: "No file selected" },
    ]);
  };

  const handleDiscardRow = (index) => {
    setDocumentFields((prevState) => prevState.filter((_, i) => i !== index));
  };

  const openModal = (index) => {
    setPreviewIndex(index);
    setUploadedFiles((prevFiles) => [
      ...prevFiles.slice(0, index),
      documentFields[index].uploadedFile,
      ...prevFiles.slice(index + 1),
    ]);
    setShowModal(true);
  };
  return (
    <div className="w-full h-full flex justify-center items-center pb-5">
      <div className="w-full h-full flex justify-center items-center mt-10">
        <div
          style={{
            boxShadow:
              "0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)",
          }}
          className="w-[800px] mt-6 pl-6 pr-6 pt-3 pb-3 rounded-lg"
        >
          <div
            style={{ borderBottom: "2px solid #b8b8b8" }}
            className="text-center text-3xl mb-5 pb-3 w-full"
          >
            Document Management
          </div>
          {documentFields.map((field, index) => (
            <div
              key={index}
              style={{
                boxShadow:
                  "0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)",
              }}
              className="w-full h-[8vh] flex items-center justify-between pl-3 pr-3 mb-4 rounded-lg"
            >
              <FormControl className="sm:w-[170px]" size="small">
                <InputLabel id={`demo-simple-select-label-${index}`}>
                  Select Document
                </InputLabel>
                <Select
                  labelId={`demo-simple-select-label-${index}`}
                  label="Select Document"
                  value={field.selectedValue}
                  size="small"
                  onChange={(e) => handleSelect(index, e.target.value)}
                >
                  {options.map((option, optionIndex) => (
                    <MenuItem key={optionIndex} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  id={`file-upload-${index}`}
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(index, e)}
                />
                <div className="w-8 h-8 flex justify-center items-center rounded-full mr-2">
                  {field.uploadedFile && (
                    <CheckIcon
                      style={{
                        color: "#FFF",
                        backgroundColor: "#25E52E",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </div>
                <label htmlFor={`file-upload-${index}`}>
                  <div className="w-28">
                    <Button
                      size="small"
                      variant="contained"
                      component="span"
                      disabled={!field.selectedValue}
                    >
                      Upload
                    </Button>
                  </div>
                </label>
                <span className="w-28 text-xs">{field.fileName}</span>
                <Button
                  size="small"
                  color="secondary"
                  disabled={!field.uploadedFile}
                  variant="contained"
                  onClick={() => openModal(index)}
                >
                  Show Doc
                </Button>
                {documentFields.length > 1 && index === 0 && (
                  <div
                    className="h-6 w-6 flex justify-center items-center rounded-full ml-2 bg-[#FF3737] cursor-pointer"
                    onClick={() => handleDiscardRow(index)}
                  >
                    <DeleteIcon
                      style={{
                        color: "#FFF",
                      }}
                      fontSize="small"
                    />
                  </div>
                )}
                {documentFields.length > 1 && index !== 0 && (
                  <div
                    className="h-6 w-6 flex justify-center items-center rounded-full ml-2 bg-[#FF3737] cursor-pointer"
                    onClick={() => handleDiscardRow(index)}
                  >
                    <DeleteIcon
                      style={{
                        color: "#FFF",
                      }}
                      fontSize="small"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="w-full flex justify-center mt-6 gap-4 mb-2">
            <Button
              size="small"
              variant="contained"
              color="warning"
              onClick={handleAddMore}
            >
              Add More
            </Button>
            <Button
              size="small"
              color="success"
              variant="contained"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
        <DocPreviewModal
          fileData={uploadedFiles[previewIndex]}
          openState={showModal}
          setOpenState={setShowModal}
        />
      </div>
    </div>
  );
};

export default DocManage;
