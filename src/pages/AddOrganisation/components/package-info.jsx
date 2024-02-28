import { Box, Modal } from "@mui/material";
import React from "react";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
  width: "80vw",
  height: "80vh",
};
const PackageInfo = ({ handleClose, open, setPackage, billedPackage }) => {
  return (
    <Modal
      keepMounted={false}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 shadow-md outline-none rounded-md gap-2 flex flex-col"
      >
        <table className="min-w-full bg-white text-left text-sm font-light">
          <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
            <tr className="!font-medium">
              <th scope="col" className="px-6 py-3 ">
                Packages
              </th>
              <th scope="col" className="px-6 py-3 ">
                Basic
              </th>
              <th scope="col" className="px-6 py-3 ">
                Intermediate
              </th>
              <th scope="col" className="px-6 py-3 ">
                Enterprise
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className={` "bg-gray-50" border-b dark:border-neutral-500`}>
              <td className="whitespace-nowrap px-6 py-2 font-medium">
                index{" "}
              </td>
              <td className="whitespace-nowrap px-6 py-2">ok</td>
              <td className="whitespace-nowrap px-6 py-2">:hi</td>
              <td className="whitespace-nowrap px-6 py-2">op</td>
            </tr>
          </tbody>
        </table>
      </Box>
    </Modal>
  );
};

export default PackageInfo;

const packageArray = [
  {
    packageName: "Access control",
    Basic: "-",
    Intermediate: "✓",
    Enterprise: "✓",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Dual approval workflow",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Employee onboarding / offboarding",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Department creation",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Dashboard",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Payroll / salary / (add/view/create)",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Attendance tracking",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Organisation hierarchy",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Form 16 / TDS declaration",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Investment proof submission",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Multiple business unit creation",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Shift management",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Shift allowance",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Loan management ",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Machine -punching punch-out",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Mobile Android & IOS APP development",
    Basic: "✓",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Performance",
    Basic: "-",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Training (Basic) ",
    Basic: "-",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Document management",
    Basic: "-",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Remote / GPS log in ",
    Basic: "-",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Communication ",
    Basic: "-",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Reporting MIS",
    Basic: "-",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Catering / food",
    Basic: "-",
    Intermediate: "✓",
    Enterprise: "✓",
  },
  {
    packageName: "Transport (daily Bus)",
    Basic: "-",
    Intermediate: "-",
    Enterprise: "✓",
  },
  {
    packageName: "Expense management",
    Basic: "-",
    Intermediate: "-",
    Enterprise: "✓",
  },
  {
    packageName: "Help desk HR",
    Basic: "-",
    Intermediate: "-",
    Enterprise: "✓",
  },
  {
    packageName: "Project /task list management",
    Basic: "-",
    Intermediate: "-",
    Enterprise: "✓",
  },
  {
    packageName: "Skills matrix",
    Basic: "-",
    Intermediate: "-",
    Enterprise: "✓",
  },
  {
    packageName: "Training (Advance) Collaboration",
    Basic: "-",
    Intermediate: "-",
    Enterprise: "✓",
  },
  {
    packageName: "Travel Desk / Booking",
    Basic: "-",
    Intermediate: "-",
    Enterprise: "✓",
  },
  {
    packageName: "Recruitment",
    Basic: "-",
    Intermediate: "-",
    Enterprise: "✓",
  },
];
