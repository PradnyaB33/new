import { Box, Modal } from "@mui/material";
import React from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
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
        className="border-none !z-10 shadow-md outline-none rounded-md flex flex-col overflow-auto"
      >
        <table className="min-w-full bg-white text-left text-sm font-light">
          <thead className="border-b bg-brand-primary-blue/brand-primary-blue-1 font-bold text-lg dark:border-neutral-500 sticky top-0 text-brand/primary-blue">
            <tr className="!font-bold text-lg">
              <th scope="col" className="px-6 py-3">
                Packages
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Basic
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Intermediate
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Enterprise
              </th>
            </tr>
          </thead>
          <tbody className="overflow-y-scroll h-full">
            {packageArray.map((doc, key) => {
              return (
                <tr
                  key={key}
                  className={`bg-gray-50 border-b dark:border-neutral-500 font-bold`}
                >
                  <td className="whitespace-nowrap px-6 py-2 font-bold">
                    {doc.packageName}
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-2 text-center ${
                      doc.Basic === "✓" ? "text-black" : "text-red-600"
                    }`}
                  >
                    {doc.Basic === "✓" ? "✓" : "X"}
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-2 text-center ${
                      doc.Intermediate === "✓" ? "text-black" : "text-red-600"
                    }`}
                  >
                    {doc.Intermediate === "✓" ? "✓" : "X"}
                  </td>
                  <td
                    className={`whitespace-nowrap px-6 py-2 text-center ${
                      doc.Enterprise === "✓" ? "text-black" : "text-red-600"
                    }`}
                  >
                    {doc.Enterprise === "✓" ? "✓" : "X"}
                  </td>
                </tr>
              );
            })}
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
