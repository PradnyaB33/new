import { ChevronRight } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useDrawer } from "./Drawer";
import { useContext, useEffect, useState } from "react";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { UseContext } from "../../../State/UseState/UseContext";
import UserProfile from "../../../hooks/UserData/useUser";

const TestAccordian = ({
  role,
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

  const [storedRoles, setStoredRoles] = useState([]);
  const [favoriteRoles, setFavoriteRoles] = useState([]);

  // Effect to store the role passed as prop in the state
  useEffect(() => {
    setStoredRoles((prevRoles) => {
      if (!prevRoles.includes(role)) {
        return [...prevRoles, role];
      }
      return prevRoles;
    });
  }, [role]);

  const queryClient = useQueryClient();

  // Fetch favorite roles from the server
  const { data: favData } = useQuery(
    ["favoriteRoles", employeeId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get-fav-navigation-items/${employeeId}`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response.data.favItems || [];
    },
    {
      enabled: !!employeeId,
      onSuccess: (data) => setFavoriteRoles(data),
    }
  );
  console.log("favData", favData);

  // Check if the route.text is already in favorite roles
  const isRouteFavorite = (routeText) =>
    favoriteRoles.some((fav) => fav.text === routeText);

  const handleToggleFavorite = (favItem, event) => {
    console.log("favItem", favItem);



    const updatedRoles = isRouteFavorite(favItem.text)
      ? favoriteRoles.filter((fav) => fav.text !== favItem.text)
      : [...favoriteRoles, favItem];

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
        queryClient.invalidateQueries("favoriteRoles");
        console.log("Successfully updated favorite roles");
      },
      onError: (error) => {
        console.error("Error updating favorite roles", error);
      },
    }
  );

  const uniqueStoredRoles = Array.from(new Set(storedRoles));

  return (
    <div className={`block ${!isVisible && "hidden"}`}>
      {uniqueStoredRoles.map((uniqueRole, index) => (
        <div key={index}>
          <div
            className="my-2 flex gap-3 justify-between px-4 text-sm items-center cursor-pointer"
            onClick={handleAccordianClick}
          >
            <h1 className="py-1 text-base tracking-tighter font-bold">
              {uniqueRole}
            </h1>
            <div className="flex items-center gap-2">
              <ChevronRight
                className={`text-gray-500 !h-5 transition-all ${valueBoolean ? "transform rotate-90" : "rotate-0"
                  }`}
              />
            </div>
          </div>

          {valueBoolean &&
            routes.map((route, i) => (
              <div
                className={`${route.isVisible ? "block" : "hidden"} flex items-center justify-between pr-5`}
                key={`${route.text}-${i}`}
              >
                <Link
                  to={route.link}
                  onClick={handleClick}
                  className={`rounded-md flex items-center gap-1 py-2 text-gray-500 
          ${currentRoute === route.link ? "!text-white !bg-[#1414fe]" : ""}
          m-2 px-6 transition duration-200 hover:!text-white hover:!bg-[#1414fe]`}
                >
                  {route.icon}
                  <h1 className="tracking-tight font-bold text-sm">
                    {route.text}
                  </h1>
                </Link>
                <div
                  onClick={(event) =>
                    handleToggleFavorite(
                      { text: route.text, link: route.link },
                      event
                    )
                  }
                  className="flex items-center" // Ensure the star icon is also a flex item
                >
                  {isRouteFavorite(route.text) ? (
                    <StarIcon
                      style={{ fontSize: "16px" }}
                      className="text-yellow-500 cursor-pointer"
                    />
                  ) : (
                    <StarBorderIcon
                      style={{ fontSize: "16px" }}
                      className="text-gray-500 cursor-pointer"
                    />
                  )}
                </div>
              </div>
            ))}

        </div>
      ))}
    </div>
  );
};

export default TestAccordian;
