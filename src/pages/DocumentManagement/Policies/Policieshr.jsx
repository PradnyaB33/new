
// import React from "react";
// import {  Button, Container,TextField,Typography,} from "@mui/material";
// import axios from "axios";
// import jsPDF from "jspdf";
// import { useContext, useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import stripTags from "striptags";
// import { UseContext } from "../../../State/UseState/UseContext";
// import useGetUser from "../../../hooks/Token/useUser";
// import {getSignedUrlForOrgDocs,uploadFile,} from "../../../services/docManageS3";
// import DocList from "../components/DocList";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";


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

//   console.log(data2);

//   const [newDocument, setNewDocument] = useState({
//     title: "",
//     details: "",
//     applicableDate: "",
//     type: "Policies and Procedures",
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
//     // Set the initial applicable date to the current date in the format YYYY-MM-DD
//     const today = new Date().toISOString().split("T")[0]; // This gives you "YYYY-MM-DD"
//     setNewDocument(prevState => ({
//       ...prevState,
//       applicableDate: today,
//     }));
//   }, []); // The dependency array is empty, no need to worry about newDocument.
  

//   //   useEffect(() => {
//   //     setDocId("");
//   //     setNewDocument({
//   //       title: "",
//   //       details: "",
//   //       applicableDate: "",
//   //     });
//   //   }, [option]);

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
//       });

//       console.log("Document uploaded and data saved successfully");
//     } catch (error) {
//       console.error("Error while uploading document and saving data:", error);
//     }
//   };


//   // Function to open the PDF in a new tab
//   const handleViewPDF = (pdfUrl) => {
//     if (pdfUrl) {
//       window.open(pdfUrl, "_blank"); // Open PDF in new tab
//     } else {
//       alert("PDF URL is not available.");
//     }
//   };


//   const handleUpdateDocument = async () => {
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
    
//       const resp = await axios.patch(
//         `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
//         {
//           type: newDocument.type,
//           title: newDocument.title,
//           details: newDocument.details,
//           applicableDate: newDocument.applicableDate,
//           url: signedUrlResponse.url.split("?")[0],
//         },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log(resp);
    
//     querClient.invalidateQueries("getOrgDocs");
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
//         <Container className="w-[600px] h-[80vh] border-2  pt-4">
//           <DocList
//             onEdit={handleEditDocument}
//             onDelete={handleDeleteDoc}
//             onViewPDF={handleViewPDF} // Pass the PDF viewing function

//             data={data2}
//           />
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

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Type
//               </label>
//               <select
//                 value={newDocument.type}
//                 onChange={(e) =>
//                   setNewDocument({ ...newDocument, type: e.target.value })
//                 }
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               >
//                 <option value="Policies and Procedures">
//                   Policies and Procedures
//                 </option>
//                 <option value="Comms">Comms</option>
//               </select>
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
//                   theme="snow" // Specify Quill theme
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
//                   min: new Date().toISOString().split("T")[0], // Prevent past dates
//                 }}
//               />
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






// import React from "react";
// import {  Button, Container,TextField,Typography,} from "@mui/material";
// import axios from "axios";
// import jsPDF from "jspdf";
// import { useContext, useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import stripTags from "striptags";
// import { UseContext } from "../../../State/UseState/UseContext";
// import useGetUser from "../../../hooks/Token/useUser";
// import {getSignedUrlForOrgDocs,uploadFile,} from "../../../services/docManageS3";
// import DocList from "../components/DocList";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import UserProfile from "../../../hooks/UserData/useUser";
// import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
// import  logor from "../../../../src/assets/logoAegis.jpeg";

// const Policieshr = () => {
//   const { authToken } = useGetUser();
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   console.log("user",user);
//   // const organisationId=  user.organizationId;
//   console.log("organisationIdak",user.organizationId);

//   const { data } = useSubscriptionGet({
//     organisationId: user.organizationId,
//   });
//   // const orglogo= useSubscriptionGet({organisationId}); 
  
//   const logo = data.organisation.logo_url;
//   console.log("akash",logo);
//   const querClient = useQueryClient();
//   const [docId, setDocId] = useState("");
//   const { setAppAlert } = useContext(UseContext);
//   const { data: data2 } = useQuery(`getOrgDocs`, async () => {

//       console.log("user",user);


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
//     type: "Policies and Procedures",
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
//     // Set the initial applicable date to the current date in the format YYYY-MM-DD
//     const today = new Date().toISOString().split("T")[0]; // This gives you "YYYY-MM-DD"
//     setNewDocument(prevState => ({
//       ...prevState,
//       applicableDate: today,
//     }));
//   }, []); // The dependency array is empty, no need to worry about newDocument.
  

//   //   useEffect(() => {
//   //     setDocId("");
//   //     setNewDocument({
//   //       title: "",
//   //       details: "",
//   //       applicableDate: "",
//   //     });
//   //   }, [option]);



//   // Function to open the PDF in a new tab
//   const handleViewPDF = (pdfUrl) => {
//     if (pdfUrl) {
//       window.open(pdfUrl, "_blank"); // Open PDF in new tab
//     } else {
//       alert("PDF URL is not available.");
//     }
//   };


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
//       });

//       console.log("Document uploaded and data saved successfully");
//     } catch (error) {
//       console.error("Error while uploading document and saving data:", error);
//     }
//   };




//   const handleUpdateDocument = async () => {
//     try {


//       // const doc = new jsPDF();
//       // doc.setFontSize(12);
//       // doc.text("Welcome to www.aegishrms.com", 10, 20);
//       // doc.text("Title: " + newDocument.title, 10, 30);
//       // doc.text("Applicable Date: " + newDocument.applicableDate, 10, 40);
//       // const detailsText = stripTags(newDocument.details); // Remove HTML tags
//       // const detailsLines = doc.splitTextToSize(detailsText, 180);
//       // doc.text(detailsLines, 10, 50);
//       // const pdfDataUri = doc.output("datauristring");
     
//        const doc = new jsPDF();

//       // Set margins and add padding for layout
//       const margin = 10;
//       const pageWidth = doc.internal.pageSize.width;
//       const pageHeight = doc.internal.pageSize.height;
      
//       // Add a logo or company name (if available)
//       doc.setFontSize(18);
//       doc.setTextColor(0, 102, 204); // Blue color for the header
//       doc.text("Aegis HRMS", pageWidth / 2, margin + 10, null, null, "center");
      
//       // Add a subtitle with some visual space
//       doc.setFontSize(12);
//       doc.setTextColor(0, 0, 0); // Black color
//       doc.text(newDocument.type, pageWidth / 2, margin + 20, null, null, "center");
      
//       // Draw a line below the header
//       doc.setLineWidth(0.5);
//       doc.line(margin, margin + 25, pageWidth - margin, margin + 25);
      
//       // Add the document title and details with better styling
//       doc.setFontSize(14);
//       doc.setTextColor(0, 0, 0); // Set text color for title
//       doc.text("Title: " + newDocument.title, margin, 40,);
      
//       doc.setFontSize(12);
//       doc.text("Applicable Date: " + newDocument.applicableDate, margin, 50);
      
//       // Add a section with formatted details
//       const detailsText = stripTags(newDocument.details); // Remove HTML tags
//       const detailsLines = doc.splitTextToSize(detailsText, pageWidth - 2 * margin);
//       doc.text(detailsLines, margin, 60);
      
//       // Add some space for better layout
//       doc.addPage();
      
//       // Example of a footer
//       const footerText = "For more information, visit www.aegishrms.com";
//       doc.setFontSize(10);
//       doc.setTextColor(128, 128, 128); // Gray color for footer
//       doc.text(footerText, pageWidth / 2, pageHeight - margin, null, null, "center");
      
//       // Save the document as a PDF data URI
//       const pdfDataUri = doc.output("datauristring");
      
      



//       const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
//         documentName: `${newDocument.title}`,
//       });

//       const blob = await fetch(pdfDataUri).then((res) => res.blob());
//       await uploadFile(signedUrlResponse.url, blob);
    
//       const resp = await axios.patch(
//         `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
//         {
//           type: newDocument.type,
//           title: newDocument.title,
//           details: newDocument.details,
//           applicableDate: newDocument.applicableDate,
//           url: signedUrlResponse.url.split("?")[0],
//         },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log(resp);
    
//     querClient.invalidateQueries("getOrgDocs");
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
//         <Container className="w-[600px] h-[80vh] border-2  pt-4">
//           <DocList
//             onEdit={handleEditDocument}
//             onDelete={handleDeleteDoc}
//             onViewPDF={handleViewPDF} // Pass the PDF viewing function

//             data={data2}
//           />
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

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Type
//               </label>
//               <select
//                 value={newDocument.type}
//                 onChange={(e) =>
//                   setNewDocument({ ...newDocument, type: e.target.value })
//                 }
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               >
//                 <option value="Policies and Procedures">
//                   Policies and Procedures
//                 </option>
//                 <option value="Comms">Comms</option>
//               </select>
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
//                   theme="snow" // Specify Quill theme
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
//                   min: new Date().toISOString().split("T")[0], // Prevent past dates
//                 }}
//               />
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





// // //date modification

// import React from "react";
// import {  Button, Container,TextField,Typography,} from "@mui/material";
// import axios from "axios";
// import jsPDF from "jspdf";
// import { useContext, useEffect, useState } from "react";
// import { useQuery, useQueryClient } from "react-query";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
// import stripTags from "striptags";
// import { UseContext } from "../../../State/UseState/UseContext";
// import useGetUser from "../../../hooks/Token/useUser";
// import {getSignedUrlForOrgDocs,uploadFile,} from "../../../services/docManageS3";
// import DocList from "../components/DocList";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import UserProfile from "../../../hooks/UserData/useUser";
// import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
// import  logor from "../../../../src/assets/logoAegis.jpeg";

// const Policieshr = () => {
//   const { authToken } = useGetUser();
//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   console.log("user",user);
//   // const organisationId=  user.organizationId;
//   console.log("organisationIdak",user.organizationId);

//   const { data } = useSubscriptionGet({
//     organisationId: user.organizationId,
//   });
//   // const orglogo= useSubscriptionGet({organisationId}); 
  
//   const logo = data.organisation.logo_url;
//   console.log("akash",logo);
//   const querClient = useQueryClient();
//   const [docId, setDocId] = useState("");
//   const { setAppAlert } = useContext(UseContext);
//   const { data: data2 } = useQuery(`getOrgDocs`, async () => {

//       console.log("user",user);


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
//     type: "Policies and Procedures",
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
//       const document = response.data.doc;
      
//       // Convert the applicableDate to the 'YYYY-MM-DD' format
//       const formattedDate = new Date(document.applicableDate).toISOString().split('T')[0];
      
//       // Update the state with the formatted date
//       setNewDocument({
//         title: document.title,
//         details: document.details,
//         applicableDate: formattedDate,  // Set the formatted date here
//         type: document.type,
//       });
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
//     const today = new Date().toISOString().split("T")[0];
//     setNewDocument(prevState => ({
//       ...prevState,
//       applicableDate: today,
//     }));
//   }, []); // This is no longer needed if we're setting the date on edit
  
  



//   // Function to open the PDF in a new tab
//   const handleViewPDF = (pdfUrl) => {
//     if (pdfUrl) {
//       window.open(pdfUrl, "_blank"); // Open PDF in new tab
//     } else {
//       alert("PDF URL is not available.");
//     }
//   };


//   const handleCreateDocument = async () => {
//     try {
    
//       const doc = new jsPDF();

//       // Set margins and add padding for layout
//       const margin = 10;
//       const pageWidth = doc.internal.pageSize.width;
//       const pageHeight = doc.internal.pageSize.height;
      
//       // Add a logo or company name (if available)
//       doc.setFontSize(18);
//       doc.setTextColor(0, 102, 204); // Blue color for the header
//       doc.text("Aegis HRMS", pageWidth / 2, margin + 10, null, null, "center");
      
//       // Add a subtitle with some visual space
//       doc.setFontSize(12);
//       doc.setTextColor(0, 0, 0); // Black color
//       doc.text(newDocument.type, pageWidth / 2, margin + 20, null, null, "center");
      
//       // Draw a line below the header
//       doc.setLineWidth(0.5);
//       doc.line(margin, margin + 25, pageWidth - margin, margin + 25);
      
//       // Add the document title and details with better styling
//       doc.setFontSize(14);
//       doc.setTextColor(0, 0, 0); // Set text color for title
//       doc.text("Title: " + newDocument.title, margin, 40,);
      
//       doc.setFontSize(12);
//       doc.text("Applicable Date: " + newDocument.applicableDate, margin, 50);
      
//       // Add a section with formatted details
//       const detailsText = stripTags(newDocument.details); // Remove HTML tags
//       const detailsLines = doc.splitTextToSize(detailsText, pageWidth - 2 * margin);
//       doc.text(detailsLines, margin, 60);
      
//       // Add some space for better layout
//       doc.addPage();
      
//       // Example of a footer
//       const footerText = "For more information, visit www.aegishrms.com";
//       doc.setFontSize(10);
//       doc.setTextColor(128, 128, 128); // Gray color for footer
//       doc.text(footerText, pageWidth / 2, pageHeight - margin, null, null, "center");
      
//       // Save the document as a PDF data URI
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
//       });

//       console.log("Document uploaded and data saved successfully");
//     } catch (error) {
//       console.error("Error while uploading document and saving data:", error);
//     }
//   };




//   const handleUpdateDocument = async () => {
//     try {


//       // const doc = new jsPDF();
//       // doc.setFontSize(12);
//       // doc.text("Welcome to www.aegishrms.com", 10, 20);
//       // doc.text("Title: " + newDocument.title, 10, 30);
//       // doc.text("Applicable Date: " + newDocument.applicableDate, 10, 40);
//       // const detailsText = stripTags(newDocument.details); // Remove HTML tags
//       // const detailsLines = doc.splitTextToSize(detailsText, 180);
//       // doc.text(detailsLines, 10, 50);
//       // const pdfDataUri = doc.output("datauristring");
     
//        const doc = new jsPDF();

//       // Set margins and add padding for layout
//       const margin = 10;
//       const pageWidth = doc.internal.pageSize.width;
//       const pageHeight = doc.internal.pageSize.height;
      
//       // Add a logo or company name (if available)
//       doc.setFontSize(18);
//       doc.setTextColor(0, 102, 204); // Blue color for the header
//       doc.text("Aegis HRMS", pageWidth / 2, margin + 10, null, null, "center");
      
//       // Add a subtitle with some visual space
//       doc.setFontSize(12);
//       doc.setTextColor(0, 0, 0); // Black color
//       doc.text(newDocument.type, pageWidth / 2, margin + 20, null, null, "center");
      
//       // Draw a line below the header
//       doc.setLineWidth(0.5);
//       doc.line(margin, margin + 25, pageWidth - margin, margin + 25);
      
//       // Add the document title and details with better styling
//       doc.setFontSize(14);
//       doc.setTextColor(0, 0, 0); // Set text color for title
//       doc.text("Title: " + newDocument.title, margin, 40,);
      
//       doc.setFontSize(12);
//       doc.text("Applicable Date: " + newDocument.applicableDate, margin, 50);
      
//       // Add a section with formatted details
//       const detailsText = stripTags(newDocument.details); // Remove HTML tags
//       const detailsLines = doc.splitTextToSize(detailsText, pageWidth - 2 * margin);
//       doc.text(detailsLines, margin, 60);
      
//       // Add some space for better layout
//       doc.addPage();
      
//       // Example of a footer
//       const footerText = "For more information, visit www.aegishrms.com";
//       doc.setFontSize(10);
//       doc.setTextColor(128, 128, 128); // Gray color for footer
//       doc.text(footerText, pageWidth / 2, pageHeight - margin, null, null, "center");
      
//       // Save the document as a PDF data URI
//       const pdfDataUri = doc.output("datauristring");
      
      



//       const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
//         documentName: `${newDocument.title}`,
//       });

//       const blob = await fetch(pdfDataUri).then((res) => res.blob());
//       await uploadFile(signedUrlResponse.url, blob);
    
//       const resp = await axios.patch(
//         `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
//         {
//           type: newDocument.type,
//           title: newDocument.title,
//           details: newDocument.details,
//           applicableDate: newDocument.applicableDate,
//           url: signedUrlResponse.url.split("?")[0],
//         },
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       console.log(resp);
    
//     querClient.invalidateQueries("getOrgDocs");
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
//         <Container className="w-[600px] h-[80vh] border-2  pt-4">
//           <DocList
//             onEdit={handleEditDocument}
//             onDelete={handleDeleteDoc}
//             onViewPDF={handleViewPDF} // Pass the PDF viewing function

//             data={data2}
//           />
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

//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700">
//                 Type
//               </label>
//               <select
//                 value={newDocument.type}
//                 onChange={(e) =>
//                   setNewDocument({ ...newDocument, type: e.target.value })
//                 }
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               >
//                 <option value="Policies and Procedures">
//                   Policies and Procedures
//                 </option>
//                 <option value="Comms">Comms</option>
//               </select>
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
//                   theme="snow" // Specify Quill theme
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
//                   min: new Date().toISOString().split("T")[0], // Prevent past dates
//                 }}
//               />
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






// // //date modification

import React from "react";
import {  Button, Container,TextField,Typography,} from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import { useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import stripTags from "striptags";
import { UseContext } from "../../../State/UseState/UseContext";
import useGetUser from "../../../hooks/Token/useUser";
import {getSignedUrlForOrgDocs,uploadFile,} from "../../../services/docManageS3";
import DocList from "../components/DocList";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import UserProfile from "../../../hooks/UserData/useUser";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import  logor from "../../../../src/assets/logoAegis.jpeg";

const Policieshr = () => {
  const { authToken } = useGetUser();
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  console.log("user",user);
  // const organisationId=  user.organizationId;
  console.log("organisationIdak",user.organizationId);

  const { data } = useSubscriptionGet({
    organisationId: user.organizationId,
  });
  // const orglogo= useSubscriptionGet({organisationId}); 
  
  const logo = data.organisation.logo_url;
  console.log("akash",logo);
  const querClient = useQueryClient();
  const [docId, setDocId] = useState("");
  const { setAppAlert } = useContext(UseContext);
  const { data: data2 } = useQuery(`getOrgDocs`, async () => {

      console.log("user",user);


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
      const document = response.data.doc;
      
      // Convert the applicableDate to the 'YYYY-MM-DD' format
      const formattedDate = new Date(document.applicableDate).toISOString().split('T')[0];
      
      // Update the state with the formatted date
      setNewDocument({
        title: document.title,
        details: document.details,
        applicableDate: formattedDate,  // Set the formatted date here
        type: document.type,
      });
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
    const today = new Date().toISOString().split("T")[0];
    setNewDocument(prevState => ({
      ...prevState,
      applicableDate: today,
    }));
  }, []); // This is no longer needed if we're setting the date on edit
  
  



  // Function to open the PDF in a new tab
  const handleViewPDF = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank"); // Open PDF in new tab
    } else {
      alert("PDF URL is not available.");
    }
  };


  const handleCreateDocument = async () => {
    try {
    
      const doc = new jsPDF();

      // Set margins and add padding for layout
      const margin = 10;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // Add a logo or company name (if available)
      doc.setFontSize(18);
      doc.setTextColor(0, 102, 204); // Blue color for the header
      doc.text("Aegis HRMS", pageWidth / 2, margin + 10, null, null, "center");
      
      // Add a subtitle with some visual space
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Black color
      doc.text(newDocument.type, pageWidth / 2, margin + 20, null, null, "center");
      
      // Draw a line below the header
      doc.setLineWidth(0.5);
      doc.line(margin, margin + 25, pageWidth - margin, margin + 25);
      
      // Add the document title and details with better styling
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0); // Set text color for title
      doc.text("Title: " + newDocument.title, margin, 40,);
      
      doc.setFontSize(12);
      doc.text("Applicable Date: " + newDocument.applicableDate, margin, 50);
      
      // Add a section with formatted details
      const detailsText = stripTags(newDocument.details); // Remove HTML tags
      const detailsLines = doc.splitTextToSize(detailsText, pageWidth - 2 * margin);
      doc.text(detailsLines, margin, 60);
      
      // Add some space for better layout
      doc.addPage();
      
      // Example of a footer
      const footerText = "For more information, visit www.aegishrms.com";
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128); // Gray color for footer
      doc.text(footerText, pageWidth / 2, pageHeight - margin, null, null, "center");
      
      // Save the document as a PDF data URI
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


      // const doc = new jsPDF();
      // doc.setFontSize(12);
      // doc.text("Welcome to www.aegishrms.com", 10, 20);
      // doc.text("Title: " + newDocument.title, 10, 30);
      // doc.text("Applicable Date: " + newDocument.applicableDate, 10, 40);
      // const detailsText = stripTags(newDocument.details); // Remove HTML tags
      // const detailsLines = doc.splitTextToSize(detailsText, 180);
      // doc.text(detailsLines, 10, 50);
      // const pdfDataUri = doc.output("datauristring");
     
       const doc = new jsPDF();

      // Set margins and add padding for layout
      const margin = 10;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      
      // Add a logo or company name (if available)
      doc.setFontSize(18);
      doc.setTextColor(0, 102, 204); // Blue color for the header
      doc.text("Aegis HRMS", pageWidth / 2, margin + 10, null, null, "center");
      
      // Add a subtitle with some visual space
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Black color
      doc.text(newDocument.type, pageWidth / 2, margin + 20, null, null, "center");
      
      // Draw a line below the header
      doc.setLineWidth(0.5);
      doc.line(margin, margin + 25, pageWidth - margin, margin + 25);
      
      // Add the document title and details with better styling
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0); // Set text color for title
      doc.text("Title: " + newDocument.title, margin, 40,);
      
      doc.setFontSize(12);
      doc.text("Applicable Date: " + newDocument.applicableDate, margin, 50);
      
      // Add a section with formatted details
      const detailsText = stripTags(newDocument.details); // Remove HTML tags
      const detailsLines = doc.splitTextToSize(detailsText, pageWidth - 2 * margin);
      doc.text(detailsLines, margin, 60);
      
      // Add some space for better layout
      doc.addPage();
      
      // Example of a footer
      const footerText = "For more information, visit www.aegishrms.com";
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128); // Gray color for footer
      doc.text(footerText, pageWidth / 2, pageHeight - margin, null, null, "center");
      
      // Save the document as a PDF data URI
      const pdfDataUri = doc.output("datauristring");
      
      



      const signedUrlResponse = await getSignedUrlForOrgDocs(authToken, {
        documentName: `${newDocument.title}`,
      });

      const blob = await fetch(pdfDataUri).then((res) => res.blob());
      await uploadFile(signedUrlResponse.url, blob);
    
      const resp = await axios.patch(
        `${process.env.REACT_APP_API}/route/org/updatedocuments/${docId}`,
        {
          type: newDocument.type,
          title: newDocument.title,
          details: newDocument.details,
          applicableDate: newDocument.applicableDate,
          url: signedUrlResponse.url.split("?")[0],
        },
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
        msg: "Document Updated Successfully",
      });
    } catch (error) {
      console.error("Error while updating document:", error);
    }
  };



  return (
<BoxComponent>
  <HeadingOneLineInfo heading={"Add Policies and Procedures"} />
  
  <div className="w-full h-full flex flex-col sm:flex-row justify-around p-6 gap-6 bg-gray-50 min-h-screen">

    {/* Left Section (Document List) */}
    <Container className="w-full sm:w-1/2 h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-4">
      <DocList
        onEdit={handleEditDocument}
        onDelete={handleDeleteDoc}
        onViewPDF={handleViewPDF} // Pass the PDF viewing function
        data={data2}
      />
    </Container>

    {/* Right Section (Document Form) */}
    <Container className="w-full sm:w-1/2 h-auto max-h-[90vh] border-2 border-gray-300 shadow-lg rounded-lg overflow-y-auto bg-white p-6">
      <div id="document-content">
        <div   style={{ borderBottom: "2px solid gray" }}
        className="w-full flex justify-center mb-6">
          <Typography className="!font-semibold !text-xl">
            {docId ? "Update Record" : "Create Record"}
          </Typography>
        </div>
  


        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={newDocument.type}
            onChange={(e) =>
              setNewDocument({ ...newDocument, type: e.target.value })
            }
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
          >
            <option value="Policies and Procedures">Policies and Procedures</option>
            <option value="Comms">Comms</option>
          </select>
        </div>

        <div className="mb-6">
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

          {/* Quill Editor */}
          <div className="w-full mb-9">
            <ReactQuill
              className="h-[180px] mb-9"
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
  </div>
</BoxComponent>

  );
};

export default Policieshr;









