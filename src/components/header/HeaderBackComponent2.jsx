// import { West } from "@mui/icons-material";
// import { IconButton } from "@mui/material";
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import UserProfile from "../../hooks/UserData/useUser";

// const capitalizeFirstLetter = (string) => {
//     if (!string) return '';
//     return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
//   };
  
// const HeaderBackComponent2 = ({ heading, oneLineInfo }) => {
//   const navigate = useNavigate();

//   const user = UserProfile().getCurrentUser()
//   console.log("Thsii is user" , user);


// //   const firstName = user?.first_name ; 
// //   const lastName = user?.last_name ;
// const firstName = capitalizeFirstLetter(user?.first_name);
// const lastName = capitalizeFirstLetter(user?.last_name);

//   return (
//     <>
//     <header className="text-xl p-2 bg-gray-50 shadow-md flex gap-2 md:p-4">
//       <IconButton onClick={() => navigate(-1)}>
//         <West className="" />
//       </IconButton>
//       <div className="flex items-baseline justify-center flex-col">
//         {heading}
//         {oneLineInfo && (
//           <p className="text-xs text-gray-600 truncate w-full min-w-[250px]">
//             {oneLineInfo}
//           </p> )}
//       </div>
//       <div className=" flex justify- space-x-3">
//           {/* <img src={userPhoto} alt="User Photo" className="w-10 h-10 rounded-full" /> */}
//           <div>
//           <p className="text-gray-800">Welcome, {firstName} {lastName}</p>
//           </div>
//         </div>
//     </header>
//     </>
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
    <header className="flex items-center justify-between p-4 bg-gray-50 shadow-md">
      <div className="flex-shrink-0">
        <IconButton onClick={() => navigate(-1)}>
          <West />
        </IconButton>
      </div>
      <div className="flex-grow flex flex-col ">
        <h1 className="text-xl ">{heading}</h1>
        {oneLineInfo && (
          <p className="text-xs text-gray-600 truncate w-full min-w-[250px] ">
            {oneLineInfo}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        <p className="text-lg font-semibold text-gray-700">Welcome, {firstName} {lastName}</p>
      </div> 
    </header>
  );
};

export default HeaderBackComponent2;
