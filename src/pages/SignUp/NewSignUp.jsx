import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
  DriveFileRenameOutlineOutlined,
  Email,
  Lock,
  NoEncryption,
  PermContactCalendar,
  Phone,
} from "@mui/icons-material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import { z } from "zod";
import { TestContext } from "../../State/Function/Main";
import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";
import TermsCondition from "../../components/termscondition/termsCondition";

const SignIn = () => {
  const { handleAlert } = useContext(TestContext);
  const location = useLocation();
  const [display, setDisplay] = useState(false);

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const SignUpSchema = z
    .object({
      first_name: z
        .string()
        .min(2)
        .max(30)
        .regex(/^[a-zA-Z]+$/),

      last_name: z
        .string()
        .min(2)
        .max(30)
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
      message: "Password don't match",
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
  console.log("number", number?.length);

  const onSubmit = async (data) => {
    console.log("Form Data:", data);

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

  const sendOtp = () => {
    const phone = getValues("phone");
    console.log(phone);
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
            {/* image here */}
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            className="flex px-20 w-max justify-center flex-col h-[80vh]"
          >
            <div className="flex flex-col space-y-1">
              <div className="mb-4">
                <h1 className="font-[600] text-3xl">
                  Register for AEGIS Account
                </h1>
                <p className="text-lg">Enter your credentials below</p>
              </div>
            </div>

            <div className="flex gap-2">
              {/* First Name */}
              <AuthInputFiled
                name="first_name"
                icon={PermContactCalendar}
                control={control}
                type="text"
                placeholder="jhon"
                label="First Name *"
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
              error={errors.last_name}
            />
            {/* Phone Number */}

            <div className="flex items-center gap-2">
              <AuthInputFiled
                name="phone"
                icon={Phone}
                control={control}
                label={"Phone Number *"}
                type={"number"}
                errors={errors}
                error={errors.phone}
                placeholder={"123456789"}
              />

              <button
                type="button"
                disabled={number?.length === 10 ? false : true}
                onClick={sendOtp}
                className="w-max flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
              >
                Get Otp
              </button>
            </div>
            {/* Email */}
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

            {/* Password */}
            <div className="flex items-center gap-2">
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

            <div className=" mb-1">
              <TermsCondition />
            </div>

            {/* Signup Button */}
            <div className="flex gap-5 mt-2">
              <button
                type="submit"
                className=" flex group justify-center  gap-2 items-center rounded-md h-max px-4 py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
              >
                Register Account
              </button>
            </div>
          </form>
        </article>
      </section>
    </>
  );
};

export default SignIn;
