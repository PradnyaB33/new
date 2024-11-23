
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Button,
//   TextField,
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
//     skillName: z
//       .string()
//       .min(1, "Skill name is required")
//       .max(50, "Max 50 characters"),
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
//       alert(
//         `You can only add up to ${maxSkills} skills in the ${packageType} package.`
//       );
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
//     <BoxComponent sx={{ p: 0 }} className="p-4">
//       <div className="max-w-3xl mx-auto">
//         <HeadingOneLineInfo
//           className="my-3"
//           heading="Skill Matrix"
//           info="Setup Skill Matrix For Your Organisation."
//         />

//         {/* Add Skill Button */}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => setOpenPopup(true)}
//           disabled={skillCount >= maxSkills}
//           className="w-full sm:w-auto mb-4 bg-blue-500 hover:bg-blue-700 text-white"
//         >
//           Add Skill
//         </Button>

//         {/* Popup Dialog for Adding Skills */}
//         <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
//           <DialogTitle>Add Skill</DialogTitle>
//           <DialogContent className="space-y-4">
//             <TextField
//               fullWidth
//               label="Skill Name"
//               value={skillName}
//               onChange={(e) => setSkillName(e.target.value)}
//               margin="dense"
//               className="border border-gray-300 rounded-md p-2"
//             />
//             <TextField
//               fullWidth
//               label="Skill Description"
//               value={skillDescription}
//               onChange={(e) => setSkillDescription(e.target.value)}
//               margin="dense"
//               multiline
//               rows={3}
//               className="border border-gray-300 rounded-md p-2"
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button
//               onClick={() => setOpenPopup(false)}
//               color="secondary"
//               className="text-gray-600"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleAddSkill}
//               color="primary"
//               className="bg-blue-500 hover:bg-blue-700 text-white"
//             >
//               Save
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Skill Hierarchy Section
//         <Typography variant="h6" className="mt-4 font-semibold text-gray-800">
//           Skill Hierarchy
//         </Typography>
//         <div className="bg-gray-100 p-4 rounded-lg mt-2">
//           <p className="text-gray-600">
//             Skills added will appear here in a hierarchical structure.
//           </p>
//         </div> */}
//         <br />

//         {/* Enable Assessments */}
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={isAssessmentEnabled}
//               onChange={(e) => setIsAssessmentEnabled(e.target.checked)}
//               className="text-blue-600   mt-4 font-semibold"
//             />
//           }
//           label="Enable Assessments"
//           className="mt-4"
//         />
//         {isAssessmentEnabled && (
//           <Typography
//             variant="body2"
//             color="textSecondary"
//             className="mt-2 text-gray-600"
//           >
//             Managers can send assessment forms to employees reporting to them.
//           </Typography>
//         )}
//       </div>
//     </BoxComponent>
//   );
// };

// export default SkillMatrixSetup;



// ___________________________2____________

// import {
//   Button,
//   TextField,
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

// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useQuery, useMutation } from "react-query";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router";
// import useAuthToken from "../../../hooks/Token/useAuth";





// // Validation schema for skills form
// const SkillSchema = z.object({
//   skill_name: z
//     .string()
//     .min(1, { message: "Skill name is required" }),
//     // .max(50, { message: "Maximum 50 characters allowed" }),
//   skill_description: z
//     .string()
//     .optional(),
//     // .max(200, { message: "Maximum 200 characters allowed" }),
// });

// const SkillMatrixSetup = () => {
//   const authToken = useAuthToken();
//   const navigate = useNavigate();

//   const { control, handleSubmit, formState, reset } = useForm({
//     resolver: zodResolver(SkillSchema),
//   });

//   const { errors } = formState;

//   // Fetch skills using useQuery
//   const { data: skills, isLoading, error } = useQuery(
//     "fetchSkills",
//     async () => {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/skills/get-all`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data;
//     },
//     {
//       onError: () => {
//         toast.error("Failed to fetch skills. Please try again later.");
//       },
//     }
//   );

//   // Mutation for form submission
//   const { mutate: addSkill, isLoading: isSubmitting } = useMutation(
//     async (newSkill) => {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/organization/organizationId/skills/createSkill`,
//         newSkill,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data;
//     },
//     {
//       onSuccess: () => {
//         toast.success("Skill added successfully!");
//         reset(); // Clear the form after successful submission
//       },
//       onError: () => {
//         toast.error("Failed to add skill. Please try again.");
//       },
//     }
//   );

//   // Form submission handler
//   const onSubmit = (data) => {
//     const skillData = {
//       skill_name: data.skill_name,
//       skill_description: data.skill_description || "",
//     };
//     addSkill(skillData);
//   };

//   return (
//     <div className="w-full mt-1">
//       <h1 className="text-2xl mb-3 font-bold">Skill Matrix Setup</h1>

//       {/* Render loading and error states for fetching skills */}
//       {isLoading && <p>Loading skills...</p>}
//       {error && <p className="text-red-500">Error fetching skills.</p>}

//       {/* Display list of skills */}
//       {skills && skills.length > 0 && (
//         <ul className="list-disc pl-5 mb-4">
//           {skills.map((skill) => (
//             <li key={skill.id} className="text-gray-700">
//               {skill.skill_name} - {skill.skill_description || "No description"}
//             </li>
//           ))}
//         </ul>
//       )}

//       {/* Form for adding a new skill */}
//       <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Skill Name *
//           </label>
//           <Controller
//             name="skill_name"
//             control={control}
//             render={({ field }) => (
//               <input
//                 {...field}
//                 type="text"
//                 placeholder="Enter skill name"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             )}
//           />
//           {errors.skill_name && (
//             <p className="text-red-500 text-sm">{errors.skill_name.message}</p>
//           )}
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700">
//             Skill Description
//           </label>
//           <Controller
//             name="skill_description"
//             control={control}
//             render={({ field }) => (
//               <textarea
//                 {...field}
//                 placeholder="Enter skill description (optional)"
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               ></textarea>
//             )}
//           />
//           {errors.skill_description && (
//             <p className="text-red-500 text-sm">
//               {errors.skill_description.message}
//             </p>
//           )}
//         </div>

//         <button
//           type="submit"
//           className={`bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded-lg ${
//             isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//           }`}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Submitting..." : "Add Skill"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SkillMatrixSetup;

// euuu
// // Validation schema for skills form
// const SkillSchema = z.object({
//   skill_name: z
//     .string()
//     .min(1, { message: "Skill name is required" })
//     .max(50, { message: "Maximum 50 characters allowed" }),
//   skill_description: z
//     .string()
//     .optional()
//     .max(200, { message: "Maximum 200 characters allowed" }),
// });


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
//     skillName: z
//       .string()
//       .min(1, "Skill name is required")
//       .max(50, "Max 50 characters"),
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
//       alert(
//         `You can only add up to ${maxSkills} skills in the ${packageType} package.`
//       );
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
//     <BoxComponent sx={{ p: 0 }} className="p-4">
//       <div className="max-w-3xl mx-auto">
//         <HeadingOneLineInfo
//           className="my-3"
//           heading="Skill Matrix"
//           info="Setup Skill Matrix For Your Organisation."
//         />

//         {/* Add Skill Button */}
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => setOpenPopup(true)}
//           disabled={skillCount >= maxSkills}
//           className="w-full sm:w-auto mb-4 bg-blue-500 hover:bg-blue-700 text-white"
//         >
//           Add Skill
//         </Button>

//         {/* Popup Dialog for Adding Skills */}
//         <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
//           <DialogTitle>Add Skill</DialogTitle>
//           <DialogContent className="space-y-4">
//             <TextField
//               fullWidth
//               label="Skill Name"
//               value={skillName}
//               onChange={(e) => setSkillName(e.target.value)}
//               margin="dense"
//               className="border border-gray-300 rounded-md p-2"
//             />
//             <TextField
//               fullWidth
//               label="Skill Description"
//               value={skillDescription}
//               onChange={(e) => setSkillDescription(e.target.value)}
//               margin="dense"
//               multiline
//               rows={3}
//               className="border border-gray-300 rounded-md p-2"
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button
//               onClick={() => setOpenPopup(false)}
//               color="secondary"
//               className="text-gray-600"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleAddSkill}
//               color="primary"
//               className="bg-blue-500 hover:bg-blue-700 text-white"
//             >
//               Save
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Skill Hierarchy Section
//         <Typography variant="h6" className="mt-4 font-semibold text-gray-800">
//           Skill Hierarchy
//         </Typography>
//         <div className="bg-gray-100 p-4 rounded-lg mt-2">
//           <p className="text-gray-600">
//             Skills added will appear here in a hierarchical structure.
//           </p>
//         </div> */}
//         <br />

//         {/* Enable Assessments */}
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={isAssessmentEnabled}
//               onChange={(e) => setIsAssessmentEnabled(e.target.checked)}
//               className="text-blue-600   mt-4 font-semibold"
//             />
//           }
//           label="Enable Assessments"
//           className="mt-4"
//         />
//         {isAssessmentEnabled && (
//           <Typography
//             variant="body2"
//             color="textSecondary"
//             className="mt-2 text-gray-600"
//           >
//             Managers can send assessment forms to employees reporting to them.
//           </Typography>
//         )}
//       </div>
//     </BoxComponent>
//   );
// };

// export default SkillMatrixSetup;



// _______________with reactQuery
// import React, { useState } from "react";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox, Typography } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import { useQuery, useMutation, useQueryClient } from "react-query"; 
// import axios from "axios";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
// import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import toast from "react-hot-toast";
// import { useParams } from "react-router";

// const SkillMatrixSetup = () => {
//   const queryClient = useQueryClient();
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();

//   const fetchSkills = async () => {
//     const response = await axios.get('/api/skills');
//     return response.data;
//   };

 
//   const { data: skills, isLoading, isError } = useQuery(['skills'], fetchSkills);

//   // Skill Limit Logic Based on Package
//   const packageType = "no-cost"; // Just static in your example, it could be dynamic as well.
//   const maxSkills = packageType === "no-cost" ? 5 : Infinity;


//   const [openPopup, setOpenPopup] = useState(false);

//   const [isAssessmentEnabled, setIsAssessmentEnabled] = useState(false);


//   const skillSchema = z.object({
//     skillName: z
//       .string()
//       .min(1, "Skill name is required")
//       .max(15, "Max 50 characters")
//       .regex(/^[a-zA-Z]+$/, { message: "Only characters allowed" }),
//     skillDescription: z
//       .string()
//       .max(200, "Maximum 100 characters allowed")
//       .optional(),
//   });

 
//   const { control, handleSubmit, formState: { errors } } = useForm({
//     resolver: zodResolver(skillSchema),
//   });

//    const addSkill = async (data) => {
//     const response = await axios.post('/api/skills', data);
//     return response.data;
//   };


//   const mutation = useMutation(addSkill, {
//     onSuccess: () => {
//       // Invalidate the 'skills' query to refresh the list
//       queryClient.invalidateQueries(['skills']);
//     },
//   });


//   const onSubmit = (data) => {
//     if (skills?.length >= maxSkills) {
//       alert(`You can only add up to ${maxSkills} skills in the ${packageType} package.`);
//       return;
//     }

//     mutation.mutate(data); // Call mutation to add the skill
//     setOpenPopup(false); 
//   };

//   return (
//     <BoxComponent sx={{ p: 0 }} className="p-4">
//       <div className="max-w-3xl mx-auto">
//         <HeadingOneLineInfo className="my-3" heading="Skill Matrix" info="Setup Skill Matrix For Your Organisation." />

     
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => setOpenPopup(true)}
//           disabled={skills?.length >= maxSkills}
//           className="w-full sm:w-auto mb-4 bg-blue-500 hover:bg-blue-700 text-white"
//         >
//           Add Skill
//         </Button>

//         <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
//           <DialogTitle>Add Skill</DialogTitle>
//           <DialogContent className="space-y-4">
           
//             <Controller
//               control={control}
//               name="skillName"
//               render={({ field }) => (
//                 <TextField
//                   fullWidth
//                   label="Skill Name"
//                   {...field}
//                   error={!!errors.skillName}
//                   helperText={errors.skillName?.message}
//                   margin="dense"
//                   className="border border-gray-300 rounded-md p-2"
//                 />
//               )}
//             />
//             <Controller
//               control={control}
//               name="skillDescription"
//               render={({ field }) => (
//                 <TextField
//                   fullWidth
//                   label="Skill Description"
//                   {...field}
//                   error={!!errors.skillDescription}
//                   helperText={errors.skillDescription?.message}
//                   margin="dense"
//                   multiline
//                   rows={3}
//                   className="border border-gray-300 rounded-md p-2"
//                 />
//               )}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenPopup(false)} color="secondary" className="text-gray-600">Cancel</Button>
//             <Button onClick={handleSubmit(onSubmit)} color="primary" className="bg-blue-500 hover:bg-blue-700 text-white">Save</Button>
//           </DialogActions>
//         </Dialog>
// <br />
        
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={isAssessmentEnabled}
//               onChange={(e) => setIsAssessmentEnabled(e.target.checked)}
//               className="text-blue-600 mt-4 font-semibold"
//             />
//           }
//           label="Enable Assessments"
//           className="mt-4"
//         />
//         {isAssessmentEnabled && (
//           <Typography variant="body2" color="textSecondary" className="mt-2 text-gray-600">
//             Managers can send assessment forms to employees reporting to them.
//           </Typography>
//         )}
//       </div>
//     </BoxComponent>
//   );
// };

// export default SkillMatrixSetup;

//REQCT QUERY 2.0


import React, { useState } from "react"; 
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "react-query"; 
import axios from "axios";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import toast from "react-hot-toast";
import { useParams } from "react-router";

// SkillMatrixSetup Component
const SkillMatrixSetup = () => {
  const queryClient = useQueryClient();
  const { organisationId } = useParams();
  const authToken = useAuthToken();


  const fetchSkills = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`, {
      headers: {
        Authorization: authToken,
      },
    });
    return response.data;
    
  };
  

  const { data: skills, isLoading, isError } = useQuery(['skills'], fetchSkills);

  // Skill Limit Logic Based on Package
  const packageType = "no-cost"; // This can be dynamic based on user's package
  const maxSkills = packageType === "no-cost" ? 5 : Infinity;

  const [openPopup, setOpenPopup] = useState(false);
  const [isAssessmentEnabled, setIsAssessmentEnabled] = useState(false);

  // Schema for Skill Form Validation
  const skillSchema = z.object({
    skillName: z
      .string()
      .min(1, "Skill name is required")
      .max(15, "Max 50 characters")
      .regex(/^[a-zA-Z]+$/, { message: "Only characters allowed" }),
    skillDescription: z
      .string()
      .max(200, "Maximum 100 characters allowed")
      .optional(),
  });

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(skillSchema),
  });

 
  const addSkill = async (data) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`, 
      data, {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  

  const mutation = useMutation(addSkill, {
    onSuccess: () => {
      // Invalidate the 'skills' query to refresh the list after adding a new skill
      queryClient.invalidateQueries(['skills']);
      toast.success("Skill added successfully!");
    },
    onError: () => {
      toast.error("Error adding the skill. Please try again.");
    },
  });

  const onSubmit = (data) => {
    if (skills?.length >= maxSkills) {
      toast.error(`You can only add up to ${maxSkills} skills in the ${packageType} package.`);
      return;
    }

    // Mutate the data to add a new skill
    mutation.mutate(data);
    setOpenPopup(false); // Close the popup after submission
  };

  return (
    <BoxComponent sx={{ p: 0 }} className="p-4">
      <div className="max-w-3xl mx-auto">
        <HeadingOneLineInfo className="my-3" heading="Skill Matrix" info="Setup Skill Matrix For Your Organisation." />
      
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenPopup(true)}
          disabled={skills?.length >= maxSkills}
          className="w-full sm:w-auto mb-4 bg-blue-500 hover:bg-blue-700 text-white"
        >
          Add Skill
        </Button>

        <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
          <DialogTitle>Add Skill</DialogTitle>
          <DialogContent className="space-y-4">
         
            <Controller
              control={control}
              name="skillName"
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Skill Name"
                  {...field}
                  error={!!errors.skillName}
                  helperText={errors.skillName?.message}
                  margin="dense"
                  className="border border-gray-300 rounded-md p-2"
                />
              )}
            />
            {/* Skill Description Input */}
            <Controller
              control={control}
              name="skillDescription"
              render={({ field }) => (
                <TextField
                  fullWidth
                  label="Skill Description"
                  {...field}
                  error={!!errors.skillDescription}
                  helperText={errors.skillDescription?.message}
                  margin="dense"
                  multiline
                  rows={3}
                  className="border border-gray-300 rounded-md p-2"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPopup(false)} color="secondary" className="text-gray-600">Cancel</Button>
            <Button onClick={handleSubmit(onSubmit)} color="primary" className="bg-blue-500 hover:bg-blue-700 text-white">Save</Button>
          </DialogActions>
        </Dialog>
        
        <br />
        
        <FormControlLabel
          control={
            <Checkbox
              checked={isAssessmentEnabled}
              onChange={(e) => setIsAssessmentEnabled(e.target.checked)}
              className="text-blue-600 mt-4 font-semibold"
            />
          }
          label="Enable Assessments"
          className="mt-4"
        />
        
        {isAssessmentEnabled && (
          <Typography variant="body2" color="textSecondary" className="mt-2 text-gray-600">
            Managers can send assessment forms to employees reporting to them.
          </Typography>
        )}
      </div>
    </BoxComponent>
  );
};

export default SkillMatrixSetup;























// ___________________________
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
