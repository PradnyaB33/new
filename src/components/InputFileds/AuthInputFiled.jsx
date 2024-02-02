import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { Controller } from "react-hook-form";

const AuthInputFiled = ({
  label,
  name,
  icon: Icon,
  type,
  errors,
  error,
  control,
  maxLimit,
  readOnly = false,
  placeholder,
}) => {
  return (
    <div className="space-y-1 ">
      <label
        htmlFor={name}
        className={`${
          error && "text-red-500"
        } font-semibold text-gray-500 text-sm md:text-md`}
      >
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        id={name}
        render={({ field }) => (
          <>
            <div
              className={`${
                readOnly && "bg-[ghostwhite]"
              } flex rounded-md items-center px-2 border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]`}
            >
              {Icon && (
                <Icon className="text-gray-700 md:text-lg !text-[1em]" />
              )}
              <input
                type={type}
                maxLength={maxLimit && maxLimit}
                readOnly={readOnly}
                placeholder={placeholder}
                className={`${
                  readOnly && "bg-[ghostwhite]"
                } border-none bg-white w-full outline-none px-2`}
                {...field}
              />
            </div>
          </>
        )}
      />
      <div className="h-4 w-[200px]  !z-50   !mb-1">
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p className="text-sm mb-4 relative !bg-white  text-red-500">
              {message}
            </p>
          )}
        />
      </div>
    </div>
  );
};

export default AuthInputFiled;
