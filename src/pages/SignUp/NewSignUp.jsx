import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
  CheckCircle,
  DriveFileRenameOutlineOutlined,
  Email,
  Fingerprint,
  Lock,
  NoEncryption,
  PermContactCalendar,
  Phone,
} from "@mui/icons-material";
import { SvgIcon } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { z } from "zod";
import { TestContext } from "../../State/Function/Main";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import TermsCondition from "../../components/termscondition/termsCondition";
import UserProfile from "../../hooks/UserData/useUser";

const SignIn = () => {
  const { handleAlert } = useContext(TestContext);
  const location = useLocation();
  const [display, setdisplay] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOTP] = useState("");
  const [time, setTime] = useState(1);
  const [isTimeVisible, setIsTimeVisible] = useState(false);
  const [readOnly, setReadOnly] = useState(false);

  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  const navigate = useNavigate("");

  useEffect(() => {
    if (user?._id) {
      navigate(-1);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let interval;
    if (time > 0) {
      interval = setInterval(() => {
        setTime((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsTimeVisible(false);
    }

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);

    // eslint-disable-next-line
  }, [time, isTimeVisible]);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const SignUpSchema = z
    .object({
      first_name: z
        .string()
        .min(2, { message: "Minimum 2 character " })
        .max(15)
        .regex(/^[a-zA-Z]+$/, { message: "only character allow" }),

      last_name: z
        .string()
        .min(2)
        .max(15)
        .regex(/^[a-zA-Z]+$/),
      phone: z
        .string()
        .min(10, { message: "Phone Number must be 10 digit" })
        .regex(/^[0-9]+$/),
      email: z.string().email(),
      password: z
        .string()
        .min(8)
        .refine((value) => passwordRegex.test(value), {
          message:
            "Password must contain at least one number, one special character, and be at least 8 characters long",
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password does'nt   match",
      path: ["confirmPassword"],
    });

  // Create a type for validation

  const {
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpSchema),
  });

  const number = watch("phone");

  const onSubmit = async (data) => {
    if (!isVerified) {
      handleAlert(true, "error", "Please verify mobile no first");
      return false;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/create`,
        data
      );
      handleAlert(true, "success", response.data.message);
      window.location.reload();
    } catch (error) {
      handleAlert(
        true,
        "error",
        error.response.data.message || "Failed to sign up. Please try again."
      );
    }
  };

  const OtpRequest = useMutation(
    (data) =>
      axios.post(`${process.env.REACT_APP_API}/route/employee/sendOtp`, {
        number: data,
      }),
    {
      onSuccess: (data) => {
        handleAlert(
          true,
          "success",
          "otp has been send successfully on your device"
        );
        setdisplay(true);
        setTime(1);
        setIsTimeVisible(true);
      },

      onError: (data) => {
        if (data?.response?.status === 500) {
          Swal.fire({
            title: "Warning",
            text: `${data?.response?.data?.message}`,
            icon: "warning",
            confirmButtonText: "ok",
          });
        }
        if (data?.response?.data?.success === false)
          handleAlert(true, "error", data?.response?.data?.message);
      },
    }
  );

  const VerifyOtpRequest = useMutation(
    (data) =>
      axios.post(`${process.env.REACT_APP_API}/route/employee/verifyOtp`, data),
    {
      onSuccess: (data) => {
        if (data?.data?.success === false) {
          handleAlert(true, "error", data?.data?.message);
        }

        if (data?.data?.success === true) {
          Swal.fire({
            title: "Congratulation",
            text: "OTP verifed successfully",
            icon: "success",
            confirmButtonText: "ok",
          });
          setdisplay(false);
          setIsVerified(true);
          setIsTimeVisible(false);
          setReadOnly(true);
        }
      },
    }
  );

  const phone = getValues("phone");
  const SendOtp = () => {
    OtpRequest.mutateAsync(phone);
  };

  const VerifyOtp = () => {
    const data = { number: phone, otp };

    if (!otp || !number) {
      handleAlert(true, "warning", "Otp and number are required fields");
      return false;
    }
    VerifyOtpRequest.mutateAsync(data);
  };

  return (
    <>
      <section className="flex  w-full">
        {/* Left Section */}
        <article className="!w-[40%] bluegrad  h-auto lg:block hidden text-white flex-col  ">
          {/* <div className="bg__gradient  h-screen inset-0  "></div>
          <ul className="circles h-screen inset-0  ">
            {[...Array(10)].map((_, index) => (
              <li key={index}></li>
            ))}
          </ul> */}

          {/* <div className="p-8">
            <img
              src="/logo.svg"
              className="md:h-[60px] !h-[50px] "
              alt="logo"
            />
          </div> */}
          <div className="space-y-2 mb-8 h-screen flex-col flex items-center justify-center">
            <img src="/HRMS.svg" className="w-[70%]" alt="none" />
          </div>
        </article>
        {/* Right Section */}
        <article className="lg:!w-[60%] w-full h-max min-h-screen  md:block flex items-center flex-col justify-center">
          <div className="md:flex hidden  w-full py-4 px-8  gap-4 items-center justify-center lg:justify-end">
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            className="flex   my-10 !px-20 lg:w-[80%] w-full bg-white flex-col h-fit gap-1"
          >
            <div className="flex-col gap-4 w-max !flex md:space-x-4  space-x-2 mb-4 ">
              {/* <img
                src="/logo.svg"
                className="md:h-[60px] !h-[50px]"
                alt="logo"
              /> */}
              <div className="flex flex-col space-y-1">
                {/* <div className="mb-4"> */}
                <h1 className="font-bold text-2xl md:text-3xl">
                  Register Account
                </h1>

                {/* <p className="md:text-lg text-sm">
                  Enter your credentials below
                </p> */}
                {/* </div> */}
              </div>
            </div>
            {/* gap-4 <div className="flex space-x-4 items-center">
              <img src="/logo.svg" className="h-[906x]" alt="80ogo" />
              <div className="flex flex-col space-y-1">
                <h1 className="font-[600] text-3xl">
                  Register for AEGIS Account
                </h1>
                <p className="text-lg">Enter your credentials below</p>
              </div>
            </div> */}
            <div className="grid md:grid-cols-2 grid-cols-1 gap-2">
              {/* First Name */}
              <AuthInputFiled
                name="first_name"
                icon={PermContactCalendar}
                control={control}
                type="text"
                placeholder="jhon"
                label="First Name *"
                maxLimit={15}
                errors={errors}
                error={errors.first_name}
              />
              <AuthInputFiled
                name="middle_name"
                icon={Badge}
                control={control}
                type="text"
                placeholder="xyz"
                label="Middle Name"
                errors={errors}
                maxLimit={15}
                error={errors.middle_name}
              />
            </div>
            {/* Last Name */}
            <AuthInputFiled
              name="last_name"
              icon={DriveFileRenameOutlineOutlined}
              control={control}
              type="text"
              label="Last Name *"
              placeholder="Doe"
              errors={errors}
              maxLimit={15}
              error={errors.last_name}
            />
            {/* Phone Number */}
            <div className="grid grid-cols-2 items-center gap-2">
              <AuthInputFiled
                name="phone"
                icon={Phone}
                readOnly={readOnly}
                control={control}
                label={"Phone Number *"}
                type={"number"}
                errors={errors}
                error={errors.phone}
                placeholder={"123456789"}
              />

              {isVerified ? (
                <>
                  <SvgIcon color="success">
                    <CheckCircle />
                  </SvgIcon>
                  Verified
                </>
              ) : (
                <div>
                  <button
                    type="button"
                    disabled={
                      number?.length !== 10 || isTimeVisible ? true : false
                    }
                    onClick={SendOtp}
                    className={`w-max flex group justify-center gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500  ${
                      (number?.length !== 10 || isTimeVisible) &&
                      "bg-gray-400 text-gray-900"
                    }`}
                  >
                    Get Otp
                  </button>
                </div>
              )}
              {isTimeVisible && (
                <p>
                  Resend otp {Math.floor(time / 60)}:
                  {(time % 60).toString().padStart(2, "0")}
                </p>
              )}
            </div>
            {display && (
              <div className="flex items-center gap-2">
                <div className="space-y-1">
                  <label className={`font-semibold text-gray-500 text-md`}>
                    Verify OTP
                  </label>
                  <div className="flex  rounded-md px-2 border-gray-200 border-[.5px] bg-white py-[6px]">
                    <Fingerprint className="text-gray-700" />
                    <input
                      type={"number"}
                      onChange={(e) => setOTP(e.target.value)}
                      placeholder={"1235"}
                      className="border-none bg-white w-full outline-none px-2"
                    />
                  </div>

                  <div className="h-4  !mb-1 "></div>
                </div>

                <button
                  type="button"
                  onClick={VerifyOtp}
                  className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
                >
                  Verify Otp
                </button>
              </div>
            )}
            <AuthInputFiled
              name="email"
              icon={Email}
              control={control}
              type="email"
              placeholder="test@gmai..."
              label="Email Address *"
              errors={errors}
              error={errors.email}
            />

            <div className="grid md:grid-cols-2 grid-cols-1  gap-2">
              <AuthInputFiled
                name="password"
                icon={Lock}
                control={control}
                type="password"
                placeholder="****"
                label="Password *"
                errors={errors}
                error={errors.password}
              />

              <AuthInputFiled
                name="confirmPassword"
                icon={NoEncryption}
                control={control}
                type="password"
                placeholder="****"
                label="Confirm Password *"
                errors={errors}
                error={errors.confirmPassword}
              />
            </div>

            <TermsCondition />
            {/* Signup Button */}
            <div className="flex gap-5 mt-2">
              <button
                type="submit"
                className=" flex group justify-center w-full  gap-2 items-center rounded-md h-max px-4 py-2 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
              >
                Register Account
              </button>
            </div>

            <p className="flex gap-2 my-2">
              Aleady have an account?
              <Link
                to={location.pathname === "/sign-up" ? "/sign-in" : "/sign-up"}
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
