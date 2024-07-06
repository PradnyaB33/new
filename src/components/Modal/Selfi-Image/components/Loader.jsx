import { EmojiEmotionsOutlined } from "@mui/icons-material";
import React from "react";

const Loader = ({ isLoading = false }) => {
  return (
    isLoading && (
      <>
        {" "}
        <div className="preloader12 absolute left-0 right-0 m-auto inset-0 flex items-center justify-center p">
          <EmojiEmotionsOutlined className="pulse text-white !text-4xl" />
        </div>
        <p>Recognizing face and authenticating</p>
      </>
    )
  );
};

export default Loader;
