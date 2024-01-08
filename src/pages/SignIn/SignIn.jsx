import { Email, Key } from "@mui/icons-material";
import axios from "axios";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import useSignup from "../../hooks/useLoginForm";

const SignIn = () => {
  const { setEmail, setPassword, email, password } = useSignup();
  const { handleAlert } = useContext(TestContext);
  const { setCookie } = useContext(UseContext);
  const redirect = useNavigate();

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
      setCookie("aeigs", response.data.token);
      handleAlert(
        true,
        "success",
        `Welcome ${response.data.user.first_name} you are logged in successfully`
      );

      if (response.data.user.profile.length === 1) {
        redirect("/organisation/employee-dashboard");
      } else if (response.data.user.profile.includes("Hr")) {
        redirect("/organisation/HR-dashboard");
      } else if (response.data.user.profile.includes("Manager")) {
        redirect("/organisation/manager-dashboard");
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
      <section className="min-h-screen flex w-full">
        <div className="!w-[30%]  lg:flex hidden text-white flex-col items-center justify-center h-screen relative">
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

        <article className="lg:w-[70%] !bg-white w-full md:block flex items-center flex-col justify-center">
          <div className="flex w-full py-4 px-8 my-2 gap-4 items-center justify-center lg:justify-end">
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
            className="flex px-20 w-max justify-center flex-col  h-[80vh]"
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

            <div className="flex flex-col space-y-1">
              <div className="mb-4">
                <h1 className="font-[600] text-3xl">Log into AEGIS Account</h1>
                <p className="text-lg">Enter your login credentials below</p>
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

              {/* <label
                htmlFor="email"
                className="font-semibold text-gray-700 text-lg"
              >
                Email Address
              </label> */}
              {/* <div className="flex rounded-2xl px-2 border-gray-200  border-[.5px] bg-neutral-200  py-[6px]">
                <Email className="text-gray-700" />
                <input
                  name="email"
                  autoComplete="off"
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  className="border-none border-[.5px] bg-neutral-200   w-full outline-none px-2"
                />
              </div> */}

              {/* <div className="mt-2 space-y-2 ">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="email"
                    className="font-semibold  text-gray-700 text-lg"
                  >
                    Password
                  </label>
                </div>
                <div className="flex rounded-2xl px-2 border-gray-200  border-[.5px] bg-neutral-200 py-[6px]">
                  <Key className="text-gray-700" />
                  <input
                    type="password"
                    label="Password"
                    name="password"
                    id="password"
                    onChange={(event) => setPassword(event.target.value)}
                    className="border-none bg-neutral-200  outline-none px-2 w-full"
                  />
                </div>
              </div> */}
            </div>

            <div className="flex gap-5 mt-2">
              <button
                type="submit"
                className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
              >
                Log in
              </button>
            </div>
          </form>
        </article>
      </section>
    </>
  );
};

export default SignIn;
