
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
// import  logor from "../../../../src/assets/logoAegis.jpeg";

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
    setNewDocument(prevState => ({
      ...prevState,
      applicableDate: today,
    }));
  }, []); // The dependency array is empty, no need to worry about newDocument.
  

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


  // Function to open the PDF in a new tab
  const handleViewPDF = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank"); // Open PDF in new tab
    } else {
      alert("PDF URL is not available.");
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
      doc.text("Company Policies", pageWidth / 2, margin + 20, null, null, "center");
      
      // Draw a line below the header
      doc.setLineWidth(0.5);
      doc.line(margin, margin + 25, pageWidth - margin, margin + 25);
      
      // Add the document title and details with better styling
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0); // Set text color for title
      doc.text("Title: " + newDocument.title, margin, 40);
      
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
      
      
      
      
      
// const doc = new jsPDF('p', 'mm', 'a4'); // Set paper size to A4 (210mm x 297mm)

// // Set margins for the content to be inside the page
// const margin = 20;
// const pageWidth = doc.internal.pageSize.width; // Get page width
// const pageHeight = doc.internal.pageSize.height; // Get page height

// // Set Company Logo (if available)
// const logoUrl = "path_to_logo.png"; // Replace with actual logo URL
// const logoHeight = 20;  // Adjust height of logo
// const logoWidth = 30;   // Adjust width of logo
// doc.addImage(logoUrl, 'PNG', margin, margin, logoWidth, logoHeight); // Adjust image size

// // Set Header with Company Name and Document Title
// doc.setFontSize(18);
// doc.setTextColor(0, 102, 204); // Company branding color (blue)
// doc.text("Aegis HRMS", pageWidth / 2, margin + 25, null, null, 'center');
// doc.setFontSize(14);
// doc.setTextColor(0, 0, 0); // Black text for document title
// doc.text("Company Policy Document", pageWidth / 2, margin + 35, null, null, 'center');

// // Draw a Line below the Header for Separation
// doc.setLineWidth(0.8);
// doc.line(margin, margin + 45, pageWidth - margin, margin + 45);

// // Add Sidebar Section with Document Info
// const sidebarWidth = 50;
// const sidebarHeight = pageHeight - 2 * margin; // Sidebar will take the full height of the page
// doc.setFillColor(0, 102, 204); // Blue color for the sidebar
// doc.rect(margin, margin + 50, sidebarWidth, sidebarHeight, 'F'); // Sidebar background

// // Title and Date in Sidebar
// doc.setFontSize(12);
// doc.setTextColor(255, 255, 255); // White text
// doc.text("Title", margin + 5, margin + 60);
// doc.setFontSize(10);
// doc.text(newDocument.title, margin + 5, margin + 70);

// doc.text("Applicable Date", margin + 5, margin + 90);
// doc.text(newDocument.applicableDate, margin + 5, margin + 100);

// // Content Area with Background Color
// const contentLeftMargin = margin + sidebarWidth + 10; // Adjust content to the right
// const contentWidth = pageWidth - sidebarWidth - 2 * margin - 10;

// doc.setFillColor(240, 240, 240); // Light gray background for content area
// doc.rect(contentLeftMargin, margin + 50, contentWidth, pageHeight - margin - 50, 'F'); // Content block background

// // Title for Content Section
// doc.setFontSize(14);
// doc.setTextColor(0, 0, 0); // Black color for body text
// doc.text("Policy Details", contentLeftMargin + 10, margin + 60);

// // Add Document Details Section with Line Breaks
// const detailsText = stripTags(newDocument.details); // Remove HTML tags
// const detailsLines = doc.splitTextToSize(detailsText, contentWidth - 20); // Wrap text to fit content width

// // Check the available space on the page to prevent overflow
// let verticalPosition = margin + 70; // Start after the title
// const lineHeight = 8; // Line height for details

// // Loop through the details and add to PDF with a check for page overflow
// for (let i = 0; i < detailsLines.length; i++) {
//   if (verticalPosition + lineHeight > pageHeight - margin - 30) {
//     doc.addPage(); // Add a new page if we hit the bottom
//     verticalPosition = margin + 10; // Reset vertical position on new page
//   }

//   doc.text(detailsLines[i], contentLeftMargin + 10, verticalPosition);
//   verticalPosition += lineHeight; // Move down by the line height
// }

// // Add a Divider Line Between Content and Footer
// doc.setLineWidth(0.8);
// doc.line(contentLeftMargin, pageHeight - margin - 30, pageWidth - margin, pageHeight - margin - 30);

// // Footer with Contact Information and Page Numbers
// doc.setFontSize(10);
// doc.setTextColor(128, 128, 128); // Gray for footer text
// doc.text("For more information, visit www.aegishrms.com", pageWidth / 2, pageHeight - margin + 10, null, null, 'center');

// // Add Page Number at the Bottom Center
// const totalPages = doc.internal.getNumberOfPages();
// doc.text(`Page ${1} of ${totalPages}`, pageWidth / 2, pageHeight - margin - 10, null, null, 'center');

// // Final Output as Data URI
// const pdfDataUri = doc.output("datauristring");


// const doc = new jsPDF();

// // Set margins and add padding for layout
// const margin = 20;
// const pageWidth = doc.internal.pageSize.width;
// const pageHeight = doc.internal.pageSize.height;
// const headerHeight = 40; // Height of the header section
// const footerHeight = 20; // Height of the footer section

// // Add a logo or company name (if available)
// doc.setFontSize(22);
// doc.setTextColor(0, 102, 204); // Blue color for the header
// doc.text("Aegis HRMS", pageWidth / 2, margin + 20, null, null, "center"); // Company name at top center

// // Add a subtitle with some visual space
// doc.setFontSize(14);
// doc.setTextColor(0, 0, 0); // Black color for subtitle
// doc.text("Company Policies", pageWidth / 2, margin + 35, null, null, "center"); // Subtitle below company name

// // Draw a line below the header for separation
// doc.setLineWidth(0.5);
// doc.setDrawColor(0, 102, 204); // Blue line for visual separation
// doc.line(margin, margin + headerHeight, pageWidth - margin, margin + headerHeight); // Blue line under header

// // Add the document title and details with better styling
// doc.setFontSize(16);
// doc.setTextColor(0, 0, 0); // Set text color for title
// doc.text("Title: " + newDocument.title, margin, headerHeight + 20); // Title with margin below header

// doc.setFontSize(12);
// doc.text("Applicable Date: " + newDocument.applicableDate, margin, headerHeight + 30); // Date just below the title

// // Add a section with formatted details (handle text overflow)
// const detailsText = stripTags(newDocument.details); // Remove HTML tags
// const detailsLines = doc.splitTextToSize(detailsText, pageWidth - 2 * margin);
// doc.text(detailsLines, margin, headerHeight + 40); // Content starts right below the date

// // Add more space before footer
// doc.addPage();

// // Example of a footer
// const footerText = "For more information, visit www.aegishrms.com";
// doc.setFontSize(10);
// doc.setTextColor(128, 128, 128); // Gray color for footer text
// doc.text(footerText, pageWidth / 2, pageHeight - footerHeight, null, null, "center"); // Footer text centered at bottom

// // Optional: Draw a line at the bottom for separation
// doc.setLineWidth(0.5);
// doc.setDrawColor(0, 102, 204); // Same blue for footer line
// doc.line(margin, pageHeight - footerHeight - 10, pageWidth - margin, pageHeight - footerHeight - 10); // Blue line at the bottom

// // Save the document as a PDF data URI
// const pdfDataUri = doc.output("datauristring");









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
      <div className="w-full h-full flex justify-around p-6 gap-6">
        <Container className="w-[600px] h-[80vh] border-2  pt-4">
          <DocList
            onEdit={handleEditDocument}
            onDelete={handleDeleteDoc}
            onViewPDF={handleViewPDF} // Pass the PDF viewing function

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
