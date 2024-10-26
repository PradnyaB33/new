// import { ChevronRight } from "@mui/icons-material";
// import { Link, useLocation } from "react-router-dom";
// import { useDrawer } from "./Drawer";
// import { useContext, useState } from "react";
// import StarBorderIcon from '@mui/icons-material/StarBorder';
// import StarIcon from '@mui/icons-material/Star';
// import { useMutation, useQuery } from "react-query";
// import axios from "axios";
// import { UseContext } from "../../../State/UseState/UseContext";
// import UserProfile from "../../../hooks/UserData/useUser";

// const TestAccordian = ({
//   role,
//   icon,
//   routes,
//   isVisible,
//   valueBoolean,
//   handleAccordianClick,
// }) => {
//   const { pinned, setOpen } = useDrawer();
//   const currentRoute = useLocation().pathname;
//   console.log("role", role);

//   const { getCurrentUser } = UserProfile();
//   const user = getCurrentUser();
//   const employeeId = user?._id;
//   console.log("employeeId", employeeId);

//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];

//   const [favoriteRoles, setFavoriteRoles] = useState([]);

//   // Fetch favorite roles using GET API
//   const fetchFavoriteRoles = async () => {
//     const response = await axios.get(
//       `${process.env.REACT_APP_API}/route/fav-navigation-items/${employeeId}`,
//       {
//         headers: {
//           Authorization: authToken,
//         },
//       }
//     );
//     return response.data;
//   };

//   const { data } = useQuery('favoriteRoles', fetchFavoriteRoles, {
//     onSuccess: (data) => {
//       setFavoriteRoles(data.favItems || []);
//     },
//     onError: (error) => {
//       console.error("Error fetching favorite roles", error);
//     },
//     enabled: !!employeeId,
//   });
//   console.log("favdata", data);

//   const isRoleFavorite = favoriteRoles.includes(role);

//   const handleToggleFavorite = (roleName, event) => {
//     event.stopPropagation();
//     const updatedRoles = favoriteRoles.includes(roleName)
//       ? favoriteRoles.filter((fav) => fav !== roleName)
//       : [...favoriteRoles, roleName];

//     setFavoriteRoles(updatedRoles);

//     // Call mutation to save favorite roles
//     mutation.mutate({
//       employeeId,
//       favItems: updatedRoles,
//     });
//   };

//   const handleClick = () => {
//     if (!pinned) {
//       setOpen(false);
//     }
//   };

//   // API call to save favorite roles
//   const mutation = useMutation(
//     async (formData) => {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API}/route/add-fav-navigation-item`,
//         formData,
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
//         console.log("Successfully updated favorite roles");
//       },
//       onError: (error) => {
//         console.error("Error updating favorite roles", error);
//       },
//     }
//   );

//   return (
//     <div className={`block ${!isVisible && "hidden"}`}>
//       <div
//         className="my-2 flex gap-3 justify-between px-4 text-sm items-center cursor-pointer"
//         onClick={handleAccordianClick}
//       >
//         <h1 className="py-1 text-base tracking-tighter font-bold">{role}</h1>
//         <div className="flex items-center gap-2">
//           {/* Toggle Favorite Icon for Role */}
//           <div onClick={(event) => handleToggleFavorite(role, event)}>
//             {isRoleFavorite ? (
//               <StarIcon style={{ fontSize: "16px" }} className="text-yellow-500 cursor-pointer" />
//             ) : (
//               <StarBorderIcon style={{ fontSize: "16px" }} className="text-gray-500 cursor-pointer" />
//             )}
//           </div>
//           <ChevronRight
//             className={`text-gray-500 !h-5 transition-all ${valueBoolean ? "transform rotate-90" : "rotate-0"}`}
//           />
//         </div>
//       </div>

//       {valueBoolean &&
//         routes.map((route, i) => (
//           <div className={`${route.isVisible ? "block " : "hidden"}`} key={i}>
//             <Link
//               to={route.link}
//               onClick={handleClick}
//               className={`rounded-md flex items-center gap-1 py-2 text-gray-500 
//                 ${currentRoute === route.link ? "!text-white !bg-[#1414fe]" : ""}
//                 m-2 px-6 transition duration-200 hover:!text-white hover:!bg-[#1414fe]`}
//             >
//               {route.icon}
//               <h1 className="tracking-tight font-bold text-sm">{route.text}</h1>
//             </Link>
//           </div>
//         ))}
//     </div>
//   );
// };

// export default TestAccordian;
import { ChevronRight } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useDrawer } from "./Drawer";
import { useContext, useEffect, useState } from "react";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";
import UserProfile from "../../../hooks/UserData/useUser";

const TestAccordian = ({
  role,
  icon,
  routes,
  isVisible,
  valueBoolean,
  handleAccordianClick,
}) => {
  const { pinned, setOpen } = useDrawer();
  const currentRoute = useLocation().pathname;

  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user?._id;

  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const [favoriteRoles, setFavoriteRoles] = useState([]);
  const [storedRoles, setStoredRoles] = useState([]); // State for storing roles
  console.log("storedRoles", storedRoles);

  // Effect to store the role passed as prop in the state
  useEffect(() => {
    // Update storedRoles with unique role
    setStoredRoles((prevRoles) => {
      if (!prevRoles.includes(role)) {
        return [...prevRoles, role]; // Add only if not present
      }
      return prevRoles; // Return existing roles if role is already present
    });
  }, [role]); // Run effect when the role prop changes

  // Fetch favorite roles using GET API
  const fetchFavoriteRoles = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/fav-navigation-items/${employeeId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };

  const { data } = useQuery('favoriteRoles', fetchFavoriteRoles, {
    onSuccess: (data) => {
      setFavoriteRoles(data.favItems || []);
    },
    onError: (error) => {
      console.error("Error fetching favorite roles", error);
    },
    enabled: !!employeeId,
  });
  console.log("data", data)
  const isRoleFavorite = favoriteRoles.includes(role);

  const handleToggleFavorite = (roleName, event) => {
    event.stopPropagation();
    const updatedRoles = favoriteRoles.includes(roleName)
      ? favoriteRoles.filter((fav) => fav !== roleName)
      : [...favoriteRoles, roleName];

    setFavoriteRoles(updatedRoles);

    // Call mutation to save favorite roles
    mutation.mutate({
      employeeId,
      favItems: updatedRoles,
    });
  };

  const handleClick = () => {
    if (!pinned) {
      setOpen(false);
    }
  };

  // API call to save favorite roles
  const mutation = useMutation(
    async (formData) => {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/add-fav-navigation-item`,
        formData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        console.log("Successfully updated favorite roles");
      },
      onError: (error) => {
        console.error("Error updating favorite roles", error);
      },
    }
  );

  // Get unique stored roles as an array
  const uniqueStoredRoles = Array.from(new Set(storedRoles));

  return (
    <div className={`block ${!isVisible && "hidden"}`}>
      {/* Map through unique stored roles */}
      {uniqueStoredRoles.map((uniqueRole, index) => (
        <div key={index}>
          <div
            className="my-2 flex gap-3 justify-between px-4 text-sm items-center cursor-pointer"
            onClick={handleAccordianClick}
          >
            <h1 className="py-1 text-base tracking-tighter font-bold">{uniqueRole}</h1>
            <div className="flex items-center gap-2">
              {/* Toggle Favorite Icon for Role */}
              <div onClick={(event) => handleToggleFavorite(uniqueRole, event)}>
                {isRoleFavorite ? (
                  <StarIcon style={{ fontSize: "16px" }} className="text-yellow-500 cursor-pointer" />
                ) : (
                  <StarBorderIcon style={{ fontSize: "16px" }} className="text-gray-500 cursor-pointer" />
                )}
              </div>
              <ChevronRight
                className={`text-gray-500 !h-5 transition-all ${valueBoolean ? "transform rotate-90" : "rotate-0"}`}
              />
            </div>
          </div>

          {valueBoolean &&
            routes.map((route, i) => (
              <div className={`${route.isVisible ? "block " : "hidden"}`} key={i}>
                <Link
                  to={route.link}
                  onClick={handleClick}
                  className={`rounded-md flex items-center gap-1 py-2 text-gray-500 
                    ${currentRoute === route.link ? "!text-white !bg-[#1414fe]" : ""}
                    m-2 px-6 transition duration-200 hover:!text-white hover:!bg-[#1414fe]`}
                >
                  {route.icon}
                  <h1 className="tracking-tight font-bold text-sm">{route.text}</h1>
                </Link>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default TestAccordian;
