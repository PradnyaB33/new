import React from "react";

const TableHeader = () => {
  return (
    <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500 ">
      <tr className="!font-medium shadow-lg ">
        <th scope="col" className="px-6 py-3 text-center">
          Training Logo
        </th>
        <th scope="col" className="px-6 py-3 text-center">
          Training Name
        </th>
        <th scope="col" className="px-6 py-3 text-center">
          Training Duration
        </th>
        <th scope="col" className="px-6 py-3 text-center">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
