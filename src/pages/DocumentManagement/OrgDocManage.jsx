import { Button } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useQuery } from "react-query";
import useGetUser from "../../hooks/Token/useUser";
import DocPreviewModal from "./components/Modal2";

const OrgDocManage = () => {
  const { authToken } = useGetUser();
  const [open, setOpen] = useState(false);
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState(""); // State to store the URL of the selected document
  const { data } = useQuery(`getdocsforemp`, async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/org/getdocsforemp`,
      {
        headers: { Authorization: authToken },
      }
    );
    console.log(response.data.documents);
    return response.data.documents;
  });

  const handleOpenModal = (documentUrl) => {
    setSelectedDocumentUrl(documentUrl);
    setOpen(true);
  };

  // Function to handle closing the modal

  return (
    <div className="w-full h-full p-5">
      <div className="w-[50%] h-auto pb-4 mt-4 border-2 m-auto rounded-3xl relative">
        <div>
          <div
            style={{ borderBottom: "2px solid #E5E7EB" }}
            className="text-3xl font-semibold w-full text-center my-2 pb-2"
          >
            Organization Documents
          </div>
          {data?.map((document, idx) => (
            <div
              key={idx}
              className="w-[500px] h-[60px] px-4 m-auto shadow-md flex gap-6 items-center justify-between mb-4"
            >
              <div className="text-lg">{document.title}</div>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleOpenModal(document.url)}
              >
                SHOW
              </Button>
            </div>
          ))}
        </div>
        <DocPreviewModal
          fileData={selectedDocumentUrl}
          setOpenState={setOpen}
          openState={open}
        />
      </div>
    </div>
  );
};

export default OrgDocManage;
