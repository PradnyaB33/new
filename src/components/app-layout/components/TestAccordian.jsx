import { ChevronRight } from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";

const TestAccordian = ({
  icon,
  routes,
  role,
  toggleDrawer,
  valueBoolean,
  isVisible,
}) => {
  const [open, setOpen] = useState(valueBoolean);

  const handleAccordianClick = () => {
    setOpen(!open);
  };

  return (
    <div
      className={`block ${!isVisible && "hidden"} mx-3 rounded-md  ${
        open && "bg-blue-50"
      }   `}
    >
      {routes.length > 1 && (
        <div
          className={`my-2 flex gap-3 justify-between px-4 text-sm items-center cursor-pointer ${
            open && "bg-blue-50"
          }`}
          onClick={handleAccordianClick}
        >
          {/* {icon} */}
          <h1 className="py-1 font-semibold text-[#67748E]">{role}</h1>
          {
            <ChevronRight
              className={`text-[#67748E] !h-5 transition-all ${
                open ? "transform rotate-90" : "rotate-0"
              }`}
            />
          }
        </div>
      )}

      {open &&
        routes.map((route, i) => (
          <div className={`${route.isVisible ? "block" : "hidden"} `} key={i}>
            <Link
              onClick={() => toggleDrawer()}
              to={route.link}
              className={`rounded-md flex items-center gap-2 py-2 hover:bg-blue-100 hover:!text-white m-2 px-2
               ${routes.length > 1 ? "mx-4" : "mx-0"} 
               ${
                 window.location.pathname.includes(route.link) && "bg-blue-100"
               }`}
            >
              {route.icon}
              <h1 className="font-bold text-[.9em] text-[#2e343f]">
                {route.text}
              </h1>
            </Link>
          </div>
        ))}
    </div>
  );
};

export default TestAccordian;
