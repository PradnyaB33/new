import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import { default as React, useContext, useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import aegislogo from "../../assets/logoAegis.jpeg"; // Adjust import according to your structure
import UserProfile from "../../hooks/UserData/useUser";
import useSignup from "../../hooks/useLoginForm";

const LoginPage = () => {
  const { setEmail, setPassword, email, password } = useSignup();
  const { handleAlert } = useContext(TestContext);
  // navigate
  const redirect = useNavigate();

  // to get current user information and user role
  const { getCurrentUser, useGetCurrentRole } = UserProfile();
  const user = getCurrentUser();
  const role = useGetCurrentRole();
  console.log(user, role);

  useEffect(() => {
    if (user?._id) {
      if (role === "Super-Admin" || role === "Delegate-Super-Admin")
        return redirect("/");
      else if (role === "HR")
        return redirect(
          `/organisation/${user?.organizationId}/dashboard/HR-dashboard`
        );
      else if (
        role === "Delegate-Department-Head" ||
        role === "Department-Head"
      )
        return redirect(
          `/organisation/${user?.organizationId}/dashboard/DH-dashboard`
        );
      else if (role === "Accountant")
        return redirect(
          `/organisation/${user?.organizationId}/dashboard/employee-dashboard`
        );
      else if (role === "Manager")
        return redirect(
          `/organisation/${user?._id}/dashboard/manager-dashboard`
        );
      else if (role === "Employee")
        return redirect(
          `/organisation/${user?.organizationId}/dashboard/employee-dashboard`
        );
    }
    // eslint-disable-next-line
  }, [role, window.location.pathname]);

  // to define the funciton for handle role
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
        // Cookies.set("role", response?.data?.roleToken);

        Cookies.set("role", response.data.roleToken, {
          expires: 4 / 24,
        });
        window.location.reload();
      },
    }
  );

  // to define the fuction for logged in
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
        Cookies.set("aegis", response.data.token, { expires: 4 / 24 });
        handleAlert(
          true,
          "success",
          `Welcome ${response.data.user.first_name} you are logged in successfully`
        );

        if (response.data.user?.profile?.includes("Super-Admin")) {
          handleRole.mutate({
            role: "Super-Admin",
            email: response.data.user?.email,
          });
          return redirect("/");
        } else if (
          response.data.user?.profile?.includes("Delegate-Super-Admin")
        ) {
          handleRole.mutate({
            role: "Delegate-Super-Admin",
            email: response.data.user?.email,
          });
          return redirect("/");
        } else if (response.data.user?.profile?.includes("HR")) {
          handleRole.mutate({
            role: "HR",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/HR-dashboard`
          );
        } else if (response?.data?.user?.profile?.includes("Manager")) {
          handleRole.mutate({
            role: "Manager",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/manager-dashboard`
          );
        } else if (response.data.user?.profile?.includes("Department-Head")) {
          handleRole.mutate({
            role: "Department-Head",
            email: response?.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data.user?.organizationId}/dashboard/DH-dashboard`
          );
        } else if (
          response?.data.user?.profile?.includes("Delegate-Department-Head")
        ) {
          handleRole.mutate({
            role: "Delegate-Department-Head",
            email: response?.data?.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/DH-dashboard`
          );
        } else if (response.data.user?.profile?.includes("Department-Admin")) {
          handleRole.mutate({
            role: "Department-Admin",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/employee-dashboard`
          );
        } else if (response.data.user?.profile?.includes("Accountant")) {
          handleRole.mutate({
            role: "Accountant",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/employee-dashboard`
          );
        } else if (
          response.data.user?.profile?.includes("Delegate-Accountant")
        ) {
          handleRole.mutate({
            role: "Delegate-Accountant",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/employee-dashboard`
          );
        } else if (response.data.user?.profile?.includes("Employee")) {
          handleRole.mutate({
            role: "Employee",
            email: response.data.user?.email,
          });
          return redirect(
            `/organisation/${response?.data?.user?.organizationId}/dashboard/employee-dashboard`
          );
        }
        window.location.reload();
      },

      onError: (error) => {
        console.error(error);

        handleAlert(
          true,
          error?.response.status !== 401 ? "success" : "error",
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
    // Check if email is in lowercase
    if (email !== email.toLowerCase()) {
      handleAlert(true, "warning", "Email must be in lowercase");
      return false;
    }
    const data = { email, password };
    handleLogin.mutate(data);
  };

  const [focusedInput, setFocusedInput] = React.useState(null);
  const [visible, setVisible] = useState(false);
  const handleFocus = (fieldName) => {
    setFocusedInput(fieldName);
  };

  // Create Axios instance
  const api = axios.create({
    baseURL: `${process.env.REACT_APP_API}/route`,
  });

  const navigate = useNavigate(); // Hook can be used in a functional component

  // Function to authenticate with Google and get user details
  const googleAuth = async (code) => {
    try {
      const response = await api.get(`/employee/google?code=${code}`);
      return response.data;
    } catch (err) {
      console.error("Error during Google authentication request", err);
      throw err;
    }
  };

  const handleGoogleResponse = async (authResult) => {
    try {
      if (authResult.code) {
        const result = await googleAuth(authResult.code);
        const { email, token, user } = result;

        localStorage.setItem(
          "user-info",
          JSON.stringify({ email, token, user })
        );
        Cookies.set("aegis", token, { expires: 4 / 24 });
        // const profile = user?.profile;
        // console.log("profile==", profile);
        // console.log("email==", result?.user?.email);
        // console.log("token==", token);

        handleAlert(
          true,
          "success",
          `Welcome ${user.first_name}, you are logged in successfully`
        );

        if (user.profile.includes("Super-Admin")) {
          handleRole.mutate({
            role: "Super-Admin",
            email: result.user?.email,
          });
          return navigate("/");
        } else if (user.profile.includes("Delegate-Super-Admin")) {
          handleRole.mutate({
            role: "Delegate-Super-Admin",
            email: result.user?.email,
          });
          return navigate("/");
        } else if (user.profile.includes("HR")) {
          handleRole.mutate({ role: "HR", email: result.user?.email });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/HR-dashboard`
          );
        } else if (user.profile.includes("Manager")) {
          handleRole.mutate({ role: "Manager", email: result.user?.email });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/manager-dashboard`
          );
        } else if (user.profile.includes("Department-Head")) {
          handleRole.mutate({
            role: "Department-Head",
            email: result.user?.email,
          });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/DH-dashboard`
          );
        } else if (user.profile.includes("Delegate-Department-Head")) {
          handleRole.mutate({
            role: "Delegate-Department-Head",
            email: result.user?.email,
          });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/DH-dashboard`
          );
        } else if (user.profile.includes("Department-Admin")) {
          handleRole.mutate({
            role: "Department-Admin",
            email: result.user?.email,
          });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/employee-dashboard`
          );
        } else if (user.profile.includes("Accountant")) {
          handleRole.mutate({
            role: "Accountant",
            email: result.user?.email,
          });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/employee-dashboard`
          );
        } else if (user.profile.includes("Delegate-Accountant")) {
          handleRole.mutate({
            role: "Delegate-Accountant",
            email: result.user?.email,
          });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/employee-dashboard`
          );
        } else if (user.profile.includes("Employee")) {
          handleRole.mutate({
            role: "Employee",
            email: result.user?.email,
          });
          return navigate(
            `/organisation/${user.organizationId}/dashboard/employee-dashboard`
          );
        }

        window.location.reload();
      }
    } catch (err) {
      console.error("Error while processing authentication result", err);
      handleAlert(
        true,
        "error",
        "Failed to sign in. check user has intermidate plan or valid email address"
      );
    }
  };

  // Google login configuration
  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleResponse,
    onFailure: (error) => {
      console.error("Google login failed", error);
    },
    flow: "auth-code",
  });
  return (
    <section>
      <header className="p-4">
        <img
          src={aegislogo}
          alt="logo"
          className="h-[50px]  object-cover  mix-blend-multiply"
        />
      </header>
      <main className="h-[70vh] flex items-center justify-center">
        <aside>
          <form
            onSubmit={onSubmit}
            autoComplete="off"
            className="flex  lg:px-20  sm:w-max w-[90%]  justify-center flex-col  lg:h-[80vh]"
          >
            <div>
              <h1 className="font-bold leading-none text-3xl">
                Welcome Back,{" "}
              </h1>
              <h1 className="font-bold leading-none text-3xl">
                Login to your account
              </h1>
            </div>
            <div className="mt-6 sm:w-[400px] w-full space-y-2 ">
              <label
                htmlFor={email}
                className={" font-semibold text-gray-500 text-md"}
              >
                Email Address
              </label>
              <div
                className={`
                flex  rounded-md px-2  bg-white py-[6px]
                ${
                  focusedInput === "email"
                    ? "outline-blue-500 outline-3 !border-blue-500 border-[2px]"
                    : "border-gray-200 border-[.5px]"
                }`}
              >
                <Email className="text-gray-700" />
                <input
                  name="email"
                  autoComplete="off"
                  id="email"
                  placeholder="abc@gmail.com"
                  onFocus={() => {
                    handleFocus("email");
                  }}
                  onBlur={() => setFocusedInput(null)}
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value.toLowerCase())
                  }
                  type="email"
                  className={` 
                  border-none  bg-white w-full outline-none px-2`}
                />
              </div>

              <div className="space-y-1 !mt-5 w-full ">
                <label
                  htmlFor={password}
                  className={" font-semibold text-gray-500 text-md"}
                >
                  Password
                </label>

                <div
                  className={`
                flex  rounded-md px-2 sm:w-[400px] w-full  bg-white py-[6px]
                ${
                  focusedInput === "password"
                    ? "outline-blue-500 outline-3 !border-blue-500 border-[2px]"
                    : "border-gray-200 border-[.5px]"
                }`}
                >
                  <Lock className="text-gray-700" />
                  <input
                    name="password"
                    autoComplete="off"
                    id="password"
                    onFocus={() => {
                      handleFocus("password");
                    }}
                    onBlur={() => setFocusedInput(null)}
                    type={visible ? "text" : "password"}
                    placeholder="*****"
                    label="Password"
                    onChange={(event) => setPassword(event.target.value)}
                    className={` 
                 
                    border-none bg-white w-full outline-none px-2`}
                  />

                  <button
                    type="button"
                    onClick={() => setVisible(visible === true ? false : true)}
                  >
                    {visible ? (
                      <VisibilityOff className="text-gray-700" />
                    ) : (
                      <Visibility className="text-gray-700" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="text-gray-700 my-2">
              <Link
                to="/forgot-password"
                className="font-medium text-blue-500 hover:underline  transition-all "
              >
                Forgot password?
              </Link>
            </div>
            <div className="flex gap-5">
              <button
                type="submit"
                className={` flex group justify-center w-full gap-2 items-center rounded-md h-[30px] px-4 py-4 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500`}
              >
                {handleLogin.isLoading ? (
                  <>
                    <CircularProgress CircularProgress size={20} /> Log in
                  </>
                ) : (
                  "Log in"
                )}
              </button>
              <button
                className={` flex group justify-center w-full gap-2 items-center rounded-md h-[30px] px-4 py-4 text-md font-semibold text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white focus-visible:outline-blue-500`}
              >
                SIGN UP
              </button>
            </div>

            <span className="bg-gray-300 my-4 h-[1px] w-full" />
            <button
              type="button"
              onClick={googleLogin}
              className={` flex  group justify-center w-full gap-2 items-center rounded-md h-[30px] px-4 py-4 text-md    border-gray-300 border    `}
            >
              <FcGoogle className="text-2xl" /> Continue with Google
            </button>

            {/* <GoogleButton
              type="dark" // can be light or dark
              onClick={googleLogin}
              style={{
                border: ".3px solid red",
                backgroundColor: "white", // Google blue color
                color: "red",
                fontSize: "16px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "none",
                borderRadius: "20px",
              }}
            ></GoogleButton> */}
          </form>
        </aside>
      </main>
    </section>
  );
};

export default LoginPage;
