import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import { getSignedUrlForDocs, uploadFile } from "../../services/docManageS3";
import DocPreviewModal from "./components/Modal";

const MAX_TOTAL_FILE_SIZE = 500 * 1024;

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
    "Custom",
  ];
  const { setAppAlert } = useContext(UseContext);
  const [documentFields, setDocumentFields] = useState([
    {
      selectedValue: "",
      uploadedFile: null,
      fileName: "no file selected",
      customDocumentName: "",
      loading: false, // Add loading state for each document field
    },
  ]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [totalFileSize, setTotalFileSize] = useState(0);

  useEffect(() => {
    console.log(documentFields);
  }, [documentFields]);

  useEffect(() => {
    let totalSize = 0;
    documentFields.forEach((field) => {
      if (field.uploadedFile) {
        totalSize += field.uploadedFile.size;
      }
    });
    setTotalFileSize(totalSize);
  }, [documentFields]);

  const handleSelect = (index, value) => {
    const updatedDocumentFields = [...documentFields];
    updatedDocumentFields[index].selectedValue = value;

    if (value === "Custom") {
      updatedDocumentFields[index].selectedValue = "";
      updatedDocumentFields[index].isCustom = true;
    } else {
      updatedDocumentFields[index].isCustom = false;
    }
    setDocumentFields(updatedDocumentFields);
  };

  const handleFileUpload = (index, event) => {
    const files = event.target.files;
    const file = files[0];

    if (file.size > MAX_TOTAL_FILE_SIZE) {
      setAppAlert({
        alert: true,
        type: "error",
        msg: `File "${file.name}" exceeds the size limit of 500 KB`,
      });
      event.target.value = null;
      return;
    }

    const updatedDocumentFields = [...documentFields];
    updatedDocumentFields[index].uploadedFile = file;
    updatedDocumentFields[index].fileName = file
      ? file.name
      : "No file selected";
    setDocumentFields(updatedDocumentFields);
  };

  const handleSubmit = async () => {
    try {
      if (totalFileSize > MAX_TOTAL_FILE_SIZE) {
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Total file size exceeds the limit of 500 KB",
        });
        return;
      }

      const formData = {
        predefinedFields: {},
        customFields: {},
      };

      let canSubmit = true;

      for (let i = 0; i < documentFields.length; i++) {
        const { selectedValue, uploadedFile, isCustom, customDocumentName } =
          documentFields[i];

        if (
          (!selectedValue && !isCustom) ||
          (isCustom && !customDocumentName)
        ) {
          setAppAlert({
            alert: true,
            type: "error",
            msg: "Please select a document and provide a custom name for all fields.",
          });
          canSubmit = false;
          break;
        }

        if (uploadedFile) {
          const signedUrlResponse = await getSignedUrlForDocs(token, {
            documentName: isCustom ? customDocumentName : selectedValue,
          });
          const signedUrl = signedUrlResponse.url;

          try {
            setDocumentFields((prevFields) => {
              const updatedFields = [...prevFields];
              updatedFields[i].loading = true;
              return updatedFields;
            });

            await uploadFile(signedUrl, uploadedFile);

            const fileUrl = signedUrl.split("?")[0];

            let key;
            if (isCustom) {
              key = customDocumentName.toLowerCase().split(" ")[0];
              formData.customFields[key] = fileUrl;
            } else {
              key = selectedValue.toLowerCase().split(" ")[0];
              formData.predefinedFields[key] = fileUrl;
            }

            setDocumentFields((prevFields) => {
              const updatedFields = [...prevFields];
              updatedFields[i].loading = false;
              return updatedFields;
            });
          } catch (error) {
            console.error("Error uploading file:", error);
            setDocumentFields((prevFields) => {
              const updatedFields = [...prevFields];
              updatedFields[i].loading = false;
              return updatedFields;
            });
          }
        }
      }

      if (canSubmit) {
        await axios.post(
          `${process.env.REACT_APP_API}/route/emp/adddocuments`,
          formData,
          {
            headers: { Authorization: token },
          }
        );

        setAppAlert({
          alert: true,
          type: "success",
          msg: "All documents are uploaded successfully",
        });

        console.log("All files uploaded successfully");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleAddMore = () => {
    setDocumentFields((prevState) => [
      ...prevState,
      {
        selectedValue: "",
        uploadedFile: null,
        fileName: "No file selected",
        customDocumentName: "",
        loading: false,
      },
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

  const handleCustomNameChange = (index, value) => {
    const updatedDocumentFields = [...documentFields];
    updatedDocumentFields[index].customDocumentName = value;
    setDocumentFields(updatedDocumentFields);
  };

  const remainingFileSizeKB = (MAX_TOTAL_FILE_SIZE - totalFileSize) / 1024; // Convert remaining size to KB

  return (
    <>
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
                {field.isCustom ? (
                  <TextField
                    label="Custom Document Name"
                    size="small"
                    variant="outlined"
                    value={field.customDocumentName}
                    onChange={(e) =>
                      handleCustomNameChange(index, e.target.value)
                    }
                  />
                ) : (
                  <FormControl className="sm:w-[170px]" size="small">
                    <InputLabel id={`select-doc-label-${index}`}>
                      Select Document
                    </InputLabel>
                    <Select
                      labelId={`select-doc-label-${index}`}
                      label="Select Document"
                      value={field.selectedValue}
                      size="small"
                      onChange={(e) => handleSelect(index, e.target.value)}
                    >
                      {options.map(
                        (option, optionIndex) =>
                          // Prevent selecting the same document again
                          !documentFields
                            .slice(0, index)
                            .map((field) => field.selectedValue)
                            .includes(option) && (
                            <MenuItem key={optionIndex} value={option}>
                              {option}
                            </MenuItem>
                          )
                      )}
                    </Select>
                  </FormControl>
                )}
                <div style={{ display: "flex", alignItems: "center" }}>
                  {/* {field.loading ? (
                    <CircularProgress size={24} />
                  ) : ( */}
                  <>
                    <input
                      id={`file-upload-${index}`}
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileUpload(index, e)}
                    />
                    <div className="w-8 h-8 flex justify-center items-center rounded-full mr-2">
                      {field.loading ? (
                        <CircularProgress size={24} />
                      ) : (
                        field.uploadedFile && (
                          <CheckIcon
                            style={{
                              color: "#FFF",
                              backgroundColor: "#25E52E",
                              borderRadius: "50%",
                            }}
                          />
                        )
                      )}
                    </div>
                    <label htmlFor={`file-upload-${index}`}>
                      <div className="w-28">
                        <Button
                          size="small"
                          variant="contained"
                          component="span"
                          disabled={!field.selectedValue && !field.isCustom}
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
                  </>
                  {documentFields.length > 1 && (
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
      <div className="flex justify-center gap-2">
        <span className="text-xs">Maximum Size Allowed :</span>
        <span className="text-xs text-red-600">
          {remainingFileSizeKB >= 0
            ? ` ${remainingFileSizeKB.toFixed(2)} KB`
            : "Size limit exceeded"}
        </span>
      </div>
    </>
  );
};

export default DocManage;
