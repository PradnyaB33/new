import { MoreVert } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";

const MappedForm = ({ item, index, setArray, setOpenModal }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    setArray((prev) => {
      const newArray = [...prev];
      newArray.splice(index, 1);
      return newArray;
    });
    handleClose();
  };

  return (
    <>
      <div className="w-full h-auto bg-[#e2f1ff] mb-2 relative rounded-md">
        <div className=" flex justify-between w-full h-full p-3 items-center">
          <div className="flex flex-col">
            <h1>
              <span className="text-sm">Start Time</span> :{" "}
              <span className="text-slate-600">
                {item?.start?.format("HH:mm:ss")}
              </span>
            </h1>
            <h1>
              <span className="text-sm">Address</span> :{" "}
              <span className="text-slate-600">{item?.location?.address}</span>
            </h1>
          </div>
          <div className="">
            <MoreVert onClick={handleClick} />
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem id="edit" onClick={() => setOpenModal(true)}>
                Edit
              </MenuItem>
              <MenuItem id="delete" onClick={handleDelete}>
                Delete
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </>
  );
};

export default MappedForm;