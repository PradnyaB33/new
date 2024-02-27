import { Email, Lock } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect } from "react";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import UserProfile from "../../hooks/UserData/useUser";
import useSignup from "../../hooks/useLoginForm";

const SignIn = () => {
  const { setEmail, setPassword, email, password } = useSignup();
  // const [selectRole, setSelectRole] = useState("");
  const { handleAlert } = useContext(TestContext);
  // const { setCookie } = useContext(UseContext);
  const redirect = useNavigate();

  const { getCurrentUser, getCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const role = getCurrentRole();
  useEffect(() => {
    if (user && !role) {
      redirect("/choose-role");
    }
    if (user?._id && role) {
      if (role === "Super-Admin") return redirect("/");
      else if (role === "Hr")
        return redirect(
          `/organisation/${user?.organisationId}/dashboard/HR-dashboard`
        );
      else if (role === "Manager")
        return redirect(
          `/organisation/${user?._id}/dashboard/manager-dashboard`
        );
      else if (role === "Employee")
        return redirect(`/organisation/dashboard/employee-dashboard`);
    }
    // eslint-disable-next-line
  }, []);
  console.log(
    `🚀 ~ file: SignIn.jsx:47 ~ process.env.REACT_APP_API:`,
    process.env.REACT_APP_API
  );
  const handleRole = useMutation(
    (data) => {
      const res = axios.post(
        `${process.env.REACT_APP_API}/route/employee/changerole`,
        data
      );
      return res;
    },
    {
      onSuccess: (response) => {
        Cookies.set("role", response?.data?.roleToken);
        console.log("Token Accepted");
        window.location.reload();
      },
    }
  );

  const handleLogin = useMutation(
    async (data) => {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/login`,
        data
      );

      return res;
    },

    {
      onSuccess: async (response) => {
        Cookies.set("aegis", response.data.token);
        handleAlert(
          true,
          "success",
          `Welcome ${response.data.user.first_name} you are logged in successfully`
        );

        // redirect("/choose-role");

        if (response.data.user?.profile?.includes("Super-Admin")) {
          handleRole.mutate({
            role: "Super-Admin",
            email: response.data.user?.email,
          });
          return redirect("/");
        } else if (response.data.user?.profile.includes("Hr")) {
          handleRole.mutate({ role: "Hr", email: response.data.user?.email });
          return redirect(
            `/organisation/${user?.organisationId}/dashboard/HR-dashboard`
          );
        } else if (response.data.user?.profile.includes("Manager")) {
          handleRole.mutate({
            role: "Manager",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${user?._id}/dashboard/manager-dashboard`
          );
        } else if (response.data.user?.profile.includes("Employee")) {
          handleRole.mutate({
            role: "Employee",
            email: response.data.user?.email,
          });
          return redirect(`/organisation/dashboard/employee-dashboard`);
        }
      },

      onError: (error) => {
        console.error(error);

        handleAlert(
          true,
          "error",
          error?.response?.data?.message ||
            "Failed to sign in. Please try again."
        );
      },
    }
  );

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      handleAlert(true, "warning", "All fields are manadatory");
      return false;
    }
    const data = { email, password };
    handleLogin.mutate(data);
  };

  return (
    <>
      <section className="lg:min-h-screen  flex w-full">
        <div className="!w-[40%]  md:justify-start lg:flex hidden text-white flex-col items-center justify-center lg:h-screen relative">
          <div className="bg__gradient  absolute inset-0 "></div>
          <ul className="circles">
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
          <div className="space-y-2 mb-8 flex-col flex items-center justify-center"></div>
        </div>

        <article className="lg:w-[60%] h-screen  !bg-white w-full flex lg:justify-start justify-center  items-center lg:items-start flex-col ">
          {/* <div className="lg:flex hidden w-full  lg:py-2 lg:px-8 my-2 gap-4 items-center justify-center lg:justify-end">
            <p>Don't have an account ?</p>
            <Link to="/sign-up">
              <button className="py-[.22rem] text-sm uppercase  font-semibold rounded-sm px-6 border-[.5px] border-black hover:bg-black hover:text-white transition-all">
                Create Account
              </button>
            </Link>
          </div> */}

          <form
            onSubmit={onSubmit}
            autoComplete="off"
            className="flex  lg:px-20   w-max  justify-center flex-col  lg:h-[80vh]"
          >
            <div className="flex flex-col space-x-4 lg:items-start items-center">
              <div className="flex flex-col gap-1  w-full items-center justify-center space-y-1">
                {/* <div className="mb-4"> */}
                <img src="/logo.svg" className="h-[45px]" alt="logo" />
                <h1 className="font-[600] text-center w-full text-3xl">
                  Log in to AEGIS
                </h1>
                {/* <p className="text-lg">Enter your login credentials below</p> */}
                {/* </div> */}
              </div>
            </div>

            <div className="mt-6 w-[400px] space-y-2 ">
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
                </div>

                <div
                  className={
                    "  flex rounded-md px-2 border-gray-200 border-[.5px] bg-white py-[6px]"
                  }
                >
                  <Lock className="text-gray-700" />
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

            <div className="flex gap-5 mt-4">
              <button
                type="submit"
                disabled={handleLogin.isLoading}
                className={`${
                  handleLogin.isLoading && "!bg-gray-200 shadow-lg"
                } flex group justify-center w-full gap-2 items-center rounded-md h-[30px] px-4 py-3 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500`}
              >
                {handleLogin.isLoading ? (
                  <>
                    <CircularProgress CircularProgress size={20} /> Log in
                  </>
                ) : (
                  "Log in"
                )}
              </button>
            </div>

            <div className="flex items-center justify-center  gap-2 my-2">
              <Link
                to="/forgot-password"
                className="font-medium hover:font-bold transition-all "
              >
                Forgot password?
              </Link>

              <Link
                to={
                  window.location.pathname === "/sign-up"
                    ? "/sign-in"
                    : "/sign-up"
                }
                className="font-medium text-blue-500 hover:font-bold transition-all "
              >
                Sign up for AEGIS
              </Link>
            </div>
          </form>
        </article>
      </section>
    </>
  );
};

export default SignIn;
