import React from "react";
import {
  Button,
  Container,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import stripTags from "striptags";

import { UseContext } from "../../../State/UseState/UseContext";
import useGetUser from "../../../hooks/Token/useUser";
import {
  getSignedUrlForOrgDocs,
  uploadFile,
} from "../../../services/docManageS3";
import DocList from "../components/DocList";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import { FormControl } from "react-bootstrap";
import { Select } from "antd";

const Policieshr = () => {
  const { authToken } = useGetUser();
  const querClient = useQueryClient();
  const [docId, setDocId] = useState("");
  const { setAppAlert } = useContext(UseContext);

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
    type: "Policies and Procedures",
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
      setNewDocument(response.data.doc);
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
    // Set the initial applicable date to the current date in the format YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0]; // This gives you "YYYY-MM-DD"
    setNewDocument({
      ...newDocument,
      applicableDate: today,
    });
  }, []);

  //   useEffect(() => {
  //     setDocId("");
  //     setNewDocument({
  //       title: "",
  //       details: "",
  //       applicableDate: "",
  //     });
  //   }, [option]);

  const handleCreateDocument = async () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text("Welcome to www.aegishrms.com", 10, 20);
      doc.text("Title: " + newDocument.title, 10, 30);
      doc.text("Applicable Date: " + newDocument.applicableDate, 10, 40);
      const detailsText = stripTags(newDocument.details); // Remove HTML tags
      const detailsLines = doc.splitTextToSize(detailsText, 180);
      doc.text(detailsLines, 10, 50);
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
          type: newDocument.type, // Send the selected type to the backend
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
        msg: "Document Created Successfully",
      });
      setNewDocument({
        title: "",
        details: "",
        applicableDate: "",
      });

      console.log("Document uploaded and data saved successfully");
    } catch (error) {
      console.error("Error while uploading document and saving data:", error);
    }
  };

  const handleUpdateDocument = async () => {
    try {
      const resp = await axios.patch(
        `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
        {
          type: newDocument.type,
          title: newDocument.title,
          details: newDocument.details,
          applicableDate: newDocument.applicableDate,
          url: newDocument.url,
        },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(resp);
      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text("Welcome to www.aegishrms.com", 10, 20);
      doc.text("Title: " + newDocument.title, 10, 30);
      doc.text("Applicable Date: " + newDocument.applicableDate, 10, 40);
      const detailsText = stripTags(newDocument.details); // Remove HTML tags
      const detailsLines = doc.splitTextToSize(detailsText, 180);
      doc.text(detailsLines, 10, 50);
      const pdfDataUri = doc.output("datauristring");
      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `${newDocument.title}`,
      });

      const blob = await fetch(pdfDataUri).then((res) => res.blob());
      await uploadFile(signedUrlResponse.url, blob);
      querClient.invalidateQueries("getOrgDocs");
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Document Updated Successfully",
      });
    } catch (error) {
      console.error("Error while updating document:", error);
    }
  };
  return (
    <BoxComponent>
      <HeadingOneLineInfo heading={"Add Policies and Procedures"} />
      <div className="w-full h-full flex justify-around p-6 gap-6">
        <Container className="w-[600px] h-[80vh] border-2  pt-4">
          <DocList
            onEdit={handleEditDocument}
            onDelete={handleDeleteDoc}
            data={data2}
          />
        </Container>

        <Container className="w-[600px] h-[80vh] border-2">
          <div id="document-content">
            <div
              style={{ borderBottom: "2px solid gray" }}
              className="w-full justify-center flex mt-1 p-2"
            >
              <Typography className="!font-semibold !text-xl">
                {docId ? "Update Record" : "Create Record"}
              </Typography>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                value={newDocument.type}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, type: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Policies and Procedures">
                  Policies and Procedures
                </option>
                <option value="Comms">Comms</option>
              </select>
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
              {/* <TextField
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
            /> */}
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
                inputProps={{
                  min: new Date().toISOString().split("T")[0], // Prevent past dates
                }}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
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
    </BoxComponent>
  );
};

export default Policieshr;

// import React, { useState, useEffect, useContext } from "react";
// import { Button, Container, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
// import axios from "axios";
// import jsPDF from "jspdf";
// import { useQuery, useQueryClient } from "react-query";
// import { UseContext } from "../../../State/UseState/UseContext";
// import useGetUser from "../../../hooks/Token/useUser";
// import { getSignedUrlForOrgDocs, uploadFile } from "../../../services/docManageS3";
// import DocList from "../components/DocList";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import "react-quill/dist/quill.snow.css";
// import ReactQuill from "react-quill";
// import stripTags from "striptags";

// const Policieshr = () => {
//   const { authToken } = useGetUser();
//   const querClient = useQueryClient();
//   const [docId, setDocId] = useState("");
//   const { setAppAlert } = useContext(UseContext);

//   const { data: data2 } = useQuery(`getOrgDocs`, async () => {
//     const response = await axios.get(
//       `${process.env.REACT_APP_API}/route/org/getdocs`,
//       {
//         headers: { Authorization: authToken },
//       }
//     );

//     return response.data.doc;
//   });

//   const [newDocument, setNewDocument] = useState({
//     title: "",
//     details: "",
//     applicableDate: "",
//     type: "", // Add this field for type selection
//   });

//   useEffect(() => {
//     const today = new Date().toISOString().split("T")[0]; // Set today's date
//     setNewDocument({
//       ...newDocument,
//       applicableDate: today,
//     });
//   }, []);

//   const handleCreateDocument = async () => {
//     try {
//       const doc = new jsPDF();
//       doc.setFontSize(12);
//       doc.text("Welcome to www.aegishrms.com", 10, 20);
//       doc.text("Title: " + newDocument.title, 10, 30);
//       doc.text("Applicable Date: " + newDocument.applicableDate, 10, 40);
//       const detailsText = stripTags(newDocument.details); // Remove HTML tags
//       const detailsLines = doc.splitTextToSize(detailsText, 180);
//       doc.text(detailsLines, 10, 50);
//       const pdfDataUri = doc.output("datauristring");

//       const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
//         documentName: `${newDocument.title}`,
//       });

//       const blob = await fetch(pdfDataUri).then((res) => res.blob());
//       await uploadFile(signedUrlResponse.url, blob);

//       await axios.post(
//         `${process.env.REACT_APP_API}/route/org/adddocuments`,
//         {
//           title: newDocument.title,
//           details: newDocument.details,
//           applicableDate: newDocument.applicableDate,
//           type: newDocument.type, // Send the selected type to the backend
//           url: signedUrlResponse.url.split("?")[0],
//         },
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       querClient.invalidateQueries("getOrgDocs");
//       setAppAlert({
//         alert: true,
//         type: "success",
//         msg: "Document Created Successfully",
//       });
//       setNewDocument({
//         title: "",
//         details: "",
//         applicableDate: "",
//         type: "", // Reset type after submit
//       });
//     } catch (error) {
//       console.error("Error while uploading document and saving data:", error);
//     }
//   };

//   const handleEditDocument = async (id) => {
//     try {
//       setDocId(id.toString());
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/org/getdoc/${id}`,
//         {
//           headers: { Authorization: authToken },
//         }
//       );
//       setNewDocument(response.data.doc);
//     } catch (error) {
//       console.error("Error while fetching document for editing:", error);
//     }
//   };

//   const handleDeleteDoc = async (id) => {
//     try {
//       const resp = await axios.delete(
//         `${process.env.REACT_APP_API}/route/org/deletedoc/${id}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log(resp);
//       querClient.invalidateQueries("getOrgDocs");
//       setAppAlert({
//         alert: true,
//         type: "success",
//         msg: "Document Deleted Successfully",
//       });
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//     const handleUpdateDocument = async () => {
//     try {
//       const resp = await axios.patch(
//         `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
//         {
//           title: newDocument.title,
//           details: newDocument.details,
//           applicableDate: newDocument.applicableDate,
//           url: newDocument.url,
//         },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log(resp);
//       const doc = new jsPDF();
//       doc.setFontSize(12);
//       doc.text("Welcome to www.aegishrms.com", 10, 20);
//       doc.text("Title: " + newDocument.title, 10, 30);
//       doc.text("Applicable Date: " + newDocument.applicableDate, 10, 40);
//       const detailsText = stripTags(newDocument.details); // Remove HTML tags
//       const detailsLines = doc.splitTextToSize(detailsText, 180);
//       doc.text(detailsLines, 10, 50);
//       const pdfDataUri = doc.output("datauristring");
//       const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
//         documentName: `${newDocument.title}`,
//       });

//       const blob = await fetch(pdfDataUri).then((res) => res.blob());
//       await uploadFile(signedUrlResponse.url, blob);
//       querClient.invalidateQueries("getOrgDocs");
//       setAppAlert({
//         alert: true,
//         type: "success",
//         msg: "Document Updated Successfully",
//       });
//     } catch (error) {
//       console.error("Error while updating document:", error);
//     }
//   };

//   return (
//     <BoxComponent>
//       <HeadingOneLineInfo heading={"Add Policies and Procedures"} />
//       <div className="w-full h-full flex justify-around p-6 gap-6">
//         <Container className="w-[600px] h-[80vh] border-2 pt-4">
//           <DocList onEdit={handleEditDocument} onDelete={handleDeleteDoc} />
//         </Container>

//         <Container className="w-[600px] h-[80vh] border-2">
//           <div id="document-content">
//             <div
//               style={{ borderBottom: "2px solid gray" }}
//               className="w-full justify-center flex mt-1 p-2"
//             >
//               <Typography className="!font-semibold !text-xl">
//                 {docId ? "Update Record" : "Create Record"}
//               </Typography>
//             </div>

//             <div className="mt-4">
//               <TextField
//                 label="Title"
//                 size="small"
//                 value={newDocument.title}
//                 onChange={(e) =>
//                   setNewDocument({ ...newDocument, title: e.target.value })
//                 }
//                 fullWidth
//                 margin="normal"
//               />

//               <div style={{ width: "100%", maxWidth: "668px" }}>
//                 <ReactQuill
//                   className="h-[280px] mb-9"
//                   theme="snow"
//                   value={newDocument.details}
//                   onChange={(value) =>
//                     setNewDocument({ ...newDocument, details: value })
//                   }
//                   modules={{
//                     toolbar: [
//                       [{ font: [] }],
//                       [{ header: [1, 2, 3, 4, 5, 6, false] }],
//                       ["bold", "italic", "underline", "strike"],
//                       [{ list: "ordered" }, { list: "bullet" }],
//                       ["link", "image"],
//                       [{ align: [] }],
//                       ["clean"],
//                     ],
//                   }}
//                   style={{ width: "100%" }}
//                 />
//               </div>

//               <TextField
//                 label="Applicable Date"
//                 size="small"
//                 type="date"
//                 value={newDocument.applicableDate}
//                 onChange={(e) =>
//                   setNewDocument({
//                     ...newDocument,
//                     applicableDate: e.target.value,
//                   })
//                 }
//                 fullWidth
//                 margin="normal"
//                 InputLabelProps={{ shrink: true }}
//                 inputProps={{
//                   min: new Date().toISOString().split("T")[0],
//                 }}
//               />

//               {/* Add dropdown for "Type" (Policies and Procedures / Comms) */}
//               <FormControl fullWidth margin="normal">
//                 <InputLabel>Type</InputLabel>
//                 <Select
//                   value={newDocument.type}
//                   onChange={(e) =>
//                     setNewDocument({ ...newDocument, type: e.target.value })
//                   }
//                   label="Type"
//                 >
//                   <MenuItem value="Policies and Procedures">Policies and Procedures</MenuItem>
//                   <MenuItem value="Comms">Comms</MenuItem>
//                 </Select>
//               </FormControl>
//             </div>
//           </div>

//           <div className="flex gap-2 mt-3">
//             {!docId && (
//               <Button
//                 variant="contained"
//                 size="small"
//                 onClick={handleCreateDocument}
//               >
//                 Submit
//               </Button>
//             )}
//             {docId && (
//               <Button
//                 variant="contained"
//                 size="small"
//                 onClick={handleUpdateDocument}
//               >
//                 Update
//               </Button>
//             )}
//           </div>
//         </Container>
//       </div>
//     </BoxComponent>
//   );
// };

// export default Policieshr;
