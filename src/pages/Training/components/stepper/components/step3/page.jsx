import { Button, Chip } from "@mui/material";
import DOMPurify from "dompurify";
import React from "react";
import { Link } from "react-router-dom";
import useTrainingCreationMutation from "../mutation";
import useTrainingStore from "../zustand-store";

const Step3 = () => {
  const { mutate } = useTrainingCreationMutation();
  const {
    trainingName,
    trainingType,
    trainingDescription,
    trainingStartDate,
    trainingLink,
    trainingImage,
    trainingLocation,
    trainingEndDate,
    trainingPoints,
    trainingDownCasted,
    trainingDuration,
  } = useTrainingStore();
  console.log(`🚀 ~ file: page.jsx:23 ~ trainingDuration:`, trainingDuration);
  const sanitizedDescription = DOMPurify.sanitize(trainingDescription);
  const url = URL.createObjectURL(trainingImage);
  return (
    <div className="flex items-center gap-8 flex-col">
      <img
        src={url}
        className="rounded-lg w-full object-cover h-44"
        alt="Not-found"
      />
      <div className=" items-start flex flex-col w-full">
        <h2 className="text-2xl  text-gray-400">
          <span className="text-black">Title:</span> {trainingName}
        </h2>

        <div className="space-y-1 w-full items-center grid grid-cols-2">
          <h2 className="text-lg  ">
            <div className="text-gray-500 font-thin text-md">Description:</div>
            <p
              className="preview"
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            />
          </h2>
          <h2 className="text-lg  ">
            <div className="text-gray-500 font-thin text-md">
              Training Start Date:
            </div>
            <p>{trainingStartDate}</p>
          </h2>
          <h2 className="text-lg  ">
            <div className="text-gray-500 font-thin text-md">
              Training End Date:
            </div>
            <p>{trainingEndDate}</p>
          </h2>
          <h2 className="text-lg  ">
            <div className="text-gray-500 font-thin text-md">
              Training Location:
            </div>
            <p className="truncate">{trainingLocation?.address}</p>
          </h2>
          <h2 className="text-lg  ">
            <div className="text-gray-500 font-thin text-md">
              Training Link:
            </div>
            <Link className="text-blue-400 hover:underline" to={trainingLink}>
              {trainingLink}
            </Link>
          </h2>
          <h2 className="text-lg  ">
            <div className="text-gray-500 font-thin text-md">
              Training Points:
            </div>
            <p>{trainingPoints}</p>
          </h2>
          <h2 className="text-lg  ">
            <div className="text-gray-500 font-thin text-md">
              Training Type:
            </div>
            <div className="gap-4 flex">
              {trainingType.map((doc, i) => {
                return (
                  <Chip
                    key={i}
                    label={doc.label}
                    className="bg-blue-400 text-white !text-xs"
                    variant="contained"
                    size="small"
                  />
                );
              })}
            </div>
          </h2>
          <h2 className="text-lg  ">
            <div className="text-gray-500 font-thin text-md">
              Training Down Casted:
            </div>
            <p>{trainingDownCasted ? "Yes" : "No"}</p>
          </h2>
        </div>
      </div>
      <Button
        variant="contained"
        onClick={() => {
          mutate({
            trainingName,
            trainingType,
            trainingDescription,
            trainingStartDate,
            trainingLink,
            trainingImage,
            trainingLocation,
            trainingEndDate,
            trainingPoints,
            trainingDownCasted,
          });
        }}
      >
        Submit
      </Button>
    </div>
  );
};

export default Step3;
