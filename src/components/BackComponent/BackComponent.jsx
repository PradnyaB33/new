import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BackComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    navigate(-1);
  };

  const backFalseRoutes = [
    "/sign-in",
    "/sign-up",
    "setup",
    "super-admin",
    "/manager-dashboard",
    "employee-dashboard",
    "HR-dashboard",
    // "/organizationList",
    // "/organisation/employee-dashboard",
    // "/organisation",
  ];

  if (backFalseRoutes.some((value) => location.pathname.includes(value))) {
    return <></>;
  }

  return (
    <div className=" mb-5 fixed w-full cursor-pointer top-[72px] left-[-10px] z-[1000]">
      <div
        style={{ border: "1px solid black", borderRadius: "50%" }}
        onClick={goBack}
        className="mx-5 w-[50px] h-[50px] flex items-center justify-center bg-white"
      >
        <ArrowBackIcon />
      </div>
    </div>
  );
};

export default BackComponent;
