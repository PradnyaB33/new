import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";

const UserSelf = ({ message }) => {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes marquee {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }

          .animate-marquee {
            animation: marquee 5s linear infinite;
          }
        `}
      </style>
      <div className="fixed top-20 left-0 right-0 text-center">
        <div
          className={`mx-auto w-96 ${
            showAlert ? "block" : "hidden"
          } animate-marquee`}
        >
          <Alert
            variant="filled"
            severity="success"
            sx={{ backgroundColor: "#50C878" }}
          >
            {message}
          </Alert>
        </div>
      </div>
    </>
  );
};

export default UserSelf;
