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
    "/terms-and-conditions",
    "choose-role",
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
        style={{ border: "2px solid gray", borderRadius: "20%" }}
        onClick={goBack}
        className="mx-5 w-[37px] h-[37px] flex items-center justify-center bg-white"
      >
        <ArrowBackIcon />
      </div>
    </div>
  );
};

export default BackComponent;
