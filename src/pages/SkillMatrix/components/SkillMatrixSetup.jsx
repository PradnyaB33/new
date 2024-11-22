// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { Button, CircularProgress } from "@mui/material";
// // import axios from "axios";
// // import React, { useContext, useEffect, useState } from "react";
// // // import { useForm } from "react-hook-form";
// // // import { useMutation } from "react-query";
// // import { useParams } from "react-router-dom";
// // import { z } from "zod";
// // // import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";

// // import useAuthToken from "../../../hooks/Token/useAuth";
// // // import { TestContext } from "../../State/Function/Main";
// // import Setup from "../../SetUpOrganization/Setup";

// // import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// // import BoxComponent from "../../../components/BoxComponent/BoxComponent";

// // const SkillMatrixSetup = () => {
// //   // zod Schema
// //   const { organisationId } = useParams();
// //   const authToken = useAuthToken();
// //   const [skillName, setSkillName] = useState("");
// //   const [skillDescription, setSkillDescription] = useState("");

// //   const handleAddSkill = () => {
// //     console.log("Skill added:", { skillName, skillDescription });
// //   };

// //   return (
// //     <BoxComponent sx={{ p: 0 }}>
// //       <Setup>
// //         <div className="h-[90vh] overflow-y-auto scroll px-3">
// //           <div className="xs:block sm:block md:flex justify-between items-center ">
// //             <HeadingOneLineInfo
// //               className="!my-3"
// //               heading="Skill Matrix "
// //               info="Setup Skill Matrix  For Your Organisation."
// //             />
// //           </div>

// //           <div>
// //             <button
// //               onClick={() => {
// //                 /* Logic to open the Add Skill popup */
// //               }}
// //             >
// //               Add Skill
// //             </button>
// //             <div>
// //               <input
// //                 type="text"
// //                 value={skillName}
// //                 onChange={(e) => setSkillName(e.target.value)}
// //                 placeholder="Skill Name"
// //               />
// //               <br /> <br />
// //               <textarea
// //                 value={skillDescription}
// //                 onChange={(e) => setSkillDescription(e.target.value)}
// //                 placeholder="Skill Description"
// //               />
// //               <br /> <br />
// //               <button onClick={handleAddSkill}>Save</button>

// //             </div>
// //           </div>
// //         </div>
// //       </Setup>
// //     </BoxComponent>
// //   );
// // };

// // export default SkillMatrixSetup;

//✅

// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Button,
//   TextField,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Checkbox,
//   FormControlLabel,
//   Typography,
// } from "@mui/material";
// import React, { useState } from "react";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// const SkillMatrixSetup = () => {
//   // Skill Limit Logic Based on Package
//   const [skillCount, setSkillCount] = useState(0); // Keep track of the number of skills
//   const [packageType, setPackageType] = useState("no-cost"); // Package type (no-cost or collaboration)

//   const maxSkills = packageType === "no-cost" ? 5 : Infinity;

//   // Popup State
//   const [openPopup, setOpenPopup] = useState(false);

//   // Form State
//   const [skillName, setSkillName] = useState("");
//   const [skillDescription, setSkillDescription] = useState("");
//   const [isAssessmentEnabled, setIsAssessmentEnabled] = useState(false);

//   // Zod Schema for Validation
//   const skillSchema = z.object({
//     skillName: z.string().min(1, "Skill name is required").max(50, "Max 50 characters"),
//     skillDescription: z.string().max(200, "Max 200 characters"),
//   });

//   const validateSkill = (name, description) => {
//     try {
//       skillSchema.parse({ skillName: name, skillDescription: description });
//       return true;
//     } catch (error) {
//       console.error(error.errors);
//       return false;
//     }
//   };

//   // Handle Add Skill
//   const handleAddSkill = () => {
//     if (skillCount >= maxSkills) {
//       alert(`You can only add up to ${maxSkills} skills in the ${packageType} package.`);
//       return;
//     }

//     if (validateSkill(skillName, skillDescription)) {
//       console.log("Skill added:", { skillName, skillDescription });
//       setSkillCount((prev) => prev + 1); // Increment skill count
//       setOpenPopup(false); // Close the popup
//       setSkillName(""); // Reset form
//       setSkillDescription("");
//     } else {
//       alert("Please fix the errors in the form.");
//     }
//   };

//   return (
//     <BoxComponent sx={{ p: 0 }}>
//       <div>
//         <HeadingOneLineInfo
//           className="!my-3"
//           heading="Skill Matrix"
//           info="Setup Skill Matrix For Your Organisation."
//         />

//         {/* Add Skill Button */}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => setOpenPopup(true)}
//           disabled={skillCount >= maxSkills} // Disable if skill limit is reached
//         >
//           Add Skill
//         </Button>

//         {/* Popup Dialog for Adding Skills */}
//         <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
//           <DialogTitle>Add Skill</DialogTitle>
//           <DialogContent>
//             <TextField
//               fullWidth
//               label="Skill Name"
//               value={skillName}
//               onChange={(e) => setSkillName(e.target.value)}
//               margin="dense"
//             />
//             <TextField
//               fullWidth
//               label="Skill Description"
//               value={skillDescription}
//               onChange={(e) => setSkillDescription(e.target.value)}
//               margin="dense"
//               multiline
//               rows={3}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenPopup(false)} color="secondary">
//               Cancel
//             </Button>
//             <Button onClick={handleAddSkill} color="primary">
//               Save
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Skill Hierarchy Section */}
//         <Typography variant="h6" className="mt-4">
//           Skill Hierarchy
//         </Typography>
//         <div>
//           {/* Placeholder: Replace with drag-and-drop functionality */}
//           <p>Skills added will appear here in a hierarchical structure.</p>
//         </div>

//         {/* Enable Assessments */}
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={isAssessmentEnabled}
//               onChange={(e) => setIsAssessmentEnabled(e.target.checked)}
//             />
//           }
//           label="Enable Assessments"
//         />
//         {isAssessmentEnabled && (
//           <Typography variant="body2" color="textSecondary">
//             Managers can send assessment forms to employees reporting to them.
//           </Typography>
//         )}
//       </div>
//     </BoxComponent>
//   );
// };

// export default SkillMatrixSetup;

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const SkillMatrixSetup = () => {
  // Skill Limit Logic Based on Package
  const [skillCount, setSkillCount] = useState(0); // Keep track of the number of skills
  const [packageType, setPackageType] = useState("no-cost"); // Package type (no-cost or collaboration)

  const maxSkills = packageType === "no-cost" ? 5 : Infinity;

  // Popup State
  const [openPopup, setOpenPopup] = useState(false);

  // Form State
  const [skillName, setSkillName] = useState("");
  const [skillDescription, setSkillDescription] = useState("");
  const [isAssessmentEnabled, setIsAssessmentEnabled] = useState(false);

  // Zod Schema for Validation
  const skillSchema = z.object({
    skillName: z
      .string()
      .min(1, "Skill name is required")
      .max(50, "Max 50 characters"),
    skillDescription: z.string().max(200, "Max 200 characters"),
  });

  const validateSkill = (name, description) => {
    try {
      skillSchema.parse({ skillName: name, skillDescription: description });
      return true;
    } catch (error) {
      console.error(error.errors);
      return false;
    }
  };

  // Handle Add Skill
  const handleAddSkill = () => {
    if (skillCount >= maxSkills) {
      alert(
        `You can only add up to ${maxSkills} skills in the ${packageType} package.`
      );
      return;
    }

    if (validateSkill(skillName, skillDescription)) {
      console.log("Skill added:", { skillName, skillDescription });
      setSkillCount((prev) => prev + 1); // Increment skill count
      setOpenPopup(false); // Close the popup
      setSkillName(""); // Reset form
      setSkillDescription("");
    } else {
      alert("Please fix the errors in the form.");
    }
  };

  return (
    <BoxComponent sx={{ p: 0 }} className="p-4">
      <div className="max-w-3xl mx-auto">
        <HeadingOneLineInfo
          className="my-3"
          heading="Skill Matrix"
          info="Setup Skill Matrix For Your Organisation."
        />

        {/* Add Skill Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenPopup(true)}
          disabled={skillCount >= maxSkills}
          className="w-full sm:w-auto mb-4 bg-blue-500 hover:bg-blue-700 text-white"
        >
          Add Skill
        </Button>

        {/* Popup Dialog for Adding Skills */}
        <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
          <DialogTitle>Add Skill</DialogTitle>
          <DialogContent className="space-y-4">
            <TextField
              fullWidth
              label="Skill Name"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              margin="dense"
              className="border border-gray-300 rounded-md p-2"
            />
            <TextField
              fullWidth
              label="Skill Description"
              value={skillDescription}
              onChange={(e) => setSkillDescription(e.target.value)}
              margin="dense"
              multiline
              rows={3}
              className="border border-gray-300 rounded-md p-2"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenPopup(false)}
              color="secondary"
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddSkill}
              color="primary"
              className="bg-blue-500 hover:bg-blue-700 text-white"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Skill Hierarchy Section
        <Typography variant="h6" className="mt-4 font-semibold text-gray-800">
          Skill Hierarchy
        </Typography>
        <div className="bg-gray-100 p-4 rounded-lg mt-2">
          <p className="text-gray-600">
            Skills added will appear here in a hierarchical structure.
          </p>
        </div> */}
        <br />

        {/* Enable Assessments */}
        <FormControlLabel
          control={
            <Checkbox
              checked={isAssessmentEnabled}
              onChange={(e) => setIsAssessmentEnabled(e.target.checked)}
              className="text-blue-600   mt-4 font-semibold"
            />
          }
          label="Enable Assessments"
          className="mt-4"
        />
        {isAssessmentEnabled && (
          <Typography
            variant="body2"
            color="textSecondary"
            className="mt-2 text-gray-600"
          >
            Managers can send assessment forms to employees reporting to them.
          </Typography>
        )}
      </div>
    </BoxComponent>
  );
};

export default SkillMatrixSetup;

//based on pakages

// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from "@mui/material";
// import React, { useState } from "react";

// const SkillMatrixSetup = () => {
//   // Module Configurations
//   const modules = {
//     "SM No Cost": {
//       maxEmployees: 10,
//       maxSkills: 250,
//       assessments: true,
//       features: [
//         "Skill Matrix Reports",
//         "The Skills Base Library",
//         "Skill Lookup Finder",
//       ],
//       price: "Free",
//     },
//     Alliance: {
//       maxEmployees: 1000,
//       maxSkills: "Unlimited",
//       assessments: true,
//       features: [
//         "Skill Matrix Reports",
//         "The Skills Base Library",
//         "People Finder",
//         "Skill Match",
//         "Skill Matrices",
//       ],
//       price: "₹80 per month/Employee",
//     },
//   };

//   // State for selected module
//   const [selectedModule, setSelectedModule] = useState("SM No Cost");
//   const currentModule = modules[selectedModule];

//   // Popup State
//   const [openPopup, setOpenPopup] = useState(false);

//   // Form State
//   const [skillName, setSkillName] = useState("");
//   const [skillDescription, setSkillDescription] = useState("");
//   const [skills, setSkills] = useState([]);

//   // Handle Add Skill
//   const handleAddSkill = () => {
//     if (
//       currentModule.maxSkills !== "Unlimited" &&
//       skills.length >= currentModule.maxSkills
//     ) {
//       alert(
//         `You can only add up to ${currentModule.maxSkills} skills in the ${selectedModule} module.`
//       );
//       return;
//     }

//     // Add skill to the list
//     setSkills((prev) => [
//       ...prev,
//       { name: skillName, description: skillDescription },
//     ]);
//     setSkillName(""); // Reset input
//     setSkillDescription("");
//     setOpenPopup(false); // Close popup
//   };

//   return (
//     <div className="p-6 bg-gray-50 h-screen">
//       {/* Heading */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-semibold text-gray-800">Skill Matrix Setup</h1>
//         <p className="text-gray-600">
//           Configure your skill matrix based on the selected module.
//         </p>
//       </div>

//       {/* Module Selector */}
//       <div className="mb-6">
//         <label className="block text-gray-700 font-medium mb-2">
//           Select Module:
//         </label>
//         <select
//           value={selectedModule}
//           onChange={(e) => setSelectedModule(e.target.value)}
//           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           {Object.keys(modules).map((module) => (
//             <option value={module} key={module}>
//               {module}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Module Details */}
//       <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
//         <h2 className="text-xl font-semibold mb-4">Module Details</h2>
//         <ul className="list-disc ml-6 mb-4 text-gray-700">
//           {currentModule.features.map((feature, index) => (
//             <li key={index}>{feature}</li>
//           ))}
//         </ul>
//         <p className="text-gray-700">
//           <strong>Price:</strong> {currentModule.price}
//         </p>
//         <p className="text-gray-700">
//           <strong>Max Employees:</strong> {currentModule.maxEmployees}
//         </p>
//         <p className="text-gray-700">
//           <strong>Max Skills:</strong> {currentModule.maxSkills}
//         </p>
//         <p className="text-gray-700">
//           <strong>Assessments Enabled:</strong>{" "}
//           {currentModule.assessments ? "Yes" : "No"}
//         </p>
//       </div>

//       {/* Add Skill Button */}
//       <button
//         onClick={() => setOpenPopup(true)}
//         className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
//         disabled={
//           currentModule.maxSkills !== "Unlimited" &&
//           skills.length >= currentModule.maxSkills
//         }
//       >
//         Add Skill
//       </button>

//       {/* Popup for Adding Skills */}
//       <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
//         <DialogTitle>
//           <span className="text-xl font-semibold">Add Skill</span>
//         </DialogTitle>
//         <DialogContent>
//           <div className="flex flex-col space-y-4 mt-2">
//             <input
//               type="text"
//               value={skillName}
//               onChange={(e) => setSkillName(e.target.value)}
//               placeholder="Skill Name"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <textarea
//               value={skillDescription}
//               onChange={(e) => setSkillDescription(e.target.value)}
//               placeholder="Skill Description"
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows={3}
//             />
//           </div>
//         </DialogContent>
//         <DialogActions>
//           <button
//             onClick={() => setOpenPopup(false)}
//             className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleAddSkill}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Save
//           </button>
//         </DialogActions>
//       </Dialog>

//       {/* Skill Hierarchy */}
//       <div className="mt-8">
//         <h2 className="text-xl font-semibold mb-4">Skills Hierarchy</h2>
//         <ul className="space-y-2">
//           {skills.map((skill, index) => (
//             <li
//               key={index}
//               className="p-4 bg-white shadow-sm border rounded-lg"
//             >
//               <h3 className="font-medium text-gray-800">{skill.name}</h3>
//               <p className="text-gray-600">{skill.description}</p>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Enable Assessments */}
//       {currentModule.assessments && (
//         <div className="mt-6">
//           <label className="flex items-center space-x-2">
//             <input type="checkbox" className="w-5 h-5 text-blue-600" />
//             <span className="text-gray-700">Enable Assessments</span>
//           </label>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SkillMatrixSetup;
