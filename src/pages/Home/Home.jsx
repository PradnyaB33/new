import { Skeleton } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import "react-multi-carousel/lib/styles.css";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
const Home = () => {
  const redirect = useNavigate();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { handleAlert } = useContext(TestContext);

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
  const { data, isLoading } = useQuery(["orgData"], getOrgList);

  // const [userRole, setUserRole] = useState();

  // useEffect(() => {
  //   try {
  //     if (authToken) {
  //       const decodedToken = jwtDecode(authToken);
  //       if (decodedToken && decodedToken.user) {
  //         setUserRole(decodedToken.user);
  //       } else {
  //         setUserRole("guest");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Failed to decode the authToken:", error);
  //   }
  //   // eslint-disable-next-line
  // }, [authToken]);

  useEffect(() => {
    if (!authToken) {
      // Redirect to the login page
      redirect("/sign-in");
      handleAlert(true, "warning", "Please login first.");
    }
    // eslint-disable-next-line
  }, [redirect, cookies, handleAlert, authToken]);

  return (
    <div className="p-8 bg-white h-screen">
      <div className="w-full  ">
        <>
          <div className="flex items-center h-[70vh] justify-center w-full">
            <div className="md:w-[50%] w-[100%]  md:px-8  xs:px-2 flex justify-end items-end  flex-col">
              <div>
                <h1 className="md:text-[2.30rem] xs:text-[1.5rem] font-thin">
                  Welcome to{" "}
                  <span className="md:text-[2.30rem] xs:text-[1.5rem]  gradinet font-semibold text-blue-500 ">
                    AEGIS
                  </span>{" "}
                  {/* <span className="font-bold">{userRole?.first_name}</span> */}
                </h1>
                <h1 className="md:text-[2.40rem]  xs:text-[1.40rem] sm:text-[1.70rem] !leading-10 sm:text-2xl font-bold  mb-4">
                  Unleashing
                  <span className="gradinet font-bold">
                    {" "}
                    Organizational Excellence
                  </span>
                </h1>

                <p className="md:text-xl xs:text-md mb-8 text-gray-600 md:leading-10 xs:leading-5 ">
                  Empower your journey by making us your first choice. Elevate
                  your experience with the{" "}
                  <span className="!text-bold gradinet">AEGIS</span>, Lets start
                </p>

                {isLoading ? (
                  <Skeleton
                    variant="rounded"
                    height={50}
                    className="w-[35%]"
                    animation="pulse"
                  />
                ) : data?.organizations?.length <= 0 ? (
                  <Link to={"/add-organisation"}>
                    <button className=" flex group justify-center  gap-2 items-center rounded-md px-4 py-3 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500">
                      Create your organization{" "}
                      <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
                    </button>
                  </Link>
                ) : (
                  <Link to={"/organizationList"}>
                    <button className=" flex  group justify-center gap-2 items-center rounded-md px-6 py-3 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500">
                      Go to Organization{" "}
                      <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
                    </button>
                  </Link>
                )}
              </div>
            </div>

            <div className="w-[50%] md:block hidden">
              <img src="community.gif" className="h-[100%]" alt="none" />
            </div>
          </div>
        </>
      </div>

      {/* <Org /> */}
    </div>
  );
};

export default Home;
