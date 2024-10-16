import React from "react";

const HeadingOneLineInfo = ({ heading, info }) => {
  return (
    <div style={{ marginBottom: "2%" }}>
      <h1 className="text-[1.775rem] leading-none text-gray-700   font-semibold  tracking-tight">
        {heading}
      </h1>
      <p className="text-gray-500  tracking-tight ">{info}</p>
    </div>
  );
};

export default HeadingOneLineInfo;
