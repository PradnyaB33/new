import React from "react";
import TDSTable1 from "./Table/TDSTable1";

const Tab1 = () => {
  // const [open, setOpen] = useState(false);
  // const handleClose = () => {
  //   setOpen(false);
  // };
  return (
    <div className="overflow-auto !p-0 ">
      <div className="flex items-center justify-between ">
        <div className="w-full p-4  ">
          <h1 className="text-2xl ">Income From Salary</h1>
          <p>Below are the annual salary components</p>
        </div>
      </div>
      <TDSTable1 />
    </div>
  );
};

export default Tab1;
