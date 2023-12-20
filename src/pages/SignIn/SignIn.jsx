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
      console.log(`${process.env.REACT_APP_API}/route/employee/login`);

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
      redirect("/");
      // console.log(`🚀 ~ response:`, response);
      // console.log("API response:", response.data);

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
      {/* Form 1 */}
      {/* <div className="flex items-center justify-center p-8 box-border h-[500px] lg:w-[900px] m-auto">
        <div className="flex w-full h-full rounded-lg shadow-xl border bg-white">
          <form
            onSubmit={onSubmit}
            className="w-full md:w-1/2 p-8 flex flex-col items-center gap-4 justify-center"
          >
            <Typography
              color={"primary"}
              fontWeight={800}
              fontSize={20}
              className="text-2xl my-2"
            >
              Login As Admin
            </Typography>
            <div className="w-full sm:[250px]">
              <TextField
                required
                type="email"
                size="small"
                label="Email"
                name="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <TextField
                required
                size="small"
                type="password"
                label="Password"
                name="password"
                id="password"
                onChange={(event) => setPassword(event.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="m-auto w-fit"
            >
              Sign In
            </Button>
            <div>
              <p>
                <Link
                  to="/forgot-password"
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  forgot password
                </Link>
              </p>
            </div>
          </form>
          <div className="md:w-1/2 md:flex hidden p-8 bg-blue-500 rounded-r-lg items-center flex-col justify-around">
            <div className="flex flex-col items-center justify-center gap-2">
              <img
                src="aeigs-log-final.svg"
                alt="My Img"
                className="w-36 before:bottom-0 h-36 object-cover  rounded-lg p-6 bg-white"
              />
              <h1 className="text-white text-2xl mb-6">AEGIS</h1>
            </div>
            <Link to="/sign-up">
              <Button
                variant="contained"
                fullWidth
                className=" bg-white"
                style={{
                  marginTop: "38px",
                  background: "white",
                  color: "#1976d2",
                }}
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div> */}

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
            <img
              src="login.svg"
              alt="none"
              className="absolute z-50 !h-[350px]"
            />
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
            <div className="flex items-center flex-col space-y-2">
              <img
                src="aeigs-log-final.svg"
                alt="none"
                className="text-center !h-[60px]"
              />
              <div>
                <h1 className=" font-[600] text-4xl">Log into AEGIS Account</h1>
                <p className="text-lg">Enter your login credentials below</p>
              </div>
            </div>

            <div className="my-6 space-y-2">
              <label
                htmlFor="email"
                className="font-semibold text-gray-700 text-lg"
              >
                Email Address
              </label>

              <div className="flex rounded-sm px-2 border-gray-200  border-[.5px] bg-neutral-200  py-2">
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
              </div>

              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="email"
                    className="font-semibold  text-gray-700 text-lg"
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
                <div className="flex rounded-sm px-2 border-gray-200  border-[.5px] bg-neutral-200 py-2">
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
              </div>
            </div>

            <button
              type="submit"
              className=" flex w-max group justify-center gap-2 items-center rounded-md px-6 py-2 text-md  text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
            >
              SIGN IN
            </button>
          </form>
        </article>
      </section>

      {/* Form2  */}
    </>
  );
};

export default SignIn;
