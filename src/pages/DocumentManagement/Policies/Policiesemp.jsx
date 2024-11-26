// import React from 'react'

// const Policiesemp = () => {
//   return (
//     <div>Policiesemp</div>
//   )
// }

// export default Policiesemp

import React, { useContext, useState } from "react";
import { IconButton } from "@mui/material";
import { Info } from "@mui/icons-material";
import VisibilityIcon from '@mui/icons-material/Visibility';  // Eye icon for viewing the document
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import axios from "axios";
import { useQuery } from "react-query";


import UserProfile from "../../../hooks/UserData/useUser";
import ViewDocumentSkeleton from "../components/ViewDocumentSkeleton";
import { UseContext } from "../../../State/UseState/UseContext";
import { TestContext } from "../../../State/Function/Main";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

const Policiesemp = () => {
  const { handleAlert } = useContext(TestContext);
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const employeeId = user && user._id;
  const organizationId = user && user.organizationId;
  const { cookies } = useContext(UseContext);
  const token = cookies["aegis"];

  // Using React Query to fetch documents from the updated API
  const { data: getRecordOfEmployee, isLoading } = useQuery(
    ["getRecordOfDocs"],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/org/getdocs`,
        {
          headers: { Authorization: token },
        }
      );
      return response.data.doc;  // Assuming the response structure includes `doc`
    }
  );

  // Function to open the PDF in a new tab
  const handleViewPDF = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank"); // Open PDF in a new tab
    } else {
      alert("PDF URL is not available.");
    }
  };

  return (
    <>
    <BoxComponent>
    <HeadingOneLineInfo heading={" Company Policies and Procedures"} />
      {/* <section className="bg-gray-50 min-h-screen w-full">
        <article className="bg-white w-full h-max shadow-md rounded-sm border items-center flex flex-col">
          <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
            <div className="flex gap-3">
              <div className="mt-1">
                <EventNoteOutlinedIcon />
              </div>
              <div>
                <h1 className="!text-lg">Document Manage</h1>
                <p className="text-xs text-gray-600">
                  Manage your documents here.
                </p>
              </div>
            </div>
          </div> */}
{/* 
          <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
            {getRecordOfEmployee?.length > 0 && (
              <div className="flex gap-2 w-full">
                <h1 className="text-lg">Your uploaded documents</h1>
              </div>
            )}
          </div> */}

          {isLoading ? (
            <ViewDocumentSkeleton />
          ) : getRecordOfEmployee?.length > 0 ? (
            <div className="w-full p-4">
              <table className="min-w-full bg-white text-left text-sm font-light table-auto">
                <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                  <tr className="font-semibold">
                    <th className="text-left pl-6 py-3">SR NO</th>
                    <th className="px-6 py-3">File Name</th>
                    <th className="px-8 py-3">Document Type</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getRecordOfEmployee.map((data, id) => {
                    return (
                      <tr className="font-medium border-b" key={id}>
                        <td className="text-left pl-6 py-3">{id + 1}</td>
                        <td className="py-3 pl-6">{data.title}</td>
                        <td className="py-3 pl-6">{data.type}</td>
                        <td className="whitespace-nowrap px-6 py-2 flex gap-2">
                          {/* Eye Icon for View PDF */}
                          <IconButton
                            color="primary"
                            onClick={() => handleViewPDF(data.url)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
              <article className="flex items-center mb-1 text-red-500 gap-2">
                <Info className="!text-2xl" />
                <h1 className="text-lg font-semibold">No Documents Found</h1>
              </article>
              <p>No documents available.</p>
            </section>
          )}
        {/* </article>
      </section> */}
         </BoxComponent>
    </>
  );
};

export default Policiesemp;
