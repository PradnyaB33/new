import { CheckCircle, Close, Person } from "@mui/icons-material";
import { Dialog, DialogContent, Divider, IconButton } from "@mui/material";
import React, { useState } from "react";

const RegimeModel = ({ open, handleClose }) => {
  const [selected, setSelected] = useState(null);

  const handleRadioChange = (index, item) => {
    setSelected(index);
  };

  return (
    <>
      <Dialog
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "600px!important",
            height: "max-content",
          },
        }}
        open={open}
        onClose={handleClose}
        className="w-full"
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="flex w-full justify-between py-4 items-center  px-4">
          <h1 id="modal-modal-title" className="text-lg pl-2 font-semibold">
            Select Regime
          </h1>
          <IconButton onClick={handleClose}>
            <Close className="!text-[16px]" />
          </IconButton>
        </div>

        <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
          <div className="w-full">
            <Divider variant="fullWidth" orientation="horizontal" />
          </div>

          <div className="w-full py-4 px-8">
            {/* <h1 className="text-lg font-bold mb-1">Choose your Profile</h1>
            <p className="text-sm text-gray-700">
              By choosing a profile, you'll be able to access different profiles
            </p> */}

            <form className="flex-col gap-4 mt-6 flex items-center">
              {["New Regime", "Old Regime"].map((item, index) => (
                <label
                  key={index}
                  className={`inline-flex items-center space-x-2 cursor-pointer w-full border-[.5px] border-gray-300 p-4 py-3  rounded-lg ${
                    selected === index && "bg-blue-400 "
                  }`}
                >
                  <input
                    type="radio"
                    className="hidden"
                    checked={selected === index}
                    onChange={() => handleRadioChange(index, item)}
                  />
                  <span
                    className={`text-gray-700 space-x-2 ${
                      selected === index && "text-white"
                    }`}
                  >
                    {selected === index ? <CheckCircle /> : <Person />} {item}
                  </span>
                </label>
              ))}
            </form>
            <button
              type="button"
              //   onClick={handleSubmit}
              className="bg-blue-500 my-4 text-white p-2 rounded-md"
            >
              Submit
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RegimeModel;