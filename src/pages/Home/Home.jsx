import axios from "axios";
import React, { useContext } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import "react-multi-carousel/lib/styles.css";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import organization from "../../assets/organization.png"
import { Grid, Typography } from "@mui/material";

const Home = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const getOrgList = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/organization/get`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data;
  };
  const { data } = useQuery("orgDatas", getOrgList);

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={7} sx={{ p: "10% 5%" }}>
          <Typography component="span" sx={{ fontSize: { sm: "2.30rem", xs: "2rem" }, fontWeight: "300" }}>
            Welcome to{" "}<Typography component="span" sx={{ fontSize: { sm: "2.30rem", xs: "1.5rem" }, color: "#1976d2", fontWeight: "600" }}>
              AEGIS
            </Typography>
            <br />
            <Typography component="span" sx={{ fontSize: { sm: "2.30rem", xs: "2rem" }, fontWeight: "600" }}>
              Unleashing{" "}
            </Typography>
            <Typography component="span" sx={{ fontSize: { sm: "2.30rem", xs: "2rem" }, color: "#1976d2", fontWeight: "600" }}>
              Organisational Excellence
            </Typography>
          </Typography>
          <br />
          <Typography component="span" sx={{ fontSize: "1.25rem", lineHeight: "40px" }}>
            Empower your journey by making us your first choice. Elevate your experience with the{" "}
          </Typography>
          <Typography component="span" sx={{ color: "#1976d2", fontWeight: "600", fontSize: "1.25rem" }}>
            AEGIS
          </Typography>
          <Typography component="span" sx={{ fontSize: "1.25rem" }}>
            , Let's start
          </Typography>
          <br /><br />
          {data?.organizations.length <= 0 ? (
            <Link className="!w-max !block" to={"/add-organisation"}>
              <button className="!w-max flex group justify-center gap-2 items-center rounded-md px-4 py-3 text-md font-semibold text-white bg-blue-500 hover:bg-blue-600 focus-visible:outline-blue-500">
                Create Your Organisation{" "}
                <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
              </button>
            </Link>
          ) : (
            <Link to={"/organizationList"} className="!w-max !block">
              <button className="flex group justify-center gap-2 items-center rounded-md p-2 !text-xs md:px-6 md:py-3 md:!text-[1em] font-semibold text-white bg-[#1976d2] hover:bg-blue-500 focus-visible:outline-blue-500">
                Go To Organisation{" "}
                <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
              </button>
            </Link>
          )}
        </Grid>
        <Grid item xs={6} md={5} sx={{ py: "10%", display: { xs: 'none', md: 'block' } }}>
          <img src={organization} className="w-[800px] h-auto" alt="Organization" />
        </Grid>
      </Grid>

      {/* <div className="md:p-8 py-4 px-0 bg-white h-screen">
        <div className="flex items-center h-[70vh] justify-center w-full">
          <div className="xl:!w-max w-full md:px-8 px-0 flex justify-center items-center xl:justify-end xl:items-end  flex-col">
            <div className="w-full  lg:w-max md:px-0 px-2">
              <h1 className="md:text-[2.30rem] w-max xs:text-[1.5rem] font-thin">
                Welcome to{" "}
                <span className="md:text-[2.30rem] xl:text-left text-center w-max xs:text-[1.5rem]   font-semibold text-[#1976d2]">
                  AEGIS
                </span>{" "}
              </h1>
              <h1 className="md:text-[2.40rem] w-max xs:text-[1.40rem] sm:text-[1.70rem] !leading-10 sm:text-2xl font-bold  mb-4">
                Unleashing
                <span className=" font-bold text-[#1976d2]">
                  {" "}
                  Organisational Excellence
                </span>
              </h1>

              <p className="md:text-xl w-[80%] xs:text-md mb-8 text-gray-600 md:leading-10 xs:leading-5 ">
                Empower your journey by making us your first choice. Elevate
                your experience with the{" "}
                <span className="font-bold text-[#1976d2]">AEGIS</span>, Lets start
              </p>
              {data?.organizations.length <= 0 ? (
                <Link className="!w-max !block" to={"/add-organisation"}>
                  <button className="!w-max flex group justify-center  gap-2 items-center rounded-md px-4 py-3 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500">
                    Create Your Organisation{" "}
                    <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
                  </button>
                </Link>
              ) : (
                <Link to={"/organizationList"} className="!w-max !block">
                  <button className=" flex  group justify-center gap-2 items-center rounded-md p-2 !text-xs md:px-6 md:py-3 md:!text-[1em] font-semibold text-white bg-[#1976d2] hover:bg-blue-500 focus-visible:outline-blue-500">
                    Go To Organisation{" "}
                    <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
                  </button>
                </Link>
              )}
            </div>
          </div>

          <div className="xl:block hidden">
            <img src={organization} className="w-[800px] h-auto" alt="none" />
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Home;
