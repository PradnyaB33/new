import { ChevronRight } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const TestAccordian = ({
  role,
  icon,
  routes,
  isVisible,
  valueBoolean,
  handleAccordianClick,
}) => {
  const currentRoute = useLocation().pathname
  return (
    <div className={`block ${!isVisible && "hidden"}`}>
      <div
        className="my-2 flex gap-3 justify-between px-4 text-sm items-center cursor-pointer"
        onClick={handleAccordianClick}
      >
        <h1 className="py-1  font-semibold text-[#333333]">{role}</h1>
        <ChevronRight
          className={`text-[#67748E] !h-5 transition-all ${valueBoolean ? "transform rotate-90" : "rotate-0"
            }`}
        />
      </div>

      {valueBoolean &&
        routes.map((route, i) => (
          <div className={`${route.isVisible ? "block " : "hidden"}`} key={i}>
            {/* <Link
              to={route.link}
              className="rounded-md w-max flex items-center gap-2 py-2 text-[#B2B2B2] hover:text-[#1514FE] active:text-[#1514FE] m-2 px-6 transition duration-200"
            >
              {route.icon}
              <h1 className="font-bold text-[#B2B2B2] text-sm">{route.text}</h1>
            </Link> */}
            <Link
              to={route.link}
              className={`rounded-md w-max flex items-center gap-2 py-2 text-[#B2B2B2] active:!text-blue-700 hover:text-[#1514FE] focus:text-[#1514FE] ${route?.link?.includes(currentRoute) && "!text-[#1514FE]"} m-2 px-6 transition duration-200`}
            >

              {route.icon}
              <h1 className="font-bold text-sm">{route.text}</h1>
            </Link>

          </div>
        ))}
    </div>
  );
};

export default TestAccordian;
