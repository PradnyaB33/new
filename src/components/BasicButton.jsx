// import React from "react";

// const BasicButton = ({
//   type = "button",
//   onClick,
//   color,
//   size,
//   title,
//   className,
//   icon: Icon,
// }) => {
//   return (
//     <>
//       <button
//         type="button"
//         className={`w-max text-sm   font-bold  py-2 px-8 
//                 ${color === "primary"
//             ? "bg-[#1514FE]"
//             : color === "success"
//               ? "bg-green-700"
//               : color === "danger"
//                 ? "bg-red-500"
//                 : "bg-[#1514FE]"
//           }  rounded-md  text-white ${className}`}
//         onClick={onClick}
//       >
//         {Icon && <Icon />} {title}
//       </button>
//     </>
//   );
// };

// export default BasicButton;

import React from "react";
import { Link } from "react-router-dom"; // Import Link

const BasicButton = ({
  type = "button",
  onClick,
  color,
  size,
  title,
  className,
  icon: Icon,
  component: Component = "button",
  to,
  disabled = false,
}) => {
  const buttonStyles = `w-max text-sm font-bold py-2 px-8 
    ${color === "primary"
      ? "bg-[#1514FE]"
      : color === "success"
        ? "bg-green-700"
        : color === "danger"
          ? "bg-red-500"
          : "bg-[#1514FE]"
    } rounded-md text-white ${className}`;

  const disabledStyles = "bg-gray-400 cursor-not-allowed";
  console.log("className", className)

  return (
    <>
      {Component === "link" ? (
        <Link to={to} className={`${buttonStyles}`}>
          {Icon && <Icon />} {title}
        </Link>
      ) : (
        <button
          type={type}
          className={`${buttonStyles}  ${disabled ? disabledStyles : ""}`}
          onClick={onClick}
          disabled={disabled}
        >
          {Icon && <Icon />} {title}
        </button>
      )}
    </>
  );
};

export default BasicButton;

