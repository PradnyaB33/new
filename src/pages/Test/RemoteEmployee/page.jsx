import CheckIcon from "@mui/icons-material/Check";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import React, { useState } from "react";
import MiniForm from "./components/MiniForm";

const RemoteEmployee = () => {
  const [openModal, setOpenModal] = useState(false);
  const [array, setArray] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { isLoaded } = useJsApiLoader({
    id: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  console.log(selectedIndex);

  const handleMenuItemClick = (index, event) => {
    setAnchorEl(null);
    setSelectedIndex(index);
    switch (event.currentTarget.id) {
      case "edit":
        setOpenModal(true);
        break;
      case "delete":
        const newArray = [...array];
        newArray.splice(index, 1);
        setArray(newArray);
        break;
      default:
        break;
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  console.log(array);

  return (
    <div className="w-full flex justify-between relative">
      <div className=" z-50 p-6 flex flex-col mt-7 w-[25vw] bg-white gap-4 ">
        <div className="w-full bg-white">
          <h1 className="text-slate-400 mb-1">Select Date For Application</h1>
          <div>
            <p className=" z-[99999999]  mt-4 font-semibold  mb-3">
              Total Approximate Distance : Kilometers
            </p>
          </div>

          {array.map((item, index) => (
            <div className="w-full h-auto bg-[#e2f1ff] mb-2 relative">
              <div className="flex w-full items-center h-full p-5">
                <div className="pl-5 flex flex-col ">
                  <h1>Start Time : {item.start}</h1>
                  <h1>End Time : {item.end}</h1>
                  <h1>Address : {item.location}</h1>
                </div>
                <div className="absolute right-5">
                  <MoreVertIcon onClick={(event) => handleMenuClick(event)} />
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    f
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      id="edit"
                      onClick={(event) => handleMenuItemClick(index, event)}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      id="delete"
                      onClick={(event) => handleMenuItemClick(index, event)}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-3 w-[21vw] flex flex-col items-end gap-10">
            <button
              onClick={() => setOpenModal(true)}
              className="bg-[#2463ea] w-[3vw] h-[3vw] text-white text-xl rounded-full"
            >
              +
            </button>
            <button className="bg-[#2463ea] text-white pr-4 pl-4 pt-2 pb-2 text-sm">
              <span className="mr-3">
                <CheckIcon />
              </span>{" "}
              Apply for miss punch
            </button>
          </div>
        </div>
      </div>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogActions>
          <DialogContent>
            <MiniForm {...{ setArray, setOpenModal, array }} />
          </DialogContent>
        </DialogActions>
      </Dialog>
      {isLoaded && (
        <GoogleMap
          key={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          mapContainerStyle={{
            width: "80%",
            height: "91.8vh",
          }}
          center={{
            lat: 18.6229332,
            lng: 73.7360171,
          }}
          zoom={18}
        ></GoogleMap>
      )}
    </div>
  );
};

export default RemoteEmployee;
