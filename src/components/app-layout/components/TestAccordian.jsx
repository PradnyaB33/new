import { ChevronRight } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const TestAccordian = ({
  role,
  icon,
  routes,
  isVisible,
  valueBoolean,
  handleAccordianClick,
  open,
  setOpen,
}) => {
  const currentRoute = useLocation().pathname;

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <div className={`block ${!isVisible && "hidden"}`}>
      <div
        className="my-2 flex gap-3 justify-between px-4 text-sm items-center cursor-pointer"
        onClick={handleAccordianClick}
      >
        <h1 className="py-1 text-base tracking-tighter  font-bold text-gray-500">
          {role}
        </h1>
        <ChevronRight
          className={`text-gray-500 !h-5 transition-all ${valueBoolean ? "transform rotate-90" : "rotate-0"
            }`}
        />
      </div>

      {valueBoolean &&
        routes.map((route, i) => (
          <div className={`${route.isVisible ? "block " : "hidden"}`} key={i}  >
            < Link
              to={route.link}
              onClick={handleClick}
              className={`rounded-md  flex items-center gap-1 py-2 text-gray-500 active:!text-blue-700 
                hover:!bg-blue-100 
                focus:text-[#1514FE] ${route?.link?.includes(currentRoute) &&
                "!bg-[#1514FE] !text-white"
                } m-2 px-6 transition duration-200`}
            >
              {route.icon}
              <h1 className="tracking-tight  font-bold text-sm">
                {route.text}
              </h1>
            </Link>
          </div >
        ))}
    </div >
  );
};

export default TestAccordian;
