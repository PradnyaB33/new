import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
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
      <div className="w-full h-auto bg-[#e2f1ff] mb-2  rounded-md">
        <div className="grid grid-cols-12 justify-between w-full h-full p-3 items-start">
          <div className="flex col-span-10 flex-col w-full">
            <h1 className="w-full text-slate-600 truncate">
              Start Time: {item?.start?.format("HH:mm:ss")}
            </h1>
            <h1 className="w-full text-slate-600 truncate">
              Start Address:{" "}
              <abbr title={item?.startLocation?.address}>
                {item?.startLocation?.address}
              </abbr>
            </h1>
            <h1 className="w-full text-slate-600 truncate">
              End Time: {item?.end?.format("HH:mm:ss")}
            </h1>
            <h1 className="w-full text-slate-600 truncate">
              End Address:{" "}
              <abbr title={item?.endLocation?.address}>
                {item?.endLocation?.address}
              </abbr>
            </h1>
          </div>

          <div className="flex col-span-2 p-2">
            <IconButton onClick={handleClick}>
              <MoreVert />
            </IconButton>
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
