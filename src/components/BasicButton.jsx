import React from "react";
import { Link } from "react-router-dom";

const BasicButton = ({
  type = "button",
  onClick,
  variant = "contained",
  color,
  size,
  title,
  className,
  icon: Icon,
  component: Component = "button",
  to,
  disabled = false,
}) => {
  const baseStyles = `w-max text-sm font-bold py-2 px-8 rounded-md ${className}`;

  const buttonStyles = variant === "outlined"
    ? `border ${color === "primary" ? "border-[#1514FE] text-[#1514FE]"
      : color === "success" ? "border-green-700 text-green-700"
        : color === "danger" ? "border-red-500 text-red-500"
          : "border-[#1514FE] text-[#1514FE]"}`
    : `${color === "primary" ? "bg-[#1514FE]"
      : color === "success" ? "bg-green-700"
        : color === "danger" ? "bg-red-500"
          : "bg-[#1514FE]"} text-white`;

  const disabledStyles = "bg-gray-400 cursor-not-allowed text-gray-300 border-gray-400";

  return (
    <>
      {Component === "link" ? (
        <Link to={to} className={`${baseStyles} ${buttonStyles}`}>
          {Icon && <Icon />} {title}
        </Link>
      ) : (
        <button
          type={type}
          className={`${baseStyles} ${buttonStyles} ${disabled ? disabledStyles : ""}`}
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
