import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import React, { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import stripTags from "striptags";
import { UseContext } from "../../State/UseState/UseContext";
import useGetUser from "../../hooks/Token/useUser";
import { getSignedUrlForOrgDocs, uploadFile } from "../../services/docManageS3";
import DataTable from "./components/DataTable";
import DocList from "./components/DocList";
import Options from "./components/Options";

const DocManageAuth = () => {
  const { authToken } = useGetUser();
  const [option, setOption] = useState("");
  const querClient = useQueryClient();
  const [docId, setDocId] = useState("");
  const { setAppAlert } = useContext(UseContext);
  const [type, setType] = useState();
  const documentNames = [
    "Employment Offer Letter",
    "Appointment Letter",
    "Promotion Letter",
    "Transfer Letter",
    "Termination Letter",
    "Resignation Acceptance Letter",
    "Confirmation Letter",
    "Performance Appraisal Letter",
    "Warning Letter",
    "Salary Increment Letter",
    "Training Invitation Letter",
    "Employee Recognition Letter",
  ];

  const { data: data2 } = useQuery(`getOrgDocs`, async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/org/getdocs`,
      {
        headers: { Authorization: authToken },
      }
    );

    return response.data.doc;
  });

  console.log(data2);

  const [newDocument, setNewDocument] = useState({
    title: "",
    details: "",
    applicableDate: "",
    header: "",
    footer: "",
  });

  const handleEditDocument = async (id) => {
    try {
      setDocId(id.toString());
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/org/getdoc/${id}`,
        {
          headers: { Authorization: authToken },
        }
      );

      console.log("my resp", response.data.doc);
      const { title, details, applicableDate, type, header, footer } =
        response.data.doc;
      setNewDocument({
        title,
        details,
        applicableDate,
        type, // Set the type here
        header,
        footer,
      });
      setType(type); // Also set the type state variable
    } catch (error) {
      console.error("Error while fetching document for editing:", error);
    }
  };

  const handleDeleteDoc = async (id) => {
    try {
      const resp = await axios.delete(
        `${process.env.REACT_APP_API}/route/org/deletedoc/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(resp);
      querClient.invalidateQueries("getOrgDocs");
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document Deleted Successfully",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    setDocId("");
    setNewDocument({
      title: "",
      details: "",
      applicableDate: "",
      header: "",
      footer: "",
    });
  }, [option]);

  const handleCreateDocument = async () => {
    try {
      const doc = new jsPDF();
      const marginX = 20;
      const marginY = 10;

      doc.setFontSize(12);
      doc.text("Welcome to www.aegishrms.com", marginX, 20 + marginY);

      doc.text("Title: " + newDocument.title, marginX, 30 + marginY);

      doc.text(
        "Applicable Date: " + newDocument.applicableDate,
        marginX,
        40 + marginY
      );

      const headerText = stripTags(newDocument.header);
      const headerLines = doc.splitTextToSize(headerText, 180);
      doc.text(headerLines, marginX, 50 + marginY);

      if (newDocument.header.includes("<img")) {
        const imgHeader = new Image();
        imgHeader.src = newDocument.header.match(/src\s*=\s*"(.+?)"/)[1];
        await new Promise((resolve) => {
          imgHeader.onload = () => {
            const imgWidth = 20;
            const imgHeight = 20;
            const imgX = marginX + 150;
            const imgY = 40 + marginY - imgHeight - 5;
            doc.addImage(imgHeader, imgX, imgY, imgWidth, imgHeight);
            resolve();
          };
        });
      }

      const detailsLines = doc.splitTextToSize(
        stripTags(newDocument.details),
        180
      );
      let detailsY = 70 + marginY;
      detailsLines.forEach((line) => {
        if (detailsY + 10 > doc.internal.pageSize.height - marginY) {
          doc.addPage();
          detailsY = 10 + marginY;
        }
        const splitLines = doc.splitTextToSize(line, 180);
        splitLines.forEach((splitLine) => {
          doc.text(splitLine, marginX, detailsY);
          detailsY += 10;
        });
      });

      // Footer from Quill editor
      const footerText = stripTags(newDocument.footer);
      const footerLines = doc.splitTextToSize(footerText, 180);
      const footerHeight = footerLines.length * 10;
      const footerY = doc.internal.pageSize.height - marginY - footerHeight;
      doc.text(footerLines, marginX, footerY);

      // Image as footer (if applicable)
      if (newDocument.footer.includes("<img")) {
        const imgFooter = new Image();
        imgFooter.src = newDocument.footer.match(/src\s*=\s*"(.+?)"/)[1];
        await new Promise((resolve) => {
          imgFooter.onload = () => {
            const imgWidth = 30;
            const imgHeight = 30;
            const imgX = marginX + 150;
            const imgY = footerY + footerHeight + 5;
            doc.addImage(imgFooter, imgX, imgY, imgWidth, imgHeight);
            resolve();
          };
        });
      }

      const pdfDataUri = doc.output("datauristring");

      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `${newDocument.title}`,
      });
      const blob = await fetch(pdfDataUri).then((res) => res.blob());
      await uploadFile(signedUrlResponse.url, blob);

      await axios.post(
        `${process.env.REACT_APP_API}/route/org/adddocuments`,
        {
          title: newDocument.title,
          details: newDocument.details,
          applicableDate: newDocument.applicableDate,
          header: newDocument.header,
          footer: newDocument.footer,
          url: signedUrlResponse.url.split("?")[0],
          type: type,
        },
        {
          headers: { Authorization: authToken },
        }
      );

      querClient.invalidateQueries("getOrgDocs");
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document Created Successfully",
      });
      setNewDocument({
        title: "",
        details: "",
        applicableDate: "",
        header: "",
        footer: "",
      });

      console.log("Document uploaded and data saved successfully");
    } catch (error) {
      console.error("Error while uploading document and saving data:", error);
    }
  };

  const handleUpdateDocument = async () => {
    try {
      const doc = new jsPDF();
      const marginX = 20;
      const marginY = 10;

      doc.setFontSize(12);
      doc.text("Welcome to www.aegishrms.com", marginX, 20 + marginY);
      doc.text("Title: " + newDocument.title, marginX, 30 + marginY);
      doc.text(
        "Applicable Date: " + newDocument.applicableDate,
        marginX,
        40 + marginY
      );

      const headerText = stripTags(newDocument.header);
      const headerLines = doc.splitTextToSize(headerText, 180);
      doc.text(headerLines, marginX, 50 + marginY);

      if (newDocument.header.includes("<img")) {
        const imgHeader = new Image();
        imgHeader.src = newDocument.header.match(/src\s*=\s*"(.+?)"/)[1];
        await new Promise((resolve) => {
          imgHeader.onload = () => {
            const imgWidth = 20;
            const imgHeight = 20;
            const imgX = marginX + 150;
            const imgY = 40 + marginY - imgHeight - 5;
            doc.addImage(imgHeader, imgX, imgY, imgWidth, imgHeight);
            resolve();
          };
        });
      }

      const detailsLines = doc.splitTextToSize(
        stripTags(newDocument.details),
        180
      );
      let detailsY = 70 + marginY;
      detailsLines.forEach((line) => {
        if (detailsY + 10 > doc.internal.pageSize.height - marginY) {
          doc.addPage();
          detailsY = 10 + marginY;
        }
        const splitLines = doc.splitTextToSize(line, 180);
        splitLines.forEach((splitLine) => {
          doc.text(splitLine, marginX, detailsY);
          detailsY += 10;
        });
      });

      const footerText = stripTags(newDocument.footer);
      const footerLines = doc.splitTextToSize(footerText, 180);
      const footerHeight = footerLines.length * 10;
      const footerY = doc.internal.pageSize.height - marginY - footerHeight;
      doc.text(footerLines, marginX, footerY);

      if (newDocument.footer.includes("<img")) {
        const imgFooter = new Image();
        imgFooter.src = newDocument.footer.match(/src\s*=\s*"(.+?)"/)[1];
        await new Promise((resolve) => {
          imgFooter.onload = () => {
            const imgWidth = 30;
            const imgHeight = 30;
            const imgX = marginX + 150;
            const imgY = footerY + footerHeight + 5;
            doc.addImage(imgFooter, imgX, imgY, imgWidth, imgHeight);
            resolve();
          };
        });
      }

      const pdfDataUri = doc.output("datauristring");

      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `${newDocument.title}`,
      });
      const blob = await fetch(pdfDataUri).then((res) => res.blob());
      await uploadFile(signedUrlResponse.url, blob);

      await axios.patch(
        `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
        {
          title: newDocument.title,
          details: newDocument.details,
          applicableDate: newDocument.applicableDate,
          header: newDocument.header,
          footer: newDocument.footer,
          url: signedUrlResponse.url.split("?")[0],
        },
        {
          headers: { Authorization: authToken },
        }
      );

      querClient.invalidateQueries("getOrgDocs");
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document Updated Successfully",
      });

      console.log("Document uploaded and data saved successfully");
    } catch (error) {
      console.error("Error while updating document:", error);
    }
  };

  // const formatDate = (dateString) => {
  //   const rawDate = new Date(dateString);
  //   return `${rawDate.getDate()}-${(rawDate.getMonth() + 1)
  //     .toString()
  //     .padStart(2, "0")}-${rawDate.getFullYear()}`;
  // };

  return (
    <div className="w-full h-full flex justify-around p-6 gap-6">
      <Container className="w-[600px] h-[80vh] border-2 mt-5 pt-4 overflow-y-auto">
        {option !== "" && (
          <div
            onClick={() => setOption("")}
            className="w-[30px] h-[30px] cursor-pointer mb-2 rounded-full border-2"
          >
            <ArrowBackIcon />
          </div>
        )}

        {option === "emp" && <DataTable />}
        {option === "doc" && (
          <DocList
            onEdit={handleEditDocument}
            onDelete={handleDeleteDoc}
            data={data2}
          />
        )}
        {option === "" && <Options setOption={setOption} />}
      </Container>

      <Container className="w-[600px] h-full border-2 mt-5">
        <div id="document-content">
          <div
            style={{ borderBottom: "2px solid gray" }}
            className="w-full justify-center flex mt-1 p-2"
          >
            <Typography className="!font-semibold !text-xl">
              {docId ? "Update Record" : "Create Record"}
            </Typography>
          </div>
          <div className="mt-4">
            <TextField
              label="Title"
              size="small"
              value={newDocument.title}
              onChange={(e) =>
                setNewDocument({ ...newDocument, title: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Select Document"
              value={type}
              onChange={(e) => setType(e.target.value)}
              fullWidth
              margin="normal"
              size="small"
            >
              {documentNames.map((name) => (
                <MenuItem key={name} value={name}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
            <div style={{ width: "100%", maxWidth: "668px" }}>
              <Typography variant="h6" gutterBottom>
                Header
              </Typography>
              <ReactQuill
                className="h-[80px] !mb-12"
                theme="snow" // Specify Quill theme
                value={newDocument.header}
                onChange={(value) =>
                  setNewDocument({ ...newDocument, header: value })
                }
                modules={{
                  toolbar: [
                    [{ font: [] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    [{ align: [] }],
                    ["clean"],
                  ],
                }}
                style={{ width: "100%" }}
              />
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
              <ReactQuill
                className="h-[280px] mb-12"
                theme="snow" // Specify Quill theme
                value={newDocument.details}
                onChange={(value) =>
                  setNewDocument({ ...newDocument, details: value })
                }
                modules={{
                  toolbar: [
                    [{ font: [] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    [{ align: [] }],
                    ["clean"],
                  ],
                }}
                style={{ width: "100%" }}
              />
              <Typography variant="h6" className="mt-2" gutterBottom>
                Footer
              </Typography>
              <ReactQuill
                className="h-[80px] !mb-10"
                theme="snow" // Specify Quill theme
                value={newDocument.footer}
                onChange={(value) =>
                  setNewDocument({ ...newDocument, footer: value })
                }
                modules={{
                  toolbar: [
                    [{ font: [] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                    [{ align: [] }],
                    ["clean"],
                  ],
                }}
                style={{ width: "100%" }}
              />
            </div>
            <TextField
              label="Applicable Date"
              size="small"
              type="date"
              value={newDocument.applicableDate}
              onChange={(e) =>
                setNewDocument({
                  ...newDocument,
                  applicableDate: e.target.value,
                })
              }
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </div>
        </div>
        <div className="flex gap-2 mt-3 mb-3">
          {!docId && (
            <Button
              variant="contained"
              size="small"
              onClick={handleCreateDocument}
            >
              Submit
            </Button>
          )}
          {docId && (
            <Button
              variant="contained"
              size="small"
              onClick={handleUpdateDocument}
            >
              Update
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
};

export default DocManageAuth;
