import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
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

const MAX_TOTAL_FILE_SIZE = 5120 * 1024;

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
      loading: false,
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
    const allowedFileTypes = ["application/pdf", "image/jpeg", "image/png"];
    const files = event.target.files;
    const file = files[0];
    if (!allowedFileTypes.includes(file.type)) {
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Only PDFs and images are allowed for upload.",
      });
      event.target.value = null;
      return;
    }

    const tempDocumentFields = [...documentFields];
    tempDocumentFields[index].uploadedFile = file;
    const tempTotalFileSize = tempDocumentFields.reduce(
      (totalSize, field) =>
        totalSize + (field.uploadedFile ? field.uploadedFile.size : 0),
      0
    );

    if (tempTotalFileSize > MAX_TOTAL_FILE_SIZE) {
      setAppAlert({
        alert: true,
        type: "error",
        msg: `File "${file.name}" exceeds the size limit of 5 MB`,
      });
      event.target.value = null;
      tempDocumentFields[index].uploadedFile = null;
      tempDocumentFields[index].fileName = "No file selected";
      setDocumentFields(tempDocumentFields);
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

  const remainingFileSizeKB = (MAX_TOTAL_FILE_SIZE - totalFileSize) / 1024;

  return (
    <>
      <div className="w-full h-full flex justify-center items-center pb-5">
        <div className="w-full h-full flex justify-center items-center mt-10">
          <div
            style={{
              boxShadow:
                "0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)",
            }}
            className="md:w-[800px] w-[350px] m-auto mt-6 md:pl-6 pl-3 md:pr-6 pr-3 pt-3 pb-3 rounded-lg"
          >
            <div
              style={{ borderBottom: "2px solid #b8b8b8" }}
              className="text-center mb-5 pb-3 w-full"
            >
              <h1 className="text-center md:text-3xl text-2xl">
                Document Management
              </h1>
              <p>Here you can manage your documents</p>
            </div>
            {documentFields.map((field, index) => (
              <div
                key={index}
                style={{
                  boxShadow:
                    "0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)",
                }}
                className="w-full h-auto md:h-[8vh] md:flex md:items-center md:justify-between pl-3 pt-3 md:pt-0 pr-3 mb-4 rounded-lg"
              >
                {field.isCustom ? (
                  <TextField
                    label="Custom Document Name"
                    size="small"
                    sx={{ width: "100%" }}
                    variant="outlined"
                    value={field.customDocumentName}
                    onChange={(e) =>
                      handleCustomNameChange(index, e.target.value)
                    }
                  />
                ) : (
                  <FormControl className="md:w-[170px] w-full" size="small">
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
                <div
                  className="md:justify-normal justify-between md:mt-0 mt-3 pb-3 md:pb-0"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {/* {field.loading ? (
                    <CircularProgress size={24} />
                  ) : ( */}
                  <>
                    <input
                      id={`file-upload-${index}`}
                      type="file"
                      style={{ display: "none" }}
                      disabled={!field.selectedValue && !field.isCustom}
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
                      <div className="md:w-28">
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
                    <span className="md:w-28 mr-3 ml-3 text-xs">
                      {field.fileName}
                    </span>
                    <Button
                      size="small"
                      color="info"
                      disabled={!field.uploadedFile}
                      variant="contained"
                      onClick={() => openModal(index)}
                    >
                      Show Doc
                    </Button>
                  </>
                  {documentFields.length > 1 && (
                    <div
                      className="h-6 w-6 flex justify-center items-center rounded-full ml-2 cursor-pointer"
                      onClick={() => handleDiscardRow(index)}
                    >
                      <IconButton color="error" aria-label="delete">
                        <DeleteOutlineIcon />
                      </IconButton>
                      {/* <DeleteIcon
                        style={{
                          color: "#FFF",
                        }}
                        fontSize="small"
                      /> */}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="w-full flex justify-center mt-6 gap-4 mb-2">
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={handleAddMore}
              >
                Add More
              </Button>
              <Button
                size="small"
                color="primary"
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
