import React from "react";
import { Link } from "react-router-dom";

const TestAccordian = ({
  icon,
  routes,
  role,
  toggleDrawer,
  valueBoolean,
  isVisible,
}) => {
  //   const [open, setOpen] = useState(valueBoolean);
  // const params = useMatch("/organisation/:id");
  // console.log(
  //   `🚀 ~ file: accordian.jsx:23 ~ params?.params?.id:`,
  //   params?.params?.id
  // );
  return (
    <div className={`block ${!isVisible && "hidden"} `}>
      <div className="my-2 flex gap-3 px-4 text-sm items-center">
        {/* {icon} */}
        <h1 className=" py-1 font-semibold text-[#67748E]">{role}</h1>
      </div>

      {routes.map((route) => (
        <div
          className={`${route.isVisible ? "block" : "hidden"}`}
          key={route.key}
        >
          <Link
            onClick={() => toggleDrawer()}
            to={route.link}
            className="rounded-md flex items-center gap-2 py-2 hover:bg-gray-100 hover:!text-white m-2 px-6"
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
