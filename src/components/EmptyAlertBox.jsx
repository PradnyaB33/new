import { Info } from "@mui/icons-material";
import React from "react";

const EmptyAlertBox = ({ title, desc }) => {
  return (
    <section className="bg-gray-50 border py-6 px-8 rounded-md w-full">
      <article className="flex items-center text-red-500 gap-2">
        <Info className="!text-3xl mt-1" />
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-gray-900">{desc}</p>
        </div>
      </article>
    </section>
  );
};

export default EmptyAlertBox;
