import React from "react";
import { Link } from "react-router-dom";

const BasicButton = ({
  type = "button",
  onClick,
  variant,
  color,
  size,
  title,
  className,
  icon: Icon,
  component: Component = "button",
  to,
}) => {
  const buttonStyles = `w-max  font-bold py-2 px-4 
                ${
                  color === "primary"
                    ? "bg-[#1514FE]"
                    : color === "success"
                    ? "bg-green-700"
                    : color === "danger"
                    ? "bg-red-500"
                    : "bg-[#1514FE]"
                } 
                
                rounded-md text-white ${className}`;

  return (
    <>
      {Component === "link" ? ( // Check if the component is Link
        <Link to={to} className={buttonStyles}>
          {Icon && <Icon />} {title}
        </Link>
      ) : (
        <button type={type} className={buttonStyles} onClick={onClick}>
          {Icon && <Icon />} {title}
        </button>
      )}
    </>
  );
};

export default BasicButton;
