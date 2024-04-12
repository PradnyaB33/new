import { Box, Modal } from "@mui/material";
import React from "react";
import EmployeeTable from "./components/table";
import Modal1 from "./miniform/page1/page";
import Modal2 from "./miniform/page2/page";
import Modal3 from "./miniform/page3/page";
import useTrainingFormEmployee from "./my-training-use-query";

const MyTraining = () => {
  const { data, setPage, isLoading, page } = useTrainingFormEmployee();
  console.log(`🚀 ~ file: page.jsx:11 ~ data:`, data);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [firstTimeOut, setFirstTimeOut] = React.useState(false);
  const [secondTimeOut, setSecondTimeOut] = React.useState(false);
  const [thirdTimeOut, setThirdTimeOut] = React.useState(false);

  return (
    <div className="pt-14 p-8">
      <div className="flex flex-col w-min gap-8">
        <h4
          className="font-medium text-lg hover:underline cursor-wait w-max"
          onMouseEnter={() => {
            let timeout = setTimeout(() => {
              setOpen(true);
            }, 2000);
            setFirstTimeOut(timeout);
          }}
          onMouseLeave={() => {
            clearTimeout(firstTimeOut);
          }}
        >
          Upcoming Trainings : {data?.data?.length}
        </h4>
        <h4
          className="font-medium text-lg hover:underline cursor-wait w-max"
          onMouseEnter={() => {
            let timeout = setTimeout(() => {
              setOpen2(true);
            }, 2000);
            setSecondTimeOut(timeout);
          }}
          onMouseLeave={() => {
            clearTimeout(secondTimeOut);
          }}
        >
          Ongoing Trainings {data?.data?.length}
        </h4>
        <h4
          className="font-medium text-lg hover:underline cursor-wait w-max"
          onMouseEnter={() => {
            let timeout = setTimeout(() => {
              setOpen3(true);
            }, 2000);
            setThirdTimeOut(timeout);
          }}
          onMouseLeave={() => {
            clearTimeout(thirdTimeOut);
          }}
        >
          Overdue training : {data?.totalResults - data?.data?.length}
        </h4>
      </div>
      <EmployeeTable
        data={data?.data}
        setPage={setPage}
        isLoading={isLoading}
        totalResult={data?.totalResults}
        page={page}
      />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        keepMounted={false}
      >
        <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white">
          <Modal1 />
        </Box>
      </Modal>
      <Modal
        open={open2}
        onClose={() => setOpen2(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        keepMounted={false}
      >
        <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white">
          <Modal2 />
        </Box>
      </Modal>
      <Modal
        open={open3}
        onClose={() => setOpen3(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        keepMounted={false}
      >
        <Box className="border-none shadow-md outline-none rounded-md absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] md:w-[70%] z-10 p-4 bg-white">
          <Modal3 />
        </Box>
      </Modal>
    </div>
  );
};

export default MyTraining;
