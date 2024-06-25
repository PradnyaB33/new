import { MoreVert, MyLocation } from "@mui/icons-material";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";
import ReusableModal from "../../../components/Modal/component";
import SearchAdd from "../utils/SearchAdd";
import ViewDelete from "./ViewDelete";

const GeoFenceCard = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="flex flex-col justify-start items-center">
        <div className="flex p-4 justify-between gap-8 border-b w-full">
          <div className="flex gap-2 items-center">
            <MyLocation className="text-Brand-washed-blue/brand-washed-blue-10" />
            <h4 className="text-xl underline text-black">Mumbai,Pune</h4>
          </div>
          <IconButton onClick={handleClick}>
            <MoreVert />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>Delete</MenuItem>
          </Menu>
        </div>
        <div className="p-4 w-full flex flex-col gap-4">
          <div className="">
            <p className="text-xl w-full text-black">Employee Count: 08</p>
            <p className="text-sm w-full">Employee Count: 08</p>
          </div>
          <div className="flex gap-6 justify-between">
            <Button variant="contained" size="small">
              Add Employee
            </Button>
            <Button
              onClick={() => setOpen1(true)}
              color="error"
              variant="contained"
              size="small"
            >
              Remove Employee
            </Button>
          </div>
        </div>
        <ReusableModal
          open={open1}
          heading={"View And Delete"}
          onClose={() => setOpen1(false)}
        >
          <ViewDelete />
        </ReusableModal>
        <ReusableModal
          open={open2}
          heading={"View And Delete"}
          onClose={() => setOpen2(false)}
        >
          <SearchAdd />
        </ReusableModal>
      </div>
    </div>
  );
};

export default GeoFenceCard;
