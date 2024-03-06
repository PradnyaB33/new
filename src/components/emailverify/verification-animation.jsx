import { Button, Typography } from "@mui/material";
import { useRef } from "react";
import { Link } from "react-router-dom";
import useVerifyUser from "../../hooks/QueryHook/Verification/hook";
import Loader from "../app-loader/page";

const AnimationComponent = () => {
  const svgContainerRef = useRef(null);
  const { data, isLoading } = useVerifyUser();
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className=" flex flex-col items-center gap-6">
      <div className="flex items-center justify-center overflow-hidden bg-[white] p-10">
        <div
          ref={svgContainerRef}
          className="max-w-full max-h-full text-center bg-[white] h-[400px]"
        ></div>
      </div>
      <Typography variant="body1" color="initial">
        Authorized successfully You can{" "}
      </Typography>
      <Link to={"/sign-in"}>
        <Button variant="contained">Login Now</Button>
      </Link>
    </div>
  );
};

export default AnimationComponent;
