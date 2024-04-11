import { Button, Rating } from "@mui/material";
import DOMPurify from "dompurify";
import React from "react";
import { Link } from "react-router-dom";

const TrainingCard = ({ doc }) => {
  const sanitizedDescription = DOMPurify.sanitize(doc?.trainingDescription);

  return (
    <div
      className={`bg-white
       border rounded-lg p-8 dark:border-neutral-500 flex w-full justify-between shadow-1-strong`}
    >
      <div className="flex gap-8">
        <img
          src={
            doc?.trainingLogo.length > 0
              ? doc?.trainingLogo
              : "https://via.placeholder.com/150"
          }
          alt="Training Logo"
          className="w-48 h-36 object-cover rounded-md shadow-1-strong border border-gray-200"
        />
        <div className="text-left">
          <div className="font-bold text-xl">{doc?.trainingName}</div>
          <p dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
          3.5
          <Rating size="small" name="read-only" value={3.5} readOnly />
          {doc?.trainingLocation.map}
          <div className="">
            Duration &nbsp;{doc?.trainingDuration ?? "2 h"}
          </div>
          <div>
            Location&nbsp;:&nbsp;
            <Link
              className="text-blue-500 underline"
              to={`https://www.google.com/maps/search/?api=1&query=${doc?.trainingLocation?.position?.lat},${doc?.trainingLocation?.position?.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {doc?.trainingLocation.address}
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Button variant="contained">Join</Button>
      </div>
    </div>
  );
};

export default TrainingCard;
