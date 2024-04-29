import React from "react";

const Card = ({ title, data }) => {
  return (
    <>
      <div className="flex  gap-8">
        <div className="min-w-[250px] border rounded-md">
          <div className=" px-4 py-3 bg-white  rounded-lg leading-none flex items-top justify-start space-x-6">
            <div className="space-y-1">
              <h1 className="text-xl ">{title}</h1>
              <p className="text-sm text-slate-800 ">{data}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
