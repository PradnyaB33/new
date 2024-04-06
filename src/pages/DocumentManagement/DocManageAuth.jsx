import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Container, TextField, Typography } from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import React, { useState } from "react";
import { useQuery } from "react-query";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import useGetUser from "../../hooks/Token/useUser";
import { getSignedUrlForOrgDocs, uploadFile } from "../../services/docManageS3";
import DataTable from "./components/DataTable";
import DocList from "./components/DocList";
import Options from "./components/Options";

const DocManageAuth = () => {
  const { authToken } = useGetUser();
  const [option, setOption] = useState("");
  // const { getCurrentUser } = UserProfile();
  // const user = getCurrentUser();

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
  });

  const handleCreateDocument = async () => {
    console.log("New document:", newDocument);

    try {
      // Create a new jsPDF instance
      const doc = new jsPDF();

      // Add content to the PDF
      doc.setFontSize(12);
      doc.text("Welcome to www.aegishrms.com", 10, 20);
      doc.text("Title: " + newDocument.title, 10, 30);
      doc.text("Applicable Date: " + newDocument.applicableDate, 10, 40);

      const detailsLines = doc.splitTextToSize(newDocument.details, 180);
      doc.text(detailsLines, 10, 50);

      const pdfDataUri = doc.output("datauristring");

      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `${newDocument.title}`,
      });

      console.log("Signed URL response:", signedUrlResponse);

      const blob = await fetch(pdfDataUri).then((res) => res.blob());

      await uploadFile(signedUrlResponse.url, blob);

      setNewDocument({
        title: "",
        details: "",
        applicableDate: "",
      });

      console.log("Document uploaded successfully");
    } catch (error) {
      console.error("Error while uploading document:", error);
    }
  };

  return (
    <div className="w-full h-full flex justify-around p-8 gap-8">
      <Container className="w-[600px] h-[80vh] border-2 mt-5 pt-4">
        {option !== "" && (
          <div
            onClick={() => setOption("")}
            className="w-[30px] h-[30px] cursor-pointer mb-2 rounded-full border-2"
          >
            <ArrowBackIcon />
          </div>
        )}

        {option === "emp" && <DataTable />}
        {option === "doc" && <DocList data={data2} />}
        {option === "" && <Options setOption={setOption} />}
      </Container>

      <Container className="w-[600px] h-[80vh] border-2 mt-5">
        <div id="document-content">
          <div
            style={{ borderBottom: "2px solid gray" }}
            className="w-full justify-center flex mt-1 p-2"
          >
            <Typography className="!font-semibold !text-xl">
              Create Record
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
            <div style={{ width: "100%", maxWidth: "668px" }}>
              <ReactQuill
                className="h-[280px] mb-9"
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
        <div className="flex gap-2 mt-3">
          <Button
            variant="contained"
            size="small"
            onClick={handleCreateDocument}
          >
            Submit
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default DocManageAuth;
