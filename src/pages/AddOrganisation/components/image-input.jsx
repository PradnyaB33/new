import { CameraAltOutlined } from "@mui/icons-material";
import React, { useRef, useState } from "react";

const ImageInput = ({ field, setValue }) => {
  const [selectedImage, setSelectedImage] = useState("");
  const hiddenInputRef = useRef(null);
  const handleFileChange = (e) => {
    console.log(`🚀 ~ file: image-input.jsx:7 ~ e:`, e);
    const file = e.target.files[0];
    console.log(`🚀 ~ file: image-input.jsx:9 ~ file:`, file);

    // setValue("logo_url", file);
    displayImage(file);
  };
  const displayImage = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  return (
    <div
      className={`flex px-2 border-gray-200 border-[.5px] bg-[#f8f8ff59] py-[6px] items-center h-48 w-48 rounded-full justify-center hover:bg-[ghostwhite] cursor-pointer transition-all !bg-cover`}
      style={{
        background: `linear-gradient(45deg, #f8f8ff59, #f8f8ff59), url(${selectedImage})`,
      }}
      onClick={() => {
        hiddenInputRef.current.click();
      }}
    >
      <CameraAltOutlined className="!text-gray-700 !text-4xl" />
      <input
        type="file"
        accept="image/png,image/gif,image/jpeg,image/webp"
        id="logo_url"
        placeholder="placeholder"
        onChange={(e) => {
          field.onChange(e.target.files[0]);
          handleFileChange(e);
        }}
        className="hidden"
        ref={hiddenInputRef}
      />
    </div>
  );
};

export default ImageInput;
