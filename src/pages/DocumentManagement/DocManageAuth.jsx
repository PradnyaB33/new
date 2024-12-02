// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { Button, Container, TextField, Typography } from "@mui/material";
// import axios from "axios";
// import jsPDF from "jspdf";
// import React, { useContext, useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import stripTags from "striptags";
// import { UseContext } from "../../State/UseState/UseContext";
// import useGetUser from "../../hooks/Token/useUser";
// import { getSignedUrlForOrgDocs, uploadFile } from "../../services/docManageS3";
// import DataTable from "./components/DataTable";
// import DocList from "./components/DocList";
// import Options from "./components/Options";
// const DocManageAuth = () => {
//   const { authToken } = useGetUser();
//   const [option, setOption] = useState("");
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

//   console.log(data2);

//   const [newDocument, setNewDocument] = useState({
//     title: "",
//     details: "",
//     applicableDate: "",
//   });

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

//   useEffect(() => {
//     setDocId("");
//     setNewDocument({
//       title: "",
//       details: "",
//       applicableDate: "",
//     });
//   }, [option]);

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
//       });

//       console.log("Document uploaded and data saved successfully");
//     } catch (error) {
//       console.error("Error while uploading document and saving data:", error);
//     }
//   };

//   const handleUpdateDocument = async () => {
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
//     <div className="w-full h-full flex justify-around p-6 gap-6">
//       <Container className="w-[600px] h-[80vh] border-2 mt-5 pt-4">
//         {option !== "" && (
//           <div
//             onClick={() => setOption("")}
//             className="w-[30px] h-[30px] cursor-pointer mb-2 rounded-full border-2"
//           >
//             <ArrowBackIcon />
//           </div>
//         )}

//         {option === "emp" && <DataTable />}
//         {option === "doc" && (
//           <DocList
//             onEdit={handleEditDocument}
//             onDelete={handleDeleteDoc}
//             data={data2}
//           />
//         )}
//         {option === "" && (
//           <>
//             {" "}
//             <p className="font-semibold">
//               Manage Organisational Records, Used For Generation And
//               Distribution of Information To The Employees.
//             </p>{" "}
//             <Options setOption={setOption} />{" "}
//           </>
//         )}
//       </Container>

//       <Container className="w-[600px] h-[80vh] border-2 mt-5">
//         <div id="document-content">
//           <div
//             style={{ borderBottom: "2px solid gray" }}
//             className="w-full justify-center flex mt-1 p-2"
//           >
//             <Typography className="!font-semibold !text-xl">
//               {docId ? "Update Record" : "Create Record"}
//             </Typography>
//           </div>
//           <div className="mt-4">
//             <TextField
//               label="Title"
//               size="small"
//               value={newDocument.title}
//               onChange={(e) =>
//                 setNewDocument({ ...newDocument, title: e.target.value })
//               }
//               fullWidth
//               margin="normal"
//             />
//             <div style={{ width: "100%", maxWidth: "668px" }}>
//               <ReactQuill
//                 className="h-[280px] mb-9"
//                 theme="snow" // Specify Quill theme
//                 value={newDocument.details}
//                 onChange={(value) =>
//                   setNewDocument({ ...newDocument, details: value })
//                 }
//                 modules={{
//                   toolbar: [
//                     [{ font: [] }],
//                     [{ header: [1, 2, 3, 4, 5, 6, false] }],
//                     ["bold", "italic", "underline", "strike"],
//                     [{ list: "ordered" }, { list: "bullet" }],
//                     ["link", "image"],
//                     [{ align: [] }],
//                     ["clean"],
//                   ],
//                 }}
//                 style={{ width: "100%" }}
//               />
//             </div>
//             <TextField
//               label="Applicable Date"
//               size="small"
//               type="date"
//               value={newDocument.applicableDate}
//               onChange={(e) =>
//                 setNewDocument({
//                   ...newDocument,
//                   applicableDate: e.target.value,
//                 })
//               }
//               fullWidth
//               margin="normal"
//               InputLabelProps={{ shrink: true }}
//             />
//           </div>
//         </div>
//         <div className="flex gap-2 mt-3">
//           {!docId && (
//             <Button
//               variant="contained"
//               size="small"
//               onClick={handleCreateDocument}
//             >
//               Submit
//             </Button>
//           )}
//           {docId && (
//             <Button
//               variant="contained"
//               size="small"
//               onClick={handleUpdateDocument}
//             >
//               Update
//             </Button>
//           )}
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default DocManageAuth;






// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { Button, Container, TextField, Typography } from "@mui/material";
// import axios from "axios";
// import jsPDF from "jspdf";
// import React, { useContext, useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import stripTags from "striptags";
// import { UseContext } from "../../State/UseState/UseContext";
// import useGetUser from "../../hooks/Token/useUser";
// import { getSignedUrlForOrgDocs, uploadFile } from "../../services/docManageS3";
// import DataTable from "./components/DataTable";
// import DocList from "./components/DocList";
// import Options from "./components/Options";
// import { useParams } from "react-router-dom";
// const DocManageAuth = () => {
//   const { authToken } = useGetUser();
//   const { organisationId } = useParams();
//   const [option, setOption] = useState("");
//   const querClient = useQueryClient();
//   const [docId, setDocId] = useState("");
//   const { setAppAlert } = useContext(UseContext);
//   const [letterTypes, setLetterTypes] = useState([]);
//   const [selectedLetterType, setSelectedLetterType] = useState(""); // Store the selected letter type

//   const { data: data2 } = useQuery(`getOrgDocs`, async () => {
//     const response = await axios.get(
//       `${process.env.REACT_APP_API}/route/org/getdocs/letter`,
//       {
//         headers: { Authorization: authToken },
//       }
//     );

//     return response.data.doc;
//   });

//   console.log(data2);

//   const [newDocument, setNewDocument] = useState({
//     title: "",
//     details: "",
//     applicableDate: "",
//   });
// console.log("type",newDocument);

//   const handleSelectChange = (e) => {
//     setSelectedLetterType(e.target.value); // Update the selected letter type
//   };

//   useEffect(() => {
//     const fetchLetterTypes = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API}/route/letter/get/${organisationId}`, {
//           headers: { Authorization: authToken },
//         });
//         setLetterTypes(Object.keys(response.data)); // Assuming the response is an object of letter types
//       } catch (error) {
//         console.error("Error fetching letter types:", error);
//       }
//     };
//     fetchLetterTypes();
//   }, []);




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

//   useEffect(() => {
//     setDocId("");
//     setNewDocument({
//       title: "",
//       details: "",
//       applicableDate: "",
//     });
//   }, [option]);

//   const handleCreateDocument = async () => {
//     try {
//       const doc = new jsPDF();
//       doc.setFontSize(12);


//         // Add header to the PDF
//     if (newDocument.header) {
//       doc.text(newDocument.header, 10, 20);
//     }
//       doc.text("Welcome to www.aegishrms.com", 10, 20);
//       doc.text("Title: " + newDocument.title, 10, 30);
//       doc.text("Applicable Date: " + newDocument.applicableDate, 10, 40);
//       const detailsText = stripTags(newDocument.details); // Remove HTML tags
//       const detailsLines = doc.splitTextToSize(detailsText, 180);
//       doc.text(detailsLines, 10, 50);
//        // Add footer to the PDF
    
//        if (newDocument.footer) {
//       const footerY = doc.internal.pageSize.height - 10;
//       doc.text(newDocument.footer, 10, footerY);
//     }

//       const pdfDataUri = doc.output("datauristring");

//       const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
//         documentName: `${newDocument.title}`,
//       });

//       const blob = await fetch(pdfDataUri).then((res) => res.blob());
//       await uploadFile(signedUrlResponse.url, blob);

//       await axios.post(
//         `${process.env.REACT_APP_API}/route/org/adddocuments`,
//         {
//           type: "Letter",
//           letterType: selectedLetterType, // Send the selected letter type
//           title: newDocument.title,
//           details: newDocument.details,
//           applicableDate: newDocument.applicableDate,
//           header: newDocument.header,  // Send header to backend
//           footer: newDocument.footer,  // Send footer to backend
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
//         header: "",
//         footer: "",
//       });

//       console.log("Document uploaded and data saved successfully");
//     } catch (error) {
//       console.error("Error while uploading document and saving data:", error);
//     }
//   };

//   const handleUpdateDocument = async () => {
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
//     <div className="w-full h-full flex flex-col sm:flex-row justify-around p-6 gap-6 bg-gray-50 min-h-screen">
//     {/* Left Section (Document List or Options) */}
//     <Container 
//       className={`w-full ${option === "emp" ? "sm:w-full" : "sm:w-1/2"} h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-4`}
//     >
//       {option !== "" && (
//         <div
//           onClick={() => setOption("")}
//           className="w-[30px] h-[30px] cursor-pointer mb-2 rounded-full border-2"
//         >
//           <ArrowBackIcon />
//         </div>
//       )}
  
//       {option === "emp" && <DataTable />}
//       {option === "doc" && (
//         <DocList
//           onEdit={handleEditDocument}
//           onDelete={handleDeleteDoc}
//           data={data2}
//         />
//       )}
//       {option === "" && (
//         <div>
//           <p className="font-semibold">
//             Manage Organisational Records, Used For Generation And Distribution of Information To The Employees.
//           </p>
//           <Options setOption={setOption} />
//         </div>
//       )}
//     </Container>
  
//     {/* Right Section (Document Form) */}
//     {option !== "emp" && (
//       <Container className="w-full sm:w-1/2 h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-6">
//         <div id="document-content">
//           <div
//             style={{ borderBottom: "2px solid gray" }}
//             className="w-full flex justify-center mb-6"
//           >
//             <Typography className="!font-semibold !text-xl">
//               {docId ? "Update Record" : "Create Record"}
//             </Typography>
//           </div>

//           {/* <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Type
//           </label>
//           <select
//             value={newDocument.type}
//             onChange={(e) =>
//               setNewDocument({ ...newDocument, type: e.target.value })
//             }
//             className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
//           >
//             <option value="Policies and Procedures">Letter</option>
           
//           </select>
//         </div> */}

//          {/* Select Dropdown */}
//          <div className="mb-4">
//         {/* Label for Letter Type */}
//         <label htmlFor="letterType" className="block text-sm font-medium text-gray-700 mb-2">
//           Letter Type
//         </label>
//          <select
//           id="letterType"
//           value={selectedLetterType}
//           onChange={handleSelectChange}
//           className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//         >
//           <option value="" disabled>
//             Select a Letter Type
//           </option>
//           {letterTypes.map((type) => (
//             <option key={type} value={type}>
//               {type}
//             </option>
//           ))}
//         </select>
//         </div>



//         <div className="mb-4">
//   <TextField
//     label="Header"
//     size="small"
//     value={newDocument.header || ""}
//     onChange={(e) =>
//       setNewDocument({ ...newDocument, header: e.target.value })
//     }
//     fullWidth
//     margin="normal"
//     className="bg-gray-100"
//   />


//           <div className="mb-4">
//             <TextField
//               label="Title"
//               size="small"
//               value={newDocument.title}
//               onChange={(e) =>
//                 setNewDocument({ ...newDocument, title: e.target.value })
//               }
//               fullWidth
//               margin="normal"
//               className="bg-gray-100"
//             />
  
//             <div style={{ width: "100%", maxWidth: "668px" }}>
//               <ReactQuill
//                 className="h-[280px] mb-9"
//                 theme="snow"
//                 value={newDocument.details}
//                 onChange={(value) =>
//                   setNewDocument({ ...newDocument, details: value })
//                 }
//                 modules={{
//                   toolbar: [
//                     [{ font: [] }],
//                     [{ header: [1, 2, 3, 4, 5, 6, false] }],
//                     ["bold", "italic", "underline", "strike"],
//                     [{ list: "ordered" }, { list: "bullet" }],
//                     ["link", "image"],
//                     [{ align: [] }],
//                     ["clean"],
//                   ],
//                 }}
//                 style={{ width: "100%" }}
//               />
//             </div>

//             <TextField
//     label="Footer"
//     size="small"
//     value={newDocument.footer || ""}
//     onChange={(e) =>
//       setNewDocument({ ...newDocument, footer: e.target.value })
//     }
//     fullWidth
//     margin="normal"
//     className="bg-gray-100"
//   />
// </div>
  
  
// <TextField
//             label="Applicable Date"
//             size="small"
//             type="date"
//             value={newDocument.applicableDate}
//             onChange={(e) =>
//               setNewDocument({
//                 ...newDocument,
//                 applicableDate: e.target.value,
//               })
//             }
//             fullWidth
//             margin="normal"
//             InputLabelProps={{ shrink: true }}
//             inputProps={{
//               min: new Date().toISOString().split("T")[0], // Prevent past dates
//             }}
//             className="bg-gray-100"
//           />
//         </div>
//       </div>
//         {/* Submit/Update Button Section */}
//         <div className="flex gap-2 mt-3 justify-center">
//           {!docId ? (
//             <Button
//               variant="contained"
//               size="small"
//               onClick={handleCreateDocument}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
//             >
//               Submit
//             </Button>
//           ) : (
//             <Button
//               variant="contained"
//               size="small"
//               onClick={handleUpdateDocument}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
//             >
//               Update
//             </Button>
//           )}
//         </div>
//       </Container>
//     )}
//   </div>
  
  
//   );
// };

// export default DocManageAuth;































































































































































































//wrong code 

// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import { Button, Container, TextField, Typography } from "@mui/material";
// import axios from "axios";
// import jsPDF from "jspdf";
// import React, { useContext, useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import stripTags from "striptags";
// import { UseContext } from "../../State/UseState/UseContext";
// import useGetUser from "../../hooks/Token/useUser";
// import { getSignedUrlForOrgDocs, uploadFile } from "../../services/docManageS3";
// import DataTable from "./components/DataTable";
// import DocList from "./components/DocList";
// import Options from "./components/Options";
// import { useParams } from "react-router-dom";
// const DocManageAuth = () => {
//   const { authToken } = useGetUser();
//   const { organisationId } = useParams();
//   const [option, setOption] = useState("");
//   const querClient = useQueryClient();
//   const [docId, setDocId] = useState("");
//   const { setAppAlert } = useContext(UseContext);
//   const [isApproved, setIsApproved] = useState(false);

//   const [letterTypes, setLetterTypes] = useState([]);
//   const [selectedLetterType, setSelectedLetterType] = useState(""); // Store the selected letter type

//   const { data: data2 } = useQuery(`getOrgDocs`, async () => {
//     const response = await axios.get(
//       `${process.env.REACT_APP_API}/route/org/getdocs/letter`,
//       {
//         headers: { Authorization: authToken },
//       }
//     );

//     return response.data.doc;
//   });

//   console.log(data2);

//   const [newDocument, setNewDocument] = useState({
//     title: "",
//     details: "",
//     applicableDate: "",
//   });
// console.log("type",newDocument);

//   const handleSelectChange = (e) => {
//     setSelectedLetterType(e.target.value); // Update the selected letter type
//     setIsApproved(false); // Reset approval state when letter type changes
//   };


//   useEffect(() => {
//     const fetchLetterTypes = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API}/route/letter/get/${organisationId}`, {
//           headers: { Authorization: authToken },
//         });
//         setLetterTypes(Object.keys(response.data)); // Assuming the response is an object of letter types
//       } catch (error) {
//         console.error("Error fetching letter types:", error);
//       }
//     };
//     fetchLetterTypes();
//   }, []);

//   // Log the selected letter type and available letter types to confirm
//   console.log("selectedLetterType:", selectedLetterType);
//   console.log("letterTypes:", letterTypes);

//   // Get the workflow for the selected letter type
//   const selectedLetterWorkflow = selectedLetterType && letterTypes[selectedLetterType]?.workflow;
//   console.log("selectedLetterWorkflow",selectedLetterWorkflow)

//   const handleSubmit = async () => {
//     // Handle document submission only after approval
//     if (!isApproved) {
//       setAppAlert({
//         alert: true,
//         type: "error",
//         msg: "Please send the document for approval first.",
//       });
//       return;
//     }
//     // Proceed with submitting the document
//     // Your existing submit logic goes here
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

//   useEffect(() => {
//     setDocId("");
//     setNewDocument({
//       title: "",
//       details: "",
//       applicableDate: "",
//     });
//   }, [option]);

//   const handleCreateDocument = async () => {
//     try {
//       const doc = new jsPDF();
//       doc.setFontSize(12);


//         // Add header to the PDF
//     if (newDocument.header) {
//       doc.text(newDocument.header, 10, 20);
//     }
//       doc.text("Welcome to www.aegishrms.com", 10, 20);
//       doc.text("Title: " + newDocument.title, 10, 30);
//       doc.text("Applicable Date: " + newDocument.applicableDate, 10, 40);
//       const detailsText = stripTags(newDocument.details); // Remove HTML tags
//       const detailsLines = doc.splitTextToSize(detailsText, 180);
//       doc.text(detailsLines, 10, 50);
//        // Add footer to the PDF
    
//        if (newDocument.footer) {
//       const footerY = doc.internal.pageSize.height - 10;
//       doc.text(newDocument.footer, 10, footerY);
//     }

//       const pdfDataUri = doc.output("datauristring");

//       const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
//         documentName: `${newDocument.title}`,
//       });

//       const blob = await fetch(pdfDataUri).then((res) => res.blob());
//       await uploadFile(signedUrlResponse.url, blob);

//       await axios.post(
//         `${process.env.REACT_APP_API}/route/org/adddocuments`,
//         {
//           type: "Letter",
//           letterType: selectedLetterType, // Send the selected letter type
//           title: newDocument.title,
//           details: newDocument.details,
//           applicableDate: newDocument.applicableDate,
//           header: newDocument.header,  // Send header to backend
//           footer: newDocument.footer,  // Send footer to backend
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
//         header: "",
//         footer: "",
//       });

//       console.log("Document uploaded and data saved successfully");
//     } catch (error) {
//       console.error("Error while uploading document and saving data:", error);
//     }
//   };

//   const handleSendForApproval = () => {
//     // Simulate sending the document for approval
//     setIsApproved(true);
//     setAppAlert({
//       alert: true,
//       type: "success",
//       msg: "Document sent for manager approval",
//     });
//   };

//   const handleUpdateDocument = async () => {
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
//     <div className="w-full h-full flex flex-col sm:flex-row justify-around p-6 gap-6 bg-gray-50 min-h-screen">
//     {/* Left Section (Document List or Options) */}
//     <Container 
//       className={`w-full ${option === "emp" ? "sm:w-full" : "sm:w-1/2"} h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-4`}
//     >
//       {option !== "" && (
//         <div
//           onClick={() => setOption("")}
//           className="w-[30px] h-[30px] cursor-pointer mb-2 rounded-full border-2"
//         >
//           <ArrowBackIcon />
//         </div>
//       )}
  
//       {option === "emp" && <DataTable />}
//       {option === "doc" && (
//         <DocList
//           onEdit={handleEditDocument}
//           onDelete={handleDeleteDoc}
//           data={data2}
//         />
//       )}
//       {option === "" && (
//         <div>
//           <p className="font-semibold">
//             Manage Organisational Records, Used For Generation And Distribution of Information To The Employees.
//           </p>
//           <Options setOption={setOption} />
//         </div>
//       )}
//     </Container>
  
//     {/* Right Section (Document Form) */}
//     {option !== "emp" && (
//       <Container className="w-full sm:w-1/2 h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-6">
//         <div id="document-content">
//           <div
//             style={{ borderBottom: "2px solid gray" }}
//             className="w-full flex justify-center mb-6"
//           >
//             <Typography className="!font-semibold !text-xl">
//               {docId ? "Update Record" : "Create Record"}
//             </Typography>
//           </div>

//           {/* <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Type
//           </label>
//           <select
//             value={newDocument.type}
//             onChange={(e) =>
//               setNewDocument({ ...newDocument, type: e.target.value })
//             }
//             className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
//           >
//             <option value="Policies and Procedures">Letter</option>
           
//           </select>
//         </div> */}

//          {/* Select Dropdown */}
//          <div className="mb-4">
//         {/* Label for Letter Type */}
//         <label htmlFor="letterType" className="block text-sm font-medium text-gray-700 mb-2">
//           Letter Type
//         </label>
//          <select
//           id="letterType"
//           value={selectedLetterType}
//           onChange={handleSelectChange}
//           className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//         >
//           <option value="" disabled>
//             Select a Letter Type
//           </option>
//           {letterTypes.map((type) => (
//             <option key={type} value={type}>
//               {type}
//             </option>
//           ))}
//         </select>
//         </div>



//         <div className="mb-4">
//   <TextField
//     label="Header"
//     size="small"
//     value={newDocument.header || ""}
//     onChange={(e) =>
//       setNewDocument({ ...newDocument, header: e.target.value })
//     }
//     fullWidth
//     margin="normal"
//     className="bg-gray-100"
//   />


//           <div className="mb-4">
//             <TextField
//               label="Title"
//               size="small"
//               value={newDocument.title}
//               onChange={(e) =>
//                 setNewDocument({ ...newDocument, title: e.target.value })
//               }
//               fullWidth
//               margin="normal"
//               className="bg-gray-100"
//             />
  
//             <div style={{ width: "100%", maxWidth: "668px" }}>
//               <ReactQuill
//                 className="h-[280px] mb-9"
//                 theme="snow"
//                 value={newDocument.details}
//                 onChange={(value) =>
//                   setNewDocument({ ...newDocument, details: value })
//                 }
//                 modules={{
//                   toolbar: [
//                     [{ font: [] }],
//                     [{ header: [1, 2, 3, 4, 5, 6, false] }],
//                     ["bold", "italic", "underline", "strike"],
//                     [{ list: "ordered" }, { list: "bullet" }],
//                     ["link", "image"],
//                     [{ align: [] }],
//                     ["clean"],
//                   ],
//                 }}
//                 style={{ width: "100%" }}
//               />
//             </div>

//             <TextField
//     label="Footer"
//     size="small"
//     value={newDocument.footer || ""}
//     onChange={(e) =>
//       setNewDocument({ ...newDocument, footer: e.target.value })
//     }
//     fullWidth
//     margin="normal"
//     className="bg-gray-100"
//   />
// </div>
  
  
//             <TextField
//               label="Applicable Date"
//               size="small"
//               type="date"
//               value={newDocument.applicableDate}
//               onChange={(e) =>
//                 setNewDocument({
//                   ...newDocument,
//                   applicableDate: e.target.value,
//                 })
//               }
//               fullWidth
//               margin="normal"
//               InputLabelProps={{ shrink: true }}
//               className="bg-gray-100"
//             />
//           </div>
//         </div>
  
//         {/* Submit/Update Button Section */}
//     {/* Submit/Approval Button Section */}
//     <div className="flex gap-2 mt-3 justify-center">
//             {selectedLetterWorkflow && !isApproved && (
//               <Button
//                 variant="contained"
//                 size="small"
//                 onClick={handleSendForApproval}
//                 className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition duration-300"
//               >
//                 Send to Manager for Approval
//               </Button>
//             )}
//             <Button
//               variant="contained"
//               size="small"
//               onClick={handleSubmit}
//               className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
//               disabled={selectedLetterWorkflow && !isApproved}
//             >
//               {docId ? "Update" : "Submit"}
//             </Button>
//           </div>    </Container>
//     )}
//   </div>
  
  
//   );
// };

// export default DocManageAuth;






















import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button, Container, TextField, Typography } from "@mui/material";
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
import { useParams } from "react-router-dom";
import useLetterWorkflowStore from "./components/useletterworkflow";
import useEmployeeStore from "./components/useEmployeeStore";
const DocManageAuth = () => {
  const { authToken } = useGetUser();
  const { organisationId } = useParams();
  const [option, setOption] = useState("");
  const querClient = useQueryClient();
  const [docId, setDocId] = useState("");
  const { setAppAlert } = useContext(UseContext);
  const [letterTypes, setLetterTypes] = useState([]);
  const [selectedLetterType, setSelectedLetterType] = useState(""); // Store the selected letter type
  // const [letterWorkflow, setLetterWorkflow] = useState({});
  const setLetterWorkflow = useLetterWorkflowStore((state) => state.setLetterWorkflow);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employeeId, setEmployeeId] = useState("");
const [managerId, setManagerId] = useState("");
  const { savedEmployees } = useEmployeeStore(); // Get employees from Zustand

  const { data: data2 } = useQuery(`getOrgDocs`, async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/org/getdocs/letter`,
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
console.log("type",newDocument);

  const handleSelectChange = (e) => {
    setSelectedLetterType(e.target.value); // Update the selected letter type
  };


  useEffect(() => {
    const fetchLetterWorkflow = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/letter/get/${organisationId}`,
          {
            headers: { Authorization: authToken },
          }
        );

        // Extract letter types and update Zustand store
        const fetchedLetterTypes = Object.keys(response.data);
        setLetterTypes(fetchedLetterTypes); // Save letter types for dropdown

        fetchedLetterTypes.forEach((letterType) => {
          const workflowStatus = response.data[letterType].workflow;
          setLetterWorkflow(letterType, workflowStatus);
        });
      } catch (error) {
        console.error("Error fetching letter workflow:", error);
        // Optionally, you could set an error state here to display a message to the user
      }
    };

    if (organisationId && authToken) {
      fetchLetterWorkflow();
    }
  }, [organisationId, authToken, setLetterWorkflow]); // 




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


  const handleApprove = async (docId) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`, {
        status: "Pending", // Update status to Pending when sent for approval
      }, { headers: { Authorization: authToken } });
      querClient.invalidateQueries("getOrgDocs");
      setAppAlert({ alert: true, type: "success", msg: "Letter sent for approval" });
    } catch (error) {
      console.error("Error while sending document for approval:", error);
    }
  };

  const handleReject = async (docId) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`, {
        status: "Rejected", // Update status to Rejected
      }, { headers: { Authorization: authToken } });
      querClient.invalidateQueries("getOrgDocs");
      setAppAlert({ alert: true, type: "error", msg: "Letter rejected" });
    } catch (error) {
      console.error("Error while rejecting document:", error);
    }
  };




  useEffect(() => {
    setDocId("");
    setNewDocument({
      title: "",
      details: "",
      applicableDate: "",
    });
  }, [option]);


  const handleSelectEmployee = (e) => {
    const selectedEmployeeId = e.target.value;
    setSelectedEmployee(selectedEmployeeId);
    console.log("Selected employee", selectedEmployeeId)
  };

  const selectedEmployeeName = savedEmployees.find(
    (emp) => emp._id === selectedEmployee
  )?.first_name || "";

  console.log("selectedEmployeeName",savedEmployees)


  const handleCreateDocument = async () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(12);


        // Add header to the PDF
    if (newDocument.header) {
      doc.text(newDocument.header, 10, 20);
    }
      doc.text("Welcome to www.aegishrms.com", 10, 20);
      doc.text("Title: " + newDocument.title, 10, 30);
      doc.text("Applicable Date: " + newDocument.applicableDate, 10, 40);
      const detailsText = stripTags(newDocument.details); // Remove HTML tags
      const detailsLines = doc.splitTextToSize(detailsText, 180);
      doc.text(detailsLines, 10, 50);
       // Add footer to the PDF
    
       if (newDocument.footer) {
      const footerY = doc.internal.pageSize.height - 10;
      doc.text(newDocument.footer, 10, footerY);
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
          empidd: selectedEmployee,
          type: "Letter",
          letterType: selectedLetterType, // Send the selected letter type
          title: newDocument.title,
          details: newDocument.details,
          applicableDate: newDocument.applicableDate,
          header: newDocument.header,  // Send header to backend
          footer: newDocument.footer,  // Send footer to backend
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
      const resp = await axios.patch(
        `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
        {
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
    <div className="w-full h-full flex flex-col sm:flex-row justify-around p-6 gap-6 bg-gray-50 min-h-screen">
    {/* Left Section (Document List or Options) */}
    <Container 
      className={`w-full ${option === "emp" ? "sm:w-full" : "sm:w-1/2"} h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-4`}
    >
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
          onDelete={handleDeleteDoc} onApprove={handleApprove} onReject={handleReject} 
          data={data2}
        />
      )}
      {option === "" && (
        <div>
          <p className="font-semibold">
            Manage Organisational Records, Used For Generation And Distribution of Information To The Employees.
          </p>
          <Options setOption={setOption} />
        </div>
      )}
    </Container>
  
    {/* Right Section (Document Form) */}
    {option !== "emp" && (
      <Container className="w-full sm:w-1/2 h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-6">
        <div id="document-content">
          <div
            style={{ borderBottom: "2px solid gray" }}
            className="w-full flex justify-center mb-6"
          >
            <Typography className="!font-semibold !text-xl">
              {docId ? "Update Record" : "Create Record"}
            </Typography>
          </div>
    
    
      
     {/* Send To Field */}
     <div className="mb-4">
          <label
            htmlFor="sendTo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Send To
          </label>
          <select
            id="sendTo"
            onChange={handleSelectEmployee}
            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>Select an Employee</option>
            {savedEmployees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.first_name}
              </option>
            ))}
          </select>
        </div>

        {/* Display selected employee's name */}
        <div className="mb-4">
          <TextField
            label="Send To"
            size="small"
            value={selectedEmployeeName}
            disabled
            fullWidth
            margin="normal"
            className="bg-gray-100"
          />
        </div>
      



         {/* Select Dropdown */}
         <div className="mb-4">
        {/* Label for Letter Type */}
        <label htmlFor="letterType" className="block text-sm font-medium text-gray-700 mb-2">
          Letter Type
        </label>
         <select
          id="letterType"
          value={selectedLetterType}
          onChange={handleSelectChange}
          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="" disabled>
            Select a Letter Type
          </option>
          {letterTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        </div>



        <div className="mb-4">
  <TextField
    label="Header"
    size="small"
    value={newDocument.header || ""}
    onChange={(e) =>
      setNewDocument({ ...newDocument, header: e.target.value })
    }
    fullWidth
    margin="normal"
    className="bg-gray-100"
  />


          <div className="mb-4">
            <TextField
              label="Title"
              size="small"
              value={newDocument.title}
              onChange={(e) =>
                setNewDocument({ ...newDocument, title: e.target.value })
              }
              fullWidth
              margin="normal"
              className="bg-gray-100"
            />
  
            <div style={{ width: "100%", maxWidth: "668px" }}>
              <ReactQuill
                className="h-[280px] mb-9"
                theme="snow"
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
    label="Footer"
    size="small"
    value={newDocument.footer || ""}
    onChange={(e) =>
      setNewDocument({ ...newDocument, footer: e.target.value })
    }
    fullWidth
    margin="normal"
    className="bg-gray-100"
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
            inputProps={{
              min: new Date().toISOString().split("T")[0], // Prevent past dates
            }}
            className="bg-gray-100"
          />
        </div>
      </div>
        {/* Submit/Update Button Section */}
        <div className="flex gap-2 mt-3 justify-center">
          {!docId ? (
            <Button
              variant="contained"
              size="small"
              onClick={handleCreateDocument}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={handleUpdateDocument}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition duration-300"
            >
              Update
            </Button>
          )}
        </div>
      </Container>
    )}
  </div>
  
  
  );
};

export default DocManageAuth;

