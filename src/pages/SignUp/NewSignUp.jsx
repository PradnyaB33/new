import { Email } from "@mui/icons-material";
import BadgeIcon from "@mui/icons-material/Badge";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import LockIcon from "@mui/icons-material/Lock";
import NoEncryptionIcon from "@mui/icons-material/NoEncryption";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import { Button } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import TermsCondition from "../../components/termscondition/termsCondition";
import useSignupFormStore from "../../hooks/useSignUpForm";
const SignIn = () => {
  const { handleAlert } = useContext(TestContext);
  const router = useNavigate();
  const location = useLocation();

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    firstNameError,
    setFirstNameError,
    lastNameError,
    setLastNameError,
    emailError,
    setEmailError,
  } = useSignupFormStore();

  const [middleName, setMiddleName] = useState("");
  const [middleNameError, setMiddleNameError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handlePasswordChange = (enteredPassword) => {
    setPassword(enteredPassword);
    if (!enteredPassword) {
      setPasswordError("Password is required");
    } else if (!enteredPassword.match(passwordRegex)) {
      setPasswordError(
        "Password must contain at least one number, one special character, and be at least 8 characters long"
      );
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (enteredConfirmPassword) => {
    setConfirmPassword(enteredConfirmPassword);
    if (!enteredConfirmPassword) {
      setConfirmPasswordError("Confirm Password is required");
    } else if (enteredConfirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const validDomain =
      email.endsWith(".com") || email.endsWith(".net") || email.endsWith(".in");
    return emailRegex.test(email) && validDomain && email.includes("@");
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const user = {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      email,
      password,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/create`,
        user
      );
      handleAlert(true, "success", response.data.message);
      // Redirect to a waiting page after successful signup
      // router("/waiting");
      // Refresh the page after signup
      window.location.reload();
    } catch (error) {
      handleAlert(
        true,
        "error",
        error.response.data.message || "Failed to sign up. Please try again."
      );
    }
  };

  return (
    <>
      <section className="min-h-screen flex w-full">
        {/* Left Section */}
        <div className="w-[30%] lg:flex hidden text-white flex-col items-center justify-center h-screen relative">
          <div className="bg__gradient absolute inset-0"></div>
          <ul className="circles">
            {[...Array(10)].map((_, index) => (
              <li key={index}></li>
            ))}
          </ul>
          <div className="space-y-2 mb-8 flex-col flex items-center justify-center">
            <img
              src="login.svg"
              alt="none"
              className="absolute z-50 !h-[350px]"
            />
          </div>
        </div>

        {/* Right Section */}
        <article className="lg:w-[70%] !bg-white w-full md:block flex items-center flex-col justify-center">
          <div className="flex w-full py-4 px-8  gap-4 items-center justify-center lg:justify-end">
            <p>
              {location.pathname === "/sign-up"
                ? "Already have an account?"
                : "Don't have an account?"}
            </p>
            <Link
              to={location.pathname === "/sign-up" ? "/sign-in" : "/sign-up"}
            >
              <button className="py-[.22rem] text-sm uppercase font-semibold rounded-sm px-6 border-[.5px] border-black hover:bg-black hover:text-white transition-all">
                {location.pathname === "/sign-up"
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </Link>
          </div>

          {/* Signup Form */}
          <form
            onSubmit={handleSignup}
            autoComplete="off"
            className="flex px-20 w-max justify-center flex-col h-[80vh]"
          >
            {/* Logo and Title */}
            <div className="flex flex-col space-y-1">
              <img
                src="aeigs-log-final.svg"
                alt="none"
                className="text-center !h-[60px]"
              />
              <div>
                <h1 className="font-[600] text-4xl">
                  Register for AEGIS Account
                </h1>
                <p className="text-lg">Enter your credentials below</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-2 mt-4 w-[30vw]">
              {/* First Name */}
              <div className="">
                <label
                  htmlFor="email"
                  className="font-semibold text-gray-700 text-lg"
                >
                  First Name
                </label>

                <div className="flex rounded-2xl px-2 border-gray-200  border-[.5px] bg-neutral-200  py-[6px]">
                  <PermContactCalendarIcon className="text-gray-700" />
                  <input
                    type="text"
                    label="First Name"
                    className="border-none border-[.5px] bg-neutral-200   w-full outline-none px-2 "
                    name="firstName"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => {
                      const enteredFirstName = e.target.value;
                      setFirstName(enteredFirstName);
                      if (!enteredFirstName.trim()) {
                        setFirstNameError("First Name is required");
                      } else if (
                        enteredFirstName.length < 2 ||
                        enteredFirstName.length > 30 ||
                        /[^a-zA-Z]/.test(enteredFirstName)
                      ) {
                        setFirstNameError(
                          "First Name must be between 2 and 30 characters and should only contain letters."
                        );
                      } else {
                        setFirstNameError("");
                      }
                    }}
                    required
                    fullWidth
                    margin="normal"
                    error={!!firstNameError}
                    helperText={firstNameError}
                  />
                </div>
              </div>

              {/* Middle Name */}
              <div className="">
                <label
                  htmlFor="email"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Middle Name
                </label>

                <div className="flex rounded-2xl px-2 border-gray-200  border-[.5px] bg-neutral-200  py-[6px]">
                  <BadgeIcon className="text-gray-700" />
                  <input
                    size="small"
                    type="text"
                    label="Middle Name"
                    className="border-none border-[.5px] bg-neutral-200   w-full outline-none px-2"
                    variant="standard"
                    name="middleName"
                    id="middleName"
                    required
                    value={middleName}
                    onChange={(e) => {
                      const enteredMiddleName = e.target.value;
                      setMiddleName(enteredMiddleName);

                      if (enteredMiddleName.trim() === "") {
                        setMiddleNameError("");
                      } else if (/[^a-zA-Z]/.test(enteredMiddleName)) {
                        setMiddleNameError(
                          "Middle Name should only contain letters."
                        );
                      } else {
                        setMiddleNameError("");
                      }
                    }}
                    fullWidth
                    margin="normal"
                    error={!!middleNameError}
                    helperText={middleNameError}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className=" ">
                <label
                  htmlFor="email"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Last Name
                </label>

                <div className="flex rounded-2xl px-2 border-gray-200  border-[.5px] bg-neutral-200  py-[6px]">
                  <DriveFileRenameOutlineIcon className="text-gray-700" />
                  <input
                    size="small"
                    type="text"
                    label="Last Name"
                    className="border-none border-[.5px] bg-neutral-200   w-full outline-none px-2"
                    variant="standard"
                    name="lastName"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => {
                      const enteredLastName = e.target.value;
                      setLastName(enteredLastName);
                      if (!enteredLastName.trim()) {
                        setLastNameError("Last Name is required");
                      } else if (
                        enteredLastName.length < 2 ||
                        enteredLastName.length > 30 ||
                        /[^a-zA-Z]/.test(enteredLastName)
                      ) {
                        setLastNameError(
                          "Last Name must be between 2 and 30 characters and should only contain letters."
                        );
                      } else {
                        setLastNameError("");
                      }
                    }}
                    error={!!lastNameError}
                    helperText={lastNameError}
                    required
                    fullWidth
                    margin="normal"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="">
                <label
                  htmlFor="email"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Email Address
                </label>

                <div className="flex rounded-2xl px-2 border-gray-200  border-[.5px] bg-neutral-200 py-[6px] ">
                  <Email className="text-gray-700" />
                  <input
                    size="small"
                    type="email"
                    label="Email"
                    variant="standard"
                    className="border-none border-[.5px] bg-neutral-200   w-full outline-none px-2"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      const enteredEmail = e.target.value;
                      setEmail(enteredEmail);
                      if (!enteredEmail.trim()) {
                        setEmailError("Email is required");
                      } else if (!isValidEmail(enteredEmail)) {
                        setEmailError("Invalid Email Format");
                      } else {
                        setEmailError("");
                      }
                    }}
                    required
                    fullWidth
                    margin="normal"
                    error={!!emailError}
                    helperText={emailError}
                  />
                </div>
              </div>
              {/* Password */}
              <div className="">
                <label
                  htmlFor="email"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Password
                </label>

                <div className="flex rounded-2xl px-2 border-gray-200  border-[.5px] bg-neutral-200  py-[6px]">
                  <LockIcon className="text-gray-700" />
                  <input
                    size="small"
                    type="password"
                    label="Password"
                    variant="standard"
                    className="border-none border-[.5px] bg-neutral-200   w-full outline-none px-2"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                    error={!!passwordError}
                    helperText={passwordError}
                    InputProps={{
                      inputProps: {
                        pattern: passwordRegex.source,
                      },
                    }}
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="">
                <label
                  htmlFor="email"
                  className="font-semibold text-gray-700 text-lg"
                >
                  Confirm Password
                </label>

                <div className="flex rounded-2xl px-2 border-gray-200  border-[.5px] bg-neutral-200  py-[6px]">
                  <NoEncryptionIcon className="text-gray-700" />
                  <input
                    size="small"
                    type="password"
                    label="Confirm Password"
                    className="border-none border-[.5px] bg-neutral-200   w-full outline-none px-2"
                    name="confirmPassword"
                    id="confirmPassword"
                    variant="standard"
                    value={confirmPassword}
                    onChange={(e) =>
                      handleConfirmPasswordChange(e.target.value)
                    }
                    required
                    fullWidth
                    margin="normal"
                    error={!!confirmPasswordError}
                    helperText={confirmPasswordError}
                  />
                </div>
              </div>
            </div>
            <div>
              <TermsCondition />
            </div>

            {/* Signup Button */}
            <div className="flex gap-5 mt-2">
              <Button
                style={{ borderRadius: "1rem" }}
                fullWidth
                size="medium"
                type="submit"
                variant="contained"
                className="rounded- bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
              >
                Sign Up
              </Button>

              {/* Sign In Link */}
            </div>
          </form>
        </article>
      </section>
    </>
  );
};

export default SignIn;
