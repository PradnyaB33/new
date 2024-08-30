

// import { West } from "@mui/icons-material";
// import { IconButton } from "@mui/material";
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import UserProfile from "../../hooks/UserData/useUser";

// // Function to capitalize the first letter of a string
// const capitalizeFirstLetter = (string) => {
//   if (!string) return '';
//   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
// };

// const HeaderBackComponent2 = ({ heading, oneLineInfo }) => {
//   const navigate = useNavigate();
 
//   const user = UserProfile().getCurrentUser();

//   // Extract and capitalize first name and last name  
//   const firstName = capitalizeFirstLetter(user?.first_name);
//   const lastName = capitalizeFirstLetter(user?.last_name);

//   return (
//     <header className="flex items-center justify-between p-4 bg-gray-50 shadow-md">
//       <div className="flex-shrink-0">
//         <IconButton onClick={() => navigate(-1)}>
//           <West />
//         </IconButton>
//       </div>
//       <div className="flex-grow flex flex-col ">
//         <h1 className="text-xl ">{heading}</h1>
//         {oneLineInfo && (
//           <p className="text-xs text-gray-600 truncate w-full min-w-[250px] ">
//             {oneLineInfo}
//           </p>
//         )}
//       </div>
//       <div className="flex-shrink-0">
//         <p className="text-lg font-semibold text-gray-700">Welcome, {firstName} {lastName}</p>
//       </div> 
//     </header>
//   );
// };

// export default HeaderBackComponent2;

// //please make this component responsive for different screen sizes  
// //ps :dont change any styling jitna kaha ai utna karo 
// //aur ye component maine yaha use kiya hai  <section className="p-4">
//       <HeaderBackComponent2
//       heading={"Attendance & Leave Management"}
//       oneLineInfo={
//         "Track your attendance and submit your leave requests here for timely approval and efficient management"
//       }
//     />



// import { West } from "@mui/icons-material";
// import { IconButton } from "@mui/material";
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import UserProfile from "../../hooks/UserData/useUser";

// // Function to capitalize the first letter of a string
// const capitalizeFirstLetter = (string) => {
//   if (!string) return '';
//   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
// };

// const HeaderBackComponent2 = ({ heading, oneLineInfo }) => {
//   const navigate = useNavigate();
  
//   const user = UserProfile().getCurrentUser();

//   // Extract and capitalize first name and last name  
//   const firstName = capitalizeFirstLetter(user?.first_name);
//   const lastName = capitalizeFirstLetter(user?.last_name);

//   return (
//     <header className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 shadow-md">
//       <div className="flex-shrink-0 mb-2 md:mb-0">
//         <IconButton onClick={() => navigate(-1)}>
//           <West />
//         </IconButton>
//       </div>
//       <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left">
//         <h1 className="text-lg md:text-xl font-semibold">{heading}</h1>
//         {oneLineInfo && (
//           <p className="text-xs md:text-sm text-gray-600 truncate w-full min-w-[250px]">
//             {oneLineInfo}
//           </p>
//         )}
//       </div>
//       <div className="flex-shrink-0 mt-2 md:mt-0">
//         <p className="text-sm md:text-lg font-semibold text-gray-700">
//           Welcome, {firstName} {lastName}
//         </p>
//       </div>
//     </header>
//   );
// };

// export default HeaderBackComponent2;


import { West } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "../../hooks/UserData/useUser";

// Function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const HeaderBackComponent2 = ({ heading, oneLineInfo }) => {
  const navigate = useNavigate();
  
  const user = UserProfile().getCurrentUser();

  // Extract and capitalize first name and last name  
  const firstName = capitalizeFirstLetter(user?.first_name);
  const lastName = capitalizeFirstLetter(user?.last_name);

  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 shadow-md">
      <div className="flex-shrink-0 mb-2 md:mb-0">
        <IconButton onClick={() => navigate(-1)}>
          <West />
        </IconButton>
      </div>
      <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-lg md:text-xl font-semibold">{heading}</h1>
        {oneLineInfo && (
          <p className="text-xs md:text-sm text-gray-600 w-full text-center md:text-left">
            {oneLineInfo}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 mt-2 md:mt-0">
        <p className="text-sm md:text-lg font-semibold text-gray-700 pr-3">
          Welcome, {firstName} {lastName}
        </p>
      </div>
    </header>
  );
};

export default HeaderBackComponent2;
