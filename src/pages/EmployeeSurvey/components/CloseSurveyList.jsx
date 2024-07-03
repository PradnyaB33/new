// import React, { useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Button, CircularProgress, TextField } from "@mui/material";
// import UserProfile from "../../../hooks/UserData/useUser";
// import { UseContext } from "../../../State/UseState/UseContext";
// import DOMPurify from "dompurify";
// import { useQuery } from "react-query";

// const CloseSurveyList = () => {
//     // Hooks
//     const navigate = useNavigate();

//     // Get organizationId
//     const { getCurrentUser } = UserProfile();
//     const user = getCurrentUser();
//     const organisationId = user?.organizationId;

//     // Get cookies
//     const { cookies } = useContext(UseContext);
//     const authToken = cookies["aegis"];

//     //get open survey
//     const { data: surveys, isLoading, isError } = useQuery(
//         ["openSurveys", organisationId],
//         async () => {
//             const response = await axios.get(
//                 `${process.env.REACT_APP_API}/route/organization/${organisationId}/get-close-survey`,
//                 {
//                     headers: {
//                         Authorization: authToken,
//                     },
//                 }
//             );
//             return response.data;
//         },
//         {
//             enabled: !!organisationId && !!authToken,
//         }
//     );

//     const handleSurveyDetails = () => {
//         navigate("/organisation/:organisationId/survey-details");
//     }



//     return (
//         <div>
//             <div className="p-4 border-y-[.5px] border-gray-300">
//                 <div className="flex justify-end gap-3 mb-3 md:mb-0 w-full md:w-auto">
//                     <TextField
//                         placeholder="Search"
//                         variant="outlined"
//                         size="small"
//                         sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
//                     />
//                 </div>
//             </div>
//             {isLoading ? (
//                 <div className="flex justify-center p-4">
//                     <CircularProgress />
//                 </div>
//             ) : isError ? (
//                 <div className="flex justify-center p-4 text-red-500">
//                     Error fetching data
//                 </div>
//             ) :
//                 surveys && surveys?.length > 0 ? (
//                     <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
//                         <table className="min-w-full bg-white text-left !text-sm font-light">
//                             <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
//                                 <tr className="!font-semibold">
//                                     <th scope="col" className="!text-left pl-8 py-3">
//                                         Title
//                                     </th>
//                                     <th scope="col" className="!text-left pl-8 py-3">
//                                         Status
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {surveys?.map((survey, index) => (
//                                     <tr key={index} className="!font-medium border-b ">
//                                         <td className="!text-left pl-8 py-3">
//                                             {DOMPurify.sanitize(survey.title, { USE_PROFILES: { html: false } })}
//                                         </td>
//                                         <td className="!text-left py-3 pl-9">
//                                             <Button
//                                                 variant="outlined"
//                                                 onClick={() => handleSurveyDetails(survey._id)}
//                                                 sx={{ textTransform: "none", width: "140px" }}
//                                             >
//                                                 View Details
//                                             </Button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 ) : (
//                     <section className="py-6 px-8 w-full">
//                         <p>Nothing to closed survey</p>
//                     </section>
//                 )}
//         </div>
//     );
// };

// export default CloseSurveyList;
import React from 'react'

const CloseSurveyList = () => {
  return (
    <div>
      
    </div>
  )
}

export default CloseSurveyList
