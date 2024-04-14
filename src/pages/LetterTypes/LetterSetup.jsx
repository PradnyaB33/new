import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import React from "react";
import Setup from "../SetUpOrganization/Setup";

const LetterSetup = () => {
  return (
    <div>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-[80%] h-max shadow-md rounded-sm border items-center">
            <div className="p-4 border-b-[.5px] flex items-center justify-between gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <FolderOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Letter Setup</h1>
                  <p className="text-xs text-gray-600">
                    Setup related to letter types which employee's would be
                    receiving.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </Setup>
      </section>
    </div>
  );
};

export default LetterSetup;
