import { DescriptionOutlined } from "@mui/icons-material";
import React, { useRef, useState } from "react";

const PdfInput = ({ field, caching = false, className }) => {
  const displayPdf = async (file) => {
    // Implement the logic to display the PDF
  };

  if (field.value) {
    displayPdf(field.value);
  }

  const [selectedPdf, setSelectedPdf] = useState(field?.value);
  const hiddenInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedPdf(file);

    displayPdf(file);
  };

  return (
    <object
      className={`flex px-2 border-gray-200 border-[.5px] bg-[#f8f8ff59] py-[6px] items-center h-48 w-48 rounded-full justify-center !hover:bg-[ghostwhite] cursor-pointer transition-all !bg-cover ${className}`}
      style={{
        background: `linear-gradient(45deg, #f8f8ff59, #f8f8ff59), url(${
          typeof selectedPdf !== "object"
            ? selectedPdf?.includes("data:application/pdf")
              ? `${selectedPdf}`
              : `${selectedPdf}?v=${Date.now()}`
            : selectedPdf
        })`,
      }}
      data={selectedPdf}
      onClick={() => {
        hiddenInputRef.current.click();
      }}
    >
      <DescriptionOutlined className="!text-gray-700 !text-4xl" />
      <input
        type="file"
        accept="application/pdf"
        id="pdf_url"
        placeholder="placeholder"
        onChange={(e) => {
          field.onChange(e.target.files[0]);
          handleFileChange(e);
        }}
        className="hidden"
        ref={hiddenInputRef}
      />
    </object>
  );
};

export default PdfInput;
