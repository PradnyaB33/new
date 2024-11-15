import useSignup from "../../hooks/useLoginForm";
import React, { useState, useContext } from "react";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import aegislogo from "../../assets/ResetPassword.svg";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { z } from "zod";

const EmployeeSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .refine((value) => /[0-9]/.test(value), {
      message: "Password must contain at least one number",
    })
    .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
      message: "Password must contain at least one special character",
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain at least one capital letter",
    }),
  confirmPassword: z.string(),
});

const ResetPassword = () => {
  const { setPassword, password, confirmPassword, setConfirmPassword } =
    useSignup(); // Assuming you have useSignup hook for state management
  const { token } = useParams();
  const { handleAlert } = useContext(TestContext);
  const redirect = useNavigate(UseContext);

  // State to control visibility of the password and confirm password
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleCPassword, setVisibleCPassword] = useState(false);
  const [passwordsMatchError, setPasswordsMatchError] = useState(false);
  const [emptyFieldError, setEmptyFieldError] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset previous errors
    setPasswordsMatchError(false);
    setEmptyFieldError(false);
    setValidationErrors([]);

    // Validate using Zod
    try {
      // Validate password and confirm password
      EmployeeSchema.parse({
        password,
        confirmPassword,
      });

      // Check if passwords match
      if (password !== confirmPassword) {
        setPasswordsMatchError(true);
        return;
      }

      // Proceed with the API request if validation passes
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/employee/reset-password/${token}`,
        { password }
      );
      handleAlert(true, "success", `Welcome ${response.data.message}`);
      redirect("/sign-in");
    } catch (error) {
      // If validation fails, set the error messages
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        setValidationErrors(errorMessages);
      } else {
        handleAlert(true, "error", error?.response?.data?.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center p-8 box-border h-[500px] lg:w-[900px] m-auto">
      <div className="flex w-full h-full rounded-lg shadow-xl border bg-white">
        <form className="w-full md:w-1/2 p-8 flex flex-col items-center gap-4 justify-center">
          <Typography
            color={"primary"}
            fontWeight={800}
            fontSize={20}
            className="text-2xl my-2"
          >
            Reset Password
          </Typography>
          <div className="w-full sm:[250px]">
            <TextField
              required
              size="small"
              type={visiblePassword ? "text" : "password"}
              label="Enter New Password"
              name="password"
              id="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              error={
                emptyFieldError ||
                passwordsMatchError ||
                validationErrors.length > 0
              }
              helperText={
                validationErrors.length > 0
                  ? validationErrors.join(", ")
                  : emptyFieldError
                  ? "Please enter a new password"
                  : passwordsMatchError
                  ? "Passwords do not match"
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => setVisiblePassword(!visiblePassword)}
                  >
                    {visiblePassword ? <VisibilityOff /> : <Visibility />}
                  </div>
                ),
              }}
            />
            <TextField
              required
              size="small"
              type={visibleCPassword ? "text" : "password"}
              label="Confirm Password"
              name="confirmPassword"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              variant="outlined"
              fullWidth
              margin="normal"
              error={
                emptyFieldError ||
                passwordsMatchError ||
                validationErrors.length > 0
              }
              helperText={
                validationErrors.length > 0
                  ? validationErrors.join(", ")
                  : emptyFieldError
                  ? "Please confirm your password"
                  : passwordsMatchError
                  ? "Passwords do not match"
                  : ""
              }
              InputProps={{
                endAdornment: (
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => setVisibleCPassword(!visibleCPassword)}
                  >
                    {visibleCPassword ? <VisibilityOff /> : <Visibility />}
                  </div>
                ),
              }}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="m-auto w-fit"
            onClick={handleSubmit}
          >
            Reset
          </Button>
        </form>
        <div className="md:w-1/2 md:flex hidden p-8 rounded-r-lg items-center flex-col justify-around">
          <img src={aegislogo} alt="Reset Password" />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
