import { Box, Button, Modal, Rating } from "@mui/material";
import DOMPurify from "dompurify";
import React from "react";
import { Link } from "react-router-dom";
import useCardQuery from "../../components/card-training/useQuery";
import MiniForm from "./components/mini-form";

const TrainingCard2 = ({ doc }) => {
  const sanitizedDescription = DOMPurify.sanitize(
    doc?.trainingId?.trainingDescription
  );
  const { data, getProofMutate, open, setOpen } = useCardQuery({
    trainingId: doc?.trainingId?._id,
  });

  return (
    <div
      className={`bg-white
       border rounded-lg p-8 dark:border-neutral-500 flex w-full justify-between shadow-1-strong`}
    >
      <div className="flex gap-8">
        <img
          src={
            doc?.trainingId?.trainingLogo?.length > 0
              ? doc?.trainingId?.trainingLogo
              : "https://via.placeholder.com/150"
          }
          alt="Training Logo"
          className="w-48 h-36 object-cover rounded-md shadow-1-strong border border-gray-200"
        />
        <div className="text-left">
          <div className="font-bold text-xl">
            {doc?.trainingId?.trainingName}
          </div>
          <p dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
          3.5
          <Rating size="small" name="read-only" value={3.5} readOnly />
          <div className="">
            Duration &nbsp;{doc?.trainingId?.trainingDuration ?? "2 h"}
          </div>
          <div>
            Location&nbsp;:&nbsp;
            <Link
              className="text-blue-500 underline"
              to={`https://www.google.com/maps/search/?api=1&query=${doc?.trainingId?.trainingLocation?.position?.lat},${doc?.trainingId?.trainingLocation?.position?.lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {doc?.trainingId?.trainingLocation?.address}
            </Link>
          </div>
          <div>
            Live Link&nbsp;:&nbsp;
            <Link
              className="text-blue-500 underline"
              to={doc?.trainingId?.trainingLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {doc?.trainingId?.trainingLink}
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Button variant="contained" onClick={() => setOpen(true)}>
          Mark as Completed
        </Button>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        keepMounted={false}
      >
        <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white">
          <MiniForm {...{ mutate: getProofMutate, doc }} />
        </Box>
      </Modal>
    </div>
  );
};

export default TrainingCard2;
