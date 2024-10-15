import React from "react";

const BasicButton = ({
  type = "button",
  onClick,
  color,
  size,
  title,
  icon: Icon,
}) => {
  return (
    <>
      <button
        type="button"
        className={`w-max text-sm   font-bold  py-2 px-8 
                ${
                  color === "primary"
                    ? "bg-[#1514FE]"
                    : color === "success"
                    ? "bg-green-700"
                    : color === "danger"
                    ? "bg-red-500"
                    : "bg-[#1514FE]"
                }  rounded-md  text-white`}
        onClick={onClick}
      >
        {Icon && <Icon />} {title}
      </button>
    </>
  );
};

export default BasicButton;
