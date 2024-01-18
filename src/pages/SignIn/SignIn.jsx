import { Email, Key } from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import UserProfile from "../../hooks/UserData/useUser";
import useSignup from "../../hooks/useLoginForm";

const SignIn = () => {
  const { setEmail, setPassword, email, password } = useSignup();
  const { handleAlert } = useContext(TestContext);
  // const { setCookie } = useContext(UseContext);
  const redirect = useNavigate();

  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const navigate = useNavigate("");

  useEffect(() => {
    if (user?._id) {
      navigate(-1);
    }
    // eslint-disable-next-line
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      // console.log(`${process.env.REACT_APP_API}/route/employee/login`);
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/login`,
        {
          email,
          password,
        }
      );
      // Changing Cookie
      Cookies.set("aeigs", response.data.token);
      handleAlert(
        true,
        "success",
        `Welcome ${response.data.user.first_name} you are logged in successfully`
      );

      if (response.data.user.profile.includes("Super-Admin")) {
        redirect("/");
      } else if (response.data.user.profile.includes("Hr")) {
        redirect("/organisation/dashboard/HR-dashboard");
      } else if (response.data.user.profile.includes("Manager")) {
        redirect("/organisation/dashboard/manager-dashboard");
      } else if (response.data.user.profile.length === 1) {
        redirect("/organisation/dashboard/employee-dashboard");
      } else {
        redirect("/");
      }

      window.location.reload();
    } catch (error) {
      console.error("API error:", error.response);
      handleAlert(
        true,
        "error",
        error?.response?.data?.message || "Failed to sign in. Please try again."
      );
    }
  };

  return (
    <>
      <section className="md:min-h-screen  flex w-full">
        <div className="!w-[30%]  lg:flex hidden text-white flex-col items-center justify-center md:h-screen relative">
          <div className="bg__gradient  absolute inset-0 "></div>
          <ul class="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
          <div className="space-y-2 mb-8 flex-col flex items-center justify-center">
            {/* <img
              src="login.svg"
              alt="none"
              className="absolute z-50 !h-[350px]"
            /> */}
          </div>
        </div>

        <article className="md:w-[70%]  !bg-white w-full flex   items-center md:items-start flex-col justify-center">
          <div className="md:flex hidden w-full md:py-2 md:px-8 my-2 gap-4 items-center justify-center lg:justify-end">
            <p>Don't have an account ?</p>
            <Link to="/sign-up">
              <button className="py-[.22rem] text-sm uppercase  font-semibold rounded-sm px-6 border-[.5px] border-black hover:bg-black hover:text-white transition-all">
                Create Account
              </button>
            </Link>
          </div>

          <form
            onSubmit={onSubmit}
            autoComplete="off"
            className="flex  md:px-20   w-max  justify-center flex-col  md:h-[80vh]"
          >
            {/* <div className="flex items-center flex-col space-y-2">
              <img
                src="aeigs-log-final.svg"
                alt="none"
                className="text-center !h-[60px]"
              />
              <div>
                <h1 className=" font-[600] text-4xl">Log into AEGIS Account</h1>
                <p className="text-lg">Enter your login credentials below</p>
              </div>
            </div> */}

            <div className="flex space-x-4 md:items-start items-center">
              <img src="/logo.svg" className="h-[45px]" alt="logo" />
              <div className="flex flex-col space-y-1">
                {/* <div className="mb-4"> */}
                <h1 className="font-[600] text-3xl">Log into AEGIS Account</h1>
                <p className="text-lg">Enter your login credentials below</p>
                {/* </div> */}
              </div>
            </div>

            <div className="my-6 space-y-2 ">
              <label
                htmlFor={email}
                className={" font-semibold text-gray-500 text-md"}
              >
                Email Address
              </label>
              <div
                className={
                  "  flex  rounded-md px-2 border-gray-200 border-[.5px] bg-white py-[6px]"
                }
              >
                <Email className="text-gray-700" />
                <input
                  name="email"
                  autoComplete="off"
                  id="email"
                  placeholder="abc@gmail.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  className={" border-none  bg-white w-full outline-none px-2"}
                />
              </div>

              <div className="space-y-1 !mt-5 w-full ">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={password}
                    className={" font-semibold text-gray-500 text-md"}
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="font-medium transition-all hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <div
                  className={
                    "  flex rounded-md px-2 border-gray-200 border-[.5px] bg-white py-[6px]"
                  }
                >
                  <Key className="text-gray-700" />
                  <input
                    name="password"
                    autoComplete="off"
                    id="password"
                    type="password"
                    placeholder="*****"
                    label="Password"
                    onChange={(event) => setPassword(event.target.value)}
                    className={" border-none bg-white w-full outline-none px-2"}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-5 mt-2">
              <button
                type="submit"
                className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
              >
                Log in
              </button>
            </div>

            <p className="flex md:hidden gap-2 my-2">
              Aleady have an account?
              <Link
                to={
                  window.location.pathname === "/sign-up"
                    ? "/sign-in"
                    : "/sign-up"
                }
                className="hover:underline"
              >
                sign in
              </Link>
            </p>
          </form>
        </article>
      </section>
    </>
  );
};

export default SignIn;
